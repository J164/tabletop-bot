import { type DMChannel, type MessageComponentInteraction, type BaseMessageOptions, ComponentType, ButtonStyle } from 'discord.js';
import { type SelectAmountOptions } from '../types/helpers.js';

/**
 * Prompts the user to select a number
 * @param channel The DM channel to prompt in
 * @param options Options to customize the selector prompt
 * @param amount The starting amount
 * @param _next The component interaction to update
 * @returns The selected amount
 */
export async function selectAmount(channel: DMChannel, options: SelectAmountOptions, amount = 0, _next?: MessageComponentInteraction): Promise<number> {
	const { baseMessage, minimum, maximum } = options;

	const messageOptions: BaseMessageOptions = {
		...baseMessage,
		components: [
			{
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: `Submit ${amount}`,
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
	};

	const message = await (_next?.update(messageOptions) ?? channel.send(messageOptions));

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
			return selectAmount(channel, options, amount - 5, component);
		}

		case 'minus_1': {
			return selectAmount(channel, options, amount - 1, component);
		}

		case 'plus_1': {
			return selectAmount(channel, options, amount + 1, component);
		}

		case 'plus_5': {
			return selectAmount(channel, options, amount + 5, component);
		}

		default: {
			await component.update({ components: [] });
			return amount;
		}
	}
}
