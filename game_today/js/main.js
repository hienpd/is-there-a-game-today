(function() {
  'use strict';
  const dateObj = new Date();
  let day;
  let month;
  const date = dateObj.getDate();
  const year = dateObj.getFullYear();
  const dayInt = dateObj.getDay();
  const monthInt = dateObj.getMonth();
  let compareDate = '';

  const convertDay = function() {
    switch (dayInt) {
      case 0:
        day = 'Sunday';
        break;
      case 1:
        day = 'Monday';
        break;
      case 2:
        day = 'Tuesday';
        break;
      case 3:
        day = 'Wednesday';
        break;
      case 4:
        day = 'Thursday';
        break;
      case 5:
        day = 'Friday';
        break;
      case 6:
        day = 'Saturday';
        break;
      default:
        day = '';
        break;
    }
  };

  const convertMonth = function() {
    switch (monthInt) {
      case 0:
        month = 'January';
        break;
      case 1:
        month = 'February';
        break;
      case 2:
        month = 'March';
        break;
      case 3:
        month = 'April';
        break;
      case 4:
        month = 'May';
        break;
      case 5:
        month = 'June';
        break;
      case 6:
        month = 'July';
        break;
      case 7:
        month = 'August';
        break;
      case 8:
        month = 'September';
        break;
      case 9:
        month = 'October';
        break;
      case 10:
        month = 'November';
        break;
      case 11:
        month = 'December';
        break;
      default:
        month = '';
        break;
    }
  };

  // If date less than 10, concatenate 0
  const concat0 = function(dateNum) {
    const dateStr = dateNum.toString();

    if (dateNum < 10) {
      return `0${dateStr}`;
    }

    return dateStr;
  };

  // Format date for Sounders and Seahawks API
  const createCompareDate = function() {
    const tmpDay = `${day.slice(0, 3)}`;
    const tmpMonth = `${month.slice(0, 3)}`;
    const tmpDate = concat0(date);

    compareDate = `${tmpDay} ${tmpMonth} ${tmpDate} ${year}`;
  };

  convertDay();
  convertMonth();
  createCompareDate();

  // Display today's date
  const $todayIs = $('#today');

  $todayIs.text(`Today is ${day}, ${month} ${date}, ${year}`);

  // If there is a game, display yes
  const yesGame = function() {
    $('.gameday').text('Yes');
  };

  // Check Mariners API
  const $xhrMariners = $.getJSON(`http://gd2.mlb.com/components/game/mlb/year_${year}/month_0${monthInt + 1}/day_${concat0(date)}/master_scoreboard.json`);

  $xhrMariners.done((data) => {
    if ($xhrMariners.status !== 200) {
      return;
    }
    const gameArray = data.data.games.game;
    const awayLogo = (awayName) => `img/mlb/${awayName.toLowerCase()}.svg`;

    for (const game of gameArray) {
      if (game.location === 'Seattle, WA') {
        const awayTeamCity = game.away_team_city;
        const awayTeamName = game.away_team_name;
        const homeTime = game.home_time;
        const homeAMPM = game.home_ampm;

        yesGame();
        $('.mlb-away-team').text(`${awayTeamCity} ${awayTeamName}`);
        $('.mlb-time').text(`${homeTime} ${homeAMPM}`);
        $('.row.mariners.hide').removeClass('hide');
        $('.mlb-away-logo').attr('src', awayLogo(awayTeamName));

        return;
      }
    }
  });

  // Check Sounders and Seahawks API
  const $xhr = $.getJSON('https://api.myjson.com/bins/3t0uo');

  $xhr.done((data) => {
    const leagueMap = {
      Sounders: 'mls',
      Seahawks: 'nfl'
    };

    for (const teamName in data) {
      const games = data[teamName];
      const league = leagueMap[teamName];

      for (const game of games) {
        if (game.date === compareDate) {
          // Replace all spaces with '_' using regex
          const file = game.away_team.toLowerCase().replace(/ /g, '_')`.svg`;

          yesGame();
          $(`.${league}-time`).text(game.time);
          $(`.${league}-away-team`).text(game.away_team);
          $(`.${league}-away-logo`).attr('src', `img/${league} /${file}`);
          $(`.${teamName.toLowerCase()}`).removeClass('hide');
        }
      }
    }
  });
})();
