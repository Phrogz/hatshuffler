const {rerequire} = require('./utils')
const {Player, Season} = require('./lib/gru')
const csv = require('csv-parse/lib/sync')
var fs = require('fs')

function defaultSeason(config) {
	// \ufeff is the UTF8 BOM; the csv library barfs on it, so it needs to be removed, if present.
	const playercsv = fs.readFileSync(config.players).toString().replace(/^\ufeff/, '')
	const players = csv(playercsv, {columns:true, delimiter:',', ltrim:true, rtrim:true}).map(p => Player.fromGRUCSV(p))
	if (config.season) {
		return Season.fromCSV(fs.readFileSync(config.season).toString(), players)
	} else {
		return Season.fromPlayers(players, config.teams, config.rounds)
	}
}

module.exports = defaultSeason;