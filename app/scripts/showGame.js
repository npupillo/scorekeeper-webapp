'use strict';

var showGame = (function(module){

  //To get only the current game's scores, iterate each player then each player's score to match the current score's game_id with the game.id
  var filterScores = function(game){
    var players = game.players;
    players.forEach(function(player){
      player.scores.forEach(function(score, index, scores_array){
        if (score.game_id !== game.id){
          // console.log(score.game_id);
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

    //initialize points form submit button
    $('form.points-form').on('submit', function(event){
      event.preventDefault();
      // console.log('button clicked');
      submitPoints(event);
    });

  };//end renderScores

  var submitPoints = function(event){
    event.preventDefault();
// debugger;
    var field = $('#input-field');
    console.log('field value: ' + field.val());




    // $.ajax({
    //     url: 'http://localhost:3000/scores',
    //     type: 'POST',
    //     dataType: 'JSON',
    //     data: {
    //       score: {
    //         points: 1,
    //         gameplayer_id: 7,
    //       }
    //     },
    // }).done(function(data){
    //   console.log(data);
    // }).fail(function(jqXHR, textStatus, errorThrow){
    //   console.log(jqXHR, textStatus, errorThrow);
    // });

  }

  var calculatePlayerScores = function(game){
// debugger;
    //For each player, push the username to the array
    //AND For each player's score, get the sum & add it to the array
    //=> [ Larry, 11, Curly 9, Moe, 7]
    var players = game.players;
    var new_array = [];

    //get each player's username and push to array
    players.forEach(function(player){
      // new_array.push(player.username);

      var player_scores = player.scores;
        //sum each player's scores and push to array
        var sum = 0;
        player.scores.forEach(function(score, index, scores_array){
          sum = sum + score.points;
        });
        new_array.push(sum);
    });
    renderHighchart(new_array);
    renderD3chart(new_array);
  };//end calculatePlayerScores

  var renderHighchart = function(game_scores){
    console.log("calculated game scores array ... : ");
    console.log(game_scores);
    $('#chart_hc').highcharts({
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

  var renderD3chart = function(game_scores){
    var bardata = game_scores;

    //setup the margin like you would a css style
    var margin = { top: 10, right: 10, bottom: 10, left: 10 }

    //remove the dimensions of the margins above from the chart dimension
    var height = 400 - margin.top - margin.bottom,
        //now we can change the width to say 400 & the chart & boundaries scale accordingly
        width = 600 - margin.left - margin.right,
        barWidth = 50,
        barOffset = 5;

    var tempColor;

    var colors = d3.scale.linear()
        .domain([0, bardata.length * .33, bardata.length * .66, bardata.length])
        .range(['#B58929','#C61C6F', '#268BD2','#85992C']) //red, purple, blue, green

    var yScale = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([0, height])

    var xScale = d3.scale.ordinal()
        .domain(d3.range(0,bardata.length))
        //we can pass .2 here to make space between the bars
        .rangeBands([0,width], .2)

    var tooltip = d3.select('body')
        .append('div')
          .style('position', 'absolute')
          .style('padding', '0 10px')
          .style('background', 'white')
          .style('opacity', 0) //start at 0

    var myChart = d3.select('#chart_d3').append('svg')
      //add a style attr so we can see the diffc betw the svg graphic & the chart
        .style('background', '#E9E9E9')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        //move the graphic, by an x position of margin.left & by y position of margin.top
        .attr('transform', 'translate('+ margin.left + ', ' + margin.top + ')')
        .selectAll('rect').data(bardata)
        .enter().append('rect')
          .style('fill', function(d,i){
            return colors(i)
          })
          .attr('width', xScale.rangeBand())
          .attr('x', function(d, i){
            return xScale(i);
          })
          .attr('height', 0)
          .attr('y', height)

      .on('mouseover', function(d){
        tooltip.transition()
          .style('opacity', .9)
        tooltip.html(d)
          .style('left', (d3.event.pageX - 35) + 'px')
          .style('top', (d3.event.pageY - 30) + 'px')

        tempColor = this.style.fill;
        d3.select(this)
          .style('opacity', .5)
          .style('fill', 'yellow')
        })
      .on('mouseout', function(d){
        d3.select(this)
          .style('opacity', 1)
          .style('fill', tempColor)
      })

    myChart.transition()
        .attr('height', function(d){
          return yScale(d);
        })
        .attr('y', function(d){
          return height - yScale(d)
        })
        .delay(function(d,i){
          return i * 40;
        })
        .duration(1000)
        .ease('elastic')

    var vGuideScale = d3.scale.linear()
      .domain([0, d3.max(bardata)])
      .range([height, 0])

    //setup the axis method
    var vAxis = d3.svg.axis()
        .scale(vGuideScale)
        .orient('left')
        .ticks(10)

    var vGuide = d3.select('svg').append('g')
        vAxis(vGuide)
        //position it 35 pixels from the left & 0 pixels from the top, so it gets moved w/ the margins
        vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        vGuide.selectAll('path')
          .style({ fill: 'none', stroke: '#000' })
        vGuide.selectAll('line')
          .style({ stroke: '#000' })

    var hAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickValues(xScale.domain().filter(function(d,i){
          return !(i % (bardata.length/5));
        }))

    var hGuide = d3.select('svg').append('g')
        hAxis(hGuide)
        //also add the height here
        hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
        hGuide.selectAll('path')
          .style({ fill: 'none', stroke: '#000' })
        hGuide.selectAll('line')
          .style({ stroke: '#000' })
  }




  module.init = function(id){
    // console.log('inside showGame.init , the game id is: ' + id);
    $.ajax({
    url: router.host + '/games/' + id,
    type: 'GET',
    dataType: 'JSON'
    }).done(function(data){
      // console.log("ajax GET game : " + id);
      console.log(data);
      filterScores(data);
    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });

    };//end module.init


  return module;

})(showGame || {});
