/*jslint devel: true, sloppy: true, maxerr: 50, indent: 4 */

var RG = RG || {};

RG.collectionPage = (function(doc, $, undefined) {
	
	"use strict";

	var

	$container = null,
	refineOptions1 = [],
	refineOptions2 = [],
	refineOptions3 = [],
	refineOptions4 = [],
	refineOptions5 = [],
	refineOptions6 = [],

	
	init = function() {
		$container = $('#collectionPage');
		if ($container.length) {
			events();
			colorSwatches();
		};
	},
	events = function() {

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
			var $obj = $(this),
				listID = $obj.parents('.refine-list'),
				listIndex = $obj.parents('.refine-list').index(),
				removeID = false;
			if (!$obj.is(':checked')) {
				removeID = true;
			};
			filterCollection($obj, removeID, listIndex);
		});

		$(document).on('click', '.refinebar ul li a', function(e) {
			var $obj = $(this);
			$obj.siblings('input').trigger('click');
			e.preventDefault();
		});

		$(document).on(RG.info.action, '.refinebar h4', function() {
		    if (RG.info.mobile) { 
		        var $obj= $(this);
		        if($obj.siblings('.refine-list').is(':visible')) {
		        	$obj.siblings('.refine-list').hide();
		        	$obj.children('span').html('+');
		        } else {
		        	$obj.siblings('.refine-list').show();
		        	$obj.children('span').html('-');
		        };
		    };
		});

		$(document).on('click', '.filter-helper a', function(e) {
			var $obj = $(this);
			e.preventDefault();
			$.scrollTo('#productList');
			$obj.parent().remove();
		});

	},
	filterCollection = function($obj, removeID, listIndex) {

		$('.filter-helper').remove();

		$('a.image-wrap').each(function() {
			$(this).attr('data-show-item', '0');
			$(this).parent().removeClass('true').removeClass('false');
		});

		var refineOption = $obj.attr('id').replace(/\s+/g, '');

		if (listIndex == 1) {
			if (removeID) {
				refineOptions1 = $.grep(refineOptions1, function(value) {
				  return value != refineOption;
				});
			} else {
				var found = $.inArray(refineOptions1, refineOption);
				if (found >= 0) {
					refineOptions1.splice(found, 1);
				} else {
					refineOptions1.push(refineOption);
				};
			};
		};

		if (listIndex == 2) {
			if (removeID) {
				refineOptions2 = $.grep(refineOptions2, function(value) {
				  return value != refineOption;
				});
			} else {
				var found = $.inArray(refineOptions2, refineOption);
				if (found >= 0) {
					refineOptions2.splice(found, 1);
				} else {
					refineOptions2.push(refineOption);
				};
			};
		};

		if (listIndex == 3) {
			if (removeID) {
				refineOptions3 = $.grep(refineOptions3, function(value) {
				  return value != refineOption;
				});
			} else {
				var found = $.inArray(refineOptions3, refineOption);
				if (found >= 0) {
					refineOptions3.splice(found, 1);
				} else {
					refineOptions3.push(refineOption);
				};
			};
		};

		if (refineOptions1.length > 0) {
			$('.thumbnail').each(function() {
				for (var i = 0; i < refineOptions1.length; i++) {
					if ($(this).children("a.image-wrap[data-option-1*='" + refineOptions1[i] + "']").length > 0) {	
						if ($(this).hasClass('false')) {
							$(this).removeClass('false').addClass('true');
						} else {
							$(this).addClass('true');
						};
					} else {
						if (!$(this).hasClass('true')) {
							$(this).addClass('false');
						};
						
					};
				};
			});
		};

		if (refineOptions2.length > 0) {
			$('.thumbnail').each(function() {
				for (var i = 0; i < refineOptions2.length; i++) {
					if ($(this).children("a.image-wrap[data-option-2*='" + refineOptions2[i] + "']").length > 0) {	
						$(this).addClass('true');
					} else {
						$(this).addClass('false');
					};
				};
			});
		};

		if (refineOptions3.length > 0) {
			$('.thumbnail').each(function() {
				for (var i = 0; i < refineOptions3.length; i++) {
					if ($(this).children("a.image-wrap[data-option-3*='" + refineOptions3[i] + "']").length > 0) {	
						$(this).addClass('true');
					} else {
						$(this).addClass('false');
					};
				};
			});
		};

		$('.thumbnail').each(function() {
			if ($(this).hasClass('true') && !$(this).hasClass('false') || !$(this).hasClass('true') && !$(this).hasClass('false')) {
				$(this).children('a.image-wrap').attr('data-show-item', '1');
			};
		});

		$('.thumbnail').each(function() {
			$(this).removeClass('omega');
			$(this).removeClass('alpha');
			$('br.clear').remove();
		});

		$("a.image-wrap[data-show-item='0']").parent().hide();
		$("a.image-wrap[data-show-item='1']").parent().show();

		if (RG.info.mobile) {
			filterHelper($obj);
		};

		// TODO: This is broken, needs to be fixed
		if ($('.true').length > 4) {
			$('.true:first-child').addClass('alpha');
			$('.product-listing div.thumbnail:visible').each(function (i) {
			    if ((i + 1) % 4 == 0) $(this).addClass('omega');
			    if ((i + 1) % 5 == 0) $(this).addClass('alpha');
			});
		} else {
			$('.thumbnail:visible:first-child').addClass('alpha');
			$('.thumbnail:visible:nth-child(3n)').addClass('omega');
			$('.thumbnail:visible:nth-child(4n)').addClass('alpha');
		};

	},
	filterHelper = function($obj) {
		var resultsTotal = $('.thumbnail:visible').length;
		$('.refinebar').append('<div class="filter-helper"><a href="#">View ' + resultsTotal + ' results</a></div>');
		$('.filter-helper').css({ top: $obj.position().top + 'px' });
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
			};
		}, 1000);
	}

	return {
		init : init
	}

})(document, jQuery);