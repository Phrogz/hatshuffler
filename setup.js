const {rerequire} = require('./utils')
const {Player, Season} = require('./lib/gru')
const csv = require('csv-parse/lib/sync')
var fs = require('fs')

function defaultSeason(config) {
	// \ufeff is the UTF8 BOM; the csv library barfs on it, so it needs to be removed, if present.
	const playercsv = fs.readFileSync(config.players).toString().replace(/^\ufeff/, '')
	const players = csv(playercsv, {columns:true, delimiter:',', ltrim:true, rtrim:true}).map(p => Player.fromGRUCSV(p))
	const playersByName = new Map(players.map(p => [p.name, p]))
	players.filter(p => p.baggageName).forEach(p => {
		const other = playersByName.get(p.baggageName);
		if (other) {
			if (other.baggageName) {
				if (other.baggageName===p.name) {
					p.baggage = other
					other.baggage = p
				} else {
					console.warn(`"${p.name}" asked to baggage with "${p.baggageName}", but they asked to baggage with "${other.baggageName}".`)
				}
			} else {
				console.warn(`"${p.name}" asked to baggage with "${p.baggageName}", but they did not select any baggage.`)
			}
		} else {
			console.warn(`"${p.name}" asked to baggage with "${p.baggageName}", but I don't know who that is.`)
		}
	});
	if (config.season) {
		return Season.fromCSV(fs.readFileSync(config.season).toString(), players)
	} else {
		return Season.fromPlayers(players, config.teams, config.rounds)
	}
}

module.exports = defaultSeason;