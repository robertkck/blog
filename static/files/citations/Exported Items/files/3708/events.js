'use strict';
(function () {

    /*
        inject search controller
        --------------------------------------------------------
    */
    function EventCtrl($scope, $log, $http, calendarService, $window, $timeout) {

        var firstTime = true,
        allEventsHasPassed,
        eventTypes = [];

        $scope.dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        $scope.dayNames = [],
        $scope.showloader,
        $scope.events,
        $scope.notFound = false,
        $scope.singleDate = false,
        $scope.projectstatus = 0,
        $scope.authors = '',
        $scope.hasInput = false,
        $scope.searchFilters = [],
        $scope.searchAuthors = [],
        $scope.searchTopcis = [],
        $scope.calendarState = true;

        function hideLoader(){
            $scope.showloader = false;
        }

        function showLoader(){
            $scope.showloader = true;
        }

        /*
            fetch new data based on dates
            --------------------------------------------------------
        */
        $scope.updateCalendar = function(year,month,autosearch){
            firstTime = false;
            showLoader();
            var params = {
                year : year,
                month : month,
                category : JSON.stringify($scope.searchTopcis),
                "author[]" : $scope.searchAuthors,
                autosearch : autosearch
            }
            calendarService.getCalendar(function(response){
                setData(response);
            },params);
        }

        /*
            init - get current month
            --------------------------------------------------------
        */
        $scope.init = function () {
            calendarService.init(function(response){
                setData(response);   
            });
        };

        /*
            Response from backend goes here
            --------------------------------------------------------
        */
        function setData(response){
            
            //$scope.showSingleDate('', 0);
            $scope.notFound = false;

            $scope.events = response.data.posts.data;
            if( response.data.posts.data < 1 ) $scope.notFound = true;

            

            $scope.dates = response.data.dates;

            //the first day of the month, shift array dependent on current day(wednesday = 2)
            var index = $scope.dayLabels.indexOf(response.data.dates.firstDayInMonth);
            for (var i = index - 1; i >= 0; i--) {
                $scope.dayLabels.push( $scope.dayLabels.shift() );
            };

            var j = 0;
            for (var k = 0; k <= response.data.dates.daysInMonth; k++) {
                //$log.debug($scope.dayLabels[0], ' i =' , k);
                $scope.dayNames[k] = $scope.dayLabels[j] || response.data.dates.firstDayInMonth;
                
                if(j > 6) j = 0;
                j++;
            };
            hideLoader();

            //search for upcoming event until found
            if( response.data.posts.events.types.only_past_events && firstTime || response.data.posts.events.retry === 1 ) $scope.updateCalendar($scope.dates.nextYear,$scope.dates.nextMonth, true);

            $log.debug('$scope.dates.inthepast = ', $scope.dates.inthepast);
            //check if we're display past date, if so show past events by default
            if($scope.dates.inthepast) showAllEvents();

            /*
                If we're on current month and all events has passed, make exception and show them all
                ------------------------------------------------------------------------------
            */
            allEventsHasPassed = false;
            for (var i = response.data.posts.data.length - 1; i >= 0; i--) {
                eventTypes[i] = response.data.posts.data[i].event_type;
            };

            var allEventTypesAreSame = eventTypes.allValuesSame(); //true
            
            if(allEventTypesAreSame){
                if(eventTypes[0] === 'past-event' && !$scope.dates.inthepast ) showAllEvents();
            }
        }

        /*
            mark date in calendar if event exists on that day
            --------------------------------------------------------
        */
        $scope.dateHasEvent = function(date){
            if($scope.notFound || $scope.events === undefined) return false;


            var dateExists = '';
            for (var i = $scope.events.length - 1; i >= 0; i--) {
                if( $scope.events[i].startday == date ) dateExists = 'has-event';
            };

            return dateExists;
        }

        /*
            show a single date
            --------------------------------------------------------
        */
        $scope.showSingleDate = function(event,date){
            angular.forEach(angular.element(".Calendar-dates span"), function(value, key){
                var span = angular.element(value);
                span.removeClass('is-active');
            });
            $(event.target).addClass('is-active');

            showAllEvents();

            $scope.projectstatus = date;

            if(date > 0)
                $scope.singleDate = true;
            else
                $scope.singleDate = false;
        }

        $scope.daysInMonth = function(num) {
            return new Array(num);
        }

        function showAllEvents(){
            $timeout(function(){
                $scope.$apply(function(){
                    angular.forEach(angular.element(".mdl.event"), function(value, key){
                        var span = angular.element(value);
                        span.removeClass('past-event');
                    });
                })
            })
        }

        /*
            filer by author name
            --------------------------------------------------------
        */
        $scope.$watch('authors', function(newValue, oldValue) {

            if(newValue != oldValue){
                if( newValue.length > 2){
                    filterAuthors(newValue);
                    $scope.hasInput = true;
                }
                else{
                    filterAuthors('');
                    $scope.hasInput = false;
                }
            }
            else{
                
            }
        });

        /*
            filer by author name
            --------------------------------------------------------
        */
        function filterAuthors(value) {
            var search_for = value.toLowerCase();
            jQuery('.Filter-authors').find("li").each(function() {
                if (jQuery(this).text().toLowerCase().indexOf(search_for) > -1) {
                    jQuery(this).css({"display": ""});
                }
                else {
                    jQuery(this).css({"display": "none"});
                }
            });
        }

        /*
            when adding filters
            --------------------------------------------------------
        */
        $scope.applyFilters = function(event,value,what){
            event.preventDefault();

            var filter = value;
            var base = WP_THEME_URL;
            
            if(what === 'author'){
                filter = event.target.attributes.data.value;
                var filterStripped = filter.replace(/-/g, " ");
                var authorExistsInArray = contains.call($scope.searchAuthors, filter);
                /*
                    push author in to it's own array so we can query by authors
                    --------------------------------------------------------
                */
                if(!authorExistsInArray)
                    $scope.searchAuthors.push(filter);
            }
            else{
                var filterStripped = filter.replace(/-/g, " ");
                var topicExistsInArray = contains.call($scope.searchTopcis, filter);
                /*
                    push topics in to it's own array so we can query by slug
                    --------------------------------------------------------
                */
                if(!topicExistsInArray)
                    $scope.searchTopcis.push(filter);
            }

            /*
                this is just for frontend
                --------------------------------------------------------
            */
            var existsInArray = contains.call($scope.searchFilters, filterStripped);
            if(!existsInArray){ 
                $scope.searchFilters.push(filterStripped);

                $scope.updateCalendar($scope.dates.year,$scope.dates.month, false);
            }


        }

        /*
            when removing filters
            --------------------------------------------------------
        */
        $scope.removeFilters = function(filter){
            var index = $scope.searchFilters.indexOf(filter);
            if (index >= 0) {
                $scope.searchFilters.splice( index, 1 );
            }
            //remove whitespace so we can remove if from params query
            var filterStripped = filter.replace(/\s+/g, '-').toLowerCase();
            
            var author = $scope.searchAuthors.indexOf(filterStripped);
            if (author >= 0) {
                $scope.searchAuthors.splice( author, 1 );
            }

            var topic = $scope.searchTopcis.indexOf(filterStripped);
            if (topic >= 0) {
                $scope.searchTopcis.splice( topic, 1 );
            }

            //update the view
            $scope.updateCalendar($scope.dates.year,$scope.dates.month, false);

        }

        /*
            check if exists in array
            --------------------------------------------------------
        */
        var contains = function(needle) {
            // Per spec, the way to identify NaN is that it is not equal to itself
            var findNaN = needle !== needle;
            var indexOf;

            if(!findNaN && typeof Array.prototype.indexOf === 'function') {
                indexOf = Array.prototype.indexOf;
            } else {
                indexOf = function(needle) {
                    var i = -1, index = -1;

                    for(i = 0; i < this.length; i++) {
                        var item = this[i];

                        if((findNaN && item !== item) || item === needle) {
                            index = i;
                            break;
                        }
                    }

                    return index;
                };
            }

            return indexOf.call(this, needle) > -1;
        };

        $scope.showMore = function(event){
            
            var element = event.currentTarget;

            if ($(element).parent().hasClass("open")) {
                $(element).parent().css({"width": "", "left": ""}) // Close
                $(element).parent().removeClass("open");
            }
            else { 
                $(".mdl").css({"width": "", "left": ""}) // Open
                $(".mdl").removeClass("open");
                if ($(window).width() > 1250) {
                    $(element).parent().css({"width": $(window).width() - 200});
                }
                else {
                    $(element).parent().css({"left": "-200px"});
                }
                $(element).parent().addClass("open");
                $(element).parent().prev().height($(element).parent().outerHeight() - 40);
            }
            event.preventDefault();
            event.stopPropagation();
        }

        Array.prototype.allValuesSame = function() {

            for(var i = 1; i < this.length; i++)
            {
                if(this[i] !== this[0])
                    return false;
            }

            return true;
        }

        $scope.getIcal = function(id,event){
            event.preventDefault();
            $window.open(WP_THEME_URL+'/?ical_download='+id);
        }

        /*
            init
            --------------------------------------------------------
        */
        showLoader();
        $scope.init();
    };

    /*
        filer for replacing &amp; with &
        --------------------------------------------------------
    */
    angular.module('app.components').filter('ampersand', function(){
        return function(input){
            return input ? input.replace(/&amp;/, '&') : '';
        }
    });
    angular.module('app.components').directive('aPreventDefault', function($log) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
       };
    });
    angular.module('app.components').controller('EventCtrl', EventCtrl);
})();