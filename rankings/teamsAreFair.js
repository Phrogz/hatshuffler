// Does each team have the same average vector?
module.exports = function(season) {
	const playerTeamVector = new Map;
	const playerTeamCount = season.rounds.length

	const teamVectors = season.teams.map(t => {
		const players = t.players
		const teamVector = players.map(p=>p.vector).average();
		players.forEach(p=>playerTeamVector.set(p,teamVector/playerTeamCount + (playerTeamVector.get(p)||0)));
		return teamVector
	});
	const averagePlayersTeamVectors = [...playerTeamVector.values()]
	return {
		score:(teamVectors.standardDeviation() + averagePlayersTeamVectors.standardDeviation()) * 50,
		stats:{
			"Average Vector per Team":teamVectors.map(n=>n.toFixed(1)).join(' '),
			"Average Vector per Player":averagePlayersTeamVectors.map(n=>n.toFixed(1)).join(' '),
		}
	}
}