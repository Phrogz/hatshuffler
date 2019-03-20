// Does each team have the same number of fast people?
module.exports = function(season) {
    const players = season.teams.map(t=>t.players.filter(p=>p.speedy).length);
    return {
        score:players.standardDeviation() * 10,
        stats:{ "Speedy Players per Team":players.join(' ') }
    }
}