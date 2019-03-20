// Does each team have the same average vector?
module.exports = function(season) {
    const averageTeamVectors = season.teams.map(t => t.players.map(p=>p.vector).average());
    return {
        score:averageTeamVectors.standardDeviation() * 50,
        stats:{"Average Vector per Team":averageTeamVectors.map(n=>n.toFixed(1)).join(' ')}
    }
}