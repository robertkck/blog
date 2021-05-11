'use strict';
(function () {

    function layoutService($window, SIZES) {

        function getElementOffset(element) {
            var top = 0, left = 0;
            do {
                top += element.offsetTop  || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while(element);

            return {
                top: top,
                left: left
            };
        }

        function getViewportOrientation() {
            return $window.innerWidth / $window.innerHeight > 1 ? SIZES.WIDE_SCREEN : SIZES.PORTRAIT;
        }

        function getElementOrientation(element) {
            return element.naturalWidth / element.naturalHeight  > 1 ? SIZES.WIDE_SCREEN : SIZES.PORTRAIT;
        }

        function getScaledImageSize(element) {
            var viewportOrientation = getViewportOrientation();
            var imageOrientation = getElementOrientation(element);

            var imageWidth, imageHeight;
            var ratioWidth = element.clientWidth / element.clientHeight;
            var ratioHeight = element.clientHeight / element.clientWidth;

            if ((viewportOrientation === SIZES.PORTRAIT && imageOrientation === SIZES.PORTRAIT) ||
                (viewportOrientation === SIZES.WIDE_SCREEN && imageOrientation === SIZES.PORTRAIT)) {
                imageWidth = $window.innerHeight * ratioWidth
                imageHeight = $window.innerHeight;
            }
            else if ((viewportOrientation === SIZES.PORTRAIT && imageOrientation === SIZES.WIDE_SCREEN) ||
                (viewportOrientation === SIZES.WIDE_SCREEN && imageOrientation === SIZES.WIDE_SCREEN)) {

                imageWidth = $window.innerWidth;
                imageHeight = imageWidth * ratioHeight;

            }

            return {
                width: imageWidth,
                height: imageHeight
            };
        }

        return {
            getElementOffset: getElementOffset,
            getViewportOrientation: getViewportOrientation,
            getElementOrientation: getElementOrientation,
            getScaledImageSize: getScaledImageSize
        }
    }

    angular.module('app.services').service('layoutService', layoutService);
})();



