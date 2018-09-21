var current_language = "en";

function SetLanguage(new_lang) {
	if (current_language == new_lang || translation_table[new_lang] == undefined) {
		return;
	}
	
	current_language = new_lang;
	save_data.settings.language = new_lang;
	app.form.storeFormData("save.json", save_data);
	UpdateLanguage();
}

function UpdateLanguage() {
	var current_dict = translation_table[current_language];
	$$("lang").each(function(index, el) {
		var orig = $$(el).attr("orig");
		if (orig == null) {
			$$(el).attr("orig", $$(el).text());
			orig = $$(el).text();
		}
		$$(el).text(GetLocalizedString(orig));
	});
	$$("[placeholder]").each(function(index, el) {
		var orig = $$(el).attr("orig");
		if (orig == null) {
			$$(el).attr("orig", $$(el).attr("placeholder"));
			orig = $$(el).attr("placeholder");
		}
		$$(el).attr("placeholder", GetLocalizedString(orig));
	});
	$$("[data-tooltip]").each(function(index, el) {
		var orig = $$(el).attr("orig");
		if (orig == null) {
			$$(el).attr("orig", $$(el).attr("data-tooltip"));
			orig = $$(el).attr("data-tooltip");
		}
		app.tooltip.setText($$(el), GetLocalizedString(orig));
		$$(el).attr("data-tooltip", GetLocalizedString(orig));
	});
}

function GetLocalizedString(key) {
	if (translation_table[current_language][key] == undefined) {
		console.log("Missing " + current_language + " translation for '" + key + "'");
		return key;
	}
	
	return translation_table[current_language][key];
}

function InitLanguage(cur_lang) {
	if (window.Intl && typeof window.Intl === 'object' && cur_lang == "") {
		cur_lang = navigator.language.split("-")[0].toLowerCase();
	} else if (cur_lang == "") {
		cur_lang = "en";
	}
	
	SetLanguage(cur_lang);
	$$(document).on('page:init', function (e, page) {
		UpdateLanguage();
		$$("input[name='lang']").on("change", function(ev) {
			SetLanguage(ev.target.value);
		});
		var language_settings = $$("input[name='lang']");
		if (language_settings.length !=0) {
			for (var i = 0; i < language_settings.length; i++) {
				var input = $$(language_settings[i]);
				if (input.attr("value") == current_language) {
					input.attr('checked',true);
				}
				else
				{
					input.removeAttr('checked');
				}
			}
		}
	});
}