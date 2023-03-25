import { type BaseMessageOptions } from 'discord.js';

/** Enum of embed format types */
export const enum EmbedType {
	Info,
	Error,
	Success,
	Prompt,
	None,
}

/** Enum of Discord emojis */
export const enum Emojis {
	Document = '\uD83D\uDCC4',
	RedX = '\u274C',
	GreenCheckMark = '\u2705',
	QuestionMark = '\u2753',
	DoubleArrowLeft = '\u23EA',
	ArrowLeft = '\u2B05\uFE0F',
	ArrowRight = '\u27A1\uFE0F',
	DoubleArrowRight = '\u23E9',
}

/** Enum of Tabletop Bot's colors */
export const enum BotColors {
	DefaultBlue = 0x00_99_ff,
	ErrorRed = 0xff_00_00,
	SuccessGreen = 0x00_ff_00,
	QuestionOrange = 0xff_a5_00,
}

export type SelectAmountOptions = { baseMessage: BaseMessageOptions; minimum: number; maximum: number };
