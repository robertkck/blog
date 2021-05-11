///////////////////////////////
// Firefox search plugin
///////////////////////////////

function addEngine() {
  try {
    window.external.AddSearchProvider('http://econpapers.repec.org/EP_searchplug.xml');
    window.external.AddSearchProvider('http://econpapers.repec.org/EPauth_searchplug.xml');
    window.external.AddSearchProvider('http://econpapers.repec.org/EPtitle_searchplug.xml');
  }
  catch(e) {
    if ((typeof window.sidebar == "object") && (typeof
            window.sidebar.addSearchEngine == "function")) {
        // Mozilla or Netscape
        window.sidebar.addSearchEngine(
        "http://econpapers.repec.org/EP_searchplug.src",
        "http://econpapers.repec.org/EP_searchplug.png",
        "EconPapers",
        "Economics" );
    }
    else {
      alert("Netscape 6, Mozilla 1.5 or Internet Explorer 7 and higher is needed to install the EconPapers search plugin");
    }
  }
}

/////////////////////////////////
// Display of search results,
// reference lists and citations
/////////////////////////////////

// not used?

function show_cites(link) {
  EP_Cites = window.open(link, 'EP_Cites',
                         'toolbar=yes,location=yes,menubar=yes,status=yes,scrollbars=yes,resizable=yes,height=480,Width=640');
  EP_Cites.focus();
  return false;
}

// not used?

function show_refs(link) {
  EP_Refs = window.open(link, 'EP_Refs',
                         'toolbar=yes,location=yes,menubar=yes,status=yes,scrollbars=yes,resizable=yes,height=480,Width=640');
  EP_Refs.focus();
//document.write( '<IFRAME src="' + link + '" width="400" height="500" scrolling="auto" frameborder="1">No iframe</IFRAME>' );
  return false;
}

//

function CloseAbstractFrame() {
  var form = document.getElementById( 'hidelink' );
  var link = '/' + form.link.value;
//alert( link );
  document.location.href = link;
}

//

function ShowAbstract(handle,file) {

  if ( handle ) {
	  SetCloseLink( handle );
	  var frame = document.getElementById("absframe")
	  var arg = '/scripts/a/abstract.pf?h='+handle;
	  frame.setAttribute( "src", arg );

	  return false;
  } else if ( file ) {
	  SetCloseLink( file );
	  var frame = document.getElementById("absframe")
	  var arg = '/scripts/a/abstract.pf?f='+file;
	  frame.setAttribute( "src", arg );
	  return false;
  } else {
	  return true;
  }

}

//

function SwitchList( num, handle, link ) {

  var tab = document.getElementById( 'tab'+num );
  var n = num-1;
  var tabs = document.getElementById( 'tab'+n );
  var list;
  while ( tabs ) {
    if ( n != num ) {
      tabs.className = 'tab';
      list = document.getElementById( 'list'+n );
      list.className = 'list';
    }
    n--;
    var tabs = document.getElementById( 'tab'+n );
  }
  var n = num+1;
  var tabs = document.getElementById( 'tab'+n );
  while ( tabs ) {
    if ( n != num ) {
      tabs.className = 'tab';
      list = document.getElementById( 'list'+n );
      list.className = 'list';
    }
    n++;
    var tabs = document.getElementById( 'tab'+n );
  }
  tab.className = 'activetab';
  list = document.getElementById( 'list'+num );
  list.className = 'activelist';

// open first item in new list in abstract frame
  var x = list.getElementsByTagName("A");
  if ( x.length > 0 ) {
    var elmnt = x[0];
      var action = String( elmnt.getAttribute( 'onClick' ) );
      var reg0 = /.+\n{\n(.+)\n}/;
      var action = action.replace( reg0, "$1" );
      var reg = /return/;
      var naction = action.replace( reg, "" );
      eval( naction );
  }

  return false;

}

//

function SetCloseLink( link ) {
  var form = document.getElementById( 'hidelink' );
  var reg = /^([^;]+);.+$/;
//  alert( link );
  var nlink = link.replace( reg, "$1" );
//  alert( nlink );
  form.link.value = nlink;
}

//

function Obfuscate( b, a ) {

  document.write( '<a href="mailto:' + a + '&#64;' + b + '">' + a + '&#64;' + b + '</a>' );

}

