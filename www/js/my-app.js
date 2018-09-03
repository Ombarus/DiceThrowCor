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
'		{"roll_data":{"dice":6,"count":3, "max":true, "one":false, "bonus":-2, "bonus_roll":0}, "results":[1,5,12]}, '+
'		{"roll_data":{"dice":8,"count":5, "max":false, "one":false, "bonus":0, "bonus_roll":0}, "results":[1,2,8,4,5]} '+
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
		save_data.current_roll[save_data.current_roll.length-1].roll_data.dice = parseInt(val);
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
		save_data.current_roll[save_data.current_roll.length-1].roll_data.dice = val;
	}
	if (btn.hasClass("dicecount"))
	{
		var val = btn.text();
		save_data.current_roll[save_data.current_roll.length-1].roll_data.count = val;
		console.log("Rolling " + val + "D" + save_data.current_roll[save_data.current_roll.length-1].roll_data.dice);
	}
	if (btn.attr('id') == "doroll")
	{
		var rerollmax = $$("input[name='dice-reroll-max']").is(':checked');
		var rerollmin = $$("input[name='dice-reroll-min']").is(':checked');
		var dicebonus = $$("input[name='dice-bonus']").val();
		var rollbonus = $$("input[name='roll-bonus']").val();
		
		save_data.current_roll[save_data.current_roll.length-1].roll_data.max = rerollmax;
		save_data.current_roll[save_data.current_roll.length-1].roll_data.min = rerollmin;
		save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_dice = parseInt(dicebonus);
		save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_roll = parseInt(rollbonus);
		
		save_data.current_roll[save_data.current_roll.length-1].results = Roll(save_data.current_roll[save_data.current_roll.length-1].roll_data);
		save_data.history.push(save_data.current_roll[save_data.current_roll.length-1]);
		app.form.storeFormData("save.json", save_data);
		console.log(save_data);
	}
}

function Roll(rolldata) {
	result = JSON.parse('[]');
	var i;
	for (i = 0; i < rolldata.count; i++)
	{
		var roll = MyRand(rolldata.dice);
		
		// reroll 1 (but only once)
		if (roll == 1 && rolldata.min == true)
		{
			roll = MyRand(rolldata.dice);
		}
		
		finalroll = roll;
		while (rolldata.max == true && roll == rolldata.dice)
		{
			roll = Math.round((Math.random() * rolldata.dice)) + 1;
			finalroll += roll;
		}
		finalroll += rolldata.bonus_dice;
		result.push(finalroll);
	}
	return result;
}

function MyRand(max) {
	// TODO: Use Mersene Twister, do NOT trust javascript random method... urk
	var roll = Math.round((Math.random() * max)) + 1;
	//////////////////////////////////////////////////////////////////////////
	
	return roll;
}

function GetSum() {
	var i = 0;
	var total = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		var j = 0;
		for (j = 0; j < inner.results.length; j++)
		{
			total += inner.results[j];
		}
		total += inner.roll_data.bonus_roll;
	}
	return total;
}

function GetCount() {
	var i = 0;
	var total = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		total += inner.results.length;
	}
	return total;
}

function GetAvg() {
	var i = 0;
	var count = 0;
	var sum = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		count += inner.results.length;
		var j = 0;
		for (j = 0; j < inner.results.length; j++)
		{
			sum += inner.results[j];
		}
	}
	return sum / count;
}

function GetMax() {
	var i = 0;
	var max = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		var j = 0;
		for (j = 0; j < inner.results.length; j++)
		{
			if (inner.results[j] > max)
			{
				max = inner.results[j];
			}
		}
	}
	return max;
}

function GetMin() {
	var i = 0;
	var min = -1;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		var j = 0;
		for (j = 0; j < inner.results.length; j++)
		{
			if (inner.results[j] < min || min == -1)
			{
				min = inner.results[j];
			}
		}
	}
	return min;
}

function GetCrit() {
	var i = 0;
	var totalcrit = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		var critthresh = inner.roll_data.dice;
		var j = 0;
		for (j = 0; j < inner.results.length; j++)
		{
			if (inner.results[j] - inner.roll_data.bonus_dice >= critthresh)
			{
				totalcrit += 1;
			}
		}
	}
	return totalcrit;
}

