
var twister = new MersenneTwister();

var app = new Framework7({
	root: '#app',
    routes: routes,
    panel: {
        swipe: "left",
    }
});
var mainView = app.views.create('.view-main');
var $$ = Dom7;

// This is not ever used except as a reference, it might not be up to date (but I try)
var sample_data = JSON.parse('{ '+
'	"version":0, ' +
'	"current_roll": [ '+
'		{"roll_data":{"dice":6,"count":3, "max":true, "min":false, "bonus":-2, "bonus_roll":0}, "results":[1,5,12]}, '+
'		{"roll_data":{"dice":8,"count":5, "max":false, "min":false, "bonus":0, "bonus_roll":0}, "results":[1,2,8,4,5]} '+
'	], '+
'	"history":[ '+
'		[ '+
'			{"roll_data":{"dice":6,"count":3, "max":true, "min":false, "bonus":-2, "bonus_roll":0}, "results":[1,5,12]}, '+
'			{"roll_data":{"dice":8,"count":5, "max":false, "min":false, "bonus":0, "bonus_roll":0}, "results":[1,2,8,4,5]} '+
'		], '+
'		[ '+
'			{"roll_data":{"dice":8,"count":5, "max":false, "min":false, "bonus":0, "bonus_roll":0}, "results":[1,2,8,4,5]} '+
'		], '+
'		[ '+
'			{"roll_data":{"dice":6,"count":20, "max":true, "min":false, "bonus":-2, "bonus_roll":0}, "results":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]} '+
'		] '+
'	], '+
'	"presets":[ '+
'		{ '+
'			"roll_data":[{"dice":6,"count":3, "max":true, "min":false, "bonus":-2, "bonus_roll":0},{"dice":8,"count":5, "max":false, "min":false, "bonus":0, "bonus_roll":0}], '+
'			"name":"1d6+3 spellcasting" '+
'		} '+
']}');
///////

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
	if (btn.hasClass("doroll"))
	{
		var rerollmax = $$("input[name='dice-reroll-max']").is(':checked');
		var rerollmin = $$("input[name='dice-reroll-min']").is(':checked');
		var dicebonus = $$("input[name='dice-bonus']").val();
		var rollbonus = $$("input[name='roll-bonus']").val();
		
		save_data.current_roll[save_data.current_roll.length-1].roll_data.max = rerollmax;
		save_data.current_roll[save_data.current_roll.length-1].roll_data.min = rerollmin;
		save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_dice = parseInt(dicebonus);
		save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_roll = parseInt(rollbonus);
		
		DoRollFromData();
	}
	if (btn.hasClass("addroll"))
	{
		var rerollmax = $$("input[name='dice-reroll-max']").is(':checked');
		var rerollmin = $$("input[name='dice-reroll-min']").is(':checked');
		var dicebonus = $$("input[name='dice-bonus']").val();
		var rollbonus = $$("input[name='roll-bonus']").val();
		
		save_data.current_roll[save_data.current_roll.length-1].roll_data.max = rerollmax;
		save_data.current_roll[save_data.current_roll.length-1].roll_data.min = rerollmin;
		save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_dice = parseInt(dicebonus);
		save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_roll = parseInt(rollbonus);
		
		save_data.current_roll.push({"roll_data":{}, "results":[]});
		app.form.storeFormData("save.json", save_data);
		console.log(save_data);
	}
	if (btn.hasClass("roll-preset"))
	{
		var presetname = btn.text();
		var presetdata = null;
		for (var i = 0; i < save_data.presets.length; i++)
		{
			if (save_data.presets[i].name == presetname)
			{
				presetdata = save_data.presets[i].roll_data;
				break;
			}
		}
		if (presetdata != null) {
			save_data.current_roll = JSON.parse(JSON.stringify(presetdata));
			DoRollFromData();
			app.router.navigate("/dicestats/");
		}
		else {
			console.log("could not find preset named " + presetname);
		}
	}
}

function AddHistory(data) {
	var max_history = 20;
	save_data.history.push(JSON.parse(JSON.stringify(data))); // a strange way to deep clone the roll instead of copying the reference
	if (save_data.history.length > max_history) {
		save_data.history.splice(0, save_data.history.length-max_history);
	}
}