function Obfuscate3( b, a, c, d ) {

  var link = '<a href="mailto:' + a + '&#64;' + b;
  if ( c != '' ) {
    link = link + '?' + c;
  }
  if ( d != '' ) {
    link = link + '">' + d + '</a>';
  } else {
    link = link + '">' + a + '&#64;' + b + '</a>';
  }
  document.write( link );

}

function ObfuscateN( b, a ) {

  function rot(a) {
  var reg = /&#x([A-F0-9]{2});/g;
  var x = '';
  var i;
  while ( arr = reg.exec(a) ) {
    i = parseInt(arr[1],16) - 7;
    if ( i <= 32 ) i += 94;
    x += String.fromCharCode(i);
    }
  return x.split('').reverse().join('');
  }

  var x = rot(a);
  var y = rot(b);
  document.write( '<a href="mailto:' + x + '&#64;' + y + '">' + x + '&#64;' + y + '</a>' );

}

///////////////////////////////
// Customize search form
///////////////////////////////

function setsearchfield(form) {
  var name = navigator.appName;
  var len = 0;
  if ( name.indexOf( 'Netscape' ) > -1 ) {
    var version = navigator.appVersion
    var reg = /^[\d\.]+/;
    if ( reg.test( version ) ) {
      var matches = reg.exec( version );
      if ( matches[0] >= 5.0 ) {
        len = 22;
        }
      }
    }
  else if ( name.indexOf( 'Microsoft' ) > -1 ) {
    len = 23;
    }
  else if ( name.indexOf( 'Opera' ) > -1 ) {
    len = 30;
    }
    len = 0;
  if ( len > 0 ) {
    document.search.ft.size = len;
    }
}

/////////////////////////////////////////
// Turn on and off display of additional
// contact info for authors
/////////////////////////////////////////

function showhide(cid) {

document.getElementById(cid).style.display=(document.getElementById(cid).style.display!="inline") ? "inline" : "none"

return false;

}

///////////////////////////////////
// specific to search form
///////////////////////////////////

function SavedSearch(searchnum) {
  document.forms.SavedSearches.ss.value = searchnum;
  document.forms.SavedSearches.submit();
}

function FixForPlang(form) {
  if ( form.pl.selectedIndex !== 0 ) {
    form.wp.checked = false;
    form.art.checked = false;
    form.bkchp.checked = false;
    form.soft.checked = true;
    form.auth.checked = false;
  }
}

//

function FixForNEP(form) {
  if ( form.nep.selectedIndex !== 0 ) {
    form.wp.checked = true;
    form.art.checked = false;
    form.bkchp.checked = false;
    form.soft.checked = true;
    form.auth.checked = false;
  }
}

//

function SetAuthorSearch(form) {
  if ( form.aus.value !== "" & form.pl.selectedIndex == 0 ) {
    form.auth.checked = true;
  }
}

//

function SetDateSort(form) {
  if ( form.ni.selectedIndex != 0 ) {
    form.sort[1].checked = true;
  }
}

////////////////////////////////////////
// Stuff for dealing with redirects from
// old location, telling people that we
// moved
////////////////////////////////////////

function canCookie() {

  var test = getCookie( 'EPTest' );
  if ( test == null ) {
    setCookie( 'EPTest', 'test', null, '/' );
    test = getCookie( 'EPTest' );
  }
  if ( test == null ) {
    return false;
  } else {
    return true;
    //return false;
  }

}

//

