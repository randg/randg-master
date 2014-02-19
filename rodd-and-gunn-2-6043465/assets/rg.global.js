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
	tablet : $(window).width() >= 768,
	action : 'click'
};

RG.global = (function (doc, $, undefined) {

	"use strict";

	var validated = false,

	init = function() { 

			// Initiate global page events
			events();

			modernBrowsers();

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

		modernBrowsers = function() {
			if (!$('html').hasClass('oldie') && $('.product_form').length) {
				$('form.product_form').attr('action', '#');
			};
		},

		// Sets Global click events for common objects 
		events = function() {
			
			RG.info.action = (hasTouch() ? 'tap' : 'click');

			/*$("#mc-embedded-subscribe-form").submit(function() {

	            var $form = $(this),
	            $iframe = $("#form-submission"),
	            $window = $(window);

	            $iframe.css({
	                height: 500,
	                width: 500,
	                position: "absolute",
	                left: ($window.width() / 2) - 250,
	                top: ($window.height() / 2) - 250
	            });

	            $iframe.load(function(){
				    $iframe.fadeIn('fast', function() {
				    	$iframe.find('.wrapper').append('<div>poop</div>');
				    });
				});
	            $('.form-submission-lightbox').fadeIn();
	        });*/


			$(document).on('mouseover', '.color-swatch li a', function() {
				var $obj = $(this),
					dClass = $obj.parent().data('color');
				$obj.parents('ul').siblings('a.image-wrap').children().children('img').each(function() {
					if ($(this).data('color') == dClass) {
						$(this).show();
						$(this).siblings().hide();
					};
				});
			}).on('click', '.color-swatch li a', function(e){
				var queryExists = getQueryVariable('color'),
		  			$obj = $(this),
		  			colorObj = $obj.parent().attr('data-color').toLowerCase(),
		  			color = colorObj.replace(/ /g,'-');
		  		if (queryExists == false) {
			  		$obj.attr('href', $obj.parents('ul').siblings('a.image-wrap').attr('href') + '?color=' + color);
			  	} else {
			  		e.preventDefault();
			  	};
			});

			$(document).on('mouseover', 'a.image-wrap', function() {
				var $obj = $(this);
				$obj.addClass('rotate');
				if ($obj.find('img').length > 1 && $obj.hasClass('rotate')) {
					var nextImage = $obj.find('img:visible').next();
					rotateTimer($obj, nextImage);
				};
			}).on('mouseout', 'a.image-wrap', function() {
				var $obj = $(this);
				$obj.removeClass('rotate');
				clearTimeout(rotateTimer);
			}).on('click', 'a.image-wrap', function() {
				var $obj = $(this),
					refineOptionsArr = [];
				$obj.removeClass('rotate');
				clearTimeout(rotateTimer);
				$.cookie('positionTop', $('body').scrollTop());
				if ($('#collectionPage').length) {
					$('.refine-item-list').each(function() {
						if ($(this).children('input').is(':checked')) {
							refineOptionsArr.push($(this).children('input').attr('id'));
						};
					});
					$.cookie('refineOptions', JSON.stringify(refineOptionsArr));
				};
			});

			$(document).on('click', '.add_to_cart', function(e) {
				validateForm();
				if (validated) {
					if (!$('.oldie').length) {
						var quantity = 1,
		 		  			variantId = getVariantId(),
		 		  			loader = '<li class="loader"></li>';
		 
		 		  		if (!$('#cart ul li[data-id="' + variantId + '"]').length) {
		 			  		$('#cart ul li:first-child').after(loader);
		 			  	} else {
		 			  		$('#cart ul li[data-id="' + variantId + '"]').addClass('loader');
		 			  	};

		 		    	$('#cart').mmenu().trigger("open").on("opened.mm", function() {
		 		    		$('#cart').addClass('auto-open');
		 			    	Shopify.addItem(variantId, quantity, updateCartUI);
		 			    });
		 			    e.preventDefault();
		 		    };
				} else {
					e.preventDefault();
				};
 		  	});

		  	$(document).one('click', 'a.image-wrap', function() {
		  		var queryExists = getQueryVariable('color'),
		  			$obj = $(this),
		  			colorObj = $obj.find('img:visible').attr('alt').toLowerCase(),
		  			color = colorObj.replace(/ /g,'-');
		  		if (queryExists == false) {
			  		$obj.attr('href', $obj.attr('href') + '?color=' + color);
			  	};
		  	});

		  	$(document).on('click', '.cart_item a', function() {
		  		var $obj = $(this),
		  			colorObj = $obj.find('img').attr('data-color');
	  			if (colorObj != null) {
	  				var colorQuery = colorObj.toLowerCase(),
	  					color = colorQuery.replace(/ /g,'-');
	  				$obj.attr('href', $obj.attr('href') + '?color=' + color);
	  			};
		  	});

		  	$(document).on('click', '.mm-menu a.close', function(e) {
		  		$('#cart').mmenu().trigger("close");
		  		e.preventDefault();
		  	});

		  	$(document).on('mouseover', '#cart', function() {
		  		if ($(this).hasClass('auto-open')) {
		  			$(this).removeClass('auto-open');
		  		};
		  	});

		  	$(document).on('change', '.single-option-selector:not(".single-option-selector:eq(0)")', function() {
		  		if ($(this).val() != 'default' && $(this).siblings('.v-error').length) {
		  			$(this).siblings('.v-error').remove();
		  			$(this).removeClass('v-error');
		  		};
		  	});

		},

		rotateTimer = function($obj, nextImage) {
			setTimeout(function() {
				if ($obj.hasClass('rotate')) {
					$obj.find('img:visible').hide();
					if (!nextImage.length) {
						nextImage = $obj.find('img:first-child');
					};
					nextImage.show();
				};
			}, 1000);
		},

		validateForm = function() {
			var selectorsVisible = $('.single-option-selector:not(".single-option-selector:eq(0)")').length,
				validOptions = [];
			$('.single-option-selector:not(".single-option-selector:eq(0)")').each(function() {
				if ($(this).val() == 'default') {
					if (!$(this).siblings('.v-error').length) {
						$(this).after('<div class="v-error"> Please ' + $(this).children('option:selected').text().toLowerCase() + '</div>');
						$(this).addClass('v-error');
					};
				} else {
					var found = $.inArray(validOptions, $(this));
					if (found < 0) {
						validOptions.push($(this));
					};	
				};
			});
			if (validOptions.length == selectorsVisible) {
				validated = true;
			} else {
				validated = false;
			};
		},

		getQueryVariable = function(variable) { 
	       var query = window.location.search.substring(1);
	       var vars = query.split("&");
	       for (var i=0;i<vars.length;i++) {
	    	   var pair = vars[i].split("=");
	           if(pair[0] == variable){return pair[1];}
	       }
	       return(false);
		},

		hasTouch = function() {
			if (Modernizr.touch) {
			    return true;
			} else {
			    return false
			};
		},

		updateCartUI = function(line_item) {

			var params = {
			    type: 'GET',
			    url: '/cart/cart.js',
			    dataType: 'json',
			    success: function(cart) { 
			        updateCartCountAndSubTotal(cart);
			    },
			    error: function(XMLHttpRequest, textStatus) {
			        Shopify.onError(XMLHttpRequest, textStatus);
			    }
			};

			var variantImage = $('.flex-active-slide').find('img').attr('src');

			$.ajax(params);

			if ($('#cart ul li[data-id="' + line_item.id + '"]').length) {

				$('#cart ul li[data-id="' + line_item.id + '"]').find('.item-details').children('strong').html(line_item.quantity + ' x');
				$('#cart ul li[data-id="' + line_item.id + '"]').find('.item-price').children('strong').html(Shopify.formatMoney(line_item.line_price, $('form.product_form', $product).data('money-format')));
				$('#cart ul li[data-id="' + line_item.id + '"]').removeClass('loader');

			} else {

				$('#cart ul li.loader').attr('data-id', line_item.id);

		  		var cartItem = '';
		  		cartItem = '<a href="' + line_item.url + '">' +
	        				   '<div class="cart_image"><img src="' + variantImage + '" alt="' + line_item.title + '"></div>' +
	        				   '<div class="item-details"><strong>' + line_item.quantity + ' x</strong> ' + line_item.title + '</div>' +
	        				   '<div class="item-price"><strong class="price">' + Shopify.formatMoney(line_item.price, $('form.product_form', $product).data('money-format')) + '</strong></div>' +
	        				   '</a>';

	        	if ($('#cart ul li.mm-label').length) {
	        		$('#cart ul li.mm-label').remove();
		        	$('#cart ul li.cart-hidden').each(function() {
		        		$(this).removeClass('cart-hidden');
		        	});
	        	};
	        	
		    	$('#cart ul li.loader').append(cartItem).addClass('cart_item').removeClass('loader');

			};

		    Currency.convertAll(shopCurrency, cookieCurrency);

	    	$('#cart').mmenu().off("opened.mm");

	    	setTimeout(function() {
	    		if ($('.auto-open').length) {
	    			$('#cart').mmenu().trigger("close");
	    		};
	
	    	}, 3000);

		},

		updateCartCountAndSubTotal = function(cart) {

			if (cart.item_count == 0) { 
	          $('.cart-button').remove('.cart_count'); 
	        } else if (cart.item_count == 1 && !$('.cart_count').length) {
	        	$('.cart-button').append('<div class="cart_count">' + cart.item_count + '</div>');
	        } else {
	          $('.cart_count').html(cart.item_count);
	        };

	        //console.log($product);

	        $('em.subtotal').html(Shopify.formatMoney(cart.total_price, $('form.product_form', $product).data('money-format')));

	        Currency.convertAll(shopCurrency, cookieCurrency);

		},

		getVariantId = function() {

	  		var variantId = null,
	  			colorVariant = $('.selector-wrapper:eq(0)').children('.single-option-selector').find(':selected').text(),
	  			singleColorVariant = $('.select select[name="id"]').find(':selected').text(),
		  		sizeVariant = $('.selector-wrapper:eq(1)').children('.single-option-selector').find(':selected').text(),
		  		lengthVariant = $('.selector-wrapper:eq(2)').children('.single-option-selector').find(':selected').text();
	  			
	  		//console.log(singleColorVariant);
	  		$('.select > select').children('option').each(function() {
	  			//console.log(singleColorVariant + ' - ' + $(this).text());
	  			if ($(this).text() == singleColorVariant || $(this).text() == colorVariant + ' / ' + sizeVariant || $(this).text() == colorVariant + ' / ' + sizeVariant + ' / ' + lengthVariant) {
	  				variantId = $(this).val();
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
		init : init
	};

})(document, jQuery);
