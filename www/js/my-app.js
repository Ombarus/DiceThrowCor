var app = new Framework7({
	root: '#app',
    routes: routes,
    panel: {
        swipe: "left",
    }
});
var mainView = app.views.create('.view-main');
var $$ = Dom7;


var sample_data = JSON.parse('{ '+
'	"current_roll": [ '+
'		{"dice":6,"count":3, "max":true, "one":false, "bonus":-2, "bonus_roll":0}, '+
'		{"dice":8,"count":1, "max":false, "one":false, "bonus":0, "bonus_roll":0} '+
'	], '+
'	"history":[ '+
'		[ '+
'			{"roll_data":{"dice":6,"count":3, "max":true, "one":false, "bonus":-2, "bonus_roll":0}, "results":[1,5,12]}, '+
'			{"roll_data":{"dice":8,"count":5, "max":false, "one":false, "bonus":0, "bonus_roll":0}, "results":[1,2,8,4,5]} '+
'		], '+
'		[ '+
'			{"roll_data":{"dice":8,"count":5, "max":false, "one":false, "bonus":0, "bonus_roll":0}, "results":[1,2,8,4,5]} '+
'		], '+
'		[ '+
'			{"roll_data":{"dice":6,"count":20, "max":true, "one":false, "bonus":-2, "bonus_roll":0}, "results":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]} '+
'		] '+
'	], '+
'	"presets":[ '+
'		{ '+
'			"roll_data":[{"dice":6,"count":3, "max":true, "one":false, "bonus":-2, "bonus_roll":0},{"dice":8,"count":5, "max":false, "one":false, "bonus":0, "bonus_roll":0}], '+
'			"name":"1d6+3 spellcasting" '+
'		} '+
']}');

$$("#dice-side").on("formajax:success", function() {
	var val = $$("input[name='dice-side-input']").val();
	if (val > 0)
	{
		app.router.navigate("/dicecount/");
	}
	else
	{
		console.log("error, NAN");
	}
});
$$("a").on("click", function(ev) {
	ProcessClick(ev);
});

function ProcessClick(ev) {
	var btn = $$(ev.target);
	if (btn.hasClass("dice"))
	{
		var val = btn.text();
		save_data.current_roll[save_data.current_roll.length-1].dice = val;
		console.log("Dice roll with " + val);
	}
	if (btn.hasClass("dicecount"))
	{
		var val = btn.text();
		save_data.current_roll[save_data.current_roll.length-1].count = val;
		console.log("Rolling " + val + "D" + save_data.current_roll[save_data.current_roll.length-1].dice);
	}
	if (btn.attr('id') == "doroll")
	{
		var rerollmax = $$("input[name='dice-reroll-max']").val();
		var rerollmin = $$("input[name='dice-reroll-min']").val();
		var dicebonus = $$("input[name='dice-bonus']").val();
		var rollbonus = $$("input[name='roll-bonus']").val();
		
		save_data.current_roll[save_data.current_roll.length-1].max = rerollmax;
		save_data.current_roll[save_data.current_roll.length-1].min = rerollmin;
		save_data.current_roll[save_data.current_roll.length-1].bonus = dicebonus;
		save_data.current_roll[save_data.current_roll.length-1].bonus_roll = rollbonus;
	}
}

var initial_data = JSON.parse('{"current_roll":[{}], "history":[], "presets":[]}');
save_data = app.form.getFormData("save.json");
if (save_data == null)
{
	save_data = initial_data;
	app.form.storeFormData("save.json", initial_data);
}

$$(document).on('page:init', function (e) {
	
	app.form.storeFormData("save.json", initial_data);
	var data = app.form.getFormData("save.json");
	
    $$('#threshold-slider').on('touchstart', function(event) {
		app.swiper.get($$('.tabs-swipeable-wrap')).allowTouchMove = false;
	});
	$$('#threshold-slider').on('touchend', function(event) {
		app.swiper.get($$('.tabs-swipeable-wrap')).allowTouchMove = true;
	});
	$$("#dice-count").on("formajax:success", function() {
		var val = $$("input[name='dice-count-input']").val();
		if (val > 0)
		{
			app.router.navigate("/diceoptions/");
		}
		else
		{
			console.log("error, NAN");
		}
	});
	$$("#dice-side").on("formajax:success", function() {
		var val = $$("input[name='dice-side-input']").val();
		if (val > 0)
		{
			app.router.navigate("/dicecount/");
		}
		else
		{
			console.log("error, NAN");
		}
	});
	$$("a").on("click", function(ev) {
		ProcessClick(ev);
	});
	
	var rerollmax = $$("input[name='dice-reroll-max']").val();
	var rerollmin = $$("input[name='dice-reroll-min']").val();
	var dicebonus = $$("input[name='dice-bonus']").val();
	var rollbonus = $$("input[name='roll-bonus']").val();
});
