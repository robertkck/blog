'use strict';
(function () {

    angular.module('app.components').constant("SIZES", {
        "WIDE_SCREEN": "wide_screen",
        "PORTRAIT": "portrait"
    });

    function anotherGallery($rootScope, $window, $timeout, SIZES) {
        return {
            restrict: 'A',
            replace: false,
            template: '<img src="{{imageUrl}}" ca-gallery-image />',
            link: function(scope, element, attrs) {
                function imageZoomHandler(event, data) {
                    $timeout(function() {
                        scope.imageUrl = data.src;
                        element.css('top', '0');


                    });
                }

                $rootScope.$on('ZOOM_IMAGE', imageZoomHandler);
            }
        }
    }

    angular.module('app.components').directive('anotherGallery', anotherGallery);

})();
