// Did each player get to play with everyone?
module.exports = function(season) {
    const players = season.players;
    const shortages = players.map(player => players.length - new Set(season.rounds.flatMap(r=>r.teamForPlayer(player).players)).size);
    const avg = shortages.average();
    const max = Math.max.apply(Math, shortages);
    return {
        score:max + avg/10,
        stats:{
            "Players Missed, per Player": shortages,
            "Avg Number of Players Missed": shortages.average(),
            "Most Reclusive Player Missed": max,
        }
    }
}