/*jslint devel: true, sloppy: true, maxerr: 50, indent: 4 */

var RG = RG || {};

RG.productPage = (function(doc, $, undefined) {
	
	"use strict";

	var

	$container = null,
	
	init = function() {
		$container = $('#productPage');
		if ($container.length) {
			events();
			preSelectColorVariation();
		};
	},
	events = function() {
		
	},
	preSelectColorVariation = function() {
		var colorQuery = getQueryVariable('color'),
		userSelectedColor = colorQuery.replace(/-/g,' ');
		$('.single-option-selector option').filter(function() { 
		    return ($(this).val() == capitaliseFirstLetters(userSelectedColor));
		}).prop('selected', true).trigger('change');
		$('.flex-control-thumbs li img').filter(function() { 
		    return ($(this).attr('alt') == capitaliseFirstLetters(userSelectedColor));
		}).trigger('click');
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

	    var $product = $('#product-' + selector.product.id);
	    var $notify_form = $('#notify-form-' + selector.product.id);

	    if (variant) {
	      var $thumbs = $('.flex-control-thumbs img', $product);
	      var optionValue = variant.options[1];

	      $.each($thumbs, function(index, value) {
	        if($(value).attr('alt').toLowerCase() == optionValue.toLowerCase() && !$(value).hasClass('flex-active')) {
	          $(value).click();
	          return false;
	        };
	      });
	    }

	    if (variant && variant.available == true) {
	      if(variant.price < variant.compare_at_price){
	        $('.was_price', $product).html(Shopify.formatMoney(variant.compare_at_price, $('form.product_form', $product).data('money-format')))        
	      } else {
	        $('.was_price', $product).text('')
	      } 
	      $('.sold_out', $product).text('');
	      $('.current_price', $product).html(Shopify.formatMoney(variant.price, $('form.product_form', $product).data('money-format')));
	      $('.add_to_cart', $product).removeClass('disabled').removeAttr('disabled').val('Add to Cart');
	      $notify_form.hide();

	    } else {
	      var message = variant ? "{{ settings.sold_out_text }}" : "Out of Stock";    
	      $('.was_price', $product).text('')
	      $('.current_price', $product).text('')
	      $('.sold_out', $product).text(message);
	      $('.add_to_cart', $product).addClass('disabled').attr('disabled', 'disabled').val(message); 
	      $notify_form.fadeIn();
	    }
	}

	return {
		init : init,
		selectCallback : selectCallback
	}

})(document, jQuery);