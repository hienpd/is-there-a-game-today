(function() {

  $('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 2,
    format: 'dddd, mmmm d, yyyy',
    formatSubmit: 'ddd mmm dd yyyy',
    onSet: function(context) {
      var clearInfo = function() {
        $('.future-mlb-away').text('');
        $('.future-mlb-time').text('');
        $('.future-mls-away').text('');
        $('.future-mls-time').text('');
        $('.future-nfl-away').text('');
        $('.future-nfl-time').text('');
      };

      if (context.select === undefined) {
        // The user hasn't selected a date, so clear and return
        clearInfo();
        return;
      }

      var convertDay = function() {
        switch (dayInt) {
          case 0: return 'Sunday';
          case 1: return 'Monday';
          case 2: return 'Tuesday';
          case 3: return 'Wednesday';
          case 4: return 'Thursday';
          case 5: return 'Friday';
          case 6: return 'Saturday';
          default: return '';
        }
      };

      var convertMonth = function() {
        switch (monthInt) {
          case 0: return 'January';
          case 1: return 'February';
          case 2: return 'March';
          case 3: return 'April';
          case 4: return 'May';
          case 5: return 'June';
          case 6: return 'July';
          case 7: return 'August';
          case 8: return 'September';
          case 9: return 'October';
          case 10: return 'November';
          case 11: return 'December';
          default: return '';
        }
      };

      var concat0 = function(date) {
        if (date < 10) {
          return '0' + (date.toString());
        }
        return date.toString();
      };

      var $displayDate = $('.future-date');
      var dateObj = new Date(context.select);

      var datePicked = dateObj.getDate();
      var monthInt = dateObj.getMonth();
      var dayInt = dateObj.getDay();
      var monthPicked = convertMonth(monthInt);
      var dayPicked = convertDay(dayInt);
      var yearPicked = dateObj.getFullYear();

      $('.future-pick').text(`${dayPicked}, ${monthPicked} ${datePicked}, ${yearPicked}`);

      // Check Mariners schedule
      var $xhrMariners = $.getJSON(`http://gd2.mlb.com/components/game/mlb/year_${yearPicked}/month_0${monthInt + 1}/day_${concat0(datePicked)}/master_scoreboard.json`);

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
            $('.future-mlb-away').text(`Seattle Mariners vs. ${awayTeamCity} ${awayTeamName}`);
            $('.future-mlb-time').text(`${homeTime} ${homeAMPM}`);
            $('.future-mlb, hide').removeClass('hide');
            return;
          }
        }
      });

      $xhrMariners.fail(function(error) {
        console.log(error);
      });

      // Check Sounders and Seahawks

      var $xhr = $.getJSON('https://api.myjson.com/bins/3t0uo');
      $xhr.done(function(data) {
        clearInfo();
        var tmpDay = `${dayPicked.slice(0, 3)}`;
        var tmpMonth = `${monthPicked.slice(0, 3)}`;
        var tmpDate = concat0(datePicked);
        var compareDate = `${tmpDay} ${tmpMonth} ${tmpDate} ${yearPicked}`;

        var leagueMap = {
          'Sounders': 'mls',
          'Seahawks': 'nfl'
        };

        for (var teamName in data) {
          var games = data[teamName];
          var league = leagueMap[teamName];

          for (var game of games) {
            if (game.date === compareDate) {
              $(`.future-${league}-away`).text(`Seattle ${teamName} vs. ${game.away_team}`);
              $(`.future-${league}-time`).text(game.time);
              $(`.future-${league}`).removeClass('hide');
            }
          }
        }
      });

    }
  });
}());