function WriteRelocation() {

  var showReloc  = false;
  var showNetEc  = false;
  var NetEcFound = false;

  if ( canCookie() ) {
    var kaka = getCookie( 'EPredir' );
    if ( kaka == 'NetEc' ) {
      deleteCookie( 'EPredir', '/' );
      showNetEc = true;
    } else if ( kaka == 'NetEcFound' ) {
      deleteCookie( 'EPredir', '/' );
      showNetEc = true;
      NetEcFound = true;
    } else {
      count = parseInt( kaka );
      if ( count < 10 ) {
        count++;
        setCookie( 'EPredir', count, null, '/' );
        showReloc = true
      }
    }
  } else {
    // kan vi kolla referrer och visa RelocInfo
    var re = /\/econpapers.repec.org\//i;
    if ( ! re.test( document.referrer ) ) {
      showReloc = true;
    }
  }

  if ( showNetEc ) {
    document.write( '<p><font color="red">The BibEc and WoPEc services of NetEc have been shut down and your request has been redirected to <a href="/">EconPapers</a>. ' +
                    'All current data from BibEc and WoPEc is available here at <a href="/">EconPapers</a> and at <a href="http://ideas.repec.org/">IDEAS</a>.</font></p>' );
    if ( NetEcFound ) document.write( '<p><font color="red">This page corresponds to the one you requested from BibEc or WoPEc.</font></p>' );
  } else if ( showReloc ) {
    document.write( "<p><font color='red'><b>EconPapers has moved to http://econpapers.repec.org! Please update your bookmarks.</b></font></p>" );
  }

}

//

function wait_while_processing() {

var doc = window.top.document;

var greyedout = doc.getElementById("greyedout");

var w = doc.documentElement.clientWidth - 3;
var h = doc.Height;
if ( isNaN( h ) ) {
  h = doc.documentElement.clientHeight;
}
if ( h < doc.documentElement.clientHeight ) {
  h = doc.documentElement.clientHeight;
}
h = h - 3;
greyedout.style.width = w + 'px';
greyedout.style.height = h + 'px';
var pos = window.center({width:w,height:h});
greyedout.style.top =  pos.y + 'px';
greyedout.style.left = pos.x + 'px';

var processing = doc.getElementById("processing");
processing.innerHTML = "<p><img width='32' height='32' align=middle src='/EPwait.gif'> Processing request...</p>";
processing.style.display = 'block';
h = processing.offsetHeight;
w = processing.offsetWidth;

var pos = window.center({width:w,height:h});
//alert( 'x ' + pos.x + ', y ' + pos.y );
processing.style.left = pos.x + 'px';
processing.style.top = pos.y + 'px';

greyedout.style.display = 'block';

return true;

}

//

function clear_wait() {

var doc = window.top.document;

var greyedout = doc.getElementById("greyedout");
greyedout.innerHTML = '';
greyedout.style.display = "none";
var processing = doc.getElementById("processing");
processing.innerHTML = '';
processing.style.display = 'none';

return true;

}

//

function item_as_reference(reftype) {

var doc = window.top.document;

var itemref = doc.getElementById("itemref");
var itemref2 = doc.getElementById("itemshadow");

if ( itemref.style.display == "block" ) {
  itemref.style.display = "none";
  itemref2.style.display = "none";
  return false;
}

if ( reftype == 'bibtex' ) {
  var text = get_bibtex();
} else if ( reftype == 'ris' ) {
  var text = get_ris()
} else if ( reftype == 'html' ) {
  var text = get_html();
} else {
  return false;
}

itemref.innerHTML = text;

var w = 500;
var h = 300;
var wSize = window.size();
if ( wSize.width > 1200 ) {
  w = 1000;
} else if ( wSize.width > 700 ) {
  w = wSize.width - 200;
} else {
  w = wSize.width - 50;
}

if ( wSize.height > 400 ) {
  h = 400;
} else {
  h = wSize.height;
}

var pos = window.center({width:w,height:h});

itemref.style.width = w + 'px';
itemref.style.top = pos.y + 'px';
itemref.style.left = pos.x + 'px';
doc.getElementById('bhleft').style.width = w-30 + 'px';
doc.getElementById('bhright').style.width = 10 + 'px';

itemref.style.display = 'block';

var ah = itemref.clientHeight;
if ( ah > h ) {
  if ( ah < wSize.height ) {
    pos = window.center({width:w,height:ah});
    itemref.style.top = pos.y + 'px';
  } else {
    w = wSize.width - 50;
    itemref.style.width = w + 'px';
    ah = itemref.clientHeight;
    if ( ah > wSize.height ) {
      var ah2 = wSize.height;
    } else {
      var ah2 = ah;
    }
    pos = window.center({width:w,height:ah2});
    itemref.style.left = pos.x + 'px';
    itemref.style.top = pos.y + 10 + 'px'; // IE 8 seems to need this
  }
}
// in case we changed the width
doc.getElementById('bhleft').style.width = w-30 + 'px';
doc.getElementById('bhright').style.width = 10 + 'px';

itemref2.style.width = w + 'px';
itemref2.style.top = pos.y + 12 + 'px';
itemref2.style.left = pos.x - 10 + 'px';
itemref2.style.height = ah + 'px';
itemref2.style.display = 'block';

return false;

}

