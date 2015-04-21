'use strict';

var showGame = (function(module){

    //To get only the current game's scores, iterate each player then each player's score to match the current score's game_id with the game.id
    var filterScores = function(game){
      var players = game.players;
      players.forEach(function(player){
        player.scores.forEach(function(score, index, scores_array){
          if (score.game_id !== game.id){
            scores_array.splice(index, 1);
          }
        })
      });
      renderScores(game);
      calculatePlayerScores(game);
    };

    var renderScores = function(data){
      var template = Handlebars.compile($('#one_game_template').html());
      $('#content1').html(template({
        game: data
      }));
    };//end renderScores

  var calculatePlayerScores = function(game){
// debugger;
    //For each player, push the username to the array
    //AND For each player's score, get the sum & add it to the array
    //=> [ Larry, 11, Curly 9, Moe, 7]
    var players = game.players;
    var new_array = [];

    //get each player's username and push to array
    players.forEach(function(player){
      new_array.push(player.username);

      var player_scores = player.scores;
        //sum each player's scores and push to array
        var sum = 0;
        player.scores.forEach(function(score, index, scores_array){
          sum = sum + score.points;
        });
        new_array.push(sum);
    });
    renderScoreChart(new_array);
  };//end calculatePlayerScores

  var renderScoreChart = function(game_scores){
    console.log(game_scores);
    $('#chart_container').highcharts({
      chart: {
        type: "column"
      },
      title: {
        text: "Game Scores"
      },
      xAxis: {
        title: {
          text: "Players"
        }
      },
      yAxis: {
        title: {
          text: "Score Totals"
        }
      },
      plotOptions:{
        series: {
          dataLabels: {
            enabled: true,
            // color: 'red'
          }
        }
      },
      series: [{
        name: 'Game Scores',
        colorByPoint: true,
        data: game_scores
        // data: [ ['Jack', 66], ['Jane', 77], ['Joe', 88] ],
      }]
    });
  }

  module.init = function(id){
    // console.log('inside showGame.init , the game id is: ' + id);
    $.ajax({
    url: router.host + '/games/' + id,
    type: 'GET',
    dataType: 'JSON'
    }).done(function(data){
      console.log(data);
      filterScores(data);
    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });

    };//end module.init


  return module;

})(showGame || {});
