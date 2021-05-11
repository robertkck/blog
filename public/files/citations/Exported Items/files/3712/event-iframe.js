'use strict';
(function () {
	function eventIframe($log) {
	    return {
	        link: function($scope, $element, attrs) {
	        	var iframes = $element.find('iframe');
				jQuery.each($(iframes), function(index, el) {
					$(el).wrapAll('<div class="has-iframe"></div>');
				});
	        }
	    }
	}
	angular.module('app.components').directive('eventIframe', eventIframe);
})();