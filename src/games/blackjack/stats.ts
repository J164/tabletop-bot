import { type BlackjackStats } from '../../types/stats.js';

const stats: Record<string, BlackjackStats | undefined> = {};

export async function fetchStats(userId: string): Promise<BlackjackStats> {
	// TODO: implement
	return { earnings: 0 };
}

export async function updateStats(userId: string): Promise<void> {
	// TODO: implement
}
