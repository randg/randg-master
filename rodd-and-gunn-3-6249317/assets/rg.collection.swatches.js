/*jslint devel: true, sloppy: true, maxerr: 50, indent: 4 */

var RG = RG || {};

RG.collectionPage = (function(doc, $, undefined) {
	
	"use strict";

	var

	$container = null,
	
	init = function() {
		$container = $('#collectionPage');
		if ($container.length) {
			events();
			colorSwatches();
		};
	},
	events = function() {
		$(document).on('mouseover', '.color-swatch li a' ,function() {
			var $obj = $(this),
				dClass = $obj.parent().data('color');
			$obj.parents('ul').siblings('a.image-wrap').children().children('img').each(function() {
				if ($(this).data('color') == dClass) {
					$(this).show();
					$(this).siblings().hide();
					var cleanUrl = $(this).parents('a.image-wrap').attr('href').split('?')[0],
					queryUrl = cleanUrl + '?color=' + dClass;
					$(this).parents('a.image-wrap').attr('href', queryUrl);
				};
			});
		}).on('click', '.color-swatch li a', function(e){
			e.preventDefault();
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
			var $obj = $(this);
			$obj.removeClass('rotate');
			clearTimeout(rotateTimer);
		});
	},
	colorSwatches = function() {

	},
	rotateTimer = function($obj, nextImage) {
		setTimeout(function() {
			if ($obj.hasClass('rotate')) {
				$obj.find('img:visible').hide();
				if (!nextImage.length) {
					nextImage = $obj.find('img:first-child');
				};
				nextImage.show();
				
			var cleanUrl = $obj.attr('href').split('?')[0],
				dClass = $obj.find('img:visible').data('color').replace(/ /g,'-'),
				queryUrl = cleanUrl + '?color=' + dClass;
				$obj.attr('href', queryUrl);

			};
		}, 1000);
	}

	return {
		init : init
	}

})(document, jQuery);