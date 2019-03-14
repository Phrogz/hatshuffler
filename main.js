require('./utils');

class Team {
	constructor(players=[]) { this._players=players }
	duplicate() { return new Team([...this.players]) }
	dup()       { return this.duplicate() }
	get players(){ return this._players }
	set players(p){ this._players=p }
	each(ƒ) { this._players.forEach(ƒ) }
	map(ƒ)  { return this._players.map(ƒ) }
}

class Game {
	constructor(team1=null, team2=null) {
		this._home = team1;
		this._away = team2;
	}
	get home() { return this._home }
	set home(o) { this._home = o }
	get away() { return this._away }
	set away(o) { this._away = o }
	get teams() { return [this._home, this.away] }
	each(ƒ) { [this._home, this._away].forEach(ƒ) }
}

class Round {
	constructor(games=[]) { this.games=games }
	get games() { return this._games }
	set games(a) { this._games=a }
	get teams() { return [...new Set(this._games.flatMap(g => g.teams))] }
	each(ƒ) { this.games.forEach(ƒ) }
	map(ƒ)  { return this.games.map(ƒ) }
}

class Season {
	constructor(rounds=[]) { this._rounds=rounds }
	get rounds() { return this._rounds }
	get teams() { return [...new Set(this._rounds.flatMap(g => g.teams))] }
	each(ƒ) { this.rounds.forEach(ƒ) }
	map(ƒ)  { return this.rounds.map(ƒ) }
}

const rankings = loadRankings();
const players = require('./players');
const teams = splitIntoTeams(players);
console.log(teams, teams.map(t=>t.length));

function splitIntoTeams(players, teams=4) {
	const [men, women] =
		players.partition(p=>p.male).map((players, index) => {
			players = players.sort(p => rankings.playerRank(p)).eachSlice(teams).transpose();
			if (index===1) players.reverse();
			return players;
		});
	return men.map((team,i)=>team.concat(women[i]));
}

function loadRankings() {
	const rankings = {};
	const fs = require('fs');
	fs.readdirSync('rankings').forEach(f => rankings[f.replace(/([^/\\]+)\.js$/, '$1')] = require(`./rankings/${f}`));
	return rankings;
}
