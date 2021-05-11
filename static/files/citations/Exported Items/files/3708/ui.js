
//////////////////////////////////////////////////////////////////
//                  BRUEGEL: PUBLIC UI CONTROLS
//////////////////////////////////////////////////////////////////

// global var for list paging
var paged = 1;

$(window).ready(function(){ // document ready

	$(".social a:first-child").click(function(e){
		openTwitterDialog();
		e.preventDefault();
	})

	//////////////////////////////////////////////////////////////////
	// STICKY HEADER
	//////////////////////////////////////////////////////////////////

    checkStickyHeader();
    $(window).scroll(checkStickyHeader);


	//////////////////////////////////////////////////////////////////
	// POPOUT MENUS
	//////////////////////////////////////////////////////////////////
	$(".open-menu > a, li.menu a").click(function(e) {
		//$(".popout").css({"height": $(window).height()});
		var t_height = $(".popout")[0].scrollHeight + 30;
		$(".popout").css({"height": t_height});
		if (t_height > $( window ).height()) { // will not fit on screen, require scrollable menu
			$('html,body').animate({
          		scrollTop: 0
        	}, 100);
			setTimeout(function() {
				$(".header").css({"position": "absolute"});
			}, 100);
		}
		e.preventDefault();
	});
	$(".popout .close").click(function(e) {
		$(".popout").css({"height": 0});
		$(".header").css({"position": "fixed"});
		e.preventDefault();
	});

	//////////////////////////////////////////////////////////////////
	// FILTER
	//////////////////////////////////////////////////////////////////
	if ($(".filter-header").length) {
		if ($.cookie('sort_html') != undefined && $.cookie('sort_html') != "") { // Restore old sort on "back"
			if ( // don't mix apples and oranges
				($.cookie('sort_html').indexOf("Trending") >= 0 && $(".filter-sort").html().indexOf("Trending") >= 0)
				||
				($.cookie('sort_html').indexOf("Past events") >= 0 && $(".filter-sort").html().indexOf("Past events") >= 0)
			) {
				$(".filter-sort").html($.cookie('sort_html'));
			}
		}
		$(".filter-header .filter-sort a").click(function(e){
	       	$(".filter-header .filter-sort a").removeClass("active");
	       	$(this).addClass("active");
	       	filterSearch();
	       	e.preventDefault();
	        e.stopPropagation();
		});
		$(".filter-header a.open, .filter-header a.close").click(function(e){
			if (!$(".filter-select").hasClass("open")) {
				$(".filter-header .open").css({"display": "none"});
				$(".filter-header .close").css({"display": "inline-block"});
				$(".filter-select").addClass("open");
			} else {
				$(".filter-header .open").css({"display": "inline-block"});
				$(".filter-header .close").css({"display": "none"});
				$(".filter-select").removeClass("open");
				$(".filter-select .open").css({"display": "none"});
				$(".filter-summary").removeClass("open");
				$(".filter-summary .criteria").remove();
				$("#fromdate").val("");
				$("#todate").val("");
				$("#fromdate").css({"background-image": ""});
				$("#todate").css({"background-image": ""});
	       		$( "#todate" ).datepicker( "option", "minDate", "" );
	       		$( "#fromdate" ).datepicker( "option", "maxDate", "" );
				filterSearch();
			}
	       	e.preventDefault();
	        e.stopPropagation();
		});
		$(".filter-select .closed > a").click(function(e){
			$(".filter-select .open").css({"display": "none"});
			$(this).parent().next().css({"display": "block"});
	       	e.preventDefault();
	        e.stopPropagation();
		});
		$(".filter-select .open > a").click(function(e){
			$(this).parent().css({"display": "none"})
	       	e.preventDefault();
	        e.stopPropagation();
		});
		$(".filter-select .open ul li a").click(function(e){
			e.preventDefault();
	        e.stopPropagation();
			var slug = $(this).attr("href").replace(/^.*\/\/[^\/]+/, '');
			if (slug.indexOf("year=") > 0) { // Remove existing time period (if any)
				$('[data*="&year="]').remove();
			}
			if ($('[data="'+slug+'"]').length == 0) { // Append
				$(".filter-summary .wrap-inner").append('<span class="criteria" data="'+slug+'">'+$(this).text()+' <i class="fa fa-times"></i></span>');
	       		applyFilterCriteriaRemove();
	       		$(".filter-summary").addClass("open");
	       		filterSearch();
	       	}
	       	$(this).parent().parent().parent().css({"display": "none"});
		});
		$(".filter-select .authors.closed > a").click(function(e){
			$("#author_search").focus();
			filterAuthors($("#author_search"));
		});
		$("#author_search").keyup(function(e){
			filterAuthors(this);
		});
		$("input[type='text'].datepicker").datepicker({dateFormat: "yy-mm-dd"});
		$(".datepicker").change(function(e){
			var slug = "&" + $(this).attr("id") + "=" + $(this).val();
			$('[data*="&' + $(this).attr("id") + '="]').remove(); // Remove existing date (if any)
			if ($(this).val() != "") { // Append
				var label = $(this).attr("id").replace("date", "");
				label = label.charAt(0).toUpperCase() + label.slice(1);
				$(".filter-summary .wrap-inner").append('<span class="criteria" data="'+slug+'">'+label+': '+$(this).val()+' <i class="fa fa-times"></i></span>');
	       		applyFilterCriteriaRemove();
	       		$(".filter-summary").addClass("open");
	       		filterSearch();
	       		$(this).css({"background-image": "url(/wp-content/themes/bruegel/ui/design/graphics/calendar-black.png)"});
	       	} else {
	       		$(this).css({"background-image": ""});
	       	}
	       	if ($("#todate").val() != "") { $(this).parent().parent().parent().css({"display": "none"}); }
	       	if ($(this).attr("type") == "text") {
	       		if ($(this).attr("id") == "fromdate") { $( "#todate" ).datepicker( "option", "minDate", $(this).val() ); }
	       		if ($(this).attr("id") == "todate") { $( "#fromdate" ).datepicker( "option", "maxDate", $(this).val() ); }
	       	} else {
	       		if ($(this).attr("id") == "fromdate") { $( "#todate" ).attr( "min", $(this).val() ); }
	       		if ($(this).attr("id") == "todate") { $( "#fromdate" ).attr( "max", $(this).val() ); }
	       	}
		});
		if ($.cookie('criteria_html') != undefined && $.cookie('criteria_html') != "") { // Restore old filter on "back"
			$(".filter-summary .wrap-inner").append($.cookie('criteria_html'));
			applyFilterCriteriaRemove();
			$(".filter-summary").addClass("open");
		}
		if (($.cookie('sort_html') != undefined && $.cookie('sort_html') != "") || ($.cookie('criteria_html') != undefined && $.cookie('criteria_html') != "")) {
			filterSearch(); // Run filter automatically due to cookie settings
		}
	}

	//////////////////////////////////////////////////////////////////
	// Click related to modules
	//////////////////////////////////////////////////////////////////
	applyModuleClicks();

	//////////////////////////////////////////////////////////////////
	// Focus on search field on search page
	//////////////////////////////////////////////////////////////////
	$(".search .search-subheader .query input").focus();

	//////////////////////////////////////////////////////////////////
	// Perform seach when input field changes or on click
	//////////////////////////////////////////////////////////////////
	var searchTimeout;
	$(".search .search-subheader .query input").keyup(function() {
		clearTimeout(searchTimeout)
		searchTimeout = setTimeout(filterSearch, 200);
	});

	//////////////////////////////////////////////////////////////////
	// Init Owl Carousel: Teasers in header
	//////////////////////////////////////////////////////////////////
	// $(".teasers").owlCarousel({
	// 	loop: true,
 //        items: 1,
 //        autoplay: true,
 //        dotSpeed: 500,
 //        navSpeed: 500,
 //        autoplayTimeout: 10000,
	//     nav: true,
	//     navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
 //        navRewind: false
	// });
	// $(".teaser").height($(".owl-stage-outer").height());

	//////////////////////////////////////////////////////////////////
	// Init Owl Carousel: Tweets
	//////////////////////////////////////////////////////////////////
	initOwlTweets();


	//////////////////////////////////////////////////////////////////
	// Init Owl Carousel: PHotos
	//////////////////////////////////////////////////////////////////
	// $(".photos").owlCarousel({
	// 	loop: true,
 //        items: 1,
 //        autoplay: false,
 //        autoHeight: true,
 //        dotSpeed: 500,
 //        navSpeed: 500,
	//     nav: true,
	//     navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
 //        navRewind: false
	// });

	//////////////////////////////////////////////////////////////////
	// Init Owl Carousel: Logos
	//////////////////////////////////////////////////////////////////
	if ( $(".logos").children().length > 1 ) {
		// $(".logos").owlCarousel({
		// 	loop: true,
	 //        items: 1,
	 //        autoplay: true,
	 //        autoplaySpeed: 50,
	 //        autoplayHoverPause: true,
	 //        dotSpeed: 50,
	 //        navSpeed: 50,
		//     nav: true,
		//     navText: ['','<i class="fa fa-angle-right"></i>'],
		//     navRewind: false,
		//     mouseDrag: false,
		//     touchDrag: false,
		//     pullDrag: false,
		//     animateOut: 'fadeOut',
	 //    	animateIn: 'fadeIn'
		// });
	}

	//////////////////////////////////////////////////////////////////
	// GET MORE-button
	//////////////////////////////////////////////////////////////////
	$(".get-more").click(function(e) {
		paged++;
		$(".get-more").css({"margin-top": "700px"});
		if ($(".filter").length) {
			var url = filterSearchURL();
		} else {
			url = $(this).attr("href");
		}
		$.get(url+"&paged="+paged, function(data){ 
			//console.log(data);
			$(".get-more").css({"margin-top": "0"});
	  		$(".get-more").before(data);
			//$('html, body').animate({scrollTop: $(window).scrollTop() + 300}, 500);
			if (data.indexOf("<!-- END OF FEED -->") > -1) {
				$(".get-more").hide();
			} else {
				$(".get-more").show();
			}
			applyModuleClicks();
		});
		e.preventDefault();
	});


	//////////////////////////////////////////////////////////////////
	// LINK TO COMMENTS click
	//////////////////////////////////////////////////////////////////
	$(".link-to-comments").unbind("click");
	$(".link-to-comments").click(function(e){
		$('html, body').animate({scrollTop: $(".comments").offset().top - 140}, 500);
		$(".view-comments" ).trigger( "click" );
        e.preventDefault();
        e.stopPropagation();
	});

	//////////////////////////////////////////////////////////////////
	// BACK TO TOP-button
	//////////////////////////////////////////////////////////////////
	$(".back-to-top").click(function(e){ 
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        e.preventDefault(); 
    });

	//////////////////////////////////////////////////////////////////
	// Max height on content and make it expandable
	//////////////////////////////////////////////////////////////////
	var pageheight = 2000;
	//var page = 1;
	//var pagestotal = 0;
	$(".policy-contribution .body, .policy-brief .body, .blog-post .body").each(function() {
		if ($(this).height() > 5000) {
			$(this).css({"max-height": pageheight, "overflow": "hidden" });
			//$(this).after('<a href="#" class="read-more"></a>');
			//pagestotal = Math.ceil($(this)[0].scrollHeight/pageheight);
			//$(".read-more").html('<i class="fa fa-chevron-down"></i> Read more (1/'+pagestotal+')');
			$(this).after('<a href="#" class="read-more">Read entire article <i class="fa fa-chevron-down"></i></a>');
		}
	});
	$(".read-more").click(function(e) {
		// Just one click
		$(this).prev().css({"max-height": Math.ceil($(this).prev()[0].scrollHeight) + 3000 });
		$(this).remove();
		// To do: Clean up below, and remove page-related vars
		/*$(this).prev().css({"max-height": $(this).prev().height() + pageheight });
		page++;
		if (page == pagestotal) {
			$(this).remove();
		} else {
			$(".read-more").html('<i class="fa fa-chevron-down"></i> Read more ('+page+'/'+Math.ceil($(this).prev()[0].scrollHeight/pageheight)+')');
		}*/
		e.preventDefault();
	});

	//////////////////////////////////////////////////////////////////
	// Registration button
	//////////////////////////////////////////////////////////////////
	$(".registration a, a.register").click(function(e) {
		$(".registration").after('<div class="c1"></div><div class="c23"><iframe src="http://bruegel.force.com/events/EventRegApplication?Id='+$(this).attr('data')+'&cid='+getCid()+'&uid='+getUid()+'" id="iframe_form" name="form" scrolling="no"></iframe></div>');
		//$(".registration").after('<div class="c1"></div><div class="c23"><iframe src="http://michel-bruegel.cs17.force.com/events/EventRegApplication?Id='+$(this).attr('data')+'&cid='+getCid()+'&uid='+getUid()+'" id="iframe_form" name="form" scrolling="no"></iframe></div>');
		$(".registration").remove();
		$('html, body').animate({ scrollTop: $("#iframe_form").offset().top - 100 }, 500);
		$("#iframe_form").animate({"height": 1240}, 1400);
		e.preventDefault();
	});

	//////////////////////////////////////////////////////////////////
	// Sign-up button
	//////////////////////////////////////////////////////////////////
	$(".sign-up-button").click(function(e) {
		$(".footer-signup-form").append('<div class="wrap-inner"><div class="c1"></div><div class="c23"><iframe style="min-height:1340px;" src="http://bruegel.force.com/events/UpdateAcc" id="iframe_signup_form" name="form" onLoad="resizeIframe(\'iframe_signup_form\');" scrolling="no"></iframe></div></div>');
		$(this).remove();
		$('html, body').animate({ scrollTop: $(".footer-signup").offset().top - 20 }, 500);
		e.preventDefault();
	});

	//////////////////////////////////////////////////////////////////
	// Dialog
	//////////////////////////////////////////////////////////////////
	$(".dialog-close").click(function(e) {
		window.history.back();
		e.preventDefault();
	});
	$("#dialog-confirm-submit").click(function() {
		if (!$("#dialog-confirm-checkbox").prop('checked')) {
			alert("Please tick the checkbox");
		} else {
			closeDialog();
		}
	});

	//////////////////////////////////////////////////////////////////
	// Tags & Topics drop down
	//////////////////////////////////////////////////////////////////
	$(".row.dropdown .label").click(function(e) {
		$(this).parent().toggleClass("open");
		e.preventDefault();
	});

	//////////////////////////////////////////////////////////////////
	// View comments button
	//////////////////////////////////////////////////////////////////
	$(".view-comments").click(function(e) {
		e.preventDefault();
		$(this).after('<h2 class="double-line comments">Comments</h2><div class="c1"></div><div class="c23"><div id="disqus_thread"></div><script type="text/javascript">var disqus_shortname = "bruegel";var disqus_identifier = "'+$(this).attr('data-identifier')+'";(function() {var dsq = document.createElement("script"); dsq.type = "text/javascript"; dsq.async = true;dsq.src = "//" + disqus_shortname + ".disqus.com/embed.js";(document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);})();</script></div>');
		$(this).remove();		
	});

});

