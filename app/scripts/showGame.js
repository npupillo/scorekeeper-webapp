'use strict';

var showGame = (function(module){

  var renderScores = function(gameData){
    console.log('inside renderScores, the gameData is:');
    console.log(gameData);

      var template = Handlebars.compile($('#one_game_template').html());
      $('#content1').html(template({
        game: gameData
      }));

    //initialize points form submit button
    $('.submit-btn').on('click', function(event){
      event.preventDefault();
      console.log('button clicked');

      var game_id = $(this).data('game_id')
      // console.log("This game_id is: " + game_id);
      var player_id = $(this).data('player_id')
      // console.log("This player_id is: " + player_id);

      submitPoints(event, game_id, player_id);
    });

  calculatePlayerScores(gameData);
  renderHighchartLine(gameData);

  };//end renderScores

  var submitPoints = function(event, game_id, player_id){
    event.preventDefault();

    var new_points = $('#field_id-' + player_id).val();
    console.log('This input value is: ' + new_points);
    console.log('This game_id is: ' + game_id);
    console.log('This player_id is: ' + player_id);

    $.ajax({
        url: 'http://localhost:3000/scores',
        type: 'POST',
        dataType: 'JSON',
        data: {
          score: {
            points: new_points,
            game_id: game_id,
            player_id: player_id
          }
        },
    }).done(function(data){
      // console.log(data);
      location.reload();
    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });

    // re-render the page

  }; //end submitPoints



  //Calculate current player totals
  var calculatePlayerScores = function(gameData){
    //For each player, push the player name & tally to newArray
    var newArray = [];

    gameData.game_scores.forEach(function(score_obj){
      newArray.push(score_obj.name);
      newArray.push(score_obj.tally);
    })
    renderHighchartBar(newArray);
    // renderD3chart(newArray);

  };//end calculatePlayerScores

  var renderHighchartBar = function(gameScores){
  // Hard coded sample data
  // gameScores = [1,4,2];

    // console.log('renderHighchartBar: calculated game scores array ... : ');
    // console.log(gameScores);

    $('#chart_hc_bar').highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Game Scores'
      },
      xAxis: {
        gridLineWidth: 0,
        gridLineColor: 'transparent',
        lineColor: 'transparent',
        tickColor: 'transparent',
        title: {
          text: 'Players'
        },
        labels: {
          enabled: false
        }
      },
      yAxis: {
        gridLineWidth: 0,
        gridLineColor: 'transparent',
        lineColor: 'transparent',
        tickColor: 'transparent',
        title: {
          text: ''
        },
        min: 0,
        labels: {
            enabled: false
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
        data: gameScores
      }]
    });
  };

  var renderD3chart = function(gameScores){
    // Hard coded sample data
    // gameScores = [1,4,2];

    var bardata = gameScores;

    //setup the margin like you would a css style
    // var margin = { top: 30, right: 30, bottom: 40, left: 50 };
    var margin = { top: 30, right: 20, bottom: 30, left: 20 };

    //remove the dimensions of the margins above from the chart dimension
    var height = 300 - margin.top - margin.bottom,
        //now we can change the width to say 400 & the chart & boundaries scale accordingly
        width = 300 - margin.left - margin.right,
        barWidth = 50,
        barOffset = 5;

    var tempColor;

    var colors = d3.scale.linear()
        .domain([0, bardata.length * .33, bardata.length * .66, bardata.length])
        .range(['#B58929','#C61C6F', '#268BD2','#85992C']); //red, purple, blue, green

    var yScale = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([0, height]);

    var xScale = d3.scale.ordinal()
        .domain(d3.range(0,bardata.length))
        //we can pass .2 here to make space between the bars
        .rangeBands([0,width], .2);

    var tooltip = d3.select('body')
        .append('div')
          .style('position', 'absolute')
          .style('padding', '0 10px')
          .style('background', 'white')
          .style('opacity', 0); //start at 0

    var myChart = d3.select('#chart_d3_bar').append('svg')
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
            return colors(i);
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
          // .style('fill', 'yellow')
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
    // var vAxis = d3.svg.axis()
    //     .scale(vGuideScale)
    //     .orient('left')
    //     .ticks(10)

    // var vGuide = d3.select('svg').append('g')
    //     vAxis(vGuide)
    //     //position it 35 pixels from the left & 0 pixels from the top, so it gets moved w/ the margins
    //     vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    //     vGuide.selectAll('path')
    //       .style({ fill: 'none', stroke: '#000' })
    //     vGuide.selectAll('line')
    //       .style({ stroke: '#000' })

    // var hAxis = d3.svg.axis()
    //     .scale(xScale)
    //     .orient('bottom')
    //     .tickValues(xScale.domain().filter(function(d,i){
    //       return !(i % (bardata.length/5));
    //     }))

    // var hGuide = d3.select('svg').append('g')
    //     hAxis(hGuide)
    //     //also add the height here
    //     hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
    //     hGuide.selectAll('path')
    //       .style({ fill: 'none', stroke: '#000' })
    //     hGuide.selectAll('line')
    //       .style({ stroke: '#000' })
  }; //end renderD3chart

// !!!
var renderHighchartLine = function(gameScores){
  var seriesArr = gameScores.game_scores;
  //Hard coded sample data
  // var seriesArr = [
  //   {name: 'Player 1', data: [7,6,7]},
  //   {name: 'Player 2', data: [8,7,8]},
  //   {name: 'Player 3', data: [9,8,9]}
  //   ];

  console.log('renderHighchartLine: seriesArr ...: ');
  console.log(seriesArr);

  $('#chart_hc_line').highcharts({
    title: {
        text: 'Game Scores',
        x: -20 //center
    },
    subtitle: {
        text: 'per Round',
        x: -20
    },
    xAxis: {
        categories: [],
        title: {
          text: 'Rounds'
        }

    },
    yAxis: {
        title: {
            text: 'Points'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: ''
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: seriesArr
    // series: gameScores
  });
}; //end renderHighchartLine

  module.init = function(id){
    console.log('inside init, the game id is: ' + id);
    $.ajax({
    url: router.host + '/games/' + id,
    type: 'GET',
    dataType: 'JSON'
    }).done(function(data){
      // console.log('ajax GET game: ' + id);
      // console.log(data);
      renderScores(data);
    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });

    };//end module.init


  return module;

})(showGame || {});
