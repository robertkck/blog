'use strict';
(function () {
	function eventToggleMore($log) {
	    return {
	        link: function($scope, $element, attrs) {
	        	var paragraphs = $element.find('p:not(:first), ul'),
	        	button = $element.find('button.Toggle'),
	        	isOpen = false;

	        	$scope.toggleText = function(){
	        		var display = !isOpen ? 'block' : 'none';
	        		var text = !isOpen ? 'Read less' : 'Read more';
	        		var icon = !isOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down';
	        		jQuery.each($(paragraphs), function(index, el) {
	        			$(el).toggleClass('is-open');
	        		});
	        		button.toggleClass('is-open');
	        		button.find('.Toggle-text').text(text);
	        		button.find('.Toggle-icon i').removeClass().addClass(icon);
	        		isOpen = !isOpen;
	        	}
	        }
	    }
	}
angular.module('app.components').directive('eventToggleMore', eventToggleMore);
})();