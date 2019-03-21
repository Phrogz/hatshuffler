// Get each player on different team numbers, so as to experience varied early games, late games, and double-headers
module.exports = function(season) {
	const playerIndex = new Map(season.players.map((p,i)=>[p,i]))
	const playerExposureByTeamIndex = season.rounds[0].teams.map(()=>Array(playerIndex.size).fill(0))
	season.rounds.forEach(r=>{
		r.teams.forEach((t,i)=>{
			let teamCounts = playerExposureByTeamIndex[i] || (playerExposureByTeamIndex[i]=[]);
			t.players.forEach(p=>{
				teamCounts[playerIndex.get(p)]++
			})
		})
	})

	const scale = 10 / playerExposureByTeamIndex.length
	const stats = {}
	let score = 0
	playerExposureByTeamIndex.forEach((playerCounts,i)=>{
		stats[`Team ${i+1} player assignments`] = playerCounts.map(n=>n?n:'-').join(' ')
		score += playerCounts.standardDeviation() * scale
	})

	return {score:score, stats:stats}
}