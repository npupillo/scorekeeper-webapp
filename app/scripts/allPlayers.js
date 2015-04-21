'use strict';

var allPlayers = (function(module){

  var renderPlayers = function(data){
    var template = Handlebars.compile($('#all_players_template').html());
    $('#content2').html(template({
      players: data
    }));
  };

  module.init = function(){
    // console.log('inside allPlayers.init');
    $.ajax({
      url: router.host + '/players',
      type: 'GET',
      dataType: 'JSON'
    }).done(function(data){
      console.log(data);
      renderPlayers(data);
    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    });

  };//end module.init

  return module;

})(allPlayers || {});
