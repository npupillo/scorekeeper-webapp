'use strict';

var newGame = (function(module){

  var renderPlayers = function(players){
    // console.log(players);
    var template = Handlebars.compile($('#new_game_template').html());
    $('#content2').html(template({
      players: players
    }));

    $('form#submit-new-game').on('click', function(event){
      event.preventDefault();
      submitGame(event);
      alert('CLICKED');
    });
  };

  var submitGame = function(event){
  // console.log('inside submitGame');
  // if(event.preventDefault) event.preventDefault();
  $.ajax({
  url: router.host + '/games',
  type: 'POST',
  dataType: 'JSON',
  data: {
    game: {
      name: $('input#new-game-name').val(),
      status: 'active',
      start_date: 'Apr 1 2015'
    }
  },
  }).done(function(data){
    console.log(data);
  }).fail(function(jqXHR, textStatus, errorThrow){
    console.log(jqXHR, textStatus, errorThrow);
  });
  };

  var ajaxGetPlayers = function(){
    // console.log('ajax to load all players for checkboxes');
    $.ajax({
      url: router.host + '/players',
      type: 'GET',
      dataType: 'JSON'
    }).done(function(players){
      console.log(players);
      renderPlayers(players);
    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });
  };

  module.init = function(){
    ajaxGetPlayers();

  }; //end module.init

  return module;

})(newGame || {});
