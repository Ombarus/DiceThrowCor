var current_language = "en";

function SetLanguage(new_lang) {
	if (current_language == new_lang || translation_table[new_lang] == undefined) {
		return;
	}
	
	current_language = new_lang;
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
	// iterate on "placeholder" props too
	// iterate on "data-tooltip" props too
}

function GetLocalizedString(key) {
	if (translation_table[current_language][key] == undefined) {
		console.log("Missing " + current_language + " translation for '" + key + "'");
		return key;
	}
	
	return translation_table[current_language][key];
}

function InitLanguage(cur_lang) {
	SetLanguage(cur_lang);
	$$(document).on('page:init', function (e, page) {
		UpdateLanguage();
		$$("input[name='lang']").on("change", function(ev) {
			save_data.settings.language = ev.target.value;
			app.form.storeFormData("save.json", save_data);
			SetLanguage(save_data.settings.language);
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