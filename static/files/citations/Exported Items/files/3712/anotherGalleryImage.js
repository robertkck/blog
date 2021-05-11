'use strict';
(function () {
    function anotherGalleryImage($timeout, $window, SIZES) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                attrs.$observe('src', onAttributeSrcSet);

                function onAttributeSrcSet() {
                    if (!__.isUndefined(attrs.src)) {
                        $timeout(function() {
                            resizeImage();
                        });
                    }
                }

                function resizeImage() {
                    var viewportOrientation = getViewportOrientation();
                    var imageOrientation = getImageOrientation();

                    var imageWidth;
                    var imageHeight;
                    var ratioWidth = element[0].clientWidth / element[0].clientHeight;
                    var ratioHeight = element[0].clientHeight / element[0].clientWidth;

                    if ((viewportOrientation === SIZES.PORTRAIT && imageOrientation === SIZES.PORTRAIT) ||
                        (viewportOrientation === SIZES.WIDE_SCREEN && imageOrientation === SIZES.PORTRAIT)) {


                        imageWidth = $window.innerHeight * ratioWidth
                        imageHeight = $window.innerHeight;


                    }
                    else if ((viewportOrientation === SIZES.PORTRAIT && imageOrientation === SIZES.WIDE_SCREEN) ||
                        (viewportOrientation === SIZES.WIDE_SCREEN && imageOrientation === SIZES.WIDE_SCREEN)) {
                        imageWidth = $window.innerWidth;
                        imageHeight = $window.innerHeight * ratioHeight;
                    }


                    var x = $window.innerWidth * .5 - imageWidth * .5;
                    var y = $window.innerHeight * .5 - imageHeight * .5;

                    element.css('width', imageWidth + 'px');
                    element.css('height', imageHeight + 'px');
                    element.css('left', x + 'px');
                    element.css('top', y + 'px');




                    // Om porträtt och bild widescreen = bredden

                    // Om widecreen och bild widescreen = bredden









                }

                function getViewportOrientation() {
                    return $window.innerWidth / $window.innerHeight > 1 ? SIZES.WIDE_SCREEN : SIZES.PORTRAIT;
                }

                function getImageOrientation() {
                    return element[0].naturalWidth / element[0].naturalHeight  > 1 ? SIZES.WIDE_SCREEN : SIZES.PORTRAIT;
                }


            }
        };
    }

        angular.module('app.components').directive('anotherGalleryImage', anotherGalleryImage);
})();