///

function get_html() {

var d = mine_meta_for_reference();

var text = '<p class="bibheadingleft" id="bhleft">HTML entry</p><p class="bibheadingright" id="bhright" onClick="return item_as_reference()" onmouseover="this.style.color=\'black\'"  onmouseout="this.style.color=\'white\'">X</p><p style="clear: both">';

var html = '';

if ( d.author != "" ) {
  var auth = d.author.split( /; /g );
  for ( var i = 0; i < auth.length; i++ ) {
    html += auth[i];
    if ( i < auth.length-2 & auth.length > 1 ) {
      html += ', ';
    } else if ( i == auth.length-2 ) {
      html += ' and ';
    }
  }
}

if ( d.year ) {
  html += ', (' + d.year + ')';
}
var astext = html;

if ( d.title != "" ) {
  html += ', <a href="' + d.url + '">' + d.title + '</a>';
  astext += ', ' + d.title;
}

if ( d.redif_type == 'paper' ) {

  if ( d.number != "" ) {
    html += ', No ' + d.number;
    astext += ', No ' + d.number;
  }
  if ( d.series_name != "" ) {
    html += ', ' + d.series_name;
    astext += ', ' + d.series_name;
  }
  if ( d.publisher != "" ) {
    html += ', ' + d.publisher;
    astext += ', ' + d.publisher;
  }

} else if ( d.redif_type == 'article' ) {

  if ( d.series_name != "" ) {
    html += ', <i>' + d.series_name + '</i>';
    astext += ', <i>' + d.series_name + '</i>';
  }
  if ( d.volume != "" ) {
    html += ', <b>' + d.volume + '</b>';
    astext += ', ' + d.volume;
  }
  if ( d.isse != "" ) {
    html += ', issue ' + d.issue;
    astext += ', issue ' + d.issue;
  }
  if ( d.page_start != "" & d.page_end != "" ) {
    html += ', p. ' + d.page_start + '-' + d.page_end;
    astext += ', p. ' + d.page_start + '-' + d.page_end;
  } else if ( d.number != "" ) {
    html += ', number ' + d.number;
    astext += ', number ' + d.number;
  }

} else if ( d.redif_type == 'book' ) {

  if ( d.volume != "" ) {
    html += ', vol. ' + d.volume;
    astext += ', vol. ' + d.volume;
  }
  if ( d.edition != "" ) {
    html += ', ' + d.edition + ' ed.';
    astext += ', ' + d.edition + ' ed.';
  }
  if ( d.publisher != "" ) {
    html += ', ' + d.publisher;
    astext += ', ' + d.publisher;
  }

} else if ( d.redif_type == 'chapter' ) {

  if ( d.chapter != "" ) {
    html += ', ch. ' + d.chapter;
    astext += ', ch. ' + d.chapter;
  }
  if ( d.page_start != "" & d.page_end != "" ) {
    html += ', p. ' + d.page_start + '-' + d.page_end;
    astext += ', p. ' + d.page_start + '-' + d.page_end;
  }
  if ( d.book_editor != "" || d.book_title != "" ) {
    html += ' in ';
    astext += ' in ';
  }
  if ( d.book_editor != "" ) {
    var ed = d.book_editor.split( /;/ );
    for ( var i = 0; i < ed.length; i++ ) {
      html += ed[i];
      astext += ed[i];
      if ( i < ed.length-2 & ed.length > 1 ) {
        html += ', ';
        astext += ', ';
      } else if ( i == ed.length-2 ) {
        html += ' and ';
        astext += ' and ';
      }
    }
    html += ' eds.';
    astext += ' eds.';
  }
  if ( d.book_title != "" ) {
    html += ', ' + d.book_title;
    astext += ', ' + d.book_title;
    if ( d.volume != "" ) {
      html += ', vol. ' + d.volume;
      astext += ', vol. ' + d.volume;
    }
  }
  if ( d.publisher != "" ) {
    html += ', ' + d.publisher;
    astext += ', ' + d.publisher;
  }

} else if ( d.redif_type == 'software' ) {

  if ( d.publisher != "" & d.series_name != "" ) {
    html += ', ' + d.series_name + ', ' + d.publisher;
    astext += ', ' + d.series_name + ', ' + d.publisher;
  }

}

html += '.';
astext += ', ' + d.url + '.'

text += '<p><b>HTML:</b><br>' + html;

var h = html.replace( /</g, '&lt;' );
html = h.replace( />/g, '&gt;' );

text += '<p><b>HTML mark up:</b><br>' + html;

text += '<p><b>Text:</b><br>' + astext;

text += '<p align="center"><a href="" onClick="return item_as_reference()">Close</a></p>';

return text;

}

