require('./utils')
const csv = require('csv-parse/lib/sync')
var fs = require('fs')

const athleticismToRank = {
	"I'm not that fast and don't have great endurance but can occasionally rise to the call.":2,
	"I grind it out and get the job done most of the time.":3,
	"I'm a good athlete and consider myself above average.":4,
	"I'm a great athlete. I can jump with, sprint with, and hang with most anyone.":5,
}

const experienceToRank = {
	"I've never played ultimate before":0,
	"Intramurals":1,
	"Pickup":1,
	"League / HS Regionals":2,
	"College Club / YCCs":3,
	"Club":4,
	"Club - Made Regionals / Masters Nationals / College Club Nationals":5,
	"Club - Made Nationals":6,
}

class Player {
	constructor(obj) {
		if (obj) Object.assign(this, obj);

		const [feet, inches] = this.Height.match(/\d+/g).map(parseFloat)
		this.heightInInches = feet*12 + inches
		this.tall = this.heightInInches>=73
		this.athleticism = athleticismToRank[this.Ath] || 1
		this.experience  = experienceToRank[this.HighestLevel5] || 1
		this.throwSkills = (this.Throws.match(/,/g) || []).length + 1
		const sum = this.athleticism + this.experience*5/6 + this.throwSkills*5/7
		this.vector = sum>=12.2 ? 5 : sum>=11.2 ? 4 : sum>=9.8 ? 3 : sum>=8.2 ? 2 : 1

		this.male = this.gender==='male'
	}
	get name() { return `${this.first_name} ${this.last_name}` }
	toString() { return this.name + (this.tall ? '(T)' : '') }
}

class Team {
	constructor(men=[], women=[]) {
		this.men=[...men]
		this.women=[...women]
	}
	duplicate() { return new Team(this.men, this.women) }
	get players(){ return [...this.men, ...this.women] }
	each(ƒ) { this.players.forEach(ƒ) }
	map(ƒ)  { return this.players.map(ƒ) }
	toString() { return this.players.join(', ') }
	includes(player) { return (player.male ? this.men : this.women).includes(player) }
}

class Round {
	constructor(teams=[]) { this.teams = teams.map(t=>t.duplicate()) }
	each(ƒ) { this.teams.forEach(ƒ) }
	map(ƒ)  { return this.teams.map(ƒ) }
	teamForPlayer(player) { return this.teams.find(t => t.includes(player)) }
	duplicate() { return new Round(this.teams) }
	toString() { return this.teams.map(t=>t+'').join('\n') }
}

const combinationsByArraySize = {
	3: [[0,1], [0,2], [1,2]],
	4: [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]],
	5: [[0,1], [0,2], [0,3], [0,4], [1,2], [1,3], [1,4], [2,3], [2,4], [3,4]],
	6: [[0,1], [0,2], [0,3], [0,4], [0,5], [1,2], [1,3], [1,4], [1,5], [2,3], [2,4], [2,5], [3,4], [3,5], [4,5]],
}

const W='women', M='men';

class Season {
	constructor(rounds=[]) { this.rounds=rounds.map(r=>r.duplicate()) }
	get teams() { return [...new Set(this.rounds.flatMap(g => g.teams))] }
	each(ƒ) { this.rounds.forEach(ƒ) }
	map(ƒ)  { return this.rounds.map(ƒ) }
	duplicate() { return new Season(this.rounds) }
	swizzle() {
		const round = this.rounds.sample()
		// Pick a random pair of unique indices
		const teamIndices = combinationsByArraySize[round.teams.length].sample();
		const t1 = round.teams[teamIndices[0]],
		      t2 = round.teams[teamIndices[1]]
		const sex = Math.random()<0.33 ? W : M;
		// Swap random players on those two teams
		const t1i = (t1[sex].length*Math.random()) << 0,
		      t2i = (t2[sex].length*Math.random()) << 0;
		[t1[sex][t1i], t2[sex][t2i]] = [t2[sex][t2i], t1[sex][t1i]]
		return this
	}
	get players() { return this.rounds[0].teams.flatMap(t=>t.players) }
	toString() { return this.rounds.map((r,i)=>`Round #${i}\n${r+''}\n`).join('\n')}
}

// Require a file, reloading it from disk each time
function rerequire(path) {
	delete require.cache[require.resolve(path)]
	return require(path)
}

// Calculate a good general ranking for a player, to try and balance teams
function playerRank(player) {
	return player.vector;
}

function splitIntoTeams(players, teams=4) {
	const [men, women] =
		players.partition(p=>p.male).map((players, index) => {
			players = players.sort(p => playerRank(p)).eachSlice(teams).transpose();
			if (index===1) players.reverse();
			return players;
		});
	return men.map((mens,i)=>new Team(mens, women[i]));
}

function defaultSeason() {
	const config = rerequire('./config');
	const playercsv = fs.readFileSync('./data/players.csv').toString();
	const players = csv(playercsv, {columns:true}).map(p => new Player(p));
	const teams = splitIntoTeams(players, config.teams);
	const rounds = Array.from({length:config.rounds}, ()=>new Round(teams));
	return new Season(rounds);
};

module.exports = defaultSeason;