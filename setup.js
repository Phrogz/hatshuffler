const {rerequire} = require('./utils')
const {Player, Season} = require('./lib/gru')
const csv = require('csv-parse/lib/sync')
var fs = require('fs')

function defaultSeason(config) {
	const playercsv = fs.readFileSync(config.players).toString()
	const players = csv(playercsv, {columns:true, delimiter:','}).map(p => Player.fromGRUCSV(p))
	if (config.season) {
		return Season.fromCSV(fs.readFileSync(config.season).toString(), players)
	} else {
		return Season.fromPlayers(players, config.teams, config.rounds)
	}
}

module.exports = defaultSeason;