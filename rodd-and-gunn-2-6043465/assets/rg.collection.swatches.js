/*jslint devel: true, sloppy: true, maxerr: 50, indent: 4 */

var RG = RG || {};

RG.collectionPage = (function(doc, $, undefined) {
	
	"use strict";

	var

	$container = null,
	refineOptions = [],
	
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

		$(document).on('click', '.refinebar ul li input', function() {
			var $obj = $(this);
			filterCollection($obj);
		});

	},
	filterCollection = function($obj) {

		$('a.image-wrap').each(function() {
			$(this).attr('data-show-item', '0');
		});

		var refineOption = $obj.attr('id').replace(/\s+/g, ''),
			found = $.inArray(refineOption, refineOptions);

		if (found >= 0) {
			refineOptions.splice(found, 1);
		} else {
			refineOptions.push(refineOption);
		};

		if (refineOptions.length == 0) {
			$('.thumbnail').each(function() {
				$(this).children("a.image-wrap").attr("data-show-item", "1");
			});
		} else {
			for (var i = 0; i < refineOptions.length; i++) {
				$('.thumbnail').each(function() {
					$(this).children("a.image-wrap[data-option-one*='" + refineOptions[i] + "']").attr("data-show-item", "1");
				});
			};
		};

		$('.thumbnail').each(function() {
			$(this).removeClass('omega');
			$(this).removeClass('alpha');
			$('br.clear').remove();
		});

		$("a.image-wrap[data-show-item='0']").parent().hide();
		$("a.image-wrap[data-show-item='1']").parent().show();

		if ($('.thumbnail:visible').length > 4) {
			console.log('1');
			$('.thumbnail:visible:first').addClass('alpha');
			$('.thumbnail:visible:nth-child(4n)').addClass('omega');
			$('.thumbnail:visible:nth-child(5n)').addClass('alpha');
		} else {
			console.log('2');
			$('.thumbnail:visible:first').addClass('alpha');
			$('.thumbnail:visible:nth-child(4n)').addClass('omega');
		};

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