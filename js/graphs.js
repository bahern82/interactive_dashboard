 queue().defer(d3.json, "data/stats.json").await(makeGraphs);
function makeGraphs(error, stats){
    
//result {"date": "12/08/2017", "team": "liverpool", "opponent":"watford"" "home":"false", "scored" : "3" ,"conceded": "3", "points":"0"},
    
    var ndx = crossfilter(stats);

   var team_dim = ndx.dimension(dc.pluck('team'));
   var team_group = team_dim.group();
   
   dc.selectMenu("#team_selector")
   .dimension(team_dim)
   .group(team_group);
   
   //******************** %s ratios**************************
   
   //var points_dim = ndx.dimension(dc.pluck('points'));
    var percent_ratio_group = ndx.groupAll().reduce( 
     
     //adder
     function(p,v){
       p.count++;
       p.total_points += v.points;
       p.total_scored += v.scored;
       p.total_conceded += v.conceded;
       return p;
     },
     //sub
     function(p,v){
      p.count--;
      if(p.count==0){
        p.total_points=0;
         p.total_scored=0;
         p.total_conceded=0;
      }
      else{
           p.total_points -= v.points;
           p.total_scored -= v.scored;
           p.total_conceded -= v.conceded;
          }
      return p;
      
     },
     //init
     function(){
      return{ count: 0, total_points: 0, total_scored: 0, total_conceded: 0 };
     }
     );
     
     dc.numberDisplay("#points_to_total_points_percentage")
     .group(percent_ratio_group)
     .formatNumber(d3.format(".2%"))
     .valueAccessor( function(d){
      if(d.count==0){ return 0}
      else{  return d.total_points / (d.count * 3)}
     
     });

     dc.numberDisplay("#scored_per_game_Ratio")
     .group(percent_ratio_group)
     .formatNumber(d3.format(".2"))
     .valueAccessor( function(d){
      if(d.count==0){ return 0}
      else{  return (d.total_scored / d.count).toFixed(2)}
     
     });
     
       dc.numberDisplay("#conceded_per_game_Ratio")
     .group(percent_ratio_group)
     .formatNumber(d3.format(".2"))
     .valueAccessor( function(d){
      if(d.count==0){ return 0}
      else{  return (d.total_conceded / d.count).toFixed(2)}
     
     });
     
     
   
   
   
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
       d.scored=parseInt(d.scored);
       d.conceded=parseInt(d.conceded);
       d.points=parseInt(d.points);
    });
    var date_dim = ndx.dimension(dc.pluck('date'));
    
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
    
    /*
    var points_per_month = date_dim.group().reduceSum(dc.pluck('points'));
    console.log(points_per_month.all());
    dc.lineChart("#points_linechart")
    .width(1000) .height(400)
    .margins( {top: 10, right: 50, bottom: 30 , left: 50})
    .dimension(date_dim) .group(points_per_month)
    .transitionDuration(500)
    .x(d3.time.scale().domain([minDate,maxDate]))
    .xAxisLabel("Month")
    .yAxis().ticks(20);*/
    
    //stacked charts
    
    // points home and away
    
    var group_pointsByTeamAtHome = team_dim.group().reduceSum(function(d){
      if(d.home=="true"){
       return +d.points;
      }
      else{
        return 0;
      }
    });
    var group_pointsByTeamAway = team_dim.group().reduceSum(function(d){
      if(d.home=="false"){
       return +d.points;
      }
      else{
        return 0;
      }
    });
    var stackedPointsChart = dc.barChart("#points_stackedChart");
    stackedPointsChart
    .width(300) .height(200)
    .dimension(team_dim)
    .group(group_pointsByTeamAtHome, "Home")
    .stack(group_pointsByTeamAway, "Away")
    .x(d3.scale.ordinal())
    .xUnits( dc.units.ordinal)
    .legend( dc.legend().x(420).y(0).itemHeight(15).gap(5))
    .margins( {top: 10, right: 50, bottom: 30 , left: 50});
    
    
    // scored home and away
    var group_scoredByTeamAtHome = team_dim.group().reduceSum(function(d){
      if(d.home=="true"){
       return +d.scored;
      }
      else{
        return 0;
      }
    });
    var group_scoredByTeamAway = team_dim.group().reduceSum(function(d){
      if(d.home=="false"){
       return +d.scored;
      }
      else{
        return 0;
      }
    });
    var stackedScoredChart = dc.barChart("#scored_stackedChart");
    stackedScoredChart
    .width(300) .height(200)
    .dimension(team_dim)
    .group(group_scoredByTeamAtHome, "scored home")
    .stack(group_scoredByTeamAway, "scored away")
    .x(d3.scale.ordinal())
    .xUnits( dc.units.ordinal)
    .legend( dc.legend().x(420).y(0).itemHeight(15).gap(5))
    .margins( {top: 10, right: 50, bottom: 30 , left: 50});
    
     // conceded home and away
    var group_concededByTeamAtHome = team_dim.group().reduceSum(function(d){
      if(d.home=="true"){
       return +d.conceded;
      }
      else{
        return 0;
      }
    });
    var group_concededByTeamAway = team_dim.group().reduceSum(function(d){
      if(d.home=="false"){
       return +d.conceded;
      }
      else{
        return 0;
      }
    });
    var concededScoredChart = dc.barChart("#conceded_stackedChart");
    concededScoredChart
    .width(300) .height(200)
    .dimension(team_dim)
    .group(group_concededByTeamAtHome, "conceded home")
    .stack(group_concededByTeamAway, "conceded away")
    .x(d3.scale.ordinal())
    .xUnits( dc.units.ordinal)
    .legend( dc.legend().x(420).y(0).itemHeight(15).gap(5))
    .margins( {top: 10, right: 50, bottom: 30 , left: 50});
    
    // scored_scatterplot
   
    
    //date_dim,minDate //.brushOn(false)
    var goals_dim = ndx.dimension( function(d) {
       return [d.date, d.scored, d.team, d.opponent, d.conceded]; //map to co ordinates
    });
    var goals_group = goals_dim.group();
    var minDate2 = d3.time.day.offset(minDate, -5);
    var maxDate2 =d3.time.day.offset(maxDate, 5);
    
    var teamColors = d3.scale.ordinal().domain(["man city","man utd","spurs","liverpool"])
    .range(["blue","red","black","orange"]); // 1 to 1 mapping
        
    
    //console.log(goals_group.all());
    //var minDate = date_dim.bottom(1)[0].date;
    /*  var date_dim = ndx.dimension(dc.pluck('date'));
    var scored_dim = ndx.dimension(dc.pluck('scored'));
    var minDate = date_dim.bottom(1)[0].date;
    
    */
    var scored_dim = ndx.dimension(dc.pluck('scored'));
    var maxScored = scored_dim.top(1)[0].scored;
    
    var goals_scatterplot = dc.scatterPlot("#scored_scatterplot")
    goals_scatterplot
    .width(768) .height(240)
    .x(d3.time.scale().domain([minDate2 , maxDate2]) )
    .y(d3.scale.linear().domain([-1,maxScored]))
    .symbolSize(8)
    .clipPadding(10)
    .yAxisLabel(" Goals Scored")
    .title( function(d){
       return `${d.key[2]} ${d.key[1]}  ${d.key[3]} ${d.key[4]} - ${d.key[0]}`;
    })
    .colorAccessor( function(d){
     return d.key[2];
    })
    .colors(teamColors)
    .brushOn(false)
    .dimension(goals_dim)
    .group(goals_group);
    
     // conceded_scatterplot
    var conceded_dim1 = ndx.dimension(dc.pluck('conceded'));
    var maxConceded = conceded_dim1.top(1)[0].conceded;
    maxConceded  =parseInt(maxConceded);
    
    //date_dim,minDate //.brushOn(false)
    var conceded_dim = ndx.dimension( function(d) {
       return [d.date, d.conceded, d.team, d.opponent, d.scored]; //map to co ordinates
    });
    var conceded_group = conceded_dim.group();
    var minDate2 = d3.time.day.offset(minDate, -5);
    var maxDate2 =d3.time.day.offset(maxDate, 5);
    
    var teamColors = d3.scale.ordinal().domain(["man city","man utd","spurs","liverpool"])
    .range(["blue","red","black","orange"]); // 1 to 1 mapping
        
    
    //console.log(goals_group.all());
    
    var conceded_scatterplot = dc.scatterPlot("#conceded_scatterplot")
    conceded_scatterplot
    .width(768) .height(240)
    .x(d3.time.scale().domain([minDate2 , maxDate2]) )
    .y(d3.scale.linear().domain([-1,maxConceded]))
    .symbolSize(8)
    .clipPadding(10)
    .yAxisLabel(" Goals Conceded")
    .title( function(d){
       return `${d.key[2]} ${d.key[4]}  ${d.key[3]} ${d.key[1]} - ${d.key[0]}`;
    })
    .colorAccessor( function(d){
     return d.key[2];
    })
    .colors(teamColors)
    .brushOn(false)
    .dimension(conceded_dim)
    .group(conceded_group);
    
    
    dc.renderAll(); 
    
    
}   
    
   
