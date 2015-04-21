'use strict';

var App = (function() {
  var authToken, apiHost;

  var run = function() {
    // When page loads, pull authToken out of localStorage
    // It might be undefined, which is great
    authToken = localStorage.getItem('authToken');

    setupAjaxRequests();

    // $('#loadPosts').on('click', loadPosts);
    $('#loginForm').on('submit', submitLogin);
    $('#registrationForm').on('submit', submitRegistration);
  };

  var submitRegistration = function(event) {
    event.preventDefault();
    if ($('#password').val().length > 7){
      $.ajax({
        url: router.host + '/players',
        type: 'POST',
        data: {player: {email: $('#email').val(), password: $('#password').val()}},
      })
      .done(loginSuccess)
      .fail(function(err) {
        console.log(err);
      });
    } else {
      alert('do not be dumb');
    }
    return false;
  };

  var loginSuccess = function(userData) {
    localStorage.setItem('authToken', userData.token);
    console.log(userData);
    window.location.href = '/';
  };

  var submitLogin = function(event) {
    var $form;
    event.preventDefault();
    $form = $(this);
    $.ajax({
      url: apiHost + '/players/sign_in',
      type: 'POST',
      data: $form.serialize()
    })
    .done(loginSuccess)
    .fail(function(err) {
      console.log(err);
    });

    return false;
  };

  var setupAjaxRequests = function() {
    $.ajaxPrefilter(function( options ) {
      options.headers = {};
      options.headers['AUTHORIZATION'] = "Token token=" + authToken;
    });
  };

  // Let's assume that this requires login
  // var loadPosts = function() {
  //   $.ajax({
  //     url: apiHost + '/posts',
  //     type: 'GET',
  //     dataType: 'json',
  //   })
  //   .done(displayPosts)
  //   .fail(acceptFailure);
  // };

  var displayPosts = function(posts) {
    console.table(posts);
  };

  var acceptFailure = function(error) {
    // If things are failing, deal with specific errors
    // If status is unauthorized, then redirect to a login route/page
    if (error.status === 401) {
      console.log('SEND TO LOGIN SCREEN');
      window.location.href = '/login.html';
    }
  };

  return {
    run: run,
    setupAjaxRequests: setupAjaxRequests
  };
})();


$(document).ready(function() {
  App.run();
});
