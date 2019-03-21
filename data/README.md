Player information is specified in `config.js/players` to reference a file to load player information.
This is a CSV file, by default named "players.csv", and must contain the following fields:

* `first_name`, `last_name`
* `gender` —  must be `male` or `female`
* `Ath` — expected to be one of the following strings:
   * `I'm not in very good shape or I'm not all that quick.`
   * `I'm not that fast and don't have great endurance but can occasionally rise to the call.`
   * `I grind it out and get the job done most of the time.`
   * `I'm a good athlete and consider myself above average.`
   * `I'm a great athlete. I can jump with, sprint with, and hang with most anyone.`
* `HighestLevel5` — expected to be one of the following strings:
   * `I've never played ultimate before`
   * `Pickup`
   * `High school`
   * `Intramurals`
   * `League / HS Regionals`
   * `College Club / YCCs`
   * `Club`
   * `Club - Made Regionals / Masters Nationals / College Club Nationals`
   * `Club - Made Nationals`
* `Throws` — expected to be a comma-delimited string of throw types (more is better)
* `Height` — must be in the format `5'10"`
* `age_on_evaluation_date` — an integer
* `Yr Started` — an integer