////

function get_ris() {

var d = mine_meta_for_reference();
var text = get_ref_start_text( 'RIS entry', 'RefText' );

if ( d.redif_type == 'paper' ) {
  text += 'TY&nbsp;&nbsp;- RPRT';
} else if ( d.redif_type == 'article' ) {
  text += 'TY&nbsp;&nbsp;- JOUR';
} else if ( d.redif_type == 'book' ) {
  text += 'TY&nbsp;&nbsp;- BOOK';
} else if ( d.redif_type == 'chapter' ) {
  text += 'TY&nbsp;&nbsp;- CHAP';
} else if ( d.redif_type == 'software' ) {
  text += 'TY&nbsp;&nbsp;- COMP';
}

if ( d.title != "" ) {
  text += '<br>TI&nbsp;&nbsp;- ' + d.title;
}
if ( d.author != "" ) {
  var auth = d.author.split( /; /g );
  for ( var i = 0; i < auth.length; i++ ) {
    if ( d.isedited ) {
      text += '<br>ED&nbsp;&nbsp;- ' + auth[i];
    } else {
      text += '<br>AU&nbsp;&nbsp;- ' + auth[i];
    }
  }
}
if ( d.date != "" ) {
  var matches = d.date.match( /(\/)/g );
  if ( matches ) {
    var j = matches.length;
  } else {
    var j = 0;
  }
  for ( var i = j; i < 3; i++ ) {
    d.date += '/';
  }
  text += '<br>Y1&nbsp;&nbsp;- ' + d.date;
}

if ( d.redif_type == 'paper' ) {

  if ( d.publisher != "" ) {
    text += '<br>PB&nbsp;&nbsp;- ' + d.publisher;
  }
  if ( d.series_name != "" ) {
    text += '<br>T3&nbsp;&nbsp;- ' + d.series_name;
  }
  if ( d.number != "" ) {
    text += '<br>IS&nbsp;&nbsp;- ' + d.number;
  }

} else if ( d.redif_type == 'article' ) {

  if ( d.series_name != "" ) {
    text += '<br>JF&nbsp;&nbsp;- ' + d.series_name;
  }
  if ( d.volume != "" ) {
    text += '<br>VL&nbsp;&nbsp;- ' + d.volume;
  }
  if ( d.issue != "" ) {
    text += '<br>IS&nbsp;&nbsp;- ' + d.issue;
  }
  if ( d.page_start != "" & d.page_end != "" ) {
    text += '<br>SP&nbsp;&nbsp;- ' + d.page_start + '<br>EP&nbsp;&nbsp;- ' + d.page_end;
  } else if ( d.number != "" ) {
    text += ',<br>SP&nbsp;&nbsp;- ' + d.number;
  }

} else if ( d.redif_type == 'book' ) {

  if ( d.volume != "" ) {
    text += '<br>VL&nbsp;&nbsp;- ' + d.volume;
  }
  if ( d.publisher != "" ) {
    text += '<br>PB&nbsp;&nbsp;- ' + d.publisher;
  }

} else if ( d.redif_type == 'chapter' ) {

  if ( d.chapter != "" ) {
    text += '<br>CP&nbsp;&nbsp;- ' + d.chapter;
  }
  if ( d.page_start != "" & d.page_end != "" ) {
    text += '<br>SP&nbsp;&nbsp;- ' + d.page_start + '<br>EP&nbsp;&nbsp;- ' + d.page_end;
  }
  if ( d.book_title != "" ) {
    text += '<br>BT&nbsp;&nbsp;- ' + d.book_title;
  }
  if ( d.book_editor != "" ) {
    var ed = d.book_editor.split( /;/ );
    for ( var i = 0; i < ed.length; i++ ) {
      text += '<br>ED&nbsp;&nbsp;- ' + ed[i];
    }
  }
  if ( d.volume != "" ) {
    text += '<br>VL&nbsp;&nbsp;- ' + d.volume;
  }
  if ( d.publisher != "" ) {
    text += '<br>PB&nbsp;&nbsp;- ' + d.publisher;
  }

} else if ( d.redif_type == 'software' ) {

  if ( d.publisher != "" & d.series_name != "" ) {
    text += '<br>T3&nbsp;&nbsp;- ' + d.series_name + ', ' + d.publisher;
  }

}

if ( d.abstract != "" ) {
  text += '<br>AB&nbsp;&nbsp;- ' + d.abstract;
}
if ( d.keywords != "" ) {
  var key = d.keywords.split ( /;/ );
  for ( var i = 0; i < key.length; i++ ) {
    text += '<br>KW&nbsp;&nbsp;- ' + key[i];
  }
}
text += '<br>UR&nbsp;&nbsp;- ' + d.url;
text += '<br>ER&nbsp;&nbsp;- ';

text += '<p align="center"><a href="" onClick="return download_tag_text( \'RefText\', \'refdownload\', \'application/x-Research-Info-Systems\' )" download="EconPapers.ris" id="refdownload">Download</a>&nbsp;&nbsp;<a href="" onClick="return item_as_reference()">Close</a></p>';

return text;

}

