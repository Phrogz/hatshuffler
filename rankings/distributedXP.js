// Does each team have the same number of seasoned players?
module.exports = function(season) {
    const players = season.teams.map(t=>t.players.filter(p=>p.experienced).length);
    return {
        score:players.standardDeviation() * 10,
        stats:{ "Experienced Players per Team":players.join(' ') }
    }
}