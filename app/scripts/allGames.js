'use strict';

var allGames = (function(module){

  var renderGames = function(games){
    // console.log(games);
    var template = Handlebars.compile($('#all_games_template').html());
    $('#content1').html(template({
      games: games
    }));
  };

  var ajaxGetGames = function(){
    // console.log('ajax to load all games');
    $.ajax({
      url: router.host + '/games',
      type: 'GET',
      dataType: 'JSON'
    }).done(function(games){
// debugger;
      // console.log(games);
        renderGames(games);
    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });
  };

  module.init = function(){
    ajaxGetGames();

  }; //end module.init

  return module;

})(allGames || {});
