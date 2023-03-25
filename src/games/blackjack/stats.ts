import { type BlackjackStats } from '../../types/stats.js';
import { fetchStats } from '../../util/stats.js';

export function fetchBlackjackStats(userId: string): BlackjackStats {
	const stats = fetchStats(userId);

	return stats.blackjack ?? (stats.blackjack = { blackjacks: 0, losses: 0, netMoneyEarned: 0, pushes: 0, wins: 0 });
}