function GetMiss() {
	var i = 0;
	var totalmiss = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		var j = 0;
		for (j = 0; j < inner.results.length; j++)
		{
			if (inner.results[j] - inner.roll_data.bonus_dice == 1)
			{
				totalmiss += 1;
			}
		}
	}
	return totalmiss;
}

function GetThresholdCount(threshold) {
	var i = 0;
	var count = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		var j = 0;
		for (j = 0; j < inner.results.length; j++)
		{
			if (inner.results[j] >= threshold)
			{
				count += 1;
			}
		}
	}
	return count;
}

function UpdateSumText() {
	sumtext = "Sum";
	var i = 0;
	var hasbonus = false;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var bonus_roll = save_data.current_roll[i].roll_data.bonus_roll;
		if (bonus_roll != 0)
		{
			if (hasbonus)
			{
				sumtext += "/";
			}
			else
			{
				sumtext += " ";
			}
			if (bonus_roll > 0)
			{
				sumtext += "+";
			}
			sumtext += bonus_roll;
			hasbonus = true;
		}
	}
	
	$$("#stats-sum-title").text(sumtext);
}

function UpdateDiceList() {
	var content = "";
	$$("#dice-list").text(content);
	var i = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		var j = 0;
		for (j = 0; j < inner.results.length; j++)
		{
			var dice = inner.roll_data.dice;
			if (dice == 2)
			{
				content += "<div class='dice-icon d2-icon'>" + inner.results[j] + "</div>"
			}
			else if (dice == 4)
			{
				content += "<div class='dice-icon d4-icon'>" + inner.results[j] + "</div>"
			}
			else if (dice == 6)
			{
				content += "<div class='dice-icon d6-icon'>" + inner.results[j] + "</div>"
			}
			else if (dice == 8)
			{
				content += "<div class='dice-icon d8-icon'>" + inner.results[j] + "</div>"
			}
			else if (dice == 10)
			{
				content += "<div class='dice-icon d10-icon'>" + inner.results[j] + "</div>"
			}
			else if (dice == 12)
			{
				content += "<div class='dice-icon d12-icon'>" + inner.results[j] + "</div>"
			}
			else if (dice == 20)
			{
				content += "<div class='dice-icon d20-icon'>" + inner.results[j] + "</div>"
			}
			else if (dice == 100)
			{
				content += "<div class='dice-icon d100-icon'>" + inner.results[j] + "</div>"
			}
			else
			{
				content += "<div class='dice-icon'>" + inner.results[j] + "</div>"
			}
		}
	}
	
	$$("#dice-list").append(content);
}

var initial_data = JSON.parse('{"current_roll":[{"roll_data":{}, "results":{}}], "history":[], "presets":[]}');
save_data = app.form.getFormData("save.json");
if (save_data == null)
{
	save_data = initial_data;
	app.form.storeFormData("save.json", initial_data);
}
else
{
	save_data.current_roll = initial_data.current_roll;
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
	$$('#threshold-slider').on('range:change', function(event, range) {
		$$("#stats-threshold-val").text("Above Threshold of " + range.value);
		$$("#stats-threshold-count").text(GetThresholdCount(range.value));
	});
	$$("#dice-count").on("formajax:success", function() {
		var val = $$("input[name='dice-count-input']").val();
		if (val > 0)
		{
			save_data.current_roll[save_data.current_roll.length-1].roll_data.count = parseInt(val);
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
			save_data.current_roll[save_data.current_roll.length-1].roll_data.dice = parseInt(val);
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
	
	if ($$("#stats-count").length != 0)
	{
		$$("#stats-count").text(GetCount());
		$$("#stats-sum").text(GetSum());
		UpdateSumText();
		$$("#stats-avg").text(GetAvg().toFixed(2));
		var max = GetMax();
		$$("#stats-high").text(max);
		$$("#stats-low").text(GetMin());
		$$("#stats-crit").text(GetCrit());
		$$("#stats-miss").text(GetMiss());
		$$("#stats-threshold-val").text("Above Threshold of " + $$("#stats-threshold-range")[0].value);
		$$("#stats-threshold-range")[0].max = max;
		$$("#stats-threshold-count").text(GetThresholdCount($$("#stats-threshold-range")[0].value));
		
		UpdateDiceList();
	}
});
