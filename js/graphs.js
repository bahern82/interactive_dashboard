 queue().defer(d3.json, "data/soccer-stats.json")
        .await(makeGraphs);
        
function makeGraphs(error, stats){
    var ndx = crossfilter(stats);
    
    //var h_team_dim = ndx.dimenion(dc.pluck('h-team'));
   // var total_home_points = h_team_dim.group().reducSum(dc.pluck())
    
    
}