///

function get_bibtex() {

var d = mine_meta_for_reference();
var text = get_ref_start_text( 'BibTex entry', 'RefText' );

if ( d.redif_type == 'paper' ) {
  text += '@TECHREPORT{' + d.handle;
} else if ( d.redif_type == 'article' ) {
  text += '@ARTICLE{' + d.handle;
} else if ( d.redif_type == 'book' ) {
  text += '@BOOK{' + d.handle;
} else if ( d.redif_type == 'chapter' ) {
  text += '@INCOLLECTION{' + d.handle;
} else if ( d.redif_type == 'software' ) {
  text += '@MISC{' + d.handle;
}

if ( d.title != "" ) {
  text += ',<br>title = {' + d.title + '}';
}
if ( d.author != "" ) {
  var reg = /; /g;
  var auth = d.author.replace( reg, ' and ' );
  if ( d.isedited ) {
    text += ',<br>editor = {' + auth + '}';
  } else {
    text += ',<br>author = {' + auth + '}'
  }
}
if ( d.year != "" ) {
  text += ',<br>year = {' + d.year + '}';
}

if ( d.redif_type == 'paper' ) {

  if ( d.publisher != "" ) {
    text += ',<br>institution = {' + d.publisher + '}';
  }
  if ( d.series_name != "" ) {
    text += ',<br>type = {' + d.series_name + '}';
  }
  if ( d.number != "" ) {
    text += ',<br>number = {' + d.number + '}';
  }

} else if ( d.redif_type == 'article' ) {

  if ( d.series_name != "" ) {
    text += ',<br>journal = {' + d.series_name + '}';
  }
  if ( d.volume != "" ) {
    text += ',<br>volume = {' + d.volume + '}';
  }
  if ( d.issue != "" ) {
    text += ',<br>number = {' + d.issue + '}';
  }
  if ( d.page_start != "" & d.page_end != "" ) {
    text += ',<br>pages = {' + d.page_start + '-' + d.page_end + '}';
  } else if ( d.number != "" ) {
    text += ',<br>pages = {' + d.number + '}';
  }

} else if ( d.redif_type == 'book' ) {

  if ( d.volume != "" ) {
    text += ',<br>volume = {' + d.volume + '}';
  }
  if ( d.edition != "" ) {
    text += ',<br>edition = {' + d.edition + '}';
  }
  if ( d.publisher != "" ) {
    text += ',<br>publisher = {' + d.publisher + '}';
  }

} else if ( d.redif_type == 'chapter' ) {

  if ( d.chapter != "" ) {
    text += ',<br>chapter = {' + d.chapter + '}';
  }
  if ( d.page_start != "" & d.page_end != "" ) {
    text += ',<br>pages = {' + d.page_start + '-' + d.page_end + '}';
  }
  if ( d.book_title != "" ) {
    text += ',<br>booktitle = {' + d.book_title + '}';
  }
  if ( d.book_editor != "" ) {
    var reg = /; /g;
    var ed = d.book_editor.replace( reg, ' and ' );
    text += ',<br>editor = {' + ed + '}';
  }
  if ( d.volume != "" ) {
    text += ',<br>volume = {' + d.volume + '}';
  }
  if ( d.edition != "" ) {
    text += ',<br>edition = {' + d.edition + '}';
  }
  if ( d.publisher != "" ) {
    text += ',<br>publisher = {' + d.publisher + '}';
  }

} else if ( d.redif_type == 'software' ) {

  if ( d.publisher != "" & d.series_name != "" ) {
    text += ',<br>howpublished = {' + d.series_name + ', ' + d.publisher + '}';
  }

}

if ( d.abstract != "" ) {
  text += ',<br>abstract = {' + d.abstract + '}';
}
if ( d.keywords != "" ) {
  text += ',<br>keywords = {' + d.keywords + '}';
}
text += ',<br>url = {' + d.url + '}';
text += '<br>}<p align="center"><a href="" onClick="return download_tag_text( \'RefText\', \'refdownload\', \'application/x-bibtex\' )" download="EconPapers.bib" id="refdownload">Download</a>&nbsp;&nbsp;<a href="" onClick="return item_as_reference()">Close</a></p>';

return text;

}