//////////////////////////////////////////////////////////////////
// Set height of forms iframe
//////////////////////////////////////////////////////////////////
function resizeIframe(id) {
	var iframe_height = document.getElementById(id).contentWindow.document.body.scrollHeight;

    $("#"+id).animate({"height": iframe_height}, 1400);
}
function resizeIframeToFixed(id, iframe_height) {
	console.log(id+":"+iframe_height);
    $("#"+id).animate({"height": iframe_height}, 1400);
}
function scrollToElement(element) {
	$('html, body').animate({ scrollTop: $(element).offset().top - 20 }, 500);
}

//////////////////////////////////////////////////////////////////
// Init Owl Tweets
//////////////////////////////////////////////////////////////////
function initOwlTweets() {
	// $(".tweets").owlCarousel({
	// 	loop: true,
 //        items: 1,
 //        autoplay: true,
 //        autoplaySpeed: 500,
 //        autoplayHoverPause: true,
 //        dotSpeed: 500,
	//     nav: false,
	//     navRewind: false
	// });
}

//////////////////////////////////////////////////////////////////
// STICKY HEADER
//////////////////////////////////////////////////////////////////

var stickyHeaderPos = 0;
function checkStickyHeader() {
	// Main header
	var obj = $(".header");
	if (obj.length) {
		if ($(window).scrollTop() > 50) {
			if (!obj.hasClass("sticky")) {
				obj.addClass("sticky");
			}
		} else {
			if (obj.hasClass("sticky")) {
				obj.removeClass("sticky");
			}
		}
	}
	// More complex for subheader
	obj = $(".subheader");
	if (obj.length) {
		if (stickyHeaderPos == 0) { stickyHeaderPos = obj.position().top; }
		if ($(window).scrollTop() > (stickyHeaderPos - $(".header").height())) {
			if (!obj.hasClass("sticky")) {
				obj.addClass("sticky");
				$(".subheader .back-to-top").css({"display": "inline"});
				$("body").css({"padding-top": "120px"});
			}
			obj.css({"top": $(".header").height()});
		} else {
			if (obj.hasClass("sticky")) {
				obj.removeClass("sticky");
				obj.css({"top": ""});
				$(".subheader .back-to-top").css({"display": "none"});
				$("body").css({"padding-top": ""});
			}
		}
	}
}


