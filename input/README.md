Requires a CSV file named "players.csv" with—at a minimum—the following fields, in any order:

* `first_name`, `last_name`
* `gender`
* `Ath`
* `HighestLevel5`
* `Throws`
* `Height`
* `Weight`
* `age_on_evaluation_date`
* `Yr Started`
* `Pos`
* `baggage`
* `Weeks Missed`
* `Tourney?`
* `Captain?`
* `Indoor?`
* `email_address`
* `Comments`
* `id`

The result of simulation can output a CSV with the same fields (for re-import and tweaking) or a format suitable for GRU import. This is the field mapping:

raw.csv                            | import.csv
-----------------------------------+------------
first_name+" "+last_name           | Name
gender                             | G
(calculated)                       | Vector
Ath (lookup)                       | Ath
HighestLevel5 (lookup)             | Exp
Throws (lookup)                    | Skill
Height                             | Ht
Weight (extract integer)           | Wt
age_on_evaluation_date             | Age
Yr Started                         | Since
Pos (downcase)                     | Position
Weeks Missed                       | Weeks missed
email_address                      | Email
Comments                           | Comments
id                                 | ID
