//result {"date": "12/08/2017", "team": "liverpool", "opponent":"watford"" "home":"false", "scored" : "3" ,"conceded": "3", "points":"0"},
//start {"date": "12/08/2017", "hTeam": "watford", "aTeam":"liverpool", "hTeamScore" : "3" ,"aTeamScore": "3"},

var newData=[];

stats.forEach(function (d){
    var team1, opponent1, home1, scored1 , conceded1,points1;
    
    if(d.hTeam=="man utd"|| d.hTeam=="man city" || d.hTeam=="liverpool"|| d.hTeam=="spurs" )
    {
        team1=d.hTeam;
        opponent1=d.aTeam;
        home1=true;
        scored1=d.hTeamScore;
        conceded1=d.aTeamScore;
        if(d.hTeamScore > d.aTeamScore )
        {
            points1=3;
        }
        else if(d.hTeamScore == d.aTeamScore)
        {
            points1=1;
        }
        else{
            points1=0;
        }
         //newData.push({date: d.date, team: team1, opponent: opponent1, home: home1, scored: scored1, conceded: conceded1 , points: points1  });
         document.getElementById("results").innerHTML +=`<p>{ "date": "${d.date}", "team": "${team1}", "opponent": "${opponent1}", "home": "${home1}", "scored": "${scored1}", "conceded": "${conceded1}", "points": "${points1}" },</p>`;
    }
    if(d.aTeam=="man utd"|| d.aTeam=="man city" || d.aTeam=="liverpool"|| d.aTeam=="spurs" )
   {
        team1=d.aTeam;
        opponent1=d.hTeam;
        home1=false;
        scored1=d.aTeamScore;
        conceded1=d.hTeamScore;
        if(d.aTeamScore > d.hTeamScore )
        {
            points1=3;
        }
        else if(d.hTeamScore == d.aTeamScore)
        {
            points1=1;
        }
        else{
            points1=0;
        }
         //newData.push({date: d.date, team: team1, opponent: opponent1, home: home1, scored: scored1, conceded: conceded1 , points: points1  });
         document.getElementById("results").innerHTML +=`<p>{ "date": "${d.date}", "team": "${team1}", "opponent": "${opponent1}", "home": "${home1}", "scored": "${scored1}", "conceded": "${conceded1}", "points": "${points1}" },<p>`;
    }
    
});