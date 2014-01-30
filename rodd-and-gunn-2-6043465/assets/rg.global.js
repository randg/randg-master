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
			
			// Add to Cart API Call
		    $(document).on('click', '.add_to_cart', function(e) {
		  		var quantity = 1,
		  			variantId = getVariantId(),
		  			loader = '<li class="loader"></li>';

		  		if (!$('#cart ul li[data-id="' + variantId + '"]').length) {
			  		$('#cart ul li:first-child').after(loader);
			  	} else {
			  		$('#cart ul li[data-id="' + variantId + '"]').addClass('loader');
			  	};

		    	e.preventDefault();
		    	$('#cart').mmenu().trigger("open").on("opened.mm", function() {
			    	Shopify.addItem(variantId, quantity, updateCartUI);
			    });
		  	});

		  	$(document).on('click', 'a.image-wrap', function() {
		  		var $obj = $(this),
		  			colorObj = $obj.find('img:visible').attr('alt').toLowerCase(),
		  			color = colorObj.replace(/ /g,'-');
		  		$obj.attr('href', $obj.attr('href') + '?color=' + color);
		  	});

		},

		updateCartUI = function(line_item) {

			var params = {
			    type: 'GET',
			    url: '/cart/cart.js',
			    dataType: 'json',
			    success: function(cart) { 
			        updateCartCount(cart);
			    },
			    error: function(XMLHttpRequest, textStatus) {
			        Shopify.onError(XMLHttpRequest, textStatus);
			    }
			};

			$.ajax(params);


			if ($('#cart ul li[data-id="' + line_item.id + '"]').length) {

				$('#cart ul li[data-id="' + line_item.id + '"]').find('.item-details').children('strong').html(line_item.quantity + ' x');
				$('#cart ul li[data-id="' + line_item.id + '"]').removeClass('loader');

			} else {

				$('#cart ul li.loader').attr('data-id', line_item.id);

		  		var cartItem = '';
		  		cartItem = '<a href="' + line_item.url + '">' +
	        				   '<div class="cart_image"><img src="' + line_item.image + '" alt="' + line_item.title + '"></div>' +
	        				   '<div class="item-details"><strong>' + line_item.quantity + ' x</strong> ' + line_item.title + '</div>' +
	        				   '<div class="item-price"><strong class="price">' + line_item.price  + '</strong></div>' +
	        				   '</a>';

		    	$('#cart ul li.loader').append(cartItem).addClass('cart_item').removeClass('loader');

			};

	    	$('#cart').mmenu().off("opened.mm");

	    	setTimeout(function() {
	    		$('#cart').mmenu().trigger("close");
	    	}, 3000);



		},

		updateCartCount = function(cart) {
			if (cart.item_count == 0) { 
	          $('.cart-button').remove('.cart_count'); 
	        } else if (cart.item_count == 1 && !$('.cart_count').length) {
	        	$('.cart-button').append('<div class="cart_count">' + cart.item_count + '</div>');
	        } else {
	          $('.cart_count').html(cart.item_count);
	        };
		},

		getVariantId = function() {

	  		var variantId = null,
	  			colorVariant = $('.selector-wrapper:first-child').children('.single-option-selector').find(':selected').text(),
		  		sizeVariant = $('.selector-wrapper:first-child').next('.selector-wrapper').children('.single-option-selector').find(':selected').text();
	  		
	  		$('.select > select').children('option').each(function() {
	  			if ($(this).text() == colorVariant + ' / ' + sizeVariant) {
	  				variantId = $(this).val();
	  				//console.log(variantId);
	  			};
	  		});
	  		return variantId;
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
		init : init,
		getVariantId : getVariantId
	};

})(document, jQuery);
