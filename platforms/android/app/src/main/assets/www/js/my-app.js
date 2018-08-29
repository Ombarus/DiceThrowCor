var app = new Framework7({
	root: '#app',
    routes: [
        {
            path: "/login/",
            url: document.location.pathname.split("index.html")[0] + "login.html"
        }
    ],
    panel: {
        swipe: "left",
    },
});
var mainView = app.views.create('.view-main');