//////////////////////////////////////////////////////////////////
// Helper function: Apply module clicks
//////////////////////////////////////////////////////////////////

function applyModuleClicks() {
	//////////////////////////////////////////////////////////////////
	// PLUS click
	//////////////////////////////////////////////////////////////////
	$(".plus").unbind("click");
	$(".plus").click(function(e){
		if ($(this).parent().hasClass("open")) {
			$(this).parent().css({"width": "", "left": ""}) // Close
	        $(this).parent().removeClass("open");
		} else { 
			$(".mdl").css({"width": "", "left": ""}) // Open
			$(".mdl").removeClass("open");
			if ($(window).width() > 1250) {
				$(this).parent().css({"width": $(window).width() - 200});
			} else {
				$(this).parent().css({"left": "-200px"});
			}
	        $(this).parent().addClass("open");
	        $(this).parent().prev().height($(this).parent().outerHeight() - 40);
        }
        e.preventDefault();
        e.stopPropagation();
    });
}

//////////////////////////////////////////////////////////////////
// Helper function: Applies function to remove filter criterias
//////////////////////////////////////////////////////////////////

function applyFilterCriteriaRemove() {
	$(".filter-summary .criteria i").unbind("click");
	$(".filter-summary .criteria i").click(function() {
		if ($(this).parent().attr("data").indexOf("fromdate") > 0) { $("#fromdate").val(""); $( "#todate" ).datepicker( "option", "minDate", "" );$("#fromdate").css({"background-image": ""}); }
		if ($(this).parent().attr("data").indexOf("todate") > 0) { $("#todate").val(""); $( "#fromdate" ).datepicker( "option", "maxDate", "" ); $("#todate").css({"background-image": ""}); }
		$(this).parent().remove();
		filterSearch();
		if ($(".filter-summary .criteria").length == 0) {
			$(".filter-summary").removeClass("open");
		}
	});
}

