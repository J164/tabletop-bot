import { type APIEmbed, type BaseMessageOptions, type APIActionRowComponent, type APIMessageActionRowComponent } from 'discord.js';
import { BotColors, EmbedType, Emojis } from '../types/helpers.js';

/**
 * Formats an embed based on its type
 * @param type Which type of formatting to use
 * @param title Optional title of the embed
 * @param options The embed to be formated
 * @returns The formated embed
 */
export function responseEmbed(type: EmbedType, title: string, options?: Omit<APIEmbed, 'title'>): APIEmbed {
	options?.fields?.splice(25);

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

/**
 * Sanitizes a message to ensure it adheres to the API spec
 * @param options The message to sanitize
 * @returns The sanitized message
 */
export function messageOptions(
	options: BaseMessageOptions & { embeds?: APIEmbed[]; components?: Array<APIActionRowComponent<APIMessageActionRowComponent>> },
): BaseMessageOptions {
	options.embeds?.splice(10);
	options.components?.splice(5);

	return options;
}
