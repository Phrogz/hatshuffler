const {rerequire} = require('./utils')
const {Player, Season} = require('./lib/gru')
const csv = require('csv-parse/lib/sync')
var fs = require('fs')

function defaultSeason(config) {
	const playercsv = fs.readFileSync(config.players).toString()
	const players = csv(playercsv, {columns:true}).map(p => Player.fromGRUCSV(p))
	return Season.fromPlayers(players, config.teams, config.rounds)
}

module.exports = defaultSeason;