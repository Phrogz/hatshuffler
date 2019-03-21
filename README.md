# Overview
HatShuffler is a way of organizing sports teams where players play on a different team each week. Its goal is to optimize the teams for fairness on multiple axes, like:

* a consistent balance between males and females
* distributing tall people, fast people, experienced people, etc.
* ensuring that many different players get to play together
* ensuring that players aren't always stuck in the same time slot

HatShuffler uses [simulated annealing](https://en.wikipedia.org/wiki/Simulated_annealing) to "solve" what would otherwise be a nightmare problem in combinatorics. It doesn't find the absolute best season schedule, but it finds ones that are quite good, relatively quickly. This takes a little bit of art and finesse on the side of you, the operator, to help tune the algorithm as it runs. More on that below.

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

# Running

# Modifying

# TODO

# History

# License & Contact

HatShuffler is copyright ©2019 by ***REMOVED*** and is licensed under the [MIT License](http://opensource.org/licenses/MIT). See the LICENSE file for more details.

For bugs or feature requests please open [issues on GitHub](https://github.com/Phrogz/hatshuffler/issues). For other communication you can [email the author](mailto:!@phrogz.net?subject=hatshuffler) directly.
