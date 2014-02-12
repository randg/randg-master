/*jslint devel: true, sloppy: true, maxerr: 50, indent: 4 */

var RG = RG || {};

RG.collectionPage = (function (doc, $, undefined) {
	
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
			filterHistory();
			if (RG.info.mobile) {
				mobileLayout();
			};
		};
	},
	events = function() {

		$(document).on('click', '#colorRefine input, #sizeRefine input, #lengthRefine input', function() {
			var $obj = $(this),
				listID = $obj.parents('.refine-list'),
				listIndex = $obj.parents('.refine-list').index(),
				removeID = false;
			if (!$obj.is(':checked')) {
				removeID = true;
			};
			filterCollection($obj, removeID, listIndex);
		});

		$(document).on('click', '#colorRefine a, #sizeRefine a, #lengthRefine a', function(e) {
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
			$('html, body').animate({ scrollTop: $("#productList").offset().top - 40 + 'px' }, 750, function() {
				if (!$('.filter-helper-back').length) {
					//filterHelperBack();
				};
			});
			$obj.parent().remove();
		});

		$(document).on('click', '.filter-helper-back a', function(e) {
			var $obj = $(this);
			e.preventDefault();
			$('html, body').animate({ scrollTop: $("#refineBar").offset().top - 40 + 'px' }, 750);
			$obj.parent().remove();
		});

	},
	filterHistory = function() {
		var backButton = false;
		$('.refine-list-wrapper input[type="checkbox"]').each(function() {
			if ($(this).is(':checked')) {
				var $obj = $(this),
					listID = $obj.parents('.refine-list'),
					listIndex = $obj.parents('.refine-list').index(),
					removeID = false;
				filterCollection($obj, removeID, listIndex);
				backButton = true;
			};
		});
		if (backButton) {
			var cookieValue = $.cookie('positionTop');
			$('body').css({ scrollTop: cookieValue + 'px' }, 750);
		};
		if ($('.filter-helper a').length) {
			$('.filter-helper a').parent().remove();
		};
	},
	filterCollection = function($obj, removeID, listIndex) {

		$('.filter-helper').remove();

		$('a.image-wrap').each(function() {
			$(this).attr('data-show-item', '0');
			$(this).parent().removeClass('true');
			$(this).parent().removeClass('false');
		});

		$('.thumbnail').each(function() {
			$(this).removeClass('omega');
			$(this).removeClass('alpha');
			$('br.clear').remove();
		});

		var refineOption = {
			a: $obj,
			b: $obj.attr('id').replace(/\s+/g, '')
		};

		if (listIndex == 1) {
			if (removeID) {
				for (var i = 0; i < refineOptions1.length; i++) {
					if (refineOption.b == refineOptions1[i].b) {
						refineOptions1.splice(refineOptions1[i], 1);
					};
				};
			} else {
				var found = jQuery.inArray(refineOptions1, refineOption);
				if (found >= 0) {
					refineOptions1.splice(found, 1);
				} else {
					refineOptions1.push(refineOption);
				};
			};
		};

		if (listIndex == 2) {
			if (removeID) {
				for (var i = 0; i < refineOptions2.length; i++) {
					if (refineOption.b == refineOptions2[i].b) {
						refineOptions2.splice(refineOptions2[i], 1);
					};
				};
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
				for (var i = 0; i < refineOptions3.length; i++) {
					if (refineOption.b == refineOptions3[i].b) {
						refineOptions3.splice(refineOptions3[i], 1);
					};
				};
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
					if ($(this).children("a.image-wrap[data-option-1*='" + refineOptions1[i].b + "']").length > 0) {	
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
					if ($(this).children("a.image-wrap[data-option-2*='" + refineOptions2[i].b + "']").length > 0) {	
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
					if ($(this).children("a.image-wrap[data-option-3*='" + refineOptions3[i].b + "']").length > 0) {	
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

		$("a.image-wrap[data-show-item='0']").parent().hide();
		$("a.image-wrap[data-show-item='1']").parent().show();

		if (RG.info.mobile) {
			filterHelper($obj);
		};

		if ($('.true').length) {
			$('.true:first').addClass('alpha');
			$('.product-listing div.true:not(".false")').each(function (i) {
				if (!$(this).hasClass('false')) {
					if (RG.info.mobile) {
						if ((i + 1) % 2 == 0) {
					    	$(this).addClass('omega');
					    	if (!$(this).next().hasClass('clear')) {
					    		$(this).after('<br class="clear"/>');
					    	};
					    } else {
					    	$(this).addClass('alpha');
					    };
					} else {
						if ((i + 1) % 4 == 0) {
					    	$(this).addClass('omega'); 
					    	$(this).after('<br class="clear"/>');
					    };
					    if ((i + 1) % 5 == 0) {
					    	$(this).addClass('alpha');
					    };
					};
				};
			});
		} else {
			$('.thumbnail:first').addClass('alpha');
			$('.product-listing div.thumbnail').each(function (i) {
				if (RG.info.mobile) {
					if ((i + 1) % 2 == 0) {
				    	$(this).addClass('omega');
				    	if (!$(this).next().hasClass('clear')) {
				    		$(this).after('<br class="clear"/>');
				    	};
				    } else {
				    	$(this).addClass('alpha');
				    };
				} else {
					if ((i + 1) % 4 == 0) {
				    	$(this).addClass('omega'); 
				    	$(this).after('<br class="clear"/>');
				    };
				    if ((i + 1) % 5 == 0) {
				    	$(this).addClass('alpha');
				    };
				};
			});
		};
		

		$("img", '.product-listing').unveil();

	},
	mobileLayout = function() {
		$('.three:first-child').addClass('alpha');
		$('.product-listing div.three').each(function (i) {
			if ((i + 1) % 2 == 0) {
		    	$(this).addClass('omega');
		    	if (!$(this).next().hasClass('clear')) {
		    		$(this).after('<br class="clear"/>');
		    	};
		    } else {
		    	$(this).addClass('alpha');
		    };
		});
	},
	filterHelperBack = function() {
		$('body').append('<div class="filter-helper-back"><a href="#">Back to filter</a></div>');
	},
	filterHelper = function($obj) {
		var resultsTotal = $('.thumbnail:visible').length;
		$('.refinebar').append('<div class="filter-helper"><a href="#">View ' + resultsTotal + ' results</a></div>');
		$('.filter-helper').css({ top: $obj.position().top + 'px' });
	}

	return {
		init : init
	}

})(document, jQuery);