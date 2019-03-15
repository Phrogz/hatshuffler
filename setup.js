class Team {
	constructor(men=[], women=[]) { this.men=[...men]; this.women=[...women] }
	duplicate() { return new Team(this.men, this.women) }
	get players(){ return [...this.men, ...this.women] }
	each(ƒ) { this.players.forEach(ƒ) }
	map(ƒ)  { return this.players.map(ƒ) }
}

class Round {
	constructor(teams=[]) { this.teams=teams.map(t=>t.duplicate()) }
	each(ƒ) { this.teams.forEach(ƒ) }
	map(ƒ)  { return this.teams.map(ƒ) }
	duplicate() { return new Round(this.teams) }
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
	variation() {
		const round = this.rounds.sample();
		// Pick a random pair of unique indices
		const teamIndices = combinationsByArraySize[round.teams.length].sample();
		const t1 = round.teams[teamIndices[0]],
			  t2 = round.teams[teamIndices[1]];
		const sex = Math.random()<0.33 ? W : M;
		// Swap random players on those two teams
		const t1i = (t1[sex].length*Math.random()) << 0,
		      t2i = (t2[sex].length*Math.random()) << 0;
		[t1[sex][t1i], t2[sex][t2i]] = [t2[sex][t2i], t1[sex][t1i]];
		return this;
	}
	toString() { return this.rounds.map((r,i)=>`Round #${i}\n${r.teams.map(t=>t.players.map(p=>p.name).join(', ')).join('\n')}\n`).join('\n')}
}

// Require a file, reloading it from disk each time
function rerequire(path) {
	delete require.cache[require.resolve(path)];
	return require(path);
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

function make(n, ƒ) {
	return Array.from({length:n}, ƒ);
}

module.exports = function() {
	const config = rerequire('./config');
	const teams = splitIntoTeams(config.players, config.teams);
	const rounds = Array.from({length:config.rounds}, ()=>new Round(teams));
	return new Season(rounds);
};
