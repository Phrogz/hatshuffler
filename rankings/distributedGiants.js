// Does each team have the same number of tall people?
module.exports = function(season) {
    const tallPlayersPerTeam = season.teams.map(t=>t.players.filter(p=>p.tall).length);
    return {
        score:tallPlayersPerTeam.standardDeviation() * 10,
        stats:{ "Tall Players per Team":tallPlayersPerTeam.join(' ') }
    }
}