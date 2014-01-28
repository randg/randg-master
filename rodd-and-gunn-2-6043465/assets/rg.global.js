var RG = RG || {};

// Settings
RG.settings = {
	debug: true,
	debugTracking : false,
	cache: true,
	cacheTTL: 10
};

// Page/Device Info
RG.info = {
	docHeight : null,
	docWidth : null,
	ios : false,
	android: false,
	touch : false,
	orientation : null,
	pageSize : 0,
	sizes : [ 480, 768, 980, 1200 ],
	mobile : $(window).width() < 768,
	tablet : $(window).width() >= 768
};

RG.global = (function (doc, $, undefined) {

	"use strict";

	var init = function() { 

			// Initiate global page events
			events();

			// Initialize debugging
			if (RG.settings.debug) { 
				debugging.size();
				debugging.tests();
				debugging.init(); 
			};

			// Recalculate on resize / orientation change
			if (!RG.info.ios) {
				$(window).resize(function() {
					debugging.onChange();
				});
			} else {
				window.onorientationchange = function() {
					setTimeout(function() {
						debugging.onChange();
					}, 1);
				}
			};

			// Initiate other code
			RG.collectionPage.init();
			RG.productPage.init();
			RG.accountPage.init();

		},

		// Sets Global click events for common objects 
		events = function() {
			
			

		},

		// This if for debugging resolutions and misc actions
		debugging = {
			init: function() {
				$('body').append('<div id="debugger" />');
				this.update();
			},
			// Recalculate on resize / orientation change
			onChange: function() {
				this.size();
				// Debugging
				if (RG.settings.debug) { 
					this.update(); 
				};
			},
			update: function() {
				var d = $('#debugger');
				if (d.length < 1) {
					this.init();
				}
				$('#debugger').html(RG.info.docWidth + 'x' + RG.info.docHeight + ' (' + RG.info.pageSize + ')');
			},
			// Get page dimensions
			size: function() {
				RG.info.docHeight = $(window).height();
				RG.info.docWidth = $(window).width();
				// Set up breakpoints indicators
				if (RG.info.docWidth >= RG.info.sizes[3]) {
					RG.info.pageSize = 4;
				} else if (RG.info.docWidth >= RG.info.sizes[2]) {
					RG.info.pageSize = 3;
				} else if (RG.info.docWidth >= RG.info.sizes[1]) {
					RG.info.pageSize = 2;
				} else if (RG.info.docWidth >= RG.info.sizes[0]) {
					RG.info.pageSize = 1;
				} else {
					RG.info.pageSize = 0;
				};
			},
			// Checks for devices and browsers
			tests: function() {
				// Touch device
				RG.info.touch = (!$('html').hasClass('no-touch'));
				// Old IE
				RG.info.oldie = $('html').hasClass('oldie');
				// iOS device
				RG.info.ios = navigator.userAgent.match(/(iPhone|iPod|iPad)/i) ? true : false;
				// Debugging console
				if (RG.settings.debug && window.console) {
					console.log('Touch: ' + RG.info.touch);
					console.log('OldIE: ' + RG.info.oldie);
					console.log('iOS: ' + RG.info.ios);
				};
			}
		}
		
	// Public functions
	return {
		init : init
	};

})(document, jQuery);
