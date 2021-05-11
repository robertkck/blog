
/////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////
var cookie_name = 'bruegel_cookies_accept';
var cookie_wrapper = document.getElementsByClassName('cookie');
var cssClassVisible = 'js-visible';

function checkForCookie (){
	var bruegel_site_cookie = Cookies.get(cookie_name);
	if(typeof bruegel_site_cookie === 'undefined' && cookie_wrapper.length){
		presentCookie();
	}
}

function presentCookie (){
	cookie_wrapper[0].classList.add(cssClassVisible);
	var cookie_button = document.getElementsByClassName('cookie__accept-action');
	cookie_button[0].addEventListener('click', function() {
		setCookie();
	})
}

function setCookie () {
	Cookies.set(cookie_name, 1, { expires: 365 });
	cookie_wrapper[0].classList.remove(cssClassVisible);
}

checkForCookie();