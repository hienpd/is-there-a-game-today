(function(){
  var gamesToday = 0;
  var dateObj = new Date();
  var day;
  var month;
  var date = dateObj.getDate();
  var year = dateObj.getFullYear();
  var dayInt = dateObj.getDay();
  var monthInt = dateObj.getMonth();
  var compareDate = '';

  var convertDay = function() {
    switch (dayInt) {
      case 0: day = 'Sunday'; break;
      case 1: day = 'Monday'; break;
      case 2: day = 'Tuesday'; break;
      case 3: day = 'Wednesday'; break;
      case 4: day = 'Thursday'; break;
      case 5: day = 'Friday'; break;
      case 6: day = 'Saturday'; break;
      default: day = ''; break;
    }
  };

  var convertMonth = function() {
    switch (monthInt) {
      case 0: month = 'January'; break;
      case 1: month = 'February'; break;
      case 2: month = 'March'; break;
      case 3: month = 'April'; break;
      case 4: month = 'May'; break;
      case 5: month = 'June'; break;
      case 6: month = 'July'; break;
      case 7: month = 'August'; break;
      case 8: month = 'September'; break;
      case 9: month = 'October'; break;
      case 10: month = 'November'; break;
      case 11: month = 'December'; break;
      default: month = ''; break;
    }
  };

  var concat0 = function(date) {
    if (date < 10) {
      return '0' + (date.toString());
    }
  };

  var createCompareDate = function() {
    var tmpDay = `${day.slice(0, 3)}`;
    var tmpMonth = `${month.slice(0, 3)}`;
    var tmpDate = function(date) {
      if (date < 10) {
        return '0' + (date.toString());
      }
      else {
        return date;
      }
    };
    compareDate = `${tmpDay} ${tmpMonth} ${tmpDate} ${year}`;
    // compareDate = 'Sun Oct 23 2016';
  };

  convertDay();
  convertMonth();
  createCompareDate();

  var $todayIs = $('#today');
  $todayIs.text(`Today is ${day}, ${month} ${date}, ${year}`);

  var yesGame = function(obj) {
    gamesToday += 1;
    $('.gameday').text('Yes');
  };

  /* Check for Mariners game being played in Seattle. Path format: http://gd2.mlb.com/components/game/mlb/year_2016/month_05/day_28/master_scoreboard.json */

  var $xhrMariners = $.getJSON(`http://gd2.mlb.com/components/game/mlb/year_${year}/month_0${monthInt + 1}/day_${concat0(date)}/master_scoreboard.json`);

  $xhrMariners.done(function(data) {
    if ($xhrMariners.status !== 200) {
      return;
    }
    var gameArray = data.data.games.game;
    for (var game of gameArray) {
      if (game.location === 'Seattle, WA') {
        var awayTeamCity = game.away_team_city;
        var awayTeamName = game.away_team_name;
        var homeTime = game.home_time;
        var homeAMPM = game.home_ampm;
        yesGame();
        $('.mlb-away-team').text(`${awayTeamCity} ${awayTeamName}`);
        $('.mlb-away-logo').attr('src', function() {
          return 'img/mlb/' + awayTeamName.toLowerCase() + '.svg';
        });
        $('.mlb-time').text(`${homeTime} ${homeAMPM}`);
        $('.row, mariners, hide').removeClass('hide');
        return;
      }
    }
  });

  $xhrMariners.fail(function(error) {
    console.log(error);
  });

  var $xhr = $.getJSON('https://api.myjson.com/bins/3t0uo');
  $xhr.done(function(data) {
    var leagueMap = {
      'Sounders': 'mls',
      'Seahawks': 'nfl'
    };

    for (var teamName in data) {
      var games = data[teamName];
      var league = leagueMap[teamName];

      for (var game of games) {
        if (game.date === compareDate) {
          // replace all spaces with '_' using regex
          var file = game.away_team.toLowerCase().replace(/ /g, '_') + '.svg';
          yesGame();
          $(`.${league}-time`).text(game.time);
          $(`.${league}-away-team`).text(game.away_team);
          $(`.${league}-away-logo`).attr('src', 'img/' + league + '/' + file);
          $(`.${teamName.toLowerCase()}`).removeClass('hide');

        }
      }
    }
  });

  $xhr.fail(function(error) {
    console.log(error);
  });
}());
