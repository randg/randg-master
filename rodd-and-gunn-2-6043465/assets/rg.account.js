/*jslint devel: true, sloppy: true, maxerr: 50, indent: 4 */

var RG = RG || {};

RG.accountPage = (function(doc, $, undefined) {
	
	"use strict";

	var

	$container = null,
	
	init = function() {
		$container = $('#accountSummary');
		if ($container.length) {
			events();
		};
	},
	events = function() {

		$(document).on('click', '.account-navigation a.button', function(e) {
			var $obj = $(this),
				content = $obj.attr('class').split(' ')[1];
			$('.section .sixteen').each(function() {
				if ($(this).hasClass(content)) {
					$(this).show();
				} else {
					$(this).hide();
				};
			});
			e.preventDefault();
		});

	}

	return {
		init : init
	}

})(document, jQuery);