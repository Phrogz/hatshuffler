// Does every team have the same number of women?
module.exports = function(season) {
    const womenPerTeam = season.teams.map(t=>t.women.length);
    return {
        score:womenPerTeam.standardDeviation() * 10,
        stats:{ "Women per Team":womenPerTeam }
    }
}