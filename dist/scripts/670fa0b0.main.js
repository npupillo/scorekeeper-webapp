"use strict";var trace=function(){for(var a=0;a<arguments.length;a++)console.log(arguments[a])},router=function(a){a.host="http://scorekeeper-api.herokuapp.com";var b=Backbone.Router.extend({routes:{"":"allGames",game:"showGame",newgame:"newGame",players:"allPlayers"},allGames:function(){c(),$("#content1").load("partials/allGames.html"),allGames.init()},showGame:function(a){c(),$("#content1").load("partials/showGame.html"),showGame.init(a)},newGame:function(){$("#content1").load("partials/newGame.html"),newGame.init()},allPlayers:function(){c(),$("#content1").load("partials/allPlayers.html"),allPlayers.init()}}),c=function(){$("#content1").empty(),$("#content2").empty(),$("#content3").empty()};return a.router=new b,a.backbone=function(){Backbone.history.start()},a}(router||{});$(document).ready(function(){router.backbone()}),Handlebars.registerHelper("handlebar_helper",function(){return"This is the output of your helper method."}),Handlebars.registerHelper("multiply",function(a,b){return a*b}),Handlebars.registerHelper("add_nums",function(a,b){for(var c=0,d=0;d<a.length;d++)c+=b.fn(a[d]);return c}),Handlebars.registerHelper("grouped_each",function(a,b,c){var d,e="",f=[];if(b&&b.length>0){for(d=0;d<b.length;d++)d>0&&d%a===0&&(e+=c.fn(f),f=[]),f.push(b[d]);e+=c.fn(f)}return e}),Handlebars.registerHelper("sum",function(){for(var a,b=0,c=0;c<arguments.length;c++)a=parseFloat(arguments[c]),isNaN(a)||(b+=a);return b}),Handlebars.registerHelper("getGameplayerId",function(a,b){return a[b]});var showGame=function(a){var b=function(a){var b=Handlebars.compile($("#one_game_template").html());$("#content1").html(b({game:a})),$(".submit-btn").on("click",function(a){a.preventDefault(),console.log("button clicked");var b=$(this).data("game_id"),d=$(this).data("player_id");c(a,b,d)}),d(a),g(a)},c=function(a,b,c){a.preventDefault();var d=$("#field_id-"+c).val();console.log("This input value is: "+d),console.log("This game_id is: "+b),console.log("This player_id is: "+c),$.ajax({url:"http://localhost:3000/scores",type:"POST",dataType:"JSON",data:{score:{points:d,game_id:b,player_id:c}}}).done(function(a){location.reload()}).fail(function(a,b,c){console.log(a,b,c)})},d=function(a){var b=[];a.game_scores.forEach(function(a){b.push(a.name),b.push(a.tally)}),e(b),f(b)},e=function(a){$("#chart_hc_bar").highcharts({chart:{type:"column"},title:{text:"Game Scores"},xAxis:{gridLineWidth:0,gridLineColor:"transparent",lineColor:"transparent",tickColor:"transparent",title:{text:"Players"},labels:{enabled:!1}},yAxis:{gridLineWidth:0,gridLineColor:"transparent",lineColor:"transparent",tickColor:"transparent",title:{text:""},min:0,labels:{enabled:!1}},plotOptions:{series:{dataLabels:{enabled:!0}}},series:[{name:"Game Scores",colorByPoint:!0,data:a}]})},f=function(a){console.log(a);for(var b=[],c=0;c<a.length;c++)c%2!==0&&b.push(a[c]);var d,e={top:30,right:20,bottom:30,left:20},f=300-e.top-e.bottom,g=300-e.left-e.right,h=d3.scale.linear().domain([0,.33*b.length,.66*b.length,b.length]).range(["#B58929","#C61C6F","#268BD2","#85992C"]),i=d3.scale.linear().domain([0,d3.max(b)]).range([0,f]),j=d3.scale.ordinal().domain(d3.range(0,b.length)).rangeBands([0,g],.2),k=d3.select("body").append("div").style("position","absolute").style("padding","0 10px").style("background","white").style("opacity",0),l=d3.select("#chart_d3_bar").append("svg").style("background","#E9E9E9").attr("width",g+e.left+e.right).attr("height",f+e.top+e.bottom).append("g").attr("transform","translate("+e.left+", "+e.top+")").selectAll("rect").data(b).enter().append("rect").style("fill",function(a,b){return h(b)}).attr("width",j.rangeBand()).attr("x",function(a,b){return j(b)}).attr("height",0).attr("y",f).on("mouseover",function(a){k.transition().style("opacity",.9),k.html(a).style("left",d3.event.pageX-35+"px").style("top",d3.event.pageY-30+"px"),d=this.style.fill,d3.select(this).style("opacity",.5)}).on("mouseout",function(a){d3.select(this).style("opacity",1).style("fill",d)});l.transition().attr("height",function(a){return i(a)}).attr("y",function(a){return f-i(a)}).delay(function(a,b){return 40*b}).duration(1e3).ease("elastic");d3.scale.linear().domain([0,d3.max(b)]).range([f,0])},g=function(a){var b=a.game_scores;$("#chart_hc_line").highcharts({title:{text:"Game Scores",x:-20},subtitle:{text:"per Round",x:-20},xAxis:{categories:[],title:{text:"Rounds"}},yAxis:{title:{text:"Points"},plotLines:[{value:0,width:1,color:"#808080"}]},tooltip:{valueSuffix:""},legend:{layout:"vertical",align:"right",verticalAlign:"middle",borderWidth:0},series:b})};return a.init=function(a){$.ajax({url:router.host+"/games/"+a,type:"GET",dataType:"JSON"}).done(function(a){b(a)}).fail(function(a,b,c){console.log(a,b,c)})},a}(showGame||{}),allPlayers=function(a){var b=function(a){var b=Handlebars.compile($("#all_players_template").html());$("#content2").html(b({players:a}))};return a.init=function(){$.ajax({url:router.host+"/players",type:"GET",dataType:"JSON"}).done(function(a){console.log(a),b(a)}).fail(function(a,b,c){console.log(a,b,c)})},a}(allPlayers||{}),allGames=function(a){var b=function(a){var b=Handlebars.compile($("#all_games_template").html());$("#content1").html(b({games:a}))},c=function(){$.ajax({url:router.host+"/games",type:"GET",dataType:"JSON"}).done(function(a){b(a)}).fail(function(a,b,c){console.log(a,b,c)})};return a.init=function(){c()},a}(allGames||{}),newGame=function(a){var b=function(a){var b=Handlebars.compile($("#new_game_template").html());$("#content2").html(b({players:a})),$("form#submit-new-game").on("click",function(a){a.preventDefault(),c(a),alert("CLICKED")})},c=function(a){$.ajax({url:router.host+"/games",type:"POST",dataType:"JSON",data:{game:{name:$("input#new-game-name").val(),status:"active",start_date:"Apr 1 2015"}}}).done(function(a){console.log(a)}).fail(function(a,b,c){console.log(a,b,c)})},d=function(){$.ajax({url:router.host+"/players",type:"GET",dataType:"JSON"}).done(function(a){console.log(a),b(a)}).fail(function(a,b,c){console.log(a,b,c)})};return a.init=function(){d()},a}(newGame||{});