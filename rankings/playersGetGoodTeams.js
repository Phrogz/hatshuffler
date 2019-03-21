// Does each team have the same average vector?
module.exports = function(season) {
	const playerTeamVector = new Map;
	const playerTeamCount = season.rounds.length
	season.teams.forEach(t => {
		const players = t.players
		const teamVector = players.map(p=>p.vector).average();
		players.forEach(p=>playerTeamVector.set(p,teamVector/playerTeamCount + playerTeamVector.get(p)||0));
	});
	const averagePlayersTeamVectors = [...playerTeamVector.values()]
	return {
		score:averagePlayersTeamVectors.standardDeviation() * 50,
		stats:{"Average Vector per Player":averagePlayersTeamVectors.map(n=>n.toFixed(1)).join(' ')}
	}
}