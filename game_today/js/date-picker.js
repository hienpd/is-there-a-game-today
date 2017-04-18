(function() {
  'use strict';

  // Materialize uses pickadate.js
  $('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 2,
    format: 'dddd, mmmm d, yyyy',
    formatSubmit: 'ddd mmm dd yyyy',
    onSet(context) {
      const dateObj = new Date(context.select);
      const datePicked = dateObj.getDate();
      const monthInt = dateObj.getMonth();
      const dayInt = dateObj.getDay();
      const yearPicked = dateObj.getFullYear();

      // Clear game info from box
      const clearInfo = function() {
        $('.future-mlb-away').text('');
        $('.future-mlb-time').text('');
        $('.future-mls-away').text('');
        $('.future-mls-time').text('');
        $('.future-nfl-away').text('');
        $('.future-nfl-time').text('');
      };

      // Datepicker returns NaN if user clicks arrows or clear
      if (context.select === undefined) {
        // If user hasn't selected a date, clear and return
        clearInfo();

        return;
      }

      (function() {
        const convertDay = function() {
          switch (dayInt) {
            case 0:
              return 'Sunday';
            case 1:
              return 'Monday';
            case 2:
              return 'Tuesday';
            case 3:
              return 'Wednesday';
            case 4:
              return 'Thursday';
            case 5:
              return 'Friday';
            case 6:
              return 'Saturday';
            default:
              return '';
          }
        };

        const convertMonth = function() {
          switch (monthInt) {
            case 0:
              return 'January';
            case 1:
              return 'February';
            case 2:
              return 'March';
            case 3:
              return 'April';
            case 4:
              return 'May';
            case 5:
              return 'June';
            case 6:
              return 'July';
            case 7:
              return 'August';
            case 8:
              return 'September';
            case 9:
              return 'October';
            case 10:
              return 'November';
            case 11:
              return 'December';
            default:
              return '';
          }
        };

        const monthPicked = convertMonth(monthInt);
        const dayPicked = convertDay(dayInt);

        // If date less than 10, concatenate 0
        const concat0 = function(date) {
          if (date < 10) {
            return `0${date.toString()}`;
          }

          return date.toString();
        };

        // Display date user picked
        $('#pick').removeClass('hide');
        $('#no-game').removeClass('hide')
        $('.future-pick').text(`${dayPicked}, ${monthPicked} ${datePicked}, ${yearPicked}`);

        // Check Mariners API
        const $xhrMariners = $.getJSON(`http://gd2.mlb.com/components/game/mlb/year_${yearPicked}/month_0${monthInt + 1}/day_${concat0(datePicked)}/master_scoreboard.json`);

        $xhrMariners.done((data) => {
          if ($xhrMariners.status !== 200) {
            return;
          }
          const gameArray = data.data.games.game;

          for (const game of gameArray) {
            if (game.location === 'Seattle, WA') {
              const awayTeamCity = game.away_team_city;
              const awayTeamName = game.away_team_name;
              const homeTime = game.home_time;
              const homeAMPM = game.home_ampm;

              $('.future-mlb-away').text(`Seattle Mariners vs. ${awayTeamCity} ${awayTeamName}`);
              $('.future-mlb-time').text(`${homeTime} ${homeAMPM}`);
              $('.future-mlb.hide').removeClass('hide');
              $('#no-game').addClass('hide');

              return;
            }
          }
        });

        // Check Sounders and Seahawks API
        const $xhr = $.getJSON('https://api.myjson.com/bins/3t0uo');

        $xhr.done((data) => {
          clearInfo();
          const tmpDay = `${dayPicked.slice(0, 3)}`;
          const tmpMonth = `${monthPicked.slice(0, 3)}`;
          const tmpDate = concat0(datePicked);
          const compareDate = `${tmpDay} ${tmpMonth} ${tmpDate} ${yearPicked}`;
          const leagueMap = {
            Sounders: 'mls',
            Seahawks: 'nfl'
          };

          for (const teamName in data) {
            const games = data[teamName];
            const league = leagueMap[teamName];

            for (const game of games) {
              if (game.date === compareDate) {
                $(`.future-${league}-away`).text(`Seattle ${teamName} vs. ${game.away_team}`);
                $(`.future-${league}-time`).text(game.time);
                $(`.future-${league}`).removeClass('hide');
                $('#no-game').addClass('hide');

              }
            }
          }
        });
      })();
    }
  });
})();
