# The Premiership's Top 4 Statistics 2017-2018 Season 

## Dashboards Target Audience 

The target audience of this dashboard is fans of the top 4 clubs in England and people who are interested in football statistics. 

## The Purpose of this Website

The purpose of this website is to showcase the statistics of the Premier Leagues's Top 4 Teams in a highly interactive manner. The charting of all top 4 2017-2018 game stats allows soccer fans to visualise each teams strengths and weaknesses with ease.
This dashboard is highly responsive and a mobile-first approach has been used.

## Technologies used

The front-end framework Bootstrap 4 was used for dashboard layout and styling.
DC.js a D3 utilising chart library  was used to draw all the dashboard charts.
Crossfilter (a helper library) was used to provide interactivity between the dashboard charts which are dependent on the same dataset.
The IntroJS javascript library was used to create a visually impressive guide/explanation of the dashboard's various charts and calculations. This guide explains the interactivity of elements, how a selection of an chart attribute can influence other dashboard elements. 

## Data Pre-processing

The original dataset was in a JSON file, each datum was in the form below:

`{"date": "12/08/2017", "hTeam": "watford", "aTeam":"liverpool", "hTeamScore" : "3" ,"aTeamScore": "3"}`

Using javascript(code in test.js) the original dataset was converted into a form more suitable for charting:

`{ "date": "13/08/2017", "team": "spurs", "opponent": "newcastle", "home": "false", "scored": "2", "conceded": "0", "points": "3" },`

This form is more suitable because the dashboard is only conveying the statistics of top 4 teams and not every team in the league. The points have been calculated to reduce additional calculations when charting. 

## Functionality/Design

### Layout   

For screen sizes less than 576 pixels the layout is single column. An `overflow:scroll` CSS style is used to deal with the fact the scatterplot charts are significantly larger than their card containers on x-small and small screen sizes.

For small screen sizes a more attractive layout is used. The first row contains the 3 statistical calculations.The next three rows contain 2 charts each. The last last 2 rows contain 1 scatterplot chart each.

For large screens 3 columns are used for statistics, piecharts and barcharts.

On extra large screens the scatterplots are displayed side by side so viewers can easily view all statistics on the same screen.

Flexbox has been used to align items horizontally.

### Interactivity


#### IntroJS

By clicking the `Guide|Explanation` link on the navbar the user is presented with a step by step guide on how to use the dashboard. The dashboard is highly interactive and novice users can be educated on the fact that multiple filters can be applied at once.


#### Reset

Filters on DC.js charts can be removed by clicking the `RESET` link on the navbar, this returns all charts to their default state.

#### Select Menu

The selectMenu allows the filtering of all charts by selecting a single team. By default all teams are selected.The selectMenu was created using the `team` column dimension and a simple crossfilter group() function. 

#### Number Displays

Points percentage per games played, goals scored per game ratio and goals conceded per game ratio calculations are affected by selected filters i.e. team filters and piechart filters. 

The crossfilter groupAll() function was used in conjunction with a custom reduce function to create a group(percent_ratio_group) which determines - total points, total goals scored,total goals conceded and count based on all records or records left after applied filters.
The `percent_ratio_group` group was used in conjunction with the `valueAccessor` property of NumberDisplay charts to determine ratios and percentages.


#### Pie Charts

The three piecharts on the dashboard are reactive to the selection of a team filter via the select menu or the selection of one or more teams via a barchart.The selection of one or more piechart areas applies a filter to the dataset which impacts NumberDisplays, barcharts and scatterplots.

The `wonLostDrew_dimension` dimension used for the WonLostDrawn piechart  is created from a derived function e.g. if the points column for a record is 3 this will be displayed on the piechart as part of the `won` portion.
The `scoredHomeAway_dimension`and `concededHomeAway_dimension` dimensions are created from  derived functions e.g. if the home column has `false` for a record it can be part of the `away` portion for the scoredHomeAway and concededHomeAway piecharts.


#### Stacked Bar Charts

The three barcharts can be used to select a filter of one or more teams, selecting a team(applies a filter to the dataset) will affect number displays, piecharts and scatterplots. The stacked barcharts display information in terms of home and away statistics.
The stacked barcharts were created using custom reduceSum groupings.


#### Scatterplots

The scatterplot charts are extremely useful for identifying how often a team has scored or conceded a certain amount of goals in the given season. Scatterplots are affected by selected team and piechart filters. 

## Testing

**NOTE - D3 charting is not supported by Microsoft browsers. 

For testing purposes Cloud9's run mode was used to host the website during development.

The dashboard was thoroughly tested during development in Chrome developer tools as each feature was introduced.It was tested in terms of appearance and functionality on mobiles,tablets and laptop devices. As an extra precaution all links,functionality and layouts have been checked post development and post deployment in Google Chrome.
No issues were detected in Google Chrome browser.

### Validation

The HTML file has been HTML5 validated using https://validator.w3.org . The CSS file was validated using https://jigsaw.w3.org/css-validator/  . The input dataset(JSON file) was JSON validated before development began.


### Cross browser compatibility testing


### Firefox
Firefox Web developer responsive design mode was used for testing on the Firefox browser.All the standard devices were tested in portrait and landscape mode using the viewport rotate feature.No issues were detected.


## Deployment 

A repository was created on GitHub, the files were then pushed from the Cloud9 IDE to the GiHub repository using Git in Cloud9's Bash shell.
The dashboard was then made live on GitHub through GitHub Pages. Links and filters were then re-tested.
