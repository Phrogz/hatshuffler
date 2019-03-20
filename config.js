module.exports = {
    teams:        4,
    rounds:       5,

    iterations:   5e7,  /* how long with the algorith go before giving you a chance to tweak these values and continue   */
    checkinEvery: 1e4,  /* how often should the score and rankings be printed                                            */
    maxTemp:      3,    /* high temps allow the algorithm to wander into terrible scores...needed to escape local minima */
    useBestEvery: 5e3,  /* after this many iterations, switch to the best one so far                                     */

    /* how important is each ranking relative to the others */
    weightings: {
        distributedWomen:  0, /* no need for this, since women are pre-distributed and kept that way by gender-based swaps */
        distributedGiants: 4,
        distributedSpeed:  2,
        distributedXP:     1,
        evenSkills:        3,
        playerExposure:    5,
    }
}