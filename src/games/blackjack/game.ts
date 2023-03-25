import { ButtonStyle, ComponentType, type DMChannel } from 'discord.js';
import { RankCode } from '../../types/cards.js';
import { EmbedType } from '../../types/helpers.js';
import { type BlackjackStats } from '../../types/stats.js';
import { cardGenerator, type Card } from '../../util/playing-cards.js';
import { responseEmbed, responseOptions, selectAmount } from '../../util/response-formatters.js';
import { decideWinner, resolveBet, scoreHand } from './logic.js';
import { printFinalStandings, printStandings } from './responses.js';
import { fetchStats, updateStats } from './stats.js';

export type Player = { hand: Card[]; pool: number };

export async function startBlackjack(channel: DMChannel): Promise<void> {
	const stats = await fetchStats(channel.recipientId);

	const nextCard = cardGenerator();

	const dealer = [nextCard(), nextCard()];
	const playerHand = [nextCard(), nextCard()];

	const player = { hand: playerHand, pool: await initialBets(channel, stats, dealer[0].rank === RankCode.Ace ? { player: playerHand, dealer } : undefined) };

	if (scoreHand(player.hand) === 21 || scoreHand(dealer) === 21) {
		await endGame(channel, stats, [player], dealer, true);
		return;
	}

	const hands = await promptPlayer(channel, stats, nextCard, player, dealer);

	while (scoreHand(dealer) < 17) {
		dealer.push(nextCard());
	}

	await endGame(channel, stats, hands, dealer, false);
}

async function initialBets(channel: DMChannel, stats: BlackjackStats, insurance: { player: Card[]; dealer: Card[] } | undefined): Promise<number> {
	await channel.send(responseOptions(EmbedType.Info, 'Make your initial bet'));
	const bet = await selectAmount(channel, {
		message: { embeds: [responseEmbed(EmbedType.Info, `Make your bet (minimum: 5, maximum: ${stats.tokens})`)] },
		minimum: 5,
		maximum: stats.tokens,
	});

	stats.tokens -= bet;

	if (insurance) {
		const { embeds, files } = await printStandings(insurance.player, insurance.dealer[0]);
		const insuranceBet = await selectAmount(channel, {
			message: {
				embeds: [...embeds, responseEmbed(EmbedType.Info, `Make an insurance bet (minimum: 0, maximum: ${Math.floor(bet / 2)}`)],
				files,
			},
			minimum: 0,
			maximum: Math.min(Math.floor(bet / 2), stats.tokens),
		});

		stats.tokens -= insuranceBet;

		if (scoreHand(insurance.dealer) === 21) {
			await channel.send(responseOptions(EmbedType.Info, 'You lost your insurance bet'));
		} else {
			stats.earnings += insuranceBet * 2;
			await channel.send(responseOptions(EmbedType.Info, `You won your insurance bet (Recieved: ${insuranceBet * 2})`));
		}
	}

	return bet;
}

async function promptPlayer(channel: DMChannel, stats: BlackjackStats, nextCard: () => Card, player: Player, dealer: Card[]): Promise<Player[]> {
	const message = await channel.send({
		...(await printStandings(player.hand, dealer[0])),
		components: [
			{
				type: ComponentType.ActionRow,
				components: [
					{ type: ComponentType.Button, custom_id: 'hit', style: ButtonStyle.Primary, label: 'Hit' },
					{ type: ComponentType.Button, custom_id: 'stand', style: ButtonStyle.Secondary, label: 'Stand' },
					{ type: ComponentType.Button, custom_id: 'double', style: ButtonStyle.Danger, label: 'Double Down' },
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
		return [player];
	}

	await component.update({ components: [] });

	switch (component.customId) {
		case 'hit': {
			player.hand.push(nextCard());

			if (scoreHand(player.hand) < 21) {
				return promptPlayer(channel, stats, nextCard, player, dealer);
			}

			break;
		}

		case 'double': {
			player.pool *= 2;
			player.hand.push(nextCard());
			break;
		}

		case 'split': {
			return [
				...(await promptPlayer(channel, stats, nextCard, { hand: [player.hand[0]], pool: player.pool }, dealer)),
				...(await promptPlayer(channel, stats, nextCard, { hand: [player.hand[0]], pool: player.pool }, dealer)),
			];
		}
	}

	await channel.send(await printStandings(player.hand, dealer[0]));

	return [player];
}

async function endGame(channel: DMChannel, stats: BlackjackStats, players: Player[], dealer: Card[], immediate: boolean): Promise<void> {
	const previousEarnings = stats.earnings;
	const playerResults = players.map(({ hand, pool }) => {
		const result = decideWinner(scoreHand(hand), scoreHand(dealer), immediate);

		resolveBet(result, pool, stats);

		return {
			hand,
			result,
		};
	});

	await updateStats(channel.recipientId);

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
		return;
	}

	await channel.send(responseOptions(EmbedType.Info, `You netted $${stats.earnings - previousEarnings}`));
}