//////////////////////////////////////////////////////////////////
// Helper function: Filter authors depending on input
//////////////////////////////////////////////////////////////////
function filterAuthors(inputObj) {
	var search_for = $(inputObj).val().toLowerCase();
	$(inputObj).next().find("li").each(function() {
		if (search_for != "" && $(this).text().toLowerCase().indexOf(search_for) > -1) {
			$(this).css({"display": ""});
		} else {
			$(this).css({"display": "none"});
		}
	});
}


//////////////////////////////////////////////////////////////////
// Ajax filter content
//////////////////////////////////////////////////////////////////

function filterSearch() {
	$.get(filterSearchURL(), function(data){ 
		paged = 1;
		$(".mdl-submenu").remove();
		$(".mdl").remove();
		$(".results-count").remove();
		$(".filter").after(data);
		applyModuleClicks();
		var results = $(".results-count").attr("data");
		if (results == undefined) { results = 0; }
		if (results == 1) {
			$(".num-results").text("1 result");
		} else {
			$(".num-results").text(results+" results");
		}
		if (data.indexOf("<!-- END OF FEED -->") > -1) {
			$(".get-more").hide();
		} else {
			$(".get-more").show();
		}
		initOwlTweets();
		if ($(".filter-header").length && document.URL.indexOf("?s=") < 0) {
			var criteria_html = ""; // store front-end criterias in cookie for better "back"-functionality
			$(".filter-summary .criteria").each(function() {
				criteria_html += $('<span>').append($(this).clone()).html();
			});
			$.cookie('criteria_html', criteria_html);
		}
		//console.log("filterSearch() was called");
	});
}
function filterSearchURL() {
	var query = "";
	$(".filter .criteria").each(function() {
		var data = $(this).attr("data");
		data = data.replace("/topic/", "&category__slugs[]=");
		data = data.replace("/author/", "&author__slugs[]=");
		data = data.replace("/", "");
		query += data;
	})
	if ($(".filter-sort .trending").hasClass("active")) {
		$.cookie('sort_html', $(".filter-sort").html());
		query += "&meta_key=trending_index&orderby=meta_value_num&order=DESC";
	} else {
		$.removeCookie('sort_html');
	}
	if ($(".filter-sort .upcoming").hasClass("active")) {
		$.removeCookie('sort_html');
		query += "&meta_key=event_enddate&meta_value="+(Date.now() + 60 * 60000)+"&meta_compare=>&orderby=meta_value_num&order=ASC";
	}
	if ($(".filter-sort .past").hasClass("active")) {
		$.cookie('sort_html', $(".filter-sort").html());
		query += "&meta_key=event_startdate&meta_value="+Date.now()+"&meta_compare=<&orderby=meta_value_num&order=DESC";
	}
	if ($(".search .search-subheader .query input").length > 0) {
		query += "&s=" + encodeURIComponent($(".search .search-subheader .query input").val());
	}
	if (query.indexOf("basefilter") < 0) {
		query = $(".filter").attr("data") + query;
	} else {
		query = query.substring(1);
	}
	//console.log(query);
	return "/wp-content/themes/bruegel/ajax-html-feed.php?"+query;
}


