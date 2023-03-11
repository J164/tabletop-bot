import { type GlobalChatInputCommandResponse } from '../../types/client.js';
import { EmbedType } from '../../types/helpers.js';
import { responseOptions } from '../../util/response-formatters.js';

export async function help(response: GlobalChatInputCommandResponse): Promise<void> {
	await response.interaction.editReply(responseOptions(EmbedType.Info, 'Help'));
}
