import { type ButtonInteraction, ButtonStyle, ComponentType, type DMChannel, type BaseMessageOptions } from 'discord.js';
import { RankCode, SuitCode } from '../../types/cards.js';
import { EmbedType } from '../../types/helpers.js';
import { type BlackjackStats } from '../../types/stats.js';
import { type Bank } from '../../util/bank.js';
import { Card, cardGenerator } from '../../util/playing-cards.js';
import { responseEmbed, responseOptions, selectAmount } from '../../util/response-formatters.js';
import { updateStats } from '../../util/stats.js';
import { chargePlayer, decideWinner, payoutPlayer, resolveBet, scoreHand } from './logic.js';
import { printFinalStandings, printStandings } from './responses.js';
import { fetchBlackjackStats } from './stats.js';

export type Player = { hand: Card[]; pool: number };

export async function startBlackjack(channel: DMChannel): Promise<void> {
	const stats = fetchBlackjackStats(channel.recipientId);
	const bank = fetchBank(channel.recipientId);

	const nextCard = cardGenerator();

	const dealer = [nextCard(), nextCard()];
	const playerHand = [new Card(RankCode.Three, SuitCode.Spades), new Card(RankCode.Three, SuitCode.Spades)];

	const pool = await initialBets(channel, bank, stats, dealer[0].rank === RankCode.Ace ? { player: playerHand, dealer } : undefined);

	if (!pool) {
		return;
	}

	const player = { hand: playerHand, pool };

	if (scoreHand(player.hand) === 21 || scoreHand(dealer) === 21) {
		await endGame(channel, bank, stats, [player], dealer, true);
		return;
	}

	const hands = await promptPlayer(channel, bank, stats, nextCard, player, dealer);

	while (scoreHand(dealer) < 17) {
		dealer.push(nextCard());
	}

	await endGame(channel, bank, stats, hands, dealer, false);
}

async function initialBets(
	channel: DMChannel,
	bank: Bank,
	stats: BlackjackStats,
	insurance: { player: Card[]; dealer: Card[] } | undefined,
): Promise<number | undefined> {
	const bet = await selectAmount(
		channel,
		{
			baseMessage: { embeds: [responseEmbed(EmbedType.Info, `Make your initial bet (minimum: 5, maximum: ${bank.tokens})`)] },
			minimum: 5,
			maximum: bank.tokens,
		},
		5,
	);

	if (!chargePlayer(bet, bank, stats)) {
		await channel.send(responseOptions(EmbedType.Info, 'Cannot afford this bet!'));
		return;
	}

	if (insurance) {
		const { embeds, files } = await printStandings(insurance.player, insurance.dealer[0]);
		const insuranceBet = await selectAmount(channel, {
			baseMessage: {
				embeds: [...embeds, responseEmbed(EmbedType.Info, `Make an insurance bet (minimum: 0, maximum: ${Math.floor(bet / 2)}`)],
				files,
			},
			minimum: 0,
			maximum: Math.min(Math.floor(bet / 2), bank.tokens),
		});

		if (!chargePlayer(insuranceBet, bank, stats)) {
			await channel.send(responseOptions(EmbedType.Info, 'Cannot afford this bet!'));
		} else if (scoreHand(insurance.dealer) === 21) {
			await channel.send(responseOptions(EmbedType.Info, 'You lost your insurance bet'));
		} else {
			payoutPlayer(insuranceBet * 3, bank, stats);
			await channel.send(responseOptions(EmbedType.Info, `You won your insurance bet (Recieved: ${insuranceBet * 2})`));
		}
	}

	return bet;
}

async function promptPlayer(
	channel: DMChannel,
	bank: Bank,
	stats: BlackjackStats,
	nextCard: () => Card,
	player: Player,
	dealer: Card[],
	next?: ButtonInteraction,
): Promise<Player[]> {
	const messageOptions: BaseMessageOptions = {
		...(await printStandings(player.hand, dealer[0])),
		components: [
			{
				type: ComponentType.ActionRow,
				components: [
					{ type: ComponentType.Button, custom_id: 'hit', style: ButtonStyle.Primary, label: 'Hit' },
					{ type: ComponentType.Button, custom_id: 'stand', style: ButtonStyle.Secondary, label: 'Stand' },
					{ type: ComponentType.Button, custom_id: 'double', style: ButtonStyle.Danger, label: 'Double Down', disabled: bank.tokens < player.pool },
					{
						type: ComponentType.Button,
						custom_id: 'split',
						style: ButtonStyle.Danger,
						label: 'Split',
						disabled: player.hand.length !== 2 || player.hand[0].rank !== player.hand[1].rank || bank.tokens < player.pool,
					},
				],
			},
		],
	};

	const message = await (next?.update(messageOptions) ?? channel.send(messageOptions));

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
			player.hand.push(nextCard());

			if (scoreHand(player.hand) < 21) {
				return promptPlayer(channel, bank, stats, nextCard, player, dealer, component);
			}

			break;
		}

		case 'double': {
			if (!chargePlayer(player.pool, bank, stats)) {
				return promptPlayer(channel, bank, stats, nextCard, player, dealer, component);
			}

			player.pool *= 2;
			player.hand.push(nextCard());
			break;
		}

		case 'split': {
			if (!chargePlayer(player.pool, bank, stats)) {
				return promptPlayer(channel, bank, stats, nextCard, player, dealer, component);
			}

			return [
				...(await promptPlayer(channel, bank, stats, nextCard, { hand: [player.hand[0]], pool: player.pool }, dealer)),
				...(await promptPlayer(channel, bank, stats, nextCard, { hand: [player.hand[0]], pool: player.pool }, dealer)),
			];
		}
	}

	await component.update({ components: [] });
	return [player];
}

async function endGame(channel: DMChannel, bank: Bank, stats: BlackjackStats, players: Player[], dealer: Card[], immediate: boolean): Promise<void> {
	const playerResults = players.map(({ hand, pool }) => {
		const result = decideWinner(scoreHand(hand), scoreHand(dealer), immediate);

		resolveBet(result, pool, bank, stats);

		return {
			hand,
			result,
		};
	});

	updateStats(channel.recipientId);

	const message = await channel.send({
		...(await printFinalStandings(playerResults, dealer)),
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
		await startBlackjack(channel);
	}
}
