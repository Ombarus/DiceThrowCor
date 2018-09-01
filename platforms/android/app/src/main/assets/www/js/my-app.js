var app = new Framework7({
	root: '#app',
    routes: routes,
    panel: {
        swipe: "left",
    },
});
var mainView = app.views.create('.view-main');
var $$ = Dom7;
$$(document).on('page:init', function (e) {
    $$('#threshold-slider').on('touchstart', function(event) {
		app.swiper.get($$('.tabs-swipeable-wrap')).allowTouchMove = false;
	});
	$$('#threshold-slider').on('touchend', function(event) {
		app.swiper.get($$('.tabs-swipeable-wrap')).allowTouchMove = true;
	});
});