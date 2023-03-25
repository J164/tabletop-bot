import { type ButtonInteraction, ButtonStyle, ComponentType, type DMChannel, type BaseMessageOptions } from 'discord.js';
import { RankCode } from '../../types/cards.js';
import { EmbedType } from '../../types/helpers.js';
import { type BlackjackStats } from '../../types/stats.js';
import { type Bank } from '../../util/bank.js';
import { type Card, cardGenerator } from '../../util/playing-cards.js';
import { responseEmbed, responseOptions } from '../../util/response-formatters.js';
import { updateStats } from '../../util/stats.js';
import { selectAmount } from '../../util/user-prompts.js';
import { BlackjackResult, decideWinner, scoreHand } from './logic.js';
import { printFinalStandings, printStandings } from './responses.js';

export type Player = { hand: Card[]; pool: number };

export class Blackjack {
	private readonly _nextCard = cardGenerator();
	private _dealer: Card[] = [];

	public constructor(private readonly _channel: DMChannel, private readonly _bank: Bank, private readonly _stats: BlackjackStats) {}

	public async start(): Promise<void> {
		if (this._bank.tokens < 5) {
			await this._channel.send(responseOptions(EmbedType.Error, "You don't have enough tokens to play this game!"));
			return;
		}

		this._dealer = [this._nextCard(), this._nextCard()];
		const playerHand = [this._nextCard(), this._nextCard()];

		const pool = await this._initialBets(playerHand);
		if (!pool) {
			return;
		}

		const player = { hand: playerHand, pool };

		if (scoreHand(player.hand) === 21 || scoreHand(this._dealer) === 21) {
			await this._endGame([player], true);
		}

		const hands = await this._promptPlayer(player);

		while (scoreHand(this._dealer) < 17) {
			this._dealer.push(this._nextCard());
		}

		await this._endGame(hands, false);
	}

	private async _initialBets(playerHand: Card[]): Promise<number | undefined> {
		const bet = await selectAmount(
			this._channel,
			{
				baseMessage: { embeds: [responseEmbed(EmbedType.Info, `Make your initial bet (minimum: 5, maximum: ${this._bank.tokens})`)] },
				minimum: 5,
				maximum: this._bank.tokens,
			},
			5,
		);

		if (!this._chargePlayer(bet)) {
			await this._channel.send(responseOptions(EmbedType.Info, 'Cannot afford this bet!'));
			return;
		}

		if (this._dealer[0].rank === RankCode.Ace) {
			const { embeds, files } = await printStandings(playerHand, this._dealer[0]);
			const insuranceBet = await selectAmount(this._channel, {
				baseMessage: {
					embeds: [...embeds, responseEmbed(EmbedType.Info, `Make an insurance bet (minimum: 0, maximum: ${Math.floor(bet / 2)}`)],
					files,
				},
				minimum: 0,
				maximum: Math.min(Math.floor(bet / 2), this._bank.tokens),
			});

			if (!this._chargePlayer(insuranceBet)) {
				await this._channel.send(responseOptions(EmbedType.Info, 'Cannot afford this bet!'));
			} else if (scoreHand(this._dealer) === 21) {
				this._payoutPlayer(insuranceBet * 3);
				await this._channel.send(responseOptions(EmbedType.Info, `You won your insurance bet (Recieved: ${insuranceBet * 3})`));
			} else {
				await this._channel.send(responseOptions(EmbedType.Info, 'You lost your insurance bet'));
			}
		}

		return bet;
	}

	private async _promptPlayer(player: Player, next?: ButtonInteraction): Promise<Player[]> {
		const messageOptions: BaseMessageOptions = {
			...(await printStandings(player.hand, this._dealer[0])),
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{ type: ComponentType.Button, custom_id: 'hit', style: ButtonStyle.Primary, label: 'Hit' },
						{ type: ComponentType.Button, custom_id: 'stand', style: ButtonStyle.Secondary, label: 'Stand' },
						{ type: ComponentType.Button, custom_id: 'double', style: ButtonStyle.Danger, label: 'Double Down', disabled: this._bank.tokens < player.pool },
						{
							type: ComponentType.Button,
							custom_id: 'split',
							style: ButtonStyle.Danger,
							label: 'Split',
							disabled: player.hand.length !== 2 || player.hand[0].rank !== player.hand[1].rank || this._bank.tokens < player.pool,
						},
					],
				},
			],
		};

		const message = await (next?.update(messageOptions) ?? this._channel.send(messageOptions));

		let component;
		try {
			component = await message.awaitMessageComponent({
				componentType: ComponentType.Button,
				time: 300_000,
			});
		} catch {
			await message.edit({ components: [] });
			return [player];
		}

		switch (component.customId) {
			case 'hit': {
				player.hand.push(this._nextCard());

				if (scoreHand(player.hand) < 21) {
					return this._promptPlayer(player, component);
				}

				break;
			}

			case 'double': {
				if (!this._chargePlayer(player.pool)) {
					return this._promptPlayer(player, component);
				}

				player.pool *= 2;
				player.hand.push(this._nextCard());
				break;
			}

			case 'split': {
				if (!this._chargePlayer(player.pool)) {
					return this._promptPlayer(player, component);
				}

				return [
					...(await this._promptPlayer({ hand: [player.hand[0]], pool: player.pool })),
					...(await this._promptPlayer({ hand: [player.hand[0]], pool: player.pool })),
				];
			}
		}

		await component.update({ components: [] });
		return [player];
	}

	private async _endGame(players: Player[], immediate: boolean): Promise<void> {
		const playerResults = players.map(({ hand, pool }) => {
			const result = decideWinner(scoreHand(hand), scoreHand(this._dealer), immediate);

			this._resolveBet(result, pool);

			return {
				hand,
				result,
			};
		});

		updateStats(this._channel.recipientId);

		const message = await this._channel.send({
			...(await printFinalStandings(playerResults, this._dealer)),
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{ type: ComponentType.Button, custom_id: 'continue', label: 'Play Again?', style: ButtonStyle.Primary },
						{ type: ComponentType.Button, custom_id: 'end', label: 'Cash Out', style: ButtonStyle.Secondary },
					],
				},
			],
		});

		let component;
		try {
			component = await message.awaitMessageComponent({
				componentType: ComponentType.Button,
				time: 300_000,
			});
		} catch {
			await message.edit({ components: [] });
			return;
		}

		await component.update({ components: [] });

		if (component.customId === 'continue') {
			await this.start();
		}
	}

	private _chargePlayer(amount: number): boolean {
		if (this._bank.chargeTokens(amount)) {
			this._stats.netMoneyEarned -= amount;
			return true;
		}

		return false;
	}

	private _payoutPlayer(amount: number): void {
		this._stats.netMoneyEarned += amount;
		this._bank.addTokens(amount);
	}

	private _resolveBet(result: BlackjackResult, pool: number): void {
		switch (result) {
			case BlackjackResult.PlayerBlackjack: {
				this._payoutPlayer(pool * 2.5);
				this._stats.blackjacks++;
				this._stats.wins++;
				break;
			}

			case BlackjackResult.Win: {
				this._payoutPlayer(pool * 2);
				this._stats.wins++;
				break;
			}

			case BlackjackResult.Push: {
				this._payoutPlayer(pool);
				this._stats.pushes++;
				break;
			}

			default: {
				this._stats.losses++;
			}
		}
	}
}
