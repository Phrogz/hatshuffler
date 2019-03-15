require('./utils');
const rankings = loadRankings();
const setup = require('./setup');
const anneal = require('simulated-annealing');
const parameters = {
	newState: require('./variation'),
	getEnergy: weightedRankings,
	getTemp: newTemp,
};

function reset() {
	parameters.initialState = setup();
	parameters.tempMax = 1000;
	parameters.tempMin = 0.001;
}

const fs = require('fs');
function loadRankings() {
	const rankings = {};
	fs.readdirSync('rankings').forEach(f => rankings[f.replace(/([^/\\]+)\.js$/, '$1')] = require(`./rankings/${f}`));
	return rankings;
}

function weightedRankings() {
	return Math.random();
}

function newTemp(prevTemp) {
	return prevTemp - 0.01;
}

reset();
console.log(parameters.initialState+"");
let result = anneal(parameters);
console.log(result+"");