function DoRollFromData() {
	for (var i = 0; i < save_data.current_roll.length; i++) {
		save_data.current_roll[i].results = Roll(save_data.current_roll[i].roll_data);	
	}
	AddHistory(save_data.current_roll);
	app.form.storeFormData("save.json", save_data);
	console.log(save_data);
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
	var roll = twister.genrand_max(max);
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
			total += Math.max(1, inner.results[j]);
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
			sum += Math.max(1, inner.results[j]);
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
	var totaldice = 0;
	for (i = 0; i < save_data.current_roll.length; i++)
	{
		var inner = save_data.current_roll[i];
		var j = 0;
		totaldice += inner.results.length;
		for (j = 0; j < inner.results.length; j++)
		{
			if (inner.results[j] - inner.roll_data.bonus_dice == 1)
			{
				totalmiss += 1;
			}
		}
	}
	return totalmiss + " (" + (totalmiss / totaldice * 100).toFixed(0) + "%)";
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
			if (Math.max(1, inner.results[j]) >= threshold)
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

function UpdateDiceTitle() {
	var title = "";
	if (save_data.current_roll.length > 1) {
		title = "Multiple Roll";
	}
	else {
		var dicetype = save_data.current_roll[0].roll_data.dice;
		var dicecount = save_data.current_roll[0].roll_data.count;
		var bonus_dice = save_data.current_roll[0].roll_data.bonus_dice;
		var bonus_roll = save_data.current_roll[0].roll_data.bonus_roll;
		var reroll_max = save_data.current_roll[0].roll_data.max;
		var reroll_one = save_data.current_roll[0].roll_data.min;
		
		title += dicecount + "D"
		if (bonus_dice != 0) {
			title += "(";
		}
		title += dicetype;
		if (bonus_dice != 0) {
			if (bonus_dice > 0) {
				title += "+";
			}
			title += bonus_dice + ")";
		}
		if (bonus_roll != 0) {
			title += " ";
			if (bonus_roll > 0) {
				title += "+ ";
			}
			title += bonus_roll;
		}
		if (reroll_max == true || reroll_one == true) {
			title += " Reroll ";
			if (reroll_max == true) {
				title += dicetype;
			}
			if (reroll_max == true && reroll_one) {
				title += "/";
			}
			if (reroll_one == true) {
				title += "1";
			}
		}
	}
	
	$$("#title-results").text(title);
}

function UpdateOptionsTitle() {
	var title = "";
	
	var dicetype = save_data.current_roll[0].roll_data.dice;
	var dicecount = save_data.current_roll[0].roll_data.count;
	
	title += dicecount + "D" + dicetype;	
	
	title += "'s Options";
	$$("#title-options").text(title);
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
			var result = Math.max(1, inner.results[j]);
			if (dice == 2)
			{
				content += "<div class='dice-icon d2-icon'>" + result + "</div>"
			}
			else if (dice == 4)
			{
				content += "<div class='dice-icon d4-icon'>" + result + "</div>"
			}
			else if (dice == 6)
			{
				content += "<div class='dice-icon d6-icon'>" + result + "</div>"
			}
			else if (dice == 8)
			{
				content += "<div class='dice-icon d8-icon'>" + result + "</div>"
			}
			else if (dice == 10)
			{
				content += "<div class='dice-icon d10-icon'>" + result + "</div>"
			}
			else if (dice == 12)
			{
				content += "<div class='dice-icon d12-icon'>" + result + "</div>"
			}
			else if (dice == 20)
			{
				content += "<div class='dice-icon d20-icon'>" + result + "</div>"
			}
			else if (dice == 100)
			{
				content += "<div class='dice-icon d100-icon'>" + result + "</div>"
			}
			else
			{
				content += "<div class='dice-icon'>" + result + "</div>"
			}
		}
	}
	
	$$("#dice-list").append(content); // text(content) will escape html tags, use append()
}

var initial_data = JSON.parse('{"version":2, "current_roll":[{"roll_data":{}, "results":[]}], "history":[], "presets":[]}');
save_data = app.form.getFormData("save.json");
if (save_data == null || save_data.version == undefined || save_data.version != initial_data.version)
{
	save_data = initial_data;
	app.form.storeFormData("save.json", initial_data);
}
else
{
	save_data.current_roll = initial_data.current_roll;
}


if ($$("#preset-list").length != 0) {
	UpdatePresetList();
}
if ($$("#preset-sortable-list").length != 0) {
	UpdateSortablePresetList();
}

function UpdatePresetList() {
	var content = "";
	$$("#preset-list").text(content);
	for (var i = 0; i < save_data.presets.length; i++)
	{
		var presetname = save_data.presets[i].name;
		content += '<li>' +
		'	<a href="#" class="item-link item-content roll-preset">' +
		'		<div class="item-inner roll-preset">' +
		'			<div class="item-title roll-preset">' + presetname + '</div>' +
		'		</div>' +
		'	</a>' +
		'</li>';
	}
	$$("#preset-list").append(content); // text(content) will escape html tags, use append()
}
$$("a").on("click", function(ev) {
	ProcessClick(ev);
});

