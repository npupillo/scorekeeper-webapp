'use strict';

var createGame = (function(module){

  module.init = function(){

    console.log('inside createGame.init');
    $.ajax({
      url: router.host + '/players',
      type: 'GET',
      dataType: 'JSON'
    }).done(function(data){
      console.log(data);
      var template = Handlebars.compile($('#new_game_template').html());
      $('#content2').html(template({
        players: data
      }));

    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });

  };//end module.init

  return module

})(createGame || {});
