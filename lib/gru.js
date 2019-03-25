/***********************************************************************************************************
A Season is basically an array of Rounds
  * someSeason.rounds -> the array of Round objects
  * someSeason.teams  -> constructs an array of teams from all rounds

A Round is basically an array of Teams
  * someRound.teams            -> the array of Team objects
  * someRound.teamForPlayer(p) -> returns the Team object given a Player object

A Team is an array of Players, sorted into men (males) and women (females). My apologies to non-binaries.
  * someTeam.men         -> the array of 'male' Players
  * someTeam.women       -> the array of 'female' Players
  * someTeam.players     -> a new array of both men and women
  * someTeam.includes(p) -> returns true if the team has the player, false otherwise

A Player is a collection of useful properties you can use to evaluate and compare them:
  * somePlayer.name           -> "Gavin Kistner"
  * somePlayer.heightInInches -> 71
  * somePlayer.age            -> 46
  * somePlayer.playingSince   -> 1992
  * somePlayer.male           -> true
  * somePlayer.athleticism    -> an integer number based on skill in this area
  * somePlayer.experience     -> an integer number based on skill in this area
  * somePlayer.throwSkills    -> an integer number based on skill in this area
  * somePlayer.vector         -> (convenience) a number combining athleticism, experience, and throwSkills
  * somePlayer.tall           -> (convenience) true if heightInInches >= 73, false otherwise
  * somePlayer.experienced    -> (convenience) true if playingSince < 2010, false otherwise
  * somePlayer.ranking()      -> (convenience) cascading sort used when creating initial 'fair' teams
***********************************************************************************************************/

const csv = require('csv-parse/lib/sync')

const AthleticismToRank = {
	"I'm not in very good shape or I'm not all that quick.":1,
	"I'm not that fast and don't have great endurance but can occasionally rise to the call.":2,
	"I grind it out and get the job done most of the time.":3,
	"I'm a good athlete and consider myself above average.":4,
	"I'm a great athlete. I can jump with, sprint with, and hang with most anyone.":5,
}

const ExperienceToRank = {
	"I've never played ultimate before":0,
	"Intramurals":1,
	"Pickup":1,
	"League / HS Regionals":2,
	"College Club / YCCs":3,
	"Club":4,
	"Club - Made Regionals / Masters Nationals / College Club Nationals":5,
	"Club - Made Nationals":6,
}

const TeamNames = 'Red Green Blue White Orange Purple Pink'.split(' ')
TeamNames.forEach((name,i)=>TeamNames[name] = i)

class Player {
	constructor(obj) {
		if (obj) Object.assign(this, obj);
	}
	static fromGRUCSV(csvObj) {
		const p = new Player;

		p.name = `${csvObj.first_name.trim()} ${csvObj.last_name.trim()}`

		const [feet, inches] = csvObj.Height.match(/\d+/g).map(parseFloat)
		p.heightInInches = feet*12 + inches
		p.tall = p.heightInInches>=73

		p.athleticism = AthleticismToRank[csvObj.Ath] || 1
		p.experience  = ExperienceToRank[csvObj.HighestLevel5] || 1
		p.throwSkills = (csvObj.Throws.match(/,/g) || []).length + 1

		const sum = p.athleticism + p.experience*5/6 + p.throwSkills*5/7
		p.vector = sum>=12.2 ? 5 : sum>=11.2 ? 4 : sum>=9.8 ? 3 : sum>=8.2 ? 2 : 1

		p.male = /^male/i.test(csvObj.gender)

		p.age = csvObj.age_on_evaluation_date*1

		p.speedy = p.athleticism > 3

		p.playingSince = csvObj['Yr Started']*1
		p.experienced = p.playingSince < 2010

		return p
	}
   ranking() { return [-this.vector, this.tall*1, -this.athleticism, this.age] }
	toString() { return this.name + (this.tall ? '(T)' : '') }
}

class Team {
	constructor(men=[], women=[]) {
		this.men=[...men]
		this.women=[...women]
	}
	duplicate() { return new Team(this.men, this.women) }
	get players(){ return [...this.men, ...this.women] }
	toString() { return this.players.join(', ') }
	includes(player) { return (player.male ? this.men : this.women).includes(player) }
}

class Round {
	constructor(teams=[]) { this.teams = teams.map(t=>t.duplicate()) }
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
	constructor(rounds=[]) {
		this.rounds=rounds.map(r=>r.duplicate())
	}

	static fromPlayers(players, teamCount=4, roundCount=5) {
	  // Distribute men and women across teams based on skill
		const [men, women] =
			players.partition(p=>p.male).map((players, index) => {
				players = players.sort(p => p.ranking()).eachSlice(teamCount).transpose();
				// Invert to match team(s) with fewer female players with teams with more male players, for more-even team sizes
				if (index===1) players.reverse();
				return players;
			});
		const teams = men.map((mens,i)=>new Team(mens, women[i]));
		const rounds = Array.from({length:roundCount}, ()=>new Round(teams));
		return new Season(rounds);
	}

	static fromPlayersAndSeason(players, season) {

	}

	get teams() { return [...new Set(this.rounds.flatMap(g => g.teams))] }
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
	toCSV() {
		const teamNameByTeam = new Map()
		this.rounds.forEach(r => r.teams.forEach((t,i) => teamNameByTeam.set(t,TeamNames[i])))
		return this.players.map(p => [
				p.name,
				p.male ? 'M' : 'F',
				'', // blank column in our spreadsheet
				...this.rounds.map(r => teamNameByTeam.get(r.teamForPlayer(p)))
			].join('\t')
		).join('\n');
	}
	static fromCSV(csvString, players) {
		// Assumes a tab-delimited CSV file as output by Season.prototype.toCSV()
		const seasonDetails = csv(csvString, {delimiter:'\t'})
		const playerByName = new Map(players.map(p=>[p.name,p]))
		const rounds = []
		const teamsByNameByRound = []
		const teamNumberByName = {}
		seasonDetails.forEach(row=>{
			const player = playerByName.get(row[0])
			// Skip the player name, sex, and blank column
			row.slice(3).forEach((teamName, roundIndex)=>{
				const round = rounds[roundIndex] = rounds[roundIndex] || new Round;
				const teamsThisRoundByName = teamsByNameByRound[roundIndex] = teamsByNameByRound[roundIndex] || {}
				const teamIndex = TeamNames[teamName]
				const team = round.teams[teamIndex] = round.teams[teamIndex] || new Team
				team[player.male ? 'men' : 'women'].push(player)
			})
		})
		return new Season(rounds)
	}
	toString() { return this.rounds.map((r,i)=>`Round #${i+1}\n${r+''}\n`).join('\n')}
}

module.exports = { Player, Team, Round, Season }
