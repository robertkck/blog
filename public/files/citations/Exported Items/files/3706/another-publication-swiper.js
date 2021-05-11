$(document).ready(function () {

	var publicationSlider = new Swiper ('.swiper-container.Publications-slider', {
		slidesPerView: 'auto',
        spaceBetween: 5,
        centeredSlides: true,
        roundLengths : true,
        loop : true,
        scrollbar: '.swiper-scrollbar.publications',
		scrollbarHide: false,
		grabCursor: false,
		scrollbarDraggable : true,
		preventClicks : false,
		preventClicksPropagation : false,
		//autoplay : 6000,
		nextButton : '.Publication-next',
		breakpoints: {
		    768: {
		      slidesPerView: 'auto',
		      centeredSlides: true,
		    }
	  	},
	  	onInit : function(swiper){
	  		swiper.slideNext();
	  	}
	});

});
