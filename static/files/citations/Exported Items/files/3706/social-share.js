'use strict';
(function(){

	var items = {
		social : $('div.body ul.Social.is-scrolled'),
		pdf : ( ($('div.body div[class^="box-left-"]').length > 0 ) ? $('div.body div[class^="box-left-"]') : 0 ),
		comments : ( ( $('.related-articles').length > 0 ) ? $('.related-articles') : 0 ),
		meta : ( ( $('.wrap-inner .meta').length > 0 ) ? $('.wrap-inner .meta') : 0 ),
	},
	stateClass = 'is-hidden',
	lastScrollTop = 0,
	scrollDirection,
	state = 'show';

    function init(){

    	if(items.pdf){
	    	$(items.social).css({
	    		top:  $(items.pdf).outerHeight(),
	    	});
    	}

    	//https://github.com/bigspotteddog/ScrollToFixed
        $(items.social).scrollToFixed({
        	marginTop : ( (items.pdf) ? $(items.pdf).outerHeight() : 200 ),
        	limit: function() {
	            var limit = $(items.comments).offset().top - 350;
	            return limit;
	        },
	        zIndex : 1,
        	removeOffsets : true,
	        postFixed: function() {
	        	if(scrollDirection === 'down' ) toggleVisibility( $(this), 'hide');
	        },
	        postAbsolute: function() {
	        	//the function handler triggered just after the element leaves absolute.
	        	toggleVisibility( $(this), 'show');
	        }
        });
    }

    function toggleVisibility(el, state){
    	if(state == 'hide') $(el).addClass(stateClass);
    	else $(el).removeClass(stateClass);
    }

	$(window).scroll(function(event){
		var st = $(this).scrollTop();


		if (st > lastScrollTop){
			scrollDirection = 'down';
		}
		else {
			scrollDirection = 'up';
		}
		lastScrollTop = st;
		overLaps();
	});

	$('.Social li, .Social.is-mobile .Social-item').on('click', function(event) {
		event.preventDefault();
		var media = $(this).data('name');
		switch(media){
			case 'tw' :
				var twitterWindow = window.open('https://twitter.com/share?url=' + WP_CURRENT_URL+'&text='+WP_CURRENT_TILTE, 'twitter-popup', 'height=350,width=600');
				if(twitterWindow.focus) twitterWindow.focus();
				trackEvent(WP_CURRENT_TILTE, 'social-share', 'twitter');
				return false;
			break;

			case 'fb' :
				FB.ui({
					method: 'feed',
					link: WP_CURRENT_URL,
					caption: WP_CURRENT_TILTE,
				}, function(response){
					if (response && response.post_id) {
						trackEvent(WP_CURRENT_TILTE, 'social-share', 'facebook');
				     }
				});
			break;

			case 'in' :
				window.open('https://www.linkedin.com/shareArticle?mini=true&url='+WP_CURRENT_URL+'&title='+WP_CURRENT_TILTE+'&source=LinkedIn');
				trackEvent(WP_CURRENT_TILTE, 'social-share', 'linkedin');
			break;

			default:
				trackEvent(WP_CURRENT_TILTE, 'social-share', 'email');
				window.location.href = "mailto:somebody@something.com?subject="+WP_CURRENT_URL;
			break;
		}
	});

	function overLaps(){
		//check if element overlaps
		if(
			$(items.social).overlaps('.box-left').length > 0 ||
			$(items.social).overlaps('.double-line').length > 0 ||
			$(items.social).overlaps('.box-left-no-border').length > 0 || 
			$(items.social).overlaps('.Tags').length > 0 ){
				state = 'hide';
		}
		else state = 'show';

		toggleVisibility($(items.social), state);
	}

	function trackEvent(eventCategory, eventAction, eventLabel){
		console.log('trackEvent');
    	ga('send', 'event', eventCategory, eventAction, eventLabel);
	}

    init();
    $(window).trigger('scroll');
})();