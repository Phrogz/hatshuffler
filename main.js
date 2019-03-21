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
	getTemp: resettingSineCooldown,
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
	for (const name in rankingWeights) {
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

// Use the 3rd quarter of the sine wave to cool down quickly and then bottom out at 0,
// resetting every so often. Returning false is a signal to switch to the best state.
function resettingSineCooldown(prevTemp, iterations) {
	const resetEvery = config.useBestEvery || 1e3
	const localStep = iterations%resetEvery
   if (localStep===0) return false
   return (Math.sin(Math.PI + Math.PI/2*localStep/resetEvery) + 1) * (config.maxTemp||10)
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

		let {state:newState, score:newScore, elapsed} = anneal(parameters)

		currentState = newState
		currentScore = newScore
		checkin(currentState, currentScore)
		console.log(`${config.iterations} iterations in ${elapsed.toFixed(1)}s (${Math.round(config.iterations/elapsed)} iterations per second)\n`)

	} else if (/^r/i.test(response)) {
		reset();
		currentState = parameters.initialState,
		currentScore = weightedRankings(currentState);;
		checkin(currentState, currentScore);
	}
}
