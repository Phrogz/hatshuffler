module.exports = {
    players: 'data/demo.csv',     // see data/README.md for file details
    // season:  'data/seed.csv',     // load this file as the initial season
    teams:   4,                   // how many teams are the players split into each round
    rounds:  6,                   // how many rounds of play are there

    iterations:   1e6,  // how does the algorithm run before giving you a chance to tweak these values and continue
    checkinEvery: 4e3,  // how often should the score and rankings be printed; too often slows things down
    maxTemp:      5,    // higher temps allow the algorithm to wander into terrible scores…to escape local minima
    useBestEvery: 1e3,  // after this many iterations, switch back to the best state so far and start hot again

    // how important is each ranking relative to the others
    weightings: {
        distributedWomen:      0, // not needed; women are pre-distributed and kept that way by gender-based swaps
        distributedGiants:     4,
        distributedSpeed:      2,
        distributedXP:         1,
        teamsAreFair:          3,
        playerExposure:        6,
        distributedScheduling: 4,
    }
}