// A function to be invoked every so often (see checkinEvery in config.js)
// Will be passed the following ordered parameters:
//   * The current state
//   * The energy/stats of the current state
//   * The best state
//   * The energy/stats of the best state
//   * The current temperature
//   * The current number of iterations elapsed
//   * The current elapsed number of seconds
module.exports = function checkin(curSeason, curRank, bestSeason, bestRank, temp, iterations, elapsed) {
    const colWidth = 80
    const teams0 = curSeason.rounds[0].teams
    let header = `${curSeason.rounds.length} rounds, ${teams0.length} teams/round   SCORE: ${curRank.score.toFixed(2)}`
    if (iterations) header += `  iterations:${iterations}  elapsed:${elapsed.toFixed(1)}s`
    if (temp && temp.toFixed) header += `  ${temp.toFixed(2)}°`
    if (bestRank) header = elide(header, colWidth) + ` | BEST SCORE: ${bestRank.score.toFixed(2)}`
    console.log(header)

    const nameLength = Math.max.apply(Math, [...Object.keys(curRank.scores), ...Object.keys(curRank.stats)].map(n=>n.length))
    console.log(`  ${"Men/women per Team".padEnd(nameLength)} : ${teams0.map(t => [t.men.length, t.women.length].join('/')).join(', ')}`)
    for (const name in curRank.scores) {
        let line = `  ${name.padEnd(nameLength-5, ' ')} × ${rankingWeights[name].toString().padStart(2)} : ${curRank.scores[name].toFixed(2)}`
        if (bestRank) line = elide(line, colWidth) + ` | ${bestRank.scores[name].toFixed(2)}`
        console.log(line)
    }
    for (const name in curRank.stats) {
        let line = `  ${name.padEnd(nameLength, ' ')} : ${curRank.stats[name]}`
        if (bestRank) line = elide(line, colWidth) + ` | ${bestRank.stats[name]}`
        console.log(line)
    }
    console.log()
}

function elide(str, len) {
    if (str.length>len) {
        const re = new RegExp('^(.{' + (len-1) + '})[\\d\\D]+')
        return str.replace(re, '$1…')
    } else return str.padEnd(len, ' ')
}