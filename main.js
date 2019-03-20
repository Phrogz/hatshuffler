const {rerequire} = require('./utils');
const readline = require('readline-sync');
const rankings = loadRankings();
const setup = require('./setup');
const anneal = require('./simulated-annealing');
const initialSeason = setup();
let config = require('./config');
rankingWeights = config.weightings // intentionally global
const checkin = require('./checkin');
const parameters = {
	newState: require('./variation'),
	getScore: weightedRankings,
	getTemp: sineWaveTemp,
	cloneState: initialSeason.duplicate,
	occasionallyInvoke: checkin,
};

function reset() {
	parameters.initialState = setup();
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

function sineWaveTemp(prevTemp, iterations) {
	return (Math.cos(Math.PI*2*iterations/(config.resetEvery||1e3))+1)/2 * (config.maxTemp||10);
}

reset();

let currentState = parameters.initialState,
    currentScore = weightedRankings(currentState);
checkin(currentState, currentScore);

while (true) {
	const response = readline.question("(g)o (s)how (r)eset (e)dit e(x)it: ");

	if (/^[xq]/i.test(response)) {
		console.log(currentState+'');
		process.exit();

	} else if (/^s/i.test(response)) {
		console.log(currentState+'');

	} else if (/^g/i.test(response)) {
		config = rerequire('./config')
		rankingWeights = config.weightings
		parameters.initialState = currentState
		parameters.maxIterations = config.iterations
		parameters.invokeEvery = config.checkinEvery
		let {state:newState, score:newScore} = anneal(parameters)
		currentState = newState
		currentScore = newScore
		checkin(currentState, currentScore)

	} else if (/^r/i.test(response)) {
		reset();
		currentState = parameters.initialState,
		currentScore = weightedRankings(currentState);;
		checkin(currentState, currentScore);
	}
}