//////////////////////////////////////////////////////////////////
// CLose dialog
//////////////////////////////////////////////////////////////////

function closeDialog() {
	$(".dialog-inner").css({"opacity": 0, "transform": "scale(.8,.8)"});
	$(".dialog-block").css({"opacity": 0});
	setTimeout(function(){
		$(".dialog").remove();
		$(".dialog-block").remove();
	},2000);
}



//////////////////////////////////////////////////////////////////
// Storing Sales Force UID
//////////////////////////////////////////////////////////////////

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();

function storeUid(str) {
	if (str!="") {
		$.cookie('uid', str, { expires: 365, path: '/' });
	} else {
		$.removeCookie('uid', { path: '/' });
	}
}
function getUid() {
	var uid = $.cookie('uid'); // get from cookie
	if (uid == undefined) { uid = ""}
	return uid;
}
function getCid() {
	var cid = QueryString.cId; // get from query string
	if (cid == undefined) { cid = ""}
	return cid;
}
window.addEventListener("message", function(e){
	try {
    	var calldata = JSON.parse(e.data);
		if (calldata.function == "storeUid") { storeUid(calldata.value); }
	    if (calldata.function == "setIframeHeight") { resizeIframeToFixed("iframe_form", calldata.value); }
	    if (calldata.function == "setIframeSignupHeight") { resizeIframeToFixed("iframe_signup_form", calldata.value); }
	    if (calldata.function == "scrollToIframe") { scrollToElement("#iframe_form"); }
	    if (calldata.function == "openTwitterDialog") { openTwitterDialog(); }
	}
	catch(err) {
	}
}, false);


//////////////////////////////////////////////////////////////////
// Open Twitter Dialog after sign up
//////////////////////////////////////////////////////////////////

function openTwitterDialog() {

	// Insert the mark up
	$("body").append('<div class="dialog-block"></div><div class="dialog dialog-twitter"><div class="dialog-inner"><p>Follow Bruegel by clicking the Follow button below:</p><a href="#" class="dialog-close"><i class="fa fa-times"></i></a><a class="twitter-timeline" href="https://twitter.com/Bruegel_org" data-widget-id="667952511131787264">Tweets by @Bruegel_org</a></div></div>');

	// Apply functionality for close-button
	$(".dialog-close").click(function(e) {
		closeDialog();
		e.preventDefault();
	});

	// Load Twitter widget JS
	!function (d,s,id) {
		var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);
		}
	}(document,"script","twitter-wjs");

	// Request extra check from Twitter
	if (typeof(twttr) == "object") {
		twttr.widgets.load();
	}

}