function UpdateSortablePresetList() {
	var content = "";
	$$("#preset-sortable-list").text(content);
	for (var i = 0; i < save_data.presets.length; i++)
	{
		var presetname = save_data.presets[i].name;
		content += '<li>' +
		'	<div class="item-content">' +
		'		<a href="#" class="item-media open-confirm">' +
		'			<i class="icon f7-icons color-red ios-only">close_round_fill</i>' +
		'			<i class="icon material-icons color-red md-only">remove_circle</i>' +
		'		</a>' +
		'		<div class="item-inner">' +
		'			<div class="item-title">' + presetname + '</div>' +
		'		</div>' +
		'	</div>' +
		'	<div class="sortable-handler"></div>' +
		'</li>';
	}
	$$("#preset-sortable-list").append(content); // text(content) will escape html tags, use append()
}


$$(document).on('page:init', function (e) {
	$$('.open-prompt').on('click', function () {
		app.dialog.prompt('', 'Preset Name', function (name) {
			save_data.presets.push({"name":name, "roll_data":JSON.parse(JSON.stringify(save_data.current_roll))});
			app.form.storeFormData("save.json", save_data);
		});
	});
	
	if ($$("#preset-list").length != 0) {
		UpdatePresetList();
	}
	if ($$("#preset-sortable-list").length != 0) {
		UpdateSortablePresetList();
	}
	
	$$('.open-confirm').on('click', function (e) {
		var presetname = $$(e.target).parents(".item-content").find(".item-inner").text();
		app.dialog.confirm(presetname, 'Delete Preset ?', function (name) {
			for (var i = 0; i < save_data.presets.length; i++) {
				if (save_data.presets[i].name == presetname) {
					save_data.presets.splice(i, 1);
					break; // Carefull not to continue to loop here !
				}
			}
			app.form.storeFormData("save.json", save_data);
			UpdateSortablePresetList();
			// this list might stay loaded because of Ajax magic so update it too if it's there.
			if ($$("#preset-list").length != 0) {
				UpdatePresetList();
			}
		});
	});
	$$("#preset-sortable-list").on("sortable:sort", function(ev) {
		var ifrom = ev.detail.from;
		var ito = ev.detail.to;
		console.log("moving preset " + ifrom + " to preset " + ito);
		var tmp = save_data.presets[ifrom];
		save_data.presets[ifrom] = save_data.presets[ito];
		save_data.presets[ito] = tmp;
		app.form.storeFormData("save.json", save_data);
		if ($$("#preset-list").length != 0) {
			UpdatePresetList();
		}
	});
	
	if ($$("input[name='dice-reroll-max']").length != 0) {
		var input = $$("input[name='dice-reroll-max']");
		if (save_data.history.length > 0) {
			 var last_roll = save_data.history[save_data.history.length-1];
			 if (last_roll[last_roll.length-1].roll_data.max == true) {
				 input.attr('checked',true);
			 }
			 else {
				 input.removeAttr('checked');
			 }
		}
	}
	if ($$("input[name='dice-reroll-min']").length != 0) {
		var input = $$("input[name='dice-reroll-min']");
		if (save_data.history.length > 0) {
			 var last_roll = save_data.history[save_data.history.length-1];
			 if (last_roll[last_roll.length-1].roll_data.min == true) {
				 input.attr('checked',true);
			 }
			 else {
				 input.removeAttr('checked');
			 }
		}
	}
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
	$$('#dice-bonus-slider').on('range:change', function(event, range) {
		var textval = "";
		if (parseInt(range.value) >= 0) {
			textval += "+";
		}
		textval += range.value + " To Each Roll";
		$$("#dice-bonus-label").text(textval);
	});
	$$('#roll-bonus-slider').on('range:change', function(event, range) {
		var textval = "";
		if (parseInt(range.value) >= 0) {
			textval += "+";
		}
		textval += range.value + " To Final Sum";
		$$("#roll-bonus-label").text(textval);
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
	
	if ($$("#title-options").length != 0) {
		UpdateOptionsTitle();
	}
	
	if ($$("#stats-count").length != 0)
	{
		$$("#stats-count").text(GetCount());
		$$("#stats-sum").text(Math.max(1, GetSum()));
		UpdateSumText();
		$$("#stats-avg").text(GetAvg().toFixed(2));
		var max = Math.max(1, GetMax());
		$$("#stats-high").text(max);
		$$("#stats-low").text(Math.max(1, GetMin()));
		$$("#stats-crit").text(GetCrit());
		$$("#stats-miss").text(GetMiss());
		app.range.setValue($$("#stats-threshold-range"), (parseInt(max/2)));
		$$("#stats-threshold-range")[0].value = parseInt(max/2);
		$$("#stats-threshold-val").text("Above Threshold of " + $$("#stats-threshold-range")[0].value);
		$$("#stats-threshold-range")[0].max = max;
		$$("#stats-threshold-count").text(GetThresholdCount($$("#stats-threshold-range")[0].value));
		
		UpdateDiceList();
		UpdateDiceTitle();
	}
});
