'use strict';
Handlebars.registerHelper("handlebar_helper", function(){
  return "This is the output of your helper method.";
});

Handlebars.registerHelper("multiply", function(a, b){
  return a * b;
});

Handlebars.registerHelper('add_nums', function(items, options){
  var sum = 0;
  for(var i=0; i<items.length; i++){
    sum = sum + options.fn(items[i]);
  }
  return sum;

});

// test in showGame.html
/*
<hr>
<p>H-Helper text: {{handlebar_helper}}</p>
<p>H-Helper, multiply function: {{multiply 2 4}}</p>
*/

//From
// http://funkjedi.com/technology/412-every-nth-item-in-handlebars/
// http://stackoverflow.com/questions/26831128/handlebars-js-and-bootstrap-grid-wrap-columns-in-row

Handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

//test in allGames.html
/*
<hr>
{{#grouped_each 3 games}}
  <div class="row">
    {{#each this }}
      <div class="col-sm-4 item">
        <strong>{{name}}</strong><br>
        {{status}}<br>
        {{players.length}}
      </div>
    {{/each}}
  </div>
{{/grouped_each}}
*/

//test in allPlayers.html
//From http://www.hariadi.org/snippets/handlebars-helper-sum/

Handlebars.registerHelper('sum', function(){
  var sum = 0, v;
  for(var i=0; i < arguments.length; i++){
    v = parseFloat(arguments[i]);
    if(!isNaN(v)) sum += v;
  }
  return sum;
});


//test in showGame.html
// {{points}}/{{getGameplayerId ../../gameplayers @index}}

Handlebars.registerHelper('getGameplayerId', function(gp_array, id) {
    return gp_array[id];
});

