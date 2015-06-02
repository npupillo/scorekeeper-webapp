'use strict';

var trace = function(){
  for(var i = 0; i < arguments.length; i++){
    console.log(arguments[i]);
  }
};

var router = (function(module){
  // module.host = "http://scorekeeper-api.herokuapp.com";
  module.host = "http://localhost:3000";

  var Router = Backbone.Router.extend({
    routes: {
      '': 'allGames',
      'game': 'showGame',
      'newgame': 'newGame',
      'players': 'allPlayers'
    },
    allGames: function(){
      // console.log('inside router: allGames');
      empty_contents();
      $('#content1').load('partials/allGames.html');
      allGames.init();
    },
    showGame: function(id){
      // console.log('inside router: showGame');
      empty_contents();
      $('#content1').load('partials/showGame.html');
      showGame.init(id);
    },
    newGame: function(){
      // console.log('inside router: newGame');
      $('#content1').load('partials/newGame.html');
      newGame.init();
    },
    allPlayers: function(){
      // console.log('inside router: allPlayers');
      empty_contents();
      $('#content1').load('partials/allPlayers.html');
      allPlayers.init();
    },

  }); //end var Router

  var empty_contents = function(){
    // console.log('empty_contents');
      $('#content1').empty();
      $('#content2').empty();
      $('#content3').empty();
  };

  module.router = new Router();

  module.backbone = function(){
    Backbone.history.start();
  };

  return module;

})(router || {});


$(document).ready(function(){
  // trace('document ready');
  router.backbone();
});