///

function download_tag_text( tagid, linkid, mime ) {

var doc = window.top.document;
var elem = doc.getElementById( tagid );
var linkelem = doc.getElementById( linkid );
var text = elem.innerHTML;
text = text.replace( /<br>/g, "\n" );
text = text.replace( /&nbsp;/g, " " );

linkelem.href = 'data:' + mime + ';charset=utf-8,'
          + encodeURIComponent( text );

}

///

function get_ref_start_text( heading, id ) {

var text = '<p class="bibheadingleft" id="bhleft">' + heading + '</p><p class="bibheadingright" id="bhright" onClick="return item_as_reference()" onmouseover="this.style.color=\'black\'"  onmouseout="this.style.color=\'white\'">X</p><p id="' + id + '" style="clear: both">';

return text;

}

///
function mine_meta_for_reference() {

var title       = '';
var isedited    = '';
var author      = '';
var series_name = '';
var publisher   = '';
var keywords    = '';
var handle      = '';
var date        = '';
var year        = '';
var abstract    = '';
var redif_type  = '';
var volume      = '';
var issue       = '';
var number      = '';
var page_start  = '';
var page_end    = '';
var edition     = '';
var book_editor = '';
var book_title  = '';
var chapter     = '';
var url         = '';

var meta = document.getElementsByTagName('meta');
for ( var i = 0; i < meta.length; i++ ) {

  if ( meta[i].name == 'citation_title' ) {
    title = meta[i].content;
  }
  if ( meta[i].name == 'isedited' ) {
    isedited = meta[i].content;
  }
  if ( meta[i].name == 'citation_authors' ) {
    author = meta[i].content;
  }
  if ( meta[i].name == 'series' ) {
    series_name = meta[i].content;
  }
  if ( meta[i].name == 'citation_publisher' || meta[i].name == 'citation_technical_report_institution' ) {
    publisher = meta[i].content;
  }
  if ( meta[i].name == 'citation_keywords' ) {
    keywords = meta[i].content;
  }
  if ( meta[i].name == 'citation_abstract_html_url' ) {
    url = meta[i].content;
    reg = /(RePEc:.+$)/i;
    handle = reg.exec( url )[0];
  }
  if ( meta[i].name == 'citation_abstract' ) {
    abstract = meta[i].content;
  }
  if ( meta[i].name == 'citation_year' ) {
    year = meta[i].content;
  }
  if ( meta[i].name == 'citation_date' ) {
    date = meta[i].content;
  }
  if ( meta[i].name == 'redif-type' ) {
    redif_type = meta[i].content;
  }
  if ( meta[i].name == 'citation_volume' ) {
    volume = meta[i].content;
  }
  if ( meta[i].name == 'citation_issue' ) {
    // article
    issue = meta[i].content;
  }
  if ( meta[i].name == 'wp-number' ) {
    // paper
    number = meta[i].content;
  }
  if ( meta[i].name == 'citation_firstpage' ) {
    page_start = meta[i].content;
  }
  if ( meta[i].name == 'citation_lastpage' ) {
    page_end = meta[i].content;
  }
  if ( meta[i].name == 'book_edition' ) {
    edition = meta[i].content;
  }
  if ( meta[i].name == 'book_title' ) {
    book_title = meta[i].content;
  }
  if ( meta[i].name == 'book_editor' ) {
    book_editor = meta[i].content;
  }
  if ( meta[i].name == 'book_chapter' ) {
    chapter = meta[i].content;
  }

}

return { title:title, isedited:isedited, author:author, series_name:series_name, publisher:publisher, keywords:keywords,
         handle:handle, year:year, date:date, abstract:abstract, redif_type:redif_type, volume:volume, issue:issue, number:number,
         page_start:page_start, page_end:page_end, edition:edition, book_editor: book_editor, book_title:book_title,
         chapter:chapter, url:url };

}
///////////////////////////////
// Some borrowed code
///////////////////////////////

