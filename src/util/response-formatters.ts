import { ButtonStyle, ComponentType, type DMChannel, type APIEmbed, type BaseMessageOptions } from 'discord.js';
import { BotColors, EmbedType, Emojis } from '../types/helpers.js';

/**
 * Formats an embed based on its type
 * @param type Which type of formatting to use
 * @param title Optional title of the embed
 * @param options The embed to be formated
 * @returns The formated embed
 */
export function responseEmbed(type: EmbedType, title: string, options?: Omit<APIEmbed, 'title'>): APIEmbed {
	const embed: APIEmbed = options ?? {};

	switch (type) {
		case EmbedType.Info: {
			embed.color ??= BotColors.DefaultBlue;
			embed.title = `${Emojis.Document}\t${title}`;
			break;
		}

		case EmbedType.Error: {
			embed.color ??= BotColors.ErrorRed;
			embed.title = `${Emojis.RedX}\t${title}`;
			break;
		}

		case EmbedType.Success: {
			embed.color ??= BotColors.SuccessGreen;
			embed.title = `${Emojis.GreenCheckMark}\t${title}`;
			break;
		}

		case EmbedType.Prompt: {
			embed.color ??= BotColors.QuestionOrange;
			embed.title = `${Emojis.QuestionMark}\t${title}`;
			break;
		}

		default: {
			embed.title = title;
			break;
		}
	}

	return embed;
}

/**
 * Formats an embed based on its type and wraps it as a message
 * @param type Which type of formatting to use
 * @param title Optional title of the embed
 * @param options The embed to be formated
 * @returns The formated embed wrapped as a message
 */
export function responseOptions(type: EmbedType, title: string, options?: APIEmbed): BaseMessageOptions {
	return { embeds: [responseEmbed(type, title, options)] };
}

type SelectAmountOptions = { message: BaseMessageOptions; minimum: number; maximum: number };
export async function selectAmount(channel: DMChannel, options: SelectAmountOptions, amount = 0): Promise<number> {
	const { message: baseMessage, minimum, maximum } = options;

	const message = await channel.send({
		...baseMessage,
		components: [
			{
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: 'Submit',
						custom_id: 'submit',
						style: ButtonStyle.Primary,
						disabled: amount < minimum || amount > maximum,
					},
				],
			},
			{
				type: ComponentType.ActionRow,
				components: [
					{ type: ComponentType.Button, label: '-5', custom_id: 'minus_5', style: ButtonStyle.Secondary, disabled: amount < minimum + 5 },
					{ type: ComponentType.Button, label: '-1', custom_id: 'minus_1', style: ButtonStyle.Secondary, disabled: amount < minimum + 1 },
					{ type: ComponentType.Button, label: '+1', custom_id: 'plus_1', style: ButtonStyle.Secondary, disabled: amount > maximum - 1 },
					{ type: ComponentType.Button, label: '+5', custom_id: 'plus_5', style: ButtonStyle.Secondary, disabled: amount > maximum - 5 },
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
		return amount;
	}

	switch (component.customId) {
		case 'minus_5': {
			return selectAmount(channel, options, amount - 5);
		}

		case 'minus_1': {
			return selectAmount(channel, options, amount - 1);
		}

		case 'plus_1': {
			return selectAmount(channel, options, amount + 1);
		}

		case 'plus_5': {
			return selectAmount(channel, options, amount + 5);
		}

		default: {
			return amount;
		}
	}
}
