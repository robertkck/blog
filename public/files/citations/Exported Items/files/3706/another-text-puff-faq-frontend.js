'use strict';
(function () {

    function anotherFaqToggle($log) {
        return {
            restrict: 'A',
            link: function($scope, $el, attrs) {
                var $items = $el.find('.Faq-item');
                var velocity = 400;
                $items.find('.Faq-toggle').on('click', function(e) {
                    $(this).next('.Faq-content').slideToggle(velocity);
                    $(this).parent().toggleClass('is-open');
                });
            }
        }
    }

    angular.module('app.components').directive('anotherFaqToggle', anotherFaqToggle);

})();