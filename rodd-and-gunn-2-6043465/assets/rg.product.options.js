var Shopify = Shopify || {};

Shopify.optionsMap = {};

Shopify.updateOptionsInSelector = function(selectorIndex) {
    
  switch (selectorIndex) {
    case 0:
      var key = 'root';
      var selector = jQuery('.single-option-selector:eq(0)');
      break;
    case 1:
      var key = jQuery('.single-option-selector:eq(0)').val();
      var selector = jQuery('.single-option-selector:eq(1)');
      break;
    case 2:
      var key = jQuery('.single-option-selector:eq(0)').val(); 
      var selector = jQuery('.single-option-selector:eq(2)');
      if (jQuery('.single-option-selector:eq(1)').val() != 'default') {
        if (jQuery('.single-option-selector:eq(1)').val() == null) { 
            key += ' / ' + jQuery('.single-option-selector:eq(1) option.available:first').val();
            jQuery('.single-option-selector:eq(1) option.available:first').prop('selected', true).trigger('change');
        } else {
            key += ' / ' + jQuery('.single-option-selector:eq(1)').val(); 
        }; 
      } else {
          key += ' / ' + jQuery('.single-option-selector:eq(1) option.available:first').val();
      };         
  };
  
  selector.attr('data-position', selectorIndex);
  if (!selector.is('[name]')) {
    selector.attr('name', selector.siblings('label').text().replace(/ /g,'').toLowerCase() + 'Select');
  };
  selector.children('option').removeClass('available');
  selector.children('option').prop('disabled', false);

  var initialValue = selector.val(); 
  var availableOptions = Shopify.optionsMap[key];

  if (selectorIndex == 1 || selectorIndex == 2) {
    if (!selector.find('option[value="default"]').length) {
      selector.prepend('<option selected value="default">Select a ' + selector.siblings('label').text().toLowerCase() + '</option>');
    };
  };

  for (var i=0; i<availableOptions.length; i++) {
    var option = availableOptions[i];
    if (selector.find('option[value="' + option + '"]').length) {
      selector.find('option[value="' + option + '"]').addClass('available');
    };
  };

  $('.single-option-selector:eq(' + selectorIndex + ') option').each(function() {
    if (!$(this).hasClass('available') && $(this).val() != 'default') {
      $(this).prop('disabled', true);
    };
    if (!$(this).hasClass('available') && $(this).is(':selected') && $(this).val() != 'default') {
      $(this).prop('selected', false);
    };
    if ($(this).is(':disabled') && $(this).val() != 'default') {
      var str = $(this).text();
      if (str.indexOf('- Out of stock') < 0) {
        $(this).html($(this).text() + ' - Out of stock');
      };
    } else if (!$(this).is(':disabled') && $(this).val() != 'default') {
      $(this).html($(this).val());
    };
  });
  
  selector.trigger('change');  
  
};

Shopify.linkOptionSelectors = function(product) {
  // Building our mapping object.
  for (var i=0; i<product.variants.length; i++) {
    var variant = product.variants[i];
    if (variant.available) {
      // Gathering values for the 1st drop-down.
      Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
      Shopify.optionsMap['root'].push(variant.option1);
      Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
      // Gathering values for the 2nd drop-down.
      if (product.options.length > 1) {
        var key = variant.option1;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option2);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
      // Gathering values for the 3rd drop-down.
      if (product.options.length === 3) {
        var key = variant.option1 + ' / ' + variant.option2;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option3);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
    }
  }
  // Update options right away.
  Shopify.updateOptionsInSelector(0);
  if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
  if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
  // When there is an update in the first dropdown.
  jQuery(".single-option-selector:eq(0)").change(function() {
    Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    return true;
  });
  // When there is an update in the second dropdown.
  jQuery(".single-option-selector:eq(1)").change(function() {
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    return true;
  });
  
};