// http://www.geekdaily.net/2007/07/04/javascript-cross-browser-window-size-and-centering/

window.size = function()
{
  var w = 0;
  var h = 0;

  //IE
  if(!window.innerWidth)
  {
    var doc = parent.document;
    //strict mode
    if(!(doc.documentElement.clientWidth == 0))
    {
      w = doc.documentElement.clientWidth;
      h = doc.documentElement.clientHeight;
    }
    //quirks mode
    else
    {
      w = doc.body.clientWidth;
      h = doc.body.clientHeight;
    }
  }
  //w3c
  else
  {
    //var wind = parent.window;
    var wind = window.top;
    w = wind.innerWidth;
    h = wind.innerHeight;
  }
  return {width:w,height:h};
}

window.center = function()
{
  var hWnd = (arguments[0] != null) ? arguments[0] : {width:0,height:0};

  var _x = 0;
  var _y = 0;
  var offsetX = 0;
  var offsetY = 0;

  //IE
  if(!window.pageYOffset)
  {
    var doc = parent.document;
    //strict mode
    if(!(doc.documentElement.scrollTop == 0))
    {
      offsetY = doc.documentElement.scrollTop;
      offsetX = doc.documentElement.scrollLeft;
    }
    //quirks mode
    else
    {
      offsetY = doc.body.scrollTop;
      offsetX = doc.body.scrollLeft;
    }
  }
  //w3c
  else
  {
    var wind = window.top;
    offsetX = wind.pageXOffset;
    offsetY = wind.pageYOffset;
  }

  _x = ((this.size().width-hWnd.width)/2)+offsetX;
  _y = ((this.size().height-hWnd.height)/2)+offsetY;

  return{x:_x,y:_y};
}

/**
 * Read the JavaScript cookies tutorial at:
 *   http://www.netspade.com/articles/javascript/cookies.xml
 */

/**
 * Sets a Cookie with the given name and value.
 *
 * name       Name of the cookie
 * value      Value of the cookie
 * [expires]  Expiration date of the cookie (default: end of current session)
 * [path]     Path where the cookie is valid (default: path of calling document)
 * [domain]   Domain where the cookie is valid
 *              (default: domain of calling document)
 * [secure]   Boolean value indicating if the cookie transmission requires a
 *              secure transmission
 */
function setCookie(name, value, expires, path, domain, secure)
{
    document.cookie= name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

/**
 * Gets the value of the specified cookie.
 *
 * name  Name of the desired cookie.
 *
 * Returns a string containing value of specified cookie,
 *   or null if cookie does not exist.
 */
function getCookie(name)
{
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1)
    {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
    {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

/**
 * Deletes the specified cookie.
 *
 * name      name of the cookie
 * [path]    path of the cookie (must be same as path used to create cookie)
 * [domain]  domain of the cookie (must be same as domain used to create cookie)
 */
function deleteCookie(name, path, domain)
{
    if (getCookie(name))
    {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}
