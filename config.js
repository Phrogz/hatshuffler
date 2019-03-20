module.exports = {
    teams:        4,
    rounds:       6,

    iterations:   5e4,   /* how long with the algorith go before giving you a chance to tweak these values and continue    */
    checkinEvery: 1e3,   /* how often should the score and rankings be printed (too often slows things down)               */
    maxTemp:      5,     /* higher temps allow the algorithm to wander into terrible scores; needed to escape local minima */
    useBestEvery: 1e3,   /* after this many iterations, switch back to the best state so far                               */

    /* how important is each ranking relative to the others */
    weightings: {
        distributedWomen:  0, /* no need for this, since women are pre-distributed and kept that way by gender-based swaps */
        distributedGiants: 4,
        distributedSpeed:  2,
        distributedXP:     1,
        evenSkills:        3,
        playerExposure:    6,
    }
}