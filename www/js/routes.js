var routes = [
	// Index page
	{
		path: '/',
		url: './index.html',
		name: 'home',
	},
	// About page
	{
		path: '/about/',
		url: './about.html',
		name: 'about',
	},
	// Number of dice page
	{
		path: '/dicecount/',
		url: './dicecount.html',
		name: 'dicecount',
	},
	// First page (changed dynamically based on options)
	{
		path: '/first/',
		async(routeTo, routeFrom, resolve, reject) {
			if (save_data.settings.first_page == "dicecount") {
				resolve({ url: 'dicecount.html' })
			} else {
				resolve({ url: 'dicetype.html' })
			}
		}
	},
	// Will be adjusted based on which page is first
	{
		path: '/dicetypenext/',
		async(routeTo, routeFrom, resolve, reject) {
			if (save_data.settings.first_page == "dicecount") {
				if (save_data.settings.show_roll_options == true) {
					resolve({ url: 'diceoptions.html' })
				} else {
					save_data.current_roll[save_data.current_roll.length-1].roll_data.max = false;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.min = false;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_dice = 0;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_roll = 0;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.drop_high = 0;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.drop_low = 0;
					
					resolve({url: 'dicestats.html'})
				}
			} else {
				resolve({ url: 'dicecount.html' })
			}
		}
	},
	// Will be adjusted based on which page is first
	{
		path: '/dicecountnext/',
		async(routeTo, routeFrom, resolve, reject) {
			if (save_data.settings.first_page == "dicecount") {
				resolve({ url: 'dicetype.html' })
			} else {
				if (save_data.settings.show_roll_options == true) {
					resolve({ url: 'diceoptions.html' })
				} else {
					save_data.current_roll[save_data.current_roll.length-1].roll_data.max = false;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.min = false;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_dice = 0;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.bonus_roll = 0;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.drop_high = 0;
					save_data.current_roll[save_data.current_roll.length-1].roll_data.drop_low = 0;
					
					resolve({url: 'dicestats.html'})
				}
			}
		}
	},
	// options for roll
	{
		path: '/diceoptions/',
		url: './diceoptions.html',
		name: 'diceoptions'
	},
	// dice stats result
	{
		path: '/dicestats/',
		url: './dicestats.html',
		name: 'dicestats'
	},
	// Preset Management page
	{
		path: '/presetmanage/',
		url: './presetmanage.html',
		name: 'presetmanage'
	},
	// History Management (see, clear)
	{
		path: '/historymanage/',
		url: './historymanage.html',
		name: 'historymanage'
	},
	// Settings page
	{
		path: '/settingsmanage/',
		url: './settingsmanage.html',
		name: 'settingsmanage'
	},


	// Default route (404 page). MUST BE THE LAST
	{
		path: '(.*)',
		url: './pages/404.html',
	},
];
