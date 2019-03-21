# Overview
HatShuffler is a way of organizing sports teams where players play on a different team each week.
Its goal is to optimize the teams for fairness on multiple axes, like:

* a consistent balance between males and females
* distributing tall people, fast people, experienced people, etc.
* ensuring that many different players get to play together
* ensuring that players aren't always stuck in the same time slot

HatShuffler uses [simulated annealing](https://en.wikipedia.org/wiki/Simulated_annealing) to "solve" what
would otherwise be a nightmare problem in combinatorics. It doesn't find the absolute best season schedule,
but it finds ones that are quite good, relatively quickly. This takes a little bit of art and finesse from you
to help tune the algorithm as it runs. More on that below.


# Installing

HatShuffler requires [Node.js](https://nodejs.org/en/), its associated package manager [npm](https://www.npmjs.com/), and [my fork](https://github.com/Phrogz/simulated-annealing) of a simulated annealing package. Given the right software, it runs on a wide variety of operating systems.

The easiest way to get the project is to use [Git](https://git-scm.com/) to pull the source code:

```sh
# creates and fills a directory `hatshuffler` in your current directory
git clone https://github.com/Phrogz/hatshuffler.git
cd hatshuffler

# clone the simulated-annealing library we need
git submodule update --init

# install (in this directory) a few helper libraries
npm install
```

Finally, in order to balance players based on their skills, you need to describe the set of players who will
be playing. See `data/README.md` for details on the CSV format used to import player information.


# Running

First, edit `config.js` to specify the file where your player data is stored,
and control the number of teams and rounds generated:

```js
players: 'data/demo.csv',     /* see data/README.md for file details                  */
teams:   4,                   /* how many teams are the players split into each round */
rounds:  6,                   /* how many rounds of play are there                    */
```

Next, from the command-line run `node main.js` to launch the application.
It will generate intial teams for the players (pretty good for the first round)
and then just repeat those teams for the next rounds (terrible).
It will show you a summary of the season, and ask you what you want to do next.

For example, with the dummy player data in `data/demo.csv` you will see:

```text
6 rounds, 4 teams/round   SCORE: 27.29
  Men/Women per Team           : 7/4, 6/4, 6/4, 6/5
  distributedGiants       ×  4 : 12.25
  distributedSpeed        ×  2 : 5.00
  distributedXP           ×  1 : 19.20
  teamsAreFair            ×  3 : 24.79
  playerExposure          ×  6 : 48.24
  distributedScheduling   ×  4 : 25.97
  Tall Players per Team        : 3 0 2 3 3 0 2 3 3 0 2 3 3 0 2 3 3 0 2 3 3 0 2 3
  Speedy Players per Team      : 3 2 2 3 3 2 2 3 3 2 2 3 3 2 2 3 3 2 2 3 3 2 2 3
  Experienced Players per Team : 5 3 6 1 5 3 6 1 5 3 6 1 5 3 6 1 5 3 6 1 5 3 6 1
  Average Vector per Team      : 2.5 2.2 1.9 2.0 2.5 2.2 1.9 2.0 2.5 2.2 1.9 2.0 2.5 2.2 1.9 2.0 2.5 2.2 1.9 2.0 2.5 2.2 1.9 2.0
  Average Vector per Player    : 2.5 2.5 2.5 2.5 2.5 2.5 2.5 2.5 2.5 2.5 2.5 2.2 2.2 2.2 2.2 2.2 2.2 2.2 2.2 2.2 2.2 1.9 1.9 1.9 1.9 1.9 1.9 1.9 1.9 1.9 1.9 2.0 2.0 2.0 2.0 2.0 2.0 2.0 2.0 2.0 2.0 2.0
  Players Missed, per Player   : 31 31 31 31 31 31 31 31 31 31 31 32 32 32 32 32 32 32 32 32 32 32 32 32 32 32 32 32 32 32 32 31 31 31 31 31 31 31 31 31 31 31
  Avg Number of Players Missed : 31.5
  Most Reclusive Player Missed : 32
  Team 1 player assignments    : 6 6 6 6 6 6 6 6 6 6 6 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Team 2 player assignments    : - - - - - - - - - - - 6 6 6 6 6 6 6 6 6 6 - - - - - - - - - - - - - - - - - - - - -
  Team 3 player assignments    : - - - - - - - - - - - - - - - - - - - - - 6 6 6 6 6 6 6 6 6 6 - - - - - - - - - - -
  Team 4 player assignments    : - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 6 6 6 6 6 6 6 6 6 6 6

(r)eset (g)o (s)how (q)uit:
```

At this point, you want to type `g <enter>` to have the program do an initial pass at optimizing the season.
It will occasionally show you its progress, outputting snapshots of the 'current' season (on the left) and
a summary of the best season it's made so far (on the right):

```text
6 rounds, 4 teams/round   SCORE: 15.18  iterations:20000  elapsed:13.7s          | BEST SCORE: 8.91
  Men/Women per Team           : 7/4, 6/4, 6/4, 6/5
  distributedGiants       ×  4 : 10.41                                           | 5.77
  distributedSpeed        ×  2 : 13.54                                           | 5.77
  distributedXP           ×  1 : 11.64                                           | 5.95
  teamsAreFair            ×  3 : 27.90                                           | 6.77
  playerExposure          ×  6 : 16.89                                           | 13.91
  distributedScheduling   ×  4 : 9.57                                            | 8.44
  Tall Players per Team        : 2 0 4 2 1 3 2 2 5 1 1 1 2 2 2 2 2 3 2 1 2 1 3 2 | 2 2 2 2 2 1 2 3 3 2 1 2 2 2 2 2 1 3 2 2 2 3 2 1
  Speedy Players per Team      : 5 0 3 2 2 2 5 1 2 2 3 3 4 2 3 1 1 3 2 4 1 3 5 1 | 2 4 2 2 3 2 3 2 3 2 3 2 3 2 2 3 3 2 3 2 2 3 2 3
  Experienced Players per Team : 4 4 3 4 4 4 4 3 4 6 2 3 2 4 5 4 4 4 3 4 2 4 2 7 | 3 4 4 4 4 4 3 4 4 4 4 3 4 5 3 3 3 4 4 4 4 3 5 3
  Average Vector per Team      : 2.6 1.5 2.5 2.0 2.5 1.9 2.6 1.7 1.7 2.2 2.1 2.… | 2.1 2.2 2.3 2.1 2.3 2.2 2.2 2.0 2.3 2.0 2.2 2.2 2.3 2.2 2.2 2.0 2.2 2.1 2.3 2.1 2.1 2.3 2.1 2.2
  Average Vector per Player    : 2.1 2.1 2.5 2.3 2.3 2.4 2.0 2.2 2.3 2.4 2.4 1.… | 2.2 2.1 2.1 2.1 2.2 2.1 2.2 2.2 2.2 2.2 2.1 2.2 2.1 2.2 2.2 2.2 2.2 2.2 2.1 2.2 2.1 2.2 2.2 2.2 2.2 2.2 2.3 2.2 2.2 2.2 2.2 2.2 2.1 2.2 2.1 2.1 2.1 2.2 2.1 2.1 2.1 2.1
  Players Missed, per Player   : 8 6 8 8 8 7 6 6 10 10 8 10 4 8 9 11 4 7 10 9 9… | 6 6 4 6 8 6 6 7 9 6 8 6 8 9 6 7 7 9 6 7 5 7 8 7 6 8 9 9 6 9 8 4 8 6 9 6 8 7 9 8 6 8
  Avg Number of Players Missed : 8.0                                             | 7.1
  Most Reclusive Player Missed : 11                                              | 9
  Team 1 player assignments    : 2 3 2 1 3 2 4 2 2 1 3 1 1 1 2 1 2 1 2 1 1 1 1 … | 1 1 4 2 2 2 3 1 2 1 2 2 1 1 1 1 2 1 1 3 - 2 1 1 2 2 2 2 1 1 1 1 1 1 2 2 2 2 3 1 1 1
  Team 2 player assignments    : 2 - 2 1 2 - 1 - 2 1 1 2 1 3 3 4 1 3 1 2 3 3 2 … | 2 1 1 3 1 1 1 - 2 2 1 1 2 1 1 3 2 3 3 2 2 1 2 1 1 2 1 1 1 1 1 3 1 1 1 1 1 1 - 2 1 1
  Team 3 player assignments    : 1 1 1 3 - 2 - 2 1 4 2 1 3 - 1 - - 1 1 - 1 1 3 … | 2 3 - 1 2 - - 4 1 2 - 1 - 2 3 - 1 1 1 - 2 3 2 2 2 2 2 2 1 2 3 1 2 2 1 1 1 2 1 1 1 -
```

When 'finished', it will summarize the best season it made, write the season to a unique file,
and again ask you what you want to do.

If you feel that the season is not yet good enough, you can type `g <enter>` again and the algorithm will continue
to operate on the season.

If you want to see the team it made, you can type `s <enter>` and it will `(s)how` the season:

```text
Round #1
Markus Lafont(T), Kaile Ziemecki, Adlai Patrone, Aluino Okker, Boycie Reading, Rowan Westwater, Shirlton Durdle, Flora Jambrozek, Kira Freschi(T), Cecily Calcutt, Dorey Bryde
Bert Thiem, Inness Wickenden(T), Livy Alebrooke, Northrop Von Hindenburg, Rob Tagg, Lauri Knewstubb, Reilla Greason(T), Derida Gossling, Belvia Duffan, Agnesse Brockie
Elmet Cotta, Carlie Heardman(T), Ravid Yerrell, Markle Phette(T), Taddeo Tubb, Myrlone Garron, Daela Skehens, Trude Skeel, Kalli McGoon, Kalle Bowlands
Kale Bandy, Shane Dorsey, Ryley Wisby(T), Leonhard Schofield, Velmo Claxson, Bartlett Gurery, Graeta Pallesen, Anastassia Goldhawk(T), Reggia Barter, Chelsie D'Alessio, Loralie Filyushkin

Round #2
Bert Thiem, Elmet Cotta, Shirlton Durdle, Myrlone Garron, Velmo Claxson, Inness Wickenden(T), Ryley Wisby(T), Kalle Bowlands, Belvia Duffan, Graeta Pallesen, Daela Skehens
Kale Bandy, Taddeo Tubb, Carlie Heardman(T), Lauri Knewstubb, Kaile Ziemecki, Aluino Okker, Trude Skeel, Derida Gossling, Reggia Barter, Kalli McGoon
Shane Dorsey, Markus Lafont(T), Boycie Reading, Ravid Yerrell, Livy Alebrooke, Northrop Von Hindenburg, Chelsie D'Alessio, Reilla Greason(T), Flora Jambrozek, Cecily Calcutt
Adlai Patrone, Rowan Westwater, Bartlett Gurery, Rob Tagg, Markle Phette(T), Leonhard Schofield, Loralie Filyushkin, Kira Freschi(T), Agnesse Brockie, Dorey Bryde, Anastassia Goldhawk(T)

Round #3
Taddeo Tubb, Lauri Knewstubb, Boycie Reading, Northrop Von Hindenburg, Markle Phette(T), Shane Dorsey, Adlai Patrone, Graeta Pallesen, Reilla Greason(T), Belvia Duffan, Anastassia Goldhawk(T)
Inness Wickenden(T), Elmet Cotta, Velmo Claxson, Rowan Westwater, Kale Bandy, Aluino Okker, Reggia Barter, Chelsie D'Alessio, Agnesse Brockie, Kira Freschi(T)
Livy Alebrooke, Kaile Ziemecki, Leonhard Schofield, Bartlett Gurery, Bert Thiem, Markus Lafont(T), Cecily Calcutt, Derida Gossling, Kalle Bowlands, Daela Skehens
Ryley Wisby(T), Rob Tagg, Carlie Heardman(T), Shirlton Durdle, Ravid Yerrell, Myrlone Garron, Kalli McGoon, Loralie Filyushkin, Flora Jambrozek, Dorey Bryde, Trude Skeel

Round #4
Myrlone Garron, Shirlton Durdle, Leonhard Schofield, Kale Bandy, Livy Alebrooke, Adlai Patrone, Markle Phette(T), Chelsie D'Alessio, Trude Skeel, Daela Skehens, Kira Freschi(T)
Markus Lafont(T), Bartlett Gurery, Carlie Heardman(T), Taddeo Tubb, Aluino Okker, Rob Tagg, Cecily Calcutt, Graeta Pallesen, Loralie Filyushkin, Belvia Duffan
Elmet Cotta, Lauri Knewstubb, Kaile Ziemecki, Northrop Von Hindenburg, Velmo Claxson, Ryley Wisby(T), Flora Jambrozek, Agnesse Brockie, Anastassia Goldhawk(T), Kalli McGoon
Boycie Reading, Shane Dorsey, Inness Wickenden(T), Ravid Yerrell, Bert Thiem, Rowan Westwater, Dorey Bryde, Kalle Bowlands, Reilla Greason(T), Derida Gossling, Reggia Barter

Round #5
Rowan Westwater, Bartlett Gurery, Ravid Yerrell, Aluino Okker, Taddeo Tubb, Rob Tagg, Bert Thiem, Belvia Duffan, Kalli McGoon, Loralie Filyushkin, Anastassia Goldhawk(T)
Ryley Wisby(T), Markle Phette(T), Shirlton Durdle, Leonhard Schofield, Shane Dorsey, Adlai Patrone, Derida Gossling, Reilla Greason(T), Kalle Bowlands, Dorey Bryde
Myrlone Garron, Elmet Cotta, Kale Bandy, Northrop Von Hindenburg, Boycie Reading, Carlie Heardman(T), Graeta Pallesen, Flora Jambrozek, Kira Freschi(T), Reggia Barter
Markus Lafont(T), Velmo Claxson, Lauri Knewstubb, Inness Wickenden(T), Kaile Ziemecki, Livy Alebrooke, Trude Skeel, Cecily Calcutt, Chelsie D'Alessio, Agnesse Brockie, Daela Skehens

Round #6
Velmo Claxson, Bartlett Gurery, Carlie Heardman(T), Adlai Patrone, Elmet Cotta, Lauri Knewstubb, Leonhard Schofield, Derida Gossling, Reggia Barter, Anastassia Goldhawk(T), Dorey Bryde
Rob Tagg, Ravid Yerrell, Boycie Reading, Kale Bandy, Markus Lafont(T), Myrlone Garron, Daela Skehens, Kira Freschi(T), Cecily Calcutt, Reilla Greason(T)
Aluino Okker, Markle Phette(T), Kaile Ziemecki, Shane Dorsey, Taddeo Tubb, Ryley Wisby(T), Kalle Bowlands, Flora Jambrozek, Agnesse Brockie, Graeta Pallesen
Bert Thiem, Northrop Von Hindenburg, Shirlton Durdle, Rowan Westwater, Inness Wickenden(T), Livy Alebrooke, Loralie Filyushkin, Belvia Duffan, Trude Skeel, Kalli McGoon, Chelsie D'Alessio
```

If you feel that maybe HatShuffler is optimizing for the wrong things, you can (while the program is running)
edit the ranking weights `in config.js` and then `(g)o` again, as described in the next section.
HatShuffler will recalculate the score of the best season and continue to optimize it.


## Modifying Rankings & Ranking Weights

Each time HatShuffler makes a new season it runs a series of 'rankings' to see how good the season is.
These rankings are stored in the `rankings/` directory. See the top of each file for a description on
what it attempts to measure.

Every measurement uses 0 as the **best** score. As in golf, the higher the score, the worse the season.
Not all rankings have the same scale, and not all are as important as others. If you see a ranking that
is getting bad scores, and you want to increase its relative importance in determining the overall score,
edit `config.js`:

```js
/* how important is each ranking relative to the others */
weightings: {
    distributedWomen:      0,
    distributedGiants:     4,
    distributedSpeed:      2,
    distributedXP:         1,
    teamsAreFair:          3,
    playerExposure:        6,
    distributedScheduling: 4,
}
```

In the above, the `distributedWomen` ranking is ignored (not even run).
_(The season-modification algorithm already ensures that they are always distributed.)_

Turning off rankings speeds up the overall performance of HatShuffler.

Changes made to `config.js` are used each time you set the algorithm in motion with `(g)o`.
You can edit the file at other times, but it won't take effect in the middle of an optimization run.


## Modifying Run Parameters

When you let the application `(g)o` it runs for a fixed number of "iterations". Each iteration it
modifies the current season a little bit, by picking a round at random, and then picking two players
of the same sex and swapping them. Then it measures the result using the rankings (described above).

* If the new season is better: Great! That's our new best season!
* If the new season is worse, we _maybe_ discard it, maybe use it and see where it leads us.

If we never accepted worse seasons, we could get stuck in a "local minimum". No simple player swap would
make our season better, but maybe if we made 10 terrible trades we'd suddenly be in a much better position.

The simulated annealing algorithm uses "temperature" to help make the decision. Temperature is an internal
number used by the program. The temperature starts out hot and cools down over time. When it's hot, the
application is more likely to accept a worse season. As it cools, it will only accept seasons that are a
little worse, and eventually only better seasons.

However, experience shows that we may need to explore many "dead end" seasons before finding one that leads
us down the right path. Instead of you sitting at the computer and pressing `(g)o` repeatedly, a single
annealing run of HatShuffler periodically abandons what it's doing, picks up the best season its found,
turns the temperature back up and starts again.

All the background knowledge above lets you tune these settings in `config.js`:

```js
iterations:   1e5, /* how does the algorithm run before giving you a chance to tweak these values and continue */
checkinEvery: 1e3, /* how often should the score and rankings be printed; too often slows things down          */
maxTemp:      4,   /* higher temps allow the algorithm to wander into terrible scores…to escape local minima   */
useBestEvery: 5e2, /* after this many iterations, switch back to the best state so far and start hot again     */
```

The scientific notation above—`1e5` instead of `100000`—is just so that you can change numbers by orders of
magnitude without OCD forcing you to re-align the comments. :)


## Picking the Right Values

The values for the first two parameters are mostly up to your preference:

* If `iterations` is too high, you'll have to wait a long time before you can tweak rankings or temperatures.
* If `iterations` is too low, you'll just have to keep typing `g <enter>` to go again after each run.
* If `checkinEvery` is too high, you'll (slightly) slow down the algorithm as wastes time keeping you informed.
* If `checkinEvery` is too low, you'll bite your fingernails dying to find out if things are going well.

The other two parameters can heavily affect how quickly you get a really good season generated:

* If `maxTemp` is too high, the algorithm will keep choosing terrible seasons and spend too little time on good ones.
* If `maxTemp` is too low, the algorithm will get stuck in local minima. Raise the temperature if you get stuck and see if it can walk out.
* If `useBestEvery` is too high, the algorithm will spend more time on what may be dead end attempts.
* If `useBestEvery` is too low, the algorithm may not have time to explore paths before the temperature cools off and it starts over.


# Adding New Rankings

_TODO: describe the data structures in `gru.js`, the importance of ranking similarity, using stddev instead of absolute values, ..._
# TODO

* Provide a config option to import a season from CSV (using the same schema as it exports)
  so you can save, share and pick up where you left off later.
* Clean up files/folders so that the main shell is 100% generic and separated from GRU/seasons.
* Clean up files/folders and document what each file is for.
* Either promote customized annealing library to main, or fork into its own npm. (Git submodules are annoying.)
* Provide a web-based front-end in lieu of the ghetto console-based interface.


# History

* 2019-03-21 — v0.5.0 just barely working


# License & Contact

HatShuffler is copyright ©2019 by ***REMOVED*** and is licensed under the [MIT License](http://opensource.org/licenses/MIT). See the LICENSE file for more details.

For bugs or feature requests please open [issues on GitHub](https://github.com/Phrogz/hatshuffler/issues). For other communication you can [email the author](mailto:!@phrogz.net?subject=hatshuffler) directly.
