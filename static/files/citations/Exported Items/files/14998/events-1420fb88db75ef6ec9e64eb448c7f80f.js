'use strict';(function(){function EventCtrl($scope,$log,$http,calendarService,$window,$timeout){var firstTime=!0,allEventsHasPassed,eventTypes=[];$scope.dayLabels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],$scope.dayNames=[],$scope.showloader,$scope.events,$scope.notFound=!1,$scope.singleDate=!1,$scope.projectstatus=0,$scope.authors='',$scope.hasInput=!1,$scope.searchFilters=[],$scope.searchAuthors=[],$scope.searchTopcis=[],$scope.calendarState=!0;function hideLoader(){$scope.showloader=!1}
function showLoader(){$scope.showloader=!0}
$scope.updateCalendar=function(year,month,autosearch){firstTime=!1;showLoader();var params={year:year,month:month,category:JSON.stringify($scope.searchTopcis),"author[]":$scope.searchAuthors,autosearch:autosearch}
calendarService.getCalendar(function(response){setData(response)},params)}
$scope.init=function(){calendarService.init(function(response){setData(response)})};function setData(response){$scope.notFound=!1;$scope.events=response.data.posts.data;if(response.data.posts.data<1)$scope.notFound=!0;$scope.dates=response.data.dates;var index=$scope.dayLabels.indexOf(response.data.dates.firstDayInMonth);for(var i=index-1;i>=0;i--){$scope.dayLabels.push($scope.dayLabels.shift())};var j=0;for(var k=0;k<=response.data.dates.daysInMonth;k++){$scope.dayNames[k]=$scope.dayLabels[j]||response.data.dates.firstDayInMonth;if(j>6)j=0;j++};hideLoader();if(response.data.posts.events.types.only_past_events&&firstTime||response.data.posts.events.retry===1)$scope.updateCalendar($scope.dates.nextYear,$scope.dates.nextMonth,!0);$log.debug('$scope.dates.inthepast = ',$scope.dates.inthepast);if($scope.dates.inthepast)showAllEvents();allEventsHasPassed=!1;for(var i=response.data.posts.data.length-1;i>=0;i--){eventTypes[i]=response.data.posts.data[i].event_type};var allEventTypesAreSame=eventTypes.allValuesSame();if(allEventTypesAreSame){if(eventTypes[0]==='past-event'&&!$scope.dates.inthepast)showAllEvents()}}
$scope.dateHasEvent=function(date){if($scope.notFound||$scope.events===undefined)return!1;var dateExists='';for(var i=$scope.events.length-1;i>=0;i--){if($scope.events[i].startday==date)dateExists='has-event'};return dateExists}
$scope.showSingleDate=function(event,date){angular.forEach(angular.element(".Calendar-dates span"),function(value,key){var span=angular.element(value);span.removeClass('is-active')});$(event.target).addClass('is-active');showAllEvents();$scope.projectstatus=date;if(date>0)
$scope.singleDate=!0;else $scope.singleDate=!1}
$scope.daysInMonth=function(num){return new Array(num)}
function showAllEvents(){$timeout(function(){$scope.$apply(function(){angular.forEach(angular.element(".mdl.event"),function(value,key){var span=angular.element(value);span.removeClass('past-event')})})})}
$scope.$watch('authors',function(newValue,oldValue){if(newValue!=oldValue){if(newValue.length>2){filterAuthors(newValue);$scope.hasInput=!0}else{filterAuthors('');$scope.hasInput=!1}}else{}});function filterAuthors(value){var search_for=value.toLowerCase();jQuery('.Filter-authors').find("li").each(function(){if(jQuery(this).text().toLowerCase().indexOf(search_for)>-1){jQuery(this).css({"display":""})}else{jQuery(this).css({"display":"none"})}})}
$scope.applyFilters=function(event,value,what){event.preventDefault();var filter=value;var base=WP_THEME_URL;if(what==='author'){filter=event.target.href;var filterStripped=filter.replace("http://bruegel.org/author/","").replace(/.$/,"");var authorExistsInArray=contains.call($scope.searchAuthors,filter);if(!authorExistsInArray)
$scope.searchAuthors.push(filter)}else{var filterStripped=filter.replace(/-/g," ");var topicExistsInArray=contains.call($scope.searchTopcis,filter);if(!topicExistsInArray)
$scope.searchTopcis.push(filter)}
var existsInArray=contains.call($scope.searchFilters,filterStripped);if(!existsInArray){$scope.searchFilters.push(filterStripped);$scope.updateCalendar($scope.dates.year,$scope.dates.month,!1)}}
$scope.removeFilters=function(filter){var index=$scope.searchFilters.indexOf(filter);if(index>=0){$scope.searchFilters.splice(index,1)}
var filterStripped=filter.replace(/\s+/g,'-').toLowerCase();var author=$scope.searchAuthors.indexOf(filterStripped);if(author>=0){$scope.searchAuthors.splice(author,1)}
var topic=$scope.searchTopcis.indexOf(filterStripped);if(topic>=0){$scope.searchTopcis.splice(topic,1)}
$scope.updateCalendar($scope.dates.year,$scope.dates.month,!1)}
var contains=function(needle){var findNaN=needle!==needle;var indexOf;if(!findNaN&&typeof Array.prototype.indexOf==='function'){indexOf=Array.prototype.indexOf}else{indexOf=function(needle){var i=-1,index=-1;for(i=0;i<this.length;i++){var item=this[i];if((findNaN&&item!==item)||item===needle){index=i;break}}
return index}}
return indexOf.call(this,needle)>-1};$scope.showMore=function(event){var element=event.currentTarget;if($(element).parent().hasClass("open")){$(element).parent().css({"width":"","left":""})
$(element).parent().removeClass("open")}else{$(".mdl").css({"width":"","left":""})
$(".mdl").removeClass("open");if($(window).width()>1250){$(element).parent().css({"width":$(window).width()-200})}else{$(element).parent().css({"left":"-200px"})}
$(element).parent().addClass("open");$(element).parent().prev().height($(element).parent().outerHeight()-40)}
event.preventDefault();event.stopPropagation()}
Array.prototype.allValuesSame=function(){for(var i=1;i<this.length;i++){if(this[i]!==this[0])
return!1}
return!0}
$scope.getIcal=function(id,event){event.preventDefault();$window.open(WP_THEME_URL+'/?ical_download='+id)}
showLoader();$scope.init()};angular.module('app.components').filter('ampersand',function(){return function(input){return input?input.replace(/&amp;/,'&'):''}});angular.module('app.components').directive('aPreventDefault',function($log){return{restrict:'A',link:function(scope,elem,attrs){elem.on('click',function(e){e.preventDefault()})}}});angular.module('app.components').controller('EventCtrl',EventCtrl)})()