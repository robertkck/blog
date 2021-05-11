'use strict';
(function () {
	function calendarService ($http, $log) {
	    var urlBase = WP_TEMPLATE_DIR+'/includes/event_calendar.php';

	    this.init = function(callback){
	        $http.get(urlBase+'?init').then(callback);
	    };

	    this.getCalendar = function(callback, params){
	        $http({ url: urlBase, method: "GET", params: params }).then(callback);
	    };
	};

	angular.module('app.components').service('calendarService', calendarService);
	
})();