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
    
    //  piecharts
    
    var wonLostDrew_dimension = ndx.dimension( function(d){
     
     if( d.points==3) //d.scored > d.conceded
     {
      return "Won";
     }
     else if( d.points==0)
     {
       return "Lost";
     }
     else{
      return "Drew";
     }
     
    });
    var wonLostDrew_group = wonLostDrew_dimension.group();
    //console.log(wonLostDrew_group.all());
    dc.pieChart("#won_lost_drew" )
    .height(330).radius(90)
    .dimension(wonLostDrew_dimension)
    .group(wonLostDrew_group);
    
    
    var scoredHomeAway_dimension = ndx.dimension( function(d){
     //"home": "false"
     if( d.home=="true") //d.scored > d.conceded
     {
      return "Home";
     }
     else{
      return "Away";
     }
     
    });
    var scoredHomeAway_group = scoredHomeAway_dimension.group().reduceSum(dc.pluck('scored'));
    

    
    dc.pieChart("#scoredHomeAway_piechart" )
    .height(330).radius(90)
    .dimension(scoredHomeAway_dimension)
    .group(scoredHomeAway_group);
    
     var concededHomeAway_dimension = ndx.dimension( function(d){
     //"home": "false"
     if( d.home=="true") //d.scored > d.conceded
     {
      return "Home";
     }
     else{
      return "Away";
     }
     
    });
    var concededHomeAway_group = scoredHomeAway_dimension.group().reduceSum(dc.pluck('conceded'));
    
    dc.pieChart("#concededHomeAway_piechart" )
    .height(330).radius(90)
    .dimension(concededHomeAway_dimension)
    .group(concededHomeAway_group );
    
    //line graph
    var parseDate = d3.time.format("%d/%m/%Y").parse;
    stats.forEach( function(d){
       d.date = parseDate( d.date);
    });
    var date_dim = ndx.dimension(dc.pluck('date'));
    
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
    
    var points_per_month = date_dim.group().reduceSum(dc.pluck('points'));
    
    
    //console.log(points_per_month.all());
    
    dc.lineChart("#points_linechart")
    .width(1000) .height(400)
    .margins( {top: 10, right: 50, bottom: 30 , left: 50})
    .dimension(date_dim) .group(points_per_month)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate,maxDate]))
    .xAxisLabel("Month")
    .yAxis().ticks(20);
    
    
    
    
    dc.renderAll(); 
    
    
}   
    
   
