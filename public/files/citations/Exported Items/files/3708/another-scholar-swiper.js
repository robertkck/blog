$(document).ready(function () {
	//initialize swiper when document ready  
	var mySwiper = new Swiper ('.swiper-container.s1', {
		slidesPerView: 'auto',
		spaceBetween: 5,
		centeredSlides: true,
		watchSlidesVisibility: true,
		parallax: false,
		loop: true,
		paginationClickable: true,
		effect: 'slide',
		roundLengths : true,
		scrollbar: '.swiper-scrollbar',
		scrollbarHide: false,
		grabCursor: false,
		scrollbarDraggable : true,
		nextButton : '.Scholar-next',
		breakpoints: {
		    768: {
		      slidesPerView: 'auto',
		      centeredSlides: true,
		    }
	  	},
	});
});