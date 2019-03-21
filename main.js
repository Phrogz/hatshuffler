const {rerequire} = require('./utils');
const readline = require('readline-sync');
const rankings = loadRankings();
const setup = require('./setup');
const anneal = require('./simulated-annealing');
let config = require('./config');
rankingWeights = config.weightings // intentionally global
const initialSeason = setup(config);
const checkin = require('./checkin');
const parameters = {
	newState: require('./variation'),
	getScore: weightedRankings,
	getTemp: resettingSineCooldown,
	cloneState: initialSeason.duplicate,
	occasionallyInvoke: checkin,
};

function reset() {
	parameters.initialState = setup(config);
}

function loadRankings() {
	const rankings = {};
	const fs = require('fs');
	fs.readdirSync('rankings').forEach(f => rankings[f.replace(/([^/\\]+)\.js$/, '$1')] = require(`./rankings/${f}`));
	return rankings;
}

// Run the rankings in the rankings folder, based on their presence in config.js/weightings
// Weight their scores based on those weightings, and aggregate all the stats they generate
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

function showState(state) {
	console.log(state.toString())
}

function exportState(state) {
	const fs = require('fs')
	const csv = state.toCSV()
	const path = `data/state-${(new Date).toISOShort()}.csv`
	if (!fs.existsSync('data')) fs.mkdirSync('data')
	fs.writeFileSync(path, csv)
	console.log(`Wrote ${path}`)
}

reset();

let currentState = parameters.initialState,
    currentScore = weightedRankings(currentState);
checkin(currentState, currentScore);

while (true) {
	const response = readline.question("(r)eset (g)o (s)how (q)uit: ");

	if (/^q/i.test(response)) {
		showState(currentState)
		process.exit()

	} else if (/^s/i.test(response)) {
		showState(currentState)

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
		exportState(currentState)
		console.log(`${config.iterations} iterations in ${elapsed.toFixed(1)}s (${Math.round(config.iterations/elapsed)} iterations per second)\n`)

	} else if (/^r/i.test(response)) {
		reset();
		currentState = parameters.initialState,
		currentScore = weightedRankings(currentState);;
		checkin(currentState, currentScore);
	}
}
