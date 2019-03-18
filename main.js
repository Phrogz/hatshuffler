require('./utils');
const readline = require('readline-sync');
const rankings = loadRankings();
const setup = require('./setup');
const anneal = require('./simulated-annealing');
const initialSeason = setup();
const config = require('./config');
const checkin = require('./checkin');
const parameters = {
	newState: require('./variation'),
	getScore: weightedRankings,
	getTemp: newTemp,
	cloneState: initialSeason.duplicate,
	occasionallyInvoke: checkin,
	invokeEvery: config.checkinEvery || 1e5,
	maxIterations: 3e7
};
let rankingWeights = require('./rankings/weights');

function reset() {
	parameters.initialState = setup();
	parameters.tempMax = 4;
	parameters.tempMin = 0;
	rankingWeights = require('./rankings/weights');
}

function loadRankings() {
	const rankings = {};
	const fs = require('fs');
	fs.readdirSync('rankings').forEach(f => rankings[f.replace(/([^/\\]+)\.js$/, '$1')] = require(`./rankings/${f}`));
	return rankings;
}

function weightedRankings(state) {
	const result = {score:0, scores:{}, stats:{}};
	let totalWeight=0;
	for (const name in rankings) {
		const weight = rankingWeights[name];
		if (weight) {
			const {score, stats} = rankings[name](state);
			result.score += score * weight;
			totalWeight += weight;
			result.scores[name] = score;
			Object.assign(result.stats, stats);
		}
	}
	result.score /= totalWeight;
	return result;
}

function newTemp(prevTemp, tempMin, tempMax, iterations) {
	return (Math.sin(iterations/1e4)+1)/2 * (tempMax-tempMin) + tempMin;
}

reset();


// const readline = require('readline');
// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);

let currentState = parameters.initialState,
    currentScore  = weightedRankings(currentState);;
checkin(currentState, currentScore);

while (true) {
	const response = readline.question("(g)o (s)how (r)eset (e)dit e(x)it: ");

	if (/^x/i.test(response)) {
		console.log(currentState+'');
		process.exit();

	} else if (/^s/i.test(response)) {
		console.log(currentState+'');

	} else if (/^g/i.test(response)) {
		parameters.initialState = currentState;
		let {state:newState, score:newScore} = anneal(parameters);
		if (newState!==currentState) {
			currentState = newState;
			currentScore = newScore;
			checkin(currentState, currentScore);
		} else {
			console.log('no better state found')
		}

	} else if (/^r/i.test(response)) {
		reset();
		currentState = parameters.initialState,
		currentScore = weightedRankings(currentState);;
		checkin(currentState, currentScore);
	}
}
