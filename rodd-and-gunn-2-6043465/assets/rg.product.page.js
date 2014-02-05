/*jslint devel: true, sloppy: true, maxerr: 50, indent: 4 */

var RG = RG || {};

RG.productPage = (function(doc, $, undefined) {
	
	"use strict";

	var

	$container = null,
	userSelectedColor = null,
	
	init = function() {
		$container = $('#productPage');
		if ($container.length) {
			events();
			preSelectColorVariation();
			buildImageGallery();
		};
	},
	events = function() {
		$(document).on('mouseover', '.selector-wrapper:first-child .single-option-selector', function() {
			$(this).addClass('user-initiated');
		});
		$(document).on('mouseover', '.selector-wrapper:eq(1) .single-option-selector', function() {
			$(this).addClass('user-initiated-faux');
		});
		$(document).on('click', 'a.next-prev', function() {
			var $obj = $(this);
	  		$obj.attr('href', $obj.attr('href') + '?color=default');
		});
		$('.flex-control-thumbs img').click(function(e) { 
		    var optionValue = $(this).attr('alt');
		    var $selector = $('select.single-option-selector:contains(' + optionValue + ')');
		    if ($selector.length && $selector.val() != optionValue) {
		    	$selector.val(optionValue).trigger('change');
		    }
		});
		if ($(window).width() >= 768) {
		    $(".size-chart-overlay").fancybox({
		        padding: 0,
		        beforeShow: function(e) {
		        	//console.log($(this.element).data('type'));
		        	$('#inlineChart').addClass($(this.element).data('type'));
		        }
		    });
		};
	},
	preSelectColorVariation = function() {
		var colorQuery = getQueryVariable('color');
		if (colorQuery != false) {
			userSelectedColor = colorQuery.replace(/-/g,' ');
		};
		if (colorQuery == 'default' || colorQuery == false) {
			var firstOption = $('.single-option-selector option:eq(0)').val();
			userSelectedColor =  firstOption.replace(/-/g,' ');
		};
		$('.single-option-selector option').filter(function() { 
		    return ($(this).val() == capitaliseFirstLetters(userSelectedColor));
		}).prop('selected', true).trigger('change');
	},
	buildImageGallery = function() {

		$('ul.slides').html('');
		$('ol.flex-control-thumbs').remove();
		$('.flex-direction-nav').remove();

		if (userSelectedColor == 'default') {
			var selectedColor = $('.single-option-selector:eq(0) option:selected').val();
			userSelectedColor = selectedColor.replace(/-/g,' ');
		};

		$('ul.all-images li').each(function() {
			if ($(this).attr('data-title') == capitaliseFirstLetters(userSelectedColor)) {
				$(this).clone().appendTo('ul.slides');
			};
		});

		$("img", '.product_slider').unveil();
		$('.flexslider').flexslider({
		    touch: false,
		    pauseOnHover: true,
		    controlNav: 'thumbnails',
		    directionNav: true,
		    slideshow: false,
		    animation: 'slide',
		    start: function(slider) {
		      if (!$('.flex-control-thumbs').children().length) {
		      	$('.flex-direction-nav').hide();
		      };
		      $('.flexslider').css({ height: 'auto' });
		      $('.loader').remove();
		    }
		});

	},
	// Check if their is a query on page load.
	getQueryVariable = function(variable) { 
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
    	   var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
       }
       return(false);
	},
	capitaliseFirstLetters = function(obj) {
	    var mystring = obj;
	    var sp = mystring.split(' ');
	    var wl=0;
	    var f ,r;
	    var word = new Array();
	    for (var i = 0 ; i < sp.length ; i ++ ) {
	        f = sp[i].substring(0,1).toUpperCase();
	        r = sp[i].substring(1).toLowerCase();
	        word[i] = f+r;
	    }
	    var newstring = word.join(' ');
	    obj = newstring;
	    return obj;   
	},
	selectCallback = function(variant, selector) {

		//console.log(variant);

	    var $product = $('#product-' + selector.product.id);
	    var $notify_form = $('#notify-form-' + selector.product.id);

	    if (variant || variant == null) {
	    
	      var $thumbs = $('.all-images li');

	      if (variant == null) {
	      	var optionValue = 'default';
	      } else {
	      	var optionValue = variant.options[0]; 
	      };

	      $.each($thumbs, function(index, value) { 
	        if($(value).attr('data-title').toLowerCase() == optionValue.toLowerCase() && !$(value).hasClass('flex-active')) {
	        	if ($('.user-initiated').length && $('body[data-select-position="0"]').length) {
		        	userSelectedColor = $(value).attr('data-title');
		        	$('.flexslider').css({ height: $('ul.slides li:first-child').find('img').height() + 'px' }).append('<div class="loader"></div>');
		        	$('.flexslider').flexslider('destroy');    	
		        	buildImageGallery();
		        };
	            return false;
	        };
	      });
	    };

	    if (variant && variant.available == true || variant == null) {

	      	if (variant != null) {

	      	    if(variant.price < variant.compare_at_price){
		        	$('.was_price', $product).html(Shopify.formatMoney(variant.compare_at_price, $('form.product_form', $product).data('money-format')))        
		        } else {
		        	$('.was_price', $product).text('');
		        };

		        $('.sold_out', $product).text('');

		        if (selector.product.price_varies && !$('.user-initiated').length && !$('.user-initiated-faux').length) {
		      		$('.current_price', $product).html('From ' + Shopify.formatMoney(selector.product.price_min, $('form.product_form', $product).data('money-format')) + ' to ' + Shopify.formatMoney(selector.product.price_max, $('form.product_form', $product).data('money-format')));
		        } else {
		      		$('.current_price', $product).html(Shopify.formatMoney(variant.price, $('form.product_form', $product).data('money-format')));
		        };
		      
		        Currency.convertAll(shopCurrency, cookieCurrency);

		        $('.add_to_cart', $product).removeClass('disabled').removeAttr('disabled').val('Add to Cart');

		        $notify_form.hide(); 

	        } else {

	        	$('.sold_out', $product).text('');

	        	if (selector.product.price_varies) {
		      		$('.current_price', $product).html('From ' + Shopify.formatMoney(selector.product.price_min, $('form.product_form', $product).data('money-format')) + ' to ' + Shopify.formatMoney(selector.product.price_max, $('form.product_form', $product).data('money-format')));
		        } else {
		      		$('.current_price', $product).html(Shopify.formatMoney(selector.product.price_min, $('form.product_form', $product).data('money-format')));
		        };

		      	//$('.current_price', $product).html('From ' + Shopify.formatMoney(selector.product.price_min, $('form.product_form', $product).data('money-format')) + ' to ' + Shopify.formatMoney(selector.product.price_max, $('form.product_form', $product).data('money-format')));
		      	



		      	$('.add_to_cart', $product).removeClass('disabled').removeAttr('disabled').val('Add to Cart');
		      	Currency.convertAll(shopCurrency, cookieCurrency);
		      	$notify_form.hide(); 

	        };

	    } else {

	        var message = variant ? "Sold Out" : ""; 

	        $('.was_price', $product).text('')
	        $('.current_price', $product).text('')
	      
	        if (variant) { $('.sold_out', $product).text(message); };

	        $('.add_to_cart', $product).addClass('disabled').attr('disabled', 'disabled').val(message); 

	        if (variant) { $notify_form.show(); };

	    };
	}

	return {
		init : init,
		selectCallback : selectCallback
	}

})(document, jQuery);