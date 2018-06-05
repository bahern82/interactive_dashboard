 queue().defer(d3.json, "data/stats.json").await(makeGraphs);
function makeGraphs(error, stats){
    
//result {"date": "12/08/2017", "team": "liverpool", "opponent":"watford"" "home":"false", "scored" : "3" ,"conceded": "3", "points":"0"},
    
    var ndx = crossfilter(stats);

   var team_dim = ndx.dimension(dc.pluck('team'));
   
    var total_points = team_dim.group().reduceSum(dc.pluck('points'));
    var goals_scored = team_dim.group().reduceSum(dc.pluck('scored'));
   var goals_conceded = team_dim.group().reduceSum(dc.pluck('conceded'));
    
    
    
    dc.barChart("#total_points")
    .width(300) . height(200)
    .margins( {top: 10, right: 50, bottom: 30 , left: 50})
    .dimension(team_dim) .group(total_points)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Team")
    .yAxis().ticks(20);
    
    
    
    dc.barChart("#total_scored")
    .width(300) . height(200)
    .margins( {top: 10, right: 50, bottom: 30 , left: 50})
    .dimension(team_dim) .group(goals_scored)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Team")
    .yAxis().ticks(20);
    
    
    dc.barChart("#total_conceded")
    .width(300) . height(200)
    .margins( {top: 10, right: 50, bottom: 30 , left: 50})
    .dimension(team_dim) .group(goals_conceded)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Team")
    .yAxis().ticks(20);
    
    
    
    
    
    
    
    
    dc.renderAll(); 
    
    
}   
    
   
