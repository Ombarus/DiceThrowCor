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

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
