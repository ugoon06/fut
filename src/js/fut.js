var ugFUT = (function(ugFUT, $, undefined){
    
    // const EPL_1819_LEAGUE_JSON = "/data/fut/epl_1819_league.json";
    const EPL_1819_LEAGUE_JSON = "/data/fut/foottystats_league.json";
    const EPL_1819_MATCH_JSON = "/data/fut/epl_1819_league.json";
    const EPL_1819_PLAYER_JSON = "/data/fut/epl_1819_league.json";
    const EPL_1819_TEAM_JSON = "/data/fut/epl_1819_league.json";

    ugFUT.init = function(){
        /*
        ugData.get(EPL_1819_LEAGUE_JSON).done(function(data){
            if(data.success) {
                data = data.data;

                console.log(data.name);
                console.log(data.english_name);
                console.log(data.country);
                console.log(data.division);
                console.log(data.starting_year + '~' + data.ending_year);
                console.log(data.season);
                console.log(data.clubNum);
                console.log(data.image);
                console.log(data.totalMatches);
                console.log(data.matchesCompleted);

                console.log((data.totalMatches / data.matchesCompleted) * 100);
                console.log(data.canceledMatchesNum);
                console.log(data.game_week + '/' + data.total_game_week);
                console.log(data.progress);

                console.log(data.total_goals);
                console.log(data.home_teams_goals);
                console.log(data.home_teams_conceded);
                console.log(data.away_teams_goals);
                console.log(data.away_teams_conceded);

                console.log(data.home_teams_clean_sheets);
                console.log(data.away_teams_clean_sheets);
                console.log(data.home_teams_failed_to_score);
                console.log(data.away_teams_failed_to_score);

                console.log(data.cornersAVG_overall);
                console.log(data.cornersAVG_home);
                console.log(data.cornersAVG_away);
                console.log(data.cornersTotal_overall);
                console.log(data.cornersTotal_home);
                console.log(data.cornersTotal_away);

                console.log(data.cardsAVG_overall);
                console.log(data.cardsAVG_home);
                console.log(data.cardsAVG_away);
                console.log(data.cardsTotal_overall);
                console.log(data.cardsTotal_home);
                console.log(data.cardsTotal_away);        

                console.log(data.foulsTotal_overall);
                console.log(data.foulsTotal_home);
                console.log(data.foulsTotal_away);
                console.log(data.foulsAVG_overall);
                console.log(data.foulsAVG_home);
                console.log(data.foulsAVG_away);             

                console.log(data.shotsTotal_overall);
                console.log(data.shotsTotal_home);
                console.log(data.shotsTotal_away);
                console.log(data.shotsAVG_overall);
                console.log(data.shotsAVG_home);
                console.log(data.shotsAVG_away);        

                console.log(data.offsidesTotal_overall);
                console.log(data.offsidesTotal_home);
                console.log(data.offsidesTotal_away);
                console.log(data.offsidesAVG_overall);
                console.log(data.offsidesAVG_home);
                console.log(data.offsidesAVG_away);   

                console.log(data.homeWins);        
                console.log(data.draws);
                console.log(data.awayWins);

                console.log(data.homeWinPercentage);
                console.log(data.drawPercentage);
                console.log(data.awayWinPercentage);

                console.log(data.goals_min_0_to_10);
                console.log(data.goals_min_11_to_20);
                console.log(data.goals_min_21_to_30);
                console.log(data.goals_min_31_to_40);
                console.log(data.goals_min_41_to_50);
                console.log(data.goals_min_51_to_60);
                console.log(data.goals_min_61_to_70);
                console.log(data.goals_min_71_to_80);
                console.log(data.goals_min_81_to_90);

                console.log(data.goals_min_0_to_15);
                console.log(data.goals_min_16_to_30);
                console.log(data.goals_min_31_to_45);
                console.log(data.goals_min_46_to_60);
                console.log(data.goals_min_61_to_75);
                console.log(data.goals_min_76_to_90);

                console.log(data.player_count);

                console.log(data.player_count);
                console.log(data.seasonGoalsScored_home_teams);
                console.log(data.seasonGoalsScored_away_teams);

                console.log(data.seasonConceded_home_teams);
                console.log(data.seasonConceded_away_teams);
                
                console.log(data);


                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> top_scorers");
                data_top_scorers = data.top_scorers;
                $.each(data_top_scorers, function(i, o) {
                    console.log(o.id);
                    console.log(o.known_as);
                    console.log(o.age);
                    console.log(o.height + 'cm');
                    console.log(o.weight + 'kg');
                    console.log(o.club_team_id);
                    console.log(o.position);
                    console.log(o.minutes_played_overall);
                    console.log(o.minutes_played_home);
                    console.log(o.minutes_played_away);
                    console.log(o.nationality);
                    console.log(o.goals_overall);
                    console.log(o.goals_home);
                    console.log(o.goals_away);
                    console.log(o.assists_overall);
                    console.log(o.assists_home);
                    console.log(o.assists_away);
                    console.log(o.penalty_goals);
                    console.log(o.penalty_misses);
                    console.log(o.penalty_success);
                    console.log(o.goals_per_90_home);
                    console.log(o.goals_per_90_away);
                    console.log(o.min_per_goal_overall);
                    console.log(o.cards_overall);
                    console.log(o.yellow_cards_overall);
                    console.log(o.red_cards_overall);
                    console.log(o.min_per_match);
                    console.log(o.rank_in_league_top_attackers);
                    console.log(o.rank_in_club_top_scorer);
                });

                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> top_assists");
                data_top_assists = data.top_assists;
                $.each(data_top_assists, function(i, o) {
                    console.log(o.id);
                    console.log(o.known_as);
                    console.log(o.age);
                    console.log(o.height + 'cm');
                    console.log(o.weight + 'kg');
                    console.log(o.club_team_id);
                    console.log(o.position);
                    console.log(o.minutes_played_overall);
                    console.log(o.minutes_played_home);
                    console.log(o.minutes_played_away);
                    console.log(o.nationality);
                    console.log(o.goals_overall);
                    console.log(o.goals_home);
                    console.log(o.goals_away);
                    console.log(o.assists_overall);
                    console.log(o.assists_home);
                    console.log(o.assists_away);
                    console.log(o.penalty_goals);
                    console.log(o.penalty_misses);
                    console.log(o.penalty_success);
                    console.log(o.goals_per_90_home);
                    console.log(o.goals_per_90_away);
                    console.log(o.min_per_goal_overall);
                    console.log(o.cards_overall);
                    console.log(o.yellow_cards_overall);
                    console.log(o.red_cards_overall);
                    console.log(o.min_per_match);
                    console.log(o.rank_in_league_top_attackers);
                    console.log(o.rank_in_club_top_scorer);
                });

                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>> top_clean_sheets");
                data_top_clean_sheets = data.top_clean_sheets;
                $.each(data_top_clean_sheets, function(i, o) {
                    console.log(o.id);
                    console.log(o.known_as);
                    console.log(o.age);
                    console.log(o.height + 'cm');
                    console.log(o.weight + 'kg');
                    console.log(o.club_team_id);
                    console.log(o.position);
                    console.log(o.minutes_played_overall);
                    console.log(o.minutes_played_home);
                    console.log(o.minutes_played_away);
                    console.log(o.nationality);
                    console.log(o.goals_overall);
                    console.log(o.goals_home);
                    console.log(o.goals_away);
                    console.log(o.assists_overall);
                    console.log(o.assists_home);
                    console.log(o.assists_away);
                    console.log(o.penalty_goals);
                    console.log(o.penalty_misses);
                    console.log(o.penalty_success);
                    console.log(o.goals_per_90_home);
                    console.log(o.goals_per_90_away);
                    console.log(o.min_per_goal_overall);
                    console.log(o.cards_overall);
                    console.log(o.yellow_cards_overall);
                    console.log(o.red_cards_overall);
                    console.log(o.min_per_match);
                    console.log(o.rank_in_league_top_attackers);
                    console.log(o.rank_in_club_top_scorer);
                });
            }
        });
        */
       
        ugFUT.leaguStat();
    };

    ugFUT.leaguStat = function(league_id) {

    };

    ugFUT.topScorers = function(league_id) {

    };

    ugFUT.topAssist = function(league_id) {

    };

    ugFUT.leagueStanding = function(league_id) {

    };

    ugFUT.leagueTeamDetail = function(league_id) {

    };

    ugFUT.playerDetail = function(player_id) {
        
    };                          

    return ugFUT;s
})(window.ugFUT || {}, jQuery);

$(function(){
    ugFUT.init();
})