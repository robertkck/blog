'use strict';

(function(angular) {

    window.__ = _.noConflict(); // Make sure lodash doesn't conflict with underscore used by WP

    angular.module('app', ['app.components', 'app.services', 'ui.tinymce']);
    angular.module('app.components', []);
    angular.module('app.services', []);

    angular.module('app').constant("EVENTS", {
        "COLLAPSE_COMPONENT": "collapse_component",
        "COMPONENT_COLLAPSED": "component_collapsed",
        'COMPONENT_EXPANDED': "component_expanded",
        'DUPLICATE_COMPONENT': "duplicate_component",
        'DELETE_COMPONENT': "delete_component"
    });


})(angular);




