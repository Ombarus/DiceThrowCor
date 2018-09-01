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

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
