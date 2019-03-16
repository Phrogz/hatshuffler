require('./utils');
const rankings = loadRankings();
const setup = require('./setup');
const anneal = require('./simulated-annealing');
const initialSeason = setup;
const parameters = {
	newState: require('./variation'),
	getEnergy: weightedRankings,
	getTemp: newTemp,
	clone: initialSeason.duplicate,
	occasionallyInvoke: checkin,
	invokeEvery: 100
};

function reset() {
	parameters.initialState = setup();
	parameters.tempMax = 1000;
	parameters.tempMin = 0.001;
}

function loadRankings() {
	const rankings = {};
	const fs = require('fs');
	fs.readdirSync('rankings').forEach(f => rankings[f.replace(/([^/\\]+)\.js$/, '$1')] = require(`./rankings/${f}`));
	return rankings;
}

function weightedRankings() {
	return Math.random();
}

function newTemp(prevTemp) {
	return prevTemp - 0.01;
}

function checkin(curSeason, curScore, bestSeason, bestScore, iterations, temp) {
	console.log(`${curScore}/${bestScore}`, iterations, temp)
}

reset();
let result = anneal(parameters);
