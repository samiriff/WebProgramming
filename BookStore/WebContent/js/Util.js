/*
 * $Id: Util.js 274872 2013-03-06 16:28:14Z mcaron $ 
 */

//! include /ui/extlib/yui/js/yahoo-dom-event/yahoo-dom-event.js
//! include /ui/extlib/yui/js/animation/animation.js 


function Util() {
}



/**
 * Constructor that creates a browserInfo object.
 * One is created right below so outside scripts can use that one directly and
 * should not create an instance of this object.
 *
 * This script is a slightly modified version of the following one:
 *
 * Script Name: Simple Javascript Browser/OS detection
 * Authors: Harald Hope, Tapio Markula, Websites: http://techpatterns.com/
 * http://www.nic.fi/~tapio1/Teaching/index1.php3
 * Script Source URI: http://techpatterns.com/downloads/javascript_browser_detection.php
 * Version 2.0.1
 * Copyright (C) 08 August 2004
 */
function BrowserInfo() {
   
    this.mac = false;
    this.win = false;
    this.lin = false;
    this.op = false;
    this.konq = false;
    this.saf  = false;
    this.moz = false;
    this.ie = false;
    this.ie4 = false;
    this.ie5x = false;
    this.ie5xmac = false;
    this.ie5xwin = false;
    this.ns4x =false;
    
    var d = document;
    var n = navigator;
    var na = n.appVersion;
    var nua = n.userAgent;
    this.win = ( na.indexOf( 'Win' ) != -1 );
    this.mac = ( na.indexOf( 'Mac' ) != -1 );
    this.lin = ( nua.indexOf( 'Linux' ) != -1 );
    this.ipad = nua.indexOf('iPad') != -1;
    this.iphone = nua.indexOf('iPhone') != -1;
    this.ios = this.ipad || this.iphone;
    this.ff = nua.indexOf('Firefox') != -1;
    this.android = nua.indexOf('Android') != -1;
    this.saf = ( nua.indexOf( 'Safari' ) != -1 );
    
        if ( !d.layers ){
            var dom = ( d.getElementById );
            this.op = ( nua.indexOf( 'Opera' ) != -1 );
            this.konq = ( nua.indexOf( 'Konqueror' ) != -1 );
            this.moz = ( nua.indexOf( 'Gecko' ) != -1 && !this.saf && !this.konq);
            this.ie = ( d.all && !this.op );
            this.ie4 = ( this.ie && !dom );
        
            /*
            ie5x tests only for functionality. ( dom||ie5x ) would be default settings. 
            Opera will register true in this test if set to identify as IE 5
            */
        
            this.ie5x = ( d.all && dom );
            this.ie5xmac = ( this.mac && this.ie5x );
            this.ie5xwin = ( this.win && this.ie5x );
        } else {
           this.ns4x = true;
        }
}

/**
 * creates an instance of a browser detector object.
 * To use just test for the properties on the object.
 * example: Util.browserInfo.ie returns true if the browser is IE.<b> 
 * Look at the above constructor for all the variables that can be tested for.
 */
Util.browserInfo = new BrowserInfo();

Util.ieVersion = function ieVersion() {
  var m = /MSIE ([0-9]+\.[0-9]+)/.exec(navigator.userAgent);
  return m&&m[1];
};

Util.ieCompat = function() {
    return parseInt(this.ieVersion()) == 7 && (navigator.userAgent.indexOf('Trident') != -1);
};

Util.quirksMode = function() {
    var winDoc = window.document;
    return ((parseInt(this.ieVersion()) <= 7 && winDoc.compatMode == 'BackCompat') || 
        (winDoc.documentMode && winDoc.documentMode <= 5));
};

Util.ffVersion = function() {
  var m = /Firefox\/([0-9\.]+)/.exec(navigator.userAgent);
  return m&&parseFloat(m[1]);
};

Util.isChrome = function () {
  return (navigator.userAgent.indexOf("Chrome") !== -1);
};

Util.geckoVersion = function geckoVersion() {  
  var m = /Gecko\/([0-9]+)/.exec(navigator.userAgent);
  return m&&m[1];
};

Util.isSafari = function () {
    var uAgent = navigator.userAgent;
    return (uAgent.indexOf("Apple") !== -1);
};

Util.browserInfo.ieQuirks = Util.quirksMode();
Util.browserInfo.css3Support = ((Util.ieVersion() >= 9 && !Util.browserInfo.ieQuirks) || Util.ffVersion() >= 3.1 || Util.isChrome() || Util.isSafari());

/**
 * Returns the major and minor numbers of the Safari family version as a decimal
 * number (i.e., MAJOR.MINOR, such as 3.0 or 5.1), or 0 if no valid number found
 */
Util.safariVersion = function () {  
    // Find "Version/MAJOR.MINOR.SUBMINOR" in the user agent string
    // and pull out "MAJOR.MINOR.SUBMINOR";
    // see http://developer.apple.com/library/IOS/#documentation/AppleApplications/Reference/SafariWebContent/OptimizingforSafarioniPhone/OptimizingforSafarioniPhone.html#//apple_ref/doc/uid/TP40006517-SW3
    var result = 0,
        versionRegExResult = /Version\/([\w.]+)/.exec(navigator.userAgent),
        versionStr = (versionRegExResult && versionRegExResult.length >= 2) ? versionRegExResult[1] : null;
    if (versionStr) {
        result = parseFloat(versionStr); // parseFloat will parse only the "MAJOR.MINOR" portion of "MAJOR.MINOR.SUBMINOR"...
        if (isNaN(result)) {
            result = 0;
        }
    }
    return result;
};

/**
 * Short way to do a document.getElementById.
 * Also you to pass in the document element or the id. 
 *
 * save some typing... everwhere
 * @param id The DOM id
 */
Util.gebi = function(id) {
     return document.getElementById(id);
};

/**
 * Obtains an element either by id or returns the object if it is the
 * document element.
 * Also you to pass in the document element or the id. 
 *
 * @param elem The id of the DOM element or the element itself(Used by other functions)
 */
Util.ge = function(elem) {

  if (typeof elem == "string") {
    return document.getElementById(elem);
  }
  else
     return elem;
};

//save some type again (get field by name)
Util.gfbn = function(name) {
  return document.forms[0][name];
};

/////////////////
//  CROCKFORD
/////////////////

Function.prototype.method = function (name, func) {
  this.prototype[name] = func;
  return this;
};

/*
  Will scroll the field to be 20px from the top of
  the window or the "scrollarea" div, and will
  put the focus on the field, so users can start typing.
  Usage:
  <script type="text/javascript"><!--
  focusOnLoad("<%=key%>");
  //--></script>
*/

Util.scrollFunction = null;

Util.focusOnLoad = function focusOnLoad(fieldID) {
  Util.scrollFunction = function() {
    var scroller = Util.gebi("scrollarea");
    var field = Util.gebi(fieldID);
    if (scroller && field) {
      scroller.scrollTop = 1000000;
      field.focus();
      scroller.scrollTop -= 20;
    } else if (field) {
      window.scrollTo(0,1000000);
      field.focus();
      window.scrollBy(0,-20);
    }
    return true;
  };
};

/* Sets the focus event 1/10 of a second later.   This is
 * necessary because on methods such on onblur where you want to
 * set focus, browser sets focus after onblur is called.
 * @param - field to set focus to.   
 */
Util.setFocusDelayed = function setFocusDelayed(field) {        
    setTimeout( function(){field.focus()},10);    
};
 

// for old browsers
var undefined;
if (!Array.prototype.splice)
{
  Array.prototype.splice = function (index, howMany) {
    var removed=[];
    var toAdd = arguments.length - 2;
    var newLength = this.length + toAdd - howMany;
    for (var i=0 ; i<howMany ; ++i)
      removed[i] = this[index+i];
    var src = index+howMany;
    var dst = index+toAdd;
    var n = this.length - src;
    if (src < dst) {
      for (i=n ; --i>=0 ; ) this[dst+i] = this[src+i];
    } else if (src > dst) {
      for (i=0 ; i<n ; ++i) this[dst+i] = this[src+i];
    }
    for (i=0 ; i<toAdd ; ++i)
      this[i+index] = arguments[i+2];
    this.length = newLength;
    return removed;
  };
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function(str) {
    for (var idx = 0; idx < this.length; idx++) {
      if (str == this[idx]) {
        this.splice(idx, 1);
      }
    }
  }
}

if (!Array.prototype.contains)
{
  Array.prototype.contains = function(obj) { 
    var len = this.length;
    for(var index = 0; index < len; index++) {    
      if(this[index] === obj) {      
        return true;    
      }  
    }  
    return false;
  };
}

/**
 *  isArray implementation for browsers which don't support
 *  the native method. Provides additional safety around array objects
 *  passed between frames.
 *
 *  @param {Object} vArg  The object to be checked
 *  
 *  @return {Boolean} Returns true if an object is an array, false if it is not.
 */
if (!Array.isArray) {
  Array.isArray = function(vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}


/**
 *  forEach executes the provided function (fn) once for each 
 *  element present in the array. fn is invoked only for indexes 
 *  of the array which have assigned values; it is not invoked for indexes 
 *  which have been deleted or which have never been assigned values.
 *
 *  @param {Function} fn    Function to execute for each element.
 *  @param {Object=}  scope Object to use as this when executing fn.
 *
 */
if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  }
}

Util.getUniqueUrl = function(oldUrl)
{
    var str = new String(oldUrl);
    if(str.indexOf('?') > -1)
        str += '&' + Date.parse(new Date().toString());
    else
        str += '?' + Date.parse(new Date().toString());
    
    return str;
    
};



/**
 * Adds a chained event handler to an HTML DOM element.
 *
 * If the DOM element does not have any previously set event handler,
 * the event handler is set directly (no chaining).  Chained, or
 * unchained, the handler function is called as though it were
 * directly invoked by the event.  This means, that "this" will be the
 * DOM element, and the arguments (if any) are the same as the browser
 * provides.
 *
 * Event handlers are called in the order they are chained.
 *
 * The return value of the last event handler to be chained will be
 * the return value of the entire chain.  (All previously chained
 * handler's return values are discarded).
 *
 * @param elem - the HTML DOM element (usually obtained via
 * document.getElementById(...))
 * @param event - the DOM name of the event (note, this is usually the
 * same as the HTML onXXX handler in all lower-case)
 * @param handler - the event handler function
 */
Util.chain = function(elem,evt,handler)
{
  if (typeof elem == "string") {
    elem = document.getElementById(elem);
  }

  var prev = elem[evt];

  if (prev) {
    elem[evt] = function () {
      try {
        prev.apply(this, arguments);
      } catch (ignored) {}

      return handler.apply(this, arguments);
    };
  } else {
    elem[evt] = handler;
  }
  if (Util.browserInfo.ie) {
    chains[chains.length] = {elem:elem, event:evt};
  }
};


if (Util.browserInfo.ie) {
  // IE only: track chains and undo them,
  // to avoid memory leak and severe slowdown.
  var chains=[];
  Util.chain(window, "onunload", function unchainEverything() {
    try {
      for (var i=0, n=chains.length; i<n; i++) {
        var c = chains[i];
        var handler = c.elem[c.event];
        c.elem[c.event]=null;
      }
    } catch (e) {
      //XXX/ADW ignore
    }
  });
}

/**
 * Use this function to escape HTML in javascript.
 *
 * @param text:  [REQUIRED] the text to escape
 * @param nl:    [OPTIONAL] the string to replace newlines ('\n') with. For example, replace all newlines
 *                          with &lt;br/&gt;
 * @param empty: [OPTIONAL] if text is empty or null, use this as the returned value. NOTE empty is NOT escaped.
 */
Util.escapeHTML = function(text,nl,empty)
{
  if (typeof nl != 'string') nl = "\n";
  if (typeof empty != 'string') empty = "";

  return ((text||"").toString().
    replace(/&/g,'&amp;').
    replace(/</g,'&lt;').
    replace(/>/g,'&gt;').
    replace(/\"/g,'&quot;').
    replace(/\'/g,'&#39;').
    replace(/\n|\r\n?/g, nl)) || empty;
};

Util.pageOffset = function(e) {
  var x=0, y=0;
  for (;e;e=e.offsetParent) {
    y += e.offsetTop;
    x += e.offsetLeft;
  }
  return {x:x,y:y};
};

Util.isSafeURL = function (url) {
    if (url.indexOf("http://") == 0 || url.indexOf("https://") == 0) {
        return true;
    } else {
        return false;
    }
};

Util.openCtrWin = function(url, name, opts) {
  var win = window.open(url, name, opts);
  var w = opts.replace(/.*width=([0-9]+).*/,"$1");
  var h = opts.replace(/.*height=([0-9]+).*/,"$1");
  if (win == null) {
    alert(MSGS.IE_POPUP_SECURITY_MSG);
    return;
  }  
  if (w && h) {
    win.resizeTo(w, h);
    win.moveTo((screen.width - w)/2, (screen.height - h)/2);
  }
  return win;
};



Util.openUrl = function(helpURL) {
   window.open(helpURL,'sfhelp','scrollbars,resizable,height=480,width=730');
};




/* following functions used for expanding and collapsing textareas */
Util.expandArea = function(area)
{
  var obj = document.getElementById(area);
  obj.expand = 'true';
  if(obj.scrollHeight/16 > 4)
    obj.rows = obj.scrollHeight/16 +3;
  else
    obj.rows = obj.rows + 10;
};


/**
 * Shows an element.
 * @param elem The id or the document element to show.
 * @param isBlock optional boolean to say if the element is a block-level element
 */
Util.show = function(elem, isBlock) {
  Util.ge(elem).style.display = (isBlock) ? 'block' : '';
};

/**
 * Checks if this element is visible.
 * 
 * @param {Object} elem String id or dom element to check.
 */
Util.visible = function(elem) {
    return (elem.type != "hidden" && Util.ge(elem).style.display != 'none' && Util.ge(elem).style.visibility != 'hidden');
};

/**
 * Hides an element from view(unblocking).
 * @param elem The id or the document element to hide.
 */
 Util.hide = function(elem) {
  Util.ge(elem).style.display='none';
};


/**
 * Finds a parent of a node with a specific id.
 * @param child The starting node.
 * @param parentId The id to look for in a parent node.
 * @param levels The max number of parents that should be traversed up the
 * chain.
 */
Util.findParentWithId = function(start, parentId, levels) {
    
    for(var i = levels; start !== undefined && i > levels; levels--) {
        var parent = start.parentNode;  
        if(parent.id == parentId) {
           return parent;
        }
        start = parent;
    }
    
    return undefined;
    
};

/**
 * Toggles a element between show and hide.
 * @param The id.
 */
Util.toggleHide = function (elem) {
  var de = Util.ge(elem);

  if (de.style.display == 'none')  {
     de.style.display= '';
  } else {
     de.style.display = 'none';
  }
};



Util.showAll = function(ids) {
  var i;
  for (i=0; i<ids.length; i++) {
    document.getElementById(ids[i]).style.display='';
  }
};

Util.hideAll = function(ids) {
  var i;
  for (i=0; i<ids.length; i++) {
    document.getElementById(ids[i]).style.display='none';
  }
};


Util.setField = function(id, val) {
  document.getElementById(id).value = val;
};



Util.detectPlugin = function(name) {
  var i=0, n, p = navigator.plugins;
  if (p && (n=p.length)>0) {
    for (;i<n ; ++i) {
      if (p[i].name.indexOf(name)>=0 || p[i].description.indexOf(name)>=0)
        return true;
    }
  }
  
  return false;
};

Util.detectMimeTypes = function() {
  for (var i=0, a=arguments, n=arguments.length ; i<n ; ++i) {
    if (navigator.mimeTypes[a[i]] && navigator.mimeTypes[a[i]].enabledPlugin != null)
      return true;
  }
  return false;
};

Util.detectActiveX = function(name) {
  try {
    if (ActiveXObject && "object" == typeof new ActiveXObject(name))
      return true;
  } catch(e) {}
  return false;
};


/**
 * Sets the field whose id is 'id' to value 'value' and submits the form.
 * The submitted form is the form the field is in.
 * This funtion will call the form's onsubmit handler, and won't submit
 * if the handler returns false.
 */
Util.setFieldAndSubmit = function(id, value) {
  var form = Util.gebi(id).form;
  var retval = true;
  if(form.onsubmit) {
    retval = form.onsubmit();
  }
  if(retval) {
    Util.setField(id, value);
    form.submit();
  }
};


/**
 * Tells the browser to set the value of this field to 'value' (default is
 * empty-string) whenever the page is loaded, even if it's from a browser
 * back/forward button.
 *
 * If you're setting a field using setFieldAndSubmit(),
 * you should probably also be using resetFieldOnLoad() on the field,
 * to avoid the problem where the field is still set when the user hits "Back".
 */
Util.resetFieldOnLoad = function(id, value) {
  if (!value) {
    value = "";
  }
  Util.chain(window,"onload",function() {
      Util.gebi(id).value=value;
    }
  );
};

Util.setColDisplay = function(tableid, column, display) {
  var tab = document.getElementById(tableid);
  var r;
  for (r=0; r<tab.rows.length; r++) {
    var row = tab.rows[r];
      var cell = row.cells[column];
      cell.style.display=display;
  }
};

Util.hideCol = function(tableid, column) {
  Util.setColDisplay(tableid, column, 'none');
};

Util.showCol = function(tableid, column) {
  Util.setColDisplay(tableid, column, '');
};

/**
 * Returns the key character from a keyboard event object.
 * @param e The event object to extract the key character.
 */
Util.getEventKeyNum = function(e) {

       var keynum;
       if(window.event) { //IE
           keynum = e.keyCode;
        }
        else if(e.which)  { // Netscape/Firefox/Opera
           keynum = e.which;
         }

        return keynum;
 };



/**
 * Checks or unchecks HTML elements, fetched by ID.
 *
 * @param ids - an array of String ids of HTML elements (checkboxes)
 * @param value - the value ("true" or "false") to set the elements' "checked" attribute to.
 */
Util.setCheckedValue = function(ids, value) {
  for (var i in ids) {
    var id = ids[i];
    var element = Util.gebi(id);
    if (element) {
      element.checked = value;
    }
  }
};

/**
 * set HTML select value based .
 *
 * @param id - HTML select
 * @param value - the value to set
 */
Util.setSelectedValue = function(id, value)
{
  var SelectObject = document.getElementById(id);
  if (SelectObject == null)
    return;

  this.setSelectedValueByElem (SelectObject, value);
};


/**
 * set HTML select value based .
 *
 * @param SelectElem - HTML select
 * @param value - the value to set
 */
Util.setSelectedValueByElem = function(SelectElem, value)
{
  if (SelectElem == null)
    return;

  for(var index = 0; index < SelectElem.length; index++) {
    if(SelectElem[index].value == value)
      SelectElem.selectedIndex = index;
  }
};


/**
 * @deprecated
 * Use SFDOMEvent.getXY(event) to return the event's page x and y.
 * 
 * useful when called from within a mouse event hander.
 * @param e - the first argument in the mouse handler (i.e. onmousemove(e)).
 * @return object of the form {'x':x, 'y':y}, where x and y are the
 * coordinates of the mouse relative to the top-left corner of the document.
 */
Util.getMousePos = function(e)
{
  var pos = {x:0, y:0};
  if (!e) {
    var e = window.event;
  }
  if (e.pageX || e.pageY) {
    pos.x = e.pageX;
    pos.y = e.pageY;
  } else if (e.clientX || e.clientY) {
    var docEl = document.documentElement; 
    pos.x = e.clientX + (docEl && docEl.scrollLeft ? docEl.scrollLeft : document.body.scrollLeft);
    pos.y = e.clientY + (docEl && docEl.scrollTop ? docEl.scrollTop : document.body.scrollTop);
  }
  return pos;
};


Math.sgn = function(n) {
  if (n==0) return 0;
  if (n > 0) return 1;
  return -1;
};

Math.randSgn = function() {
  var x = Math.random();
  if (x < 1/3) return -1;
  if (x >= 2/3) return 1;
  return 0;
};



Util.set = function(e, vals) {
  if (vals) {
    for (var i in vals) {
      if (e[i] && ("object" == typeof vals[i])) {
        Util.set(e[i], vals[i]);
      } else {
        e[i] = vals[i];
      }
    }
  }
  return e;
};

/**
 * Gives the table's data rows alternating light and dark grey coloring.
 * Doesn't affect elements in the thead or tfoot.
 * @param tab - the table element, or the id of a table element
 * @param trType - Apply alternative to tr elements that have a type attribute that matches trType.
 *                 This is useful when to want to target specific rows to alternate on.
 *                 Optional, if not given alternates all rows under tab.
 *
 */
Util.alternateRowColors = function(tab, trType) {
  if (typeof tab == "string") {
    tab = Util.gebi(tab);
  }
    
  var cellClass = 'dataRow';
  for (var t=0; t<tab.tBodies.length; t++) {
    var tBody = tab.tBodies[t];
    for (var r=0; r<tBody.rows.length; r++) {
      var row = tBody.rows[r];
      var alternate = true;
      if( trType != undefined) {
        var type = row.getAttribute("type");
        if(type != undefined && type == trType)
           alternate = true;
        else
           alternate = false;
       }

       if (alternate == true) {
          for (var c=0; c<row.cells.length; c++) {
             var cell = row.cells[c];
             cell.className = cellClass;
          }
          cellClass = (cellClass == 'dataRow' ? 'dataRowAlt' : 'dataRow');
       }
    }
  }
};


Util.imgBtnSubmit = function(name) {
  var f = Util.gfbn(name);
  //if (f.onclick && !f.onclick()) {
  //  return false;
 //}
  f.click();
  return false;
};



/**
 * wraps the string in quotes AND replaces end-of-lines with \n.
 * */
String.method('quote', function () {
  return '"' + this.replace(/(["\\])/g, '\\$1').replace(/\r\n?|\n/g, '\\n') + '"';
});

String.method('trim', function() {
  return this.replace(/^\s+/,"").replace(/\s+$/,"");
});

String.method('equalsIgnoreCase', function(arg) {
  return this.toLowerCase().toUpperCase() == arg.toLowerCase().toUpperCase();
});




String.method('entityify', function () {
      return this.replace(/&/g, "&amp;").replace(/</g,
      "&lt;").replace(/>/g, "&gt;");
    });

String.method('truncateByLength', function(maxLength) {
       if (maxLength > -1) {
            if (this.length > maxLength) {
                return this.substring(0, maxLength) + '...';
            }
            else {
                return this;
            }
        }
    });



Util.redirectPost = function(url)
{
   document.forms[0].action = url;
   document.forms[0].submit();
};

/**
 *  Adds an empty Catch block to prevent IE for throwing an Unknown exception
 *  when javascript is used to set the window.location.href leading to an onbeforeunload event
 *  @param {STRING} url     The URL which the page needs to redirect
 */
Util.gotoURL = function (url, dontCheckSecurityCrumb) {
  if (!dontCheckSecurityCrumb) {
      var PARAM_SECURITY_CRUMB_WITH_EQUALS = '_s.crb=';
      if (window.ajaxSecKey && url && (url.indexOf(PARAM_SECURITY_CRUMB_WITH_EQUALS) < 0)) {
          var queryIndex = url.indexOf('?');
          var hashIndex = url.indexOf('#');
          var hash = ""; 
          if (hashIndex >= 0 && hashIndex > queryIndex) {
              hash = url.substring(hashIndex);
              url = url.substring(0, hashIndex);
          }
          
          // add the ajax secrity key to the URL
          url += ((queryIndex < 0) ? '?' : '&') + PARAM_SECURITY_CRUMB_WITH_EQUALS + window.ajaxSecKey + hash;
      }  
  }
  try {
      window.location.href = url;
  } catch (ex) {
      // Swallow error that may result because of onbeforeunload halting the new page from loading in IE
  }
};

/**
 * Utility method to determine whether or not an array contains a particular object.
 *
 * @param anArray Array of objects
 * @param item Object to look for in array
 * @author Mark Fleschler
 */
Util.arrayContains = function(anArray, item) {

  if (anArray == undefined || anArray == null) {
    return false;
  }

  for (var i=0; anArray.length != null && i<anArray.length; i++) {
    if (anArray[i] == item) {
      return true;
    }
  }
  return false;
};



/**
 * Returns an object that contains the absolute x and y coordinate values as well
 * as the w and h of the element in pixels.
 *
 * @param idOrE The dom element or its id.
 */
Util.getAbsPos = function(idOrE) {
  var c = Util.ge(idOrE);
  var r = {x:0,y:0,w:c.offsetWidth,h:c.offsetHeight};
  for (var i=c;i;i=i.offsetParent) {
    r.x += i.offsetLeft;
    r.y += i.offsetTop;
  }
  for (var i=c;i!=document.body;i=i.parentNode) {
    if (i.scrollLeft) r.x -= i.scrollLeft;
    if (i.scrollTop) r.y -= i.scrollTop;
  }
  if (Util.browserInfo.ie) { // needed for IE to account for borders
    for (var i=c.offsetParent ; i ; i=i.offsetParent) {
      r.x += i.clientLeft;
      r.y += i.clientTop;
    }
  }
  return r;
};

/**
 * Display confirmation dialog to decide whether to continue with submit.
 *
 * @param id text element with confirmation message
 * @return true to do submit, otherwise false
  */
Util.confirmOnGo = function(id) {
  var ev = Util.gebi(id).value;
  if (null != ev && ev != '') {
    if (confirm(ev)) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

Util.urlEncodeForm = function(form) {
  var elems = form.elements;
  var url = [];
  for (var i=0, n=elems.length ; i<n ; ++i) {
    var f = elems[i];
    if (f.name) {
      switch (f.type) {
      case 'select-one':
        var value = "";
        if (f.selectedIndex >=0) {
            value = f.options[f.selectedIndex].value;
        }
        url[url.length] = f.name + '=' + encodeURIComponent(value);
        break;
      case 'select-multiple':
        for (var j=0, options = f.options, m=options.length ; j<m ; ++j) {
          if (options[j].selected) {
            url[url.length] = f.name + '=' + encodeURIComponent(options[j].selected);
          }
        }
        break;
      case 'button':
      case 'radio':
      case 'checkbox':
        if (!f.checked) {
          break;
        }
        // else fall through
      default:
        url[url.length] = f.name + '=' + encodeURIComponent(f.value);
      }
    }
  }
  return url.join('&');
};


/*
 * Returns a call back function that delegates a call out to method on
 * a object instance. This function makes sure that the method
 * gets executed within the scope of the object.
 *
 * @param obj The object instance to invoke a method on.
 * @parma methodName The name of the method on the obj to invoke later.
 */
Util.createCallback = function(obj, methodName){

    return (function(result){

        /* The  handler calls a method of the object - obj - with
           the name held in the string - methodName - passing the result
           object and a reference to the element to
           which the event handler has been assigned using the - this -
           (which works because the inner function is executed as a
           method of that element because it has been assigned as an
           event handler):-
        */
        return obj[methodName](result, this);
    });
};

/*
 * Returns a call back function that delegates a call out to method on
 * a object instance. This function makes sure that the method
 * gets executed within the scope of the object.
 *
 * @param obj The object instance to invoke a method on.
 * @parma methodName The name of the method on the obj to invoke later.
 */
Util.createCallback = function(obj, methodName, args){

    return (function(result){

        /* The handler calls a method of the object - obj - with
           the name held in the string - methodName - passing the result
           object and a reference to the element to
           which the event handler has been assigned using the - this -
           (which works because the inner function is executed as a
           method of that element because it has been assigned as an
           event handler):-
        */
        return obj[methodName](result, args, this);
    });
};

/*
 * Escape special characters in Regular Expression patterns
 */
RegExp.escape = (function() {
  var specials = [
    '/', '.', '*', '+', '?', '|', '$',
    '(', ')', '[', ']', '{', '}', '\\',
    '&', '^'];

  var sRE = new RegExp(
    '(\\' + specials.join('|\\') + ')', 'g'
  );

  return function(text) {
    return text.replace(sRE, '\\$1');
  };
})();


Util.findURLParam = function findURLParam( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
};

/**
 * Ignores multiple mouseout mouseover events from being fired by inner
 * elements in IE. 
 * In IE if you have nested elements(divs,spans,etc) and you bind a mouseover/mouseout
 * event on the top element then it will get fired even when mouseover/mousout on
 * inner elements. You can use the method to force your listener to only
 * get invoked when there is a mouseover/mouseout on the top element.
 * 
 * Refer to http://www.dynamic-tools.net/toolbox/isMouseLeaveOrEnter/
 * To use it wrap your listener with it.
 * 
 * <span onmouseout="if(Util.isMouseLeaveOrEnter(event, this) ) { your listener function }">
 *    <span class="left">
 *       <span class="right"/>...content...</span>
 *    </span>
 * </span>
 * @param {Object} e The event object.
 * @param {Object} handler The current elem.
 */
Util.isMouseLeaveOrEnter = function isMouseLeaveOrEnter(e, handler) 
{ 
    if (e.type != 'mouseout' && e.type != 'mouseover') return false; 
    var reltg = e.relatedTarget ? e.relatedTarget : 
    e.type == 'mouseout' ? e.toElement : e.fromElement; 
    while (reltg && reltg != handler) reltg = reltg.parentNode; 
    return (reltg != handler); 
};


/*
 * scroll an elements vertically into view
 *
 * @param scrollElm The element that needs to be scrolled into view.
 * @parma optional - container The container object to scroll.
 */
Util.scrollToView = function scrollToView (scrollElm, container, delay) 
{
    if (!container) {
        container = scrollElm;
    }
    
    var scrollInc = YAHOO.util.Dom.getY(scrollElm) + scrollElm.offsetHeight 
                    - YAHOO.util.Dom.getY(container) - container.clientHeight;
    var padding = 4;
    if (scrollElm.offsetHeight > container.clientHeight) {
        scrollInc = scrollInc - (scrollElm.offsetHeight - container.clientHeight);
        padding = -4;
    }
    
    if (scrollInc > 0) {
       var ScrollTopInc = container.scrollTop + scrollInc + padding;
       
       if (delay > 0) {
           var myAnim = new YAHOO.util.Scroll(container, {
                  scroll: {to: [container.scrollLeft, ScrollTopInc ] }
                   }, delay, YAHOO.util.Easing.easeIn);
            myAnim.animate();
       } else {
           container.scrollTop += ScrollTopInc;
       }
    }
};

Util.saveDialog = function saveDialog() {
    if (SavingIndicator.HAS_CHANGED && SavingIndicator.HAS_CHANGED == true) {
        var result = confirm(MSGS.COMMON_Unsaved_Changes);
        if (!result) {
            return false;
        } else {
            SavingIndicator.CLEAR_EVT.fire();
        }
    }
};

Util.switchUserConfirmation = function switchUserConfirmation() {
    if (SavingIndicator.HAS_CHANGED) {
        return confirm(MSGS.COMMON_Unsaved_Changes);
  }
  
  return true;
};

/**
 * This function sets focus to the first input control for Dialogs.
 * It also attach a keylistener for Enter key for the every Input elements. 
 *
 * @param {dialog} dialog The EXT dialog object, NOT the DOM div element for the dialog.
 * @param {bEntireForm} true to attach the Enter key press for the entire dialog
 *                      false only attach to the array of Input elements found
 */
Util.setDefaultButton = function setDefaultButton(dialog, bEntireForm) {
    var inputControls = new Array();
    var defSpan;
    var dialogElm = dialog.getEl().dom;

    inputControls = YAHOO.util.Dom.getElementsBy(function(el) {
        if (Util.visible(el)) return el;}, "input", dialogElm);
    
    
    //Set focus to the first input control
    if (inputControls.length > 0) {
        dialog.addListener('show', function(){inputControls[0].focus()});
    } 

    // default button in dialogs have Aquabtn Active class
    defSpan = YAHOO.util.Dom.getElementsBy(function(el) {
        if (el.className == 'aquabtn active') return el;}, "span", dialogElm)[0];
        
    // About Box type dialog should attach keypress event to the entire dialog (bEntireForm is true)
    if (defSpan) {
        var defButton = defSpan.getElementsByTagName('button')[0];
        if (defButton) {
            YAHOO.util.Event.addListener(!bEntireForm? inputControls:dialogElm, "keypress", 
                function(e, button) {if (e.which == 13 || e.keyCode == 13) button.click();}, defButton, this);
        }
    }
 };

//Map used to store onclick functions. Used by blockOnclick and unblockOnclick below.
// <String, function()>
Util.onclickMap = {};

/**
 * Blocks an onclick for a particular element by setting it to just return false.  The original onclick
 * is stored in the Util.eventMap.   If you use this, you MUST call unblockOnClick or else there will
 * be a memory leak in IE.
 *
 * @param key A string used to identify the object attribute value to temporarily store the onclick.
 * @param object Original object that contains the onclick.
 */
Util.blockOnclick = function blockOnclick(key, object) {
    if (key && object && object.onclick) {
        Util.onclickMap[key] = object.onclick;
        object.onclick = function() {
            return false;
        };
    }
};

/**
 * Retrieves the onclick from the Util.eventMap object and attaches back onto the object
 * parameter's onclick attribute.
 *
 * @param key A string used to identify the object attribute value to retrieve onclick from.
 * @param object Original object that contains the onclick.
 */
Util.unblockOnclick = function unblockOnclick(key, object) {
    if (key && Util.onclickMap[key] && object && object.onclick) {
        object.onclick = Util.onclickMap[key];
        Util.onclickMap[key] = null;
    }
};

/**
 * Recursively scans through each successive child in the listObject's childNodes array
 * and blocks all onclick actions.  This is meant to be used for left nav A4J links. 
 *
 * @param key A string used to identify the object attribute value to temporarily store the onclick.
 * @param listObject A root node that will have its children scanned.
 */
Util.blockOnclickList = function blockOnclickList(key, listObject) {
    if (key && listObject && listObject.childNodes) {
        Util.blockOnclicksRecursively(key, listObject);
    }
};


/**
 * This method recursively traverses a root node and will block the onclick any of its children.  This should be
 * used in conjunction with blockOnclickList with the assumption that you have an undefined heirarchy of elements
 * and you want to block the element with the onclick without manual traversal.
 * If you use this, you MUST call unblockOnClicksRecursively or else there will
 * be a memory leak in IE.
 *
 * @param key A string used to identify the object attribute value to temporarily store the onclick.
 * @param rootNode Node to traverse that contains the onclick you want to suppress.
 */
Util.blockOnclicksRecursively = function blockOnclicksRecursively(key, rootNode) {
    if (rootNode) {
        if (rootNode.onclick && rootNode.id) {
            Util.blockOnclick(key + rootNode.id, rootNode);
        }
        else if (rootNode.childNodes) {
            for (var i = 0; i < rootNode.childNodes.length; i++) {
                Util.blockOnclicksRecursively(key, rootNode.childNodes[i]);
            }
        }
    }
};

/**
 * Recursively scans through each successive child in the listObject's childNodes array
 * and restores all onclick actions.
 *
 * NOTE: This hasn't been fully tested since the left nav (where the block is used) performs an A4J update upon
 *       completion, thus not requiring a manual restoration of the onclicks.  However it's nearly identical to its
 *       blocking twin.
 *
 * @param key A string used to identify the object attribute value to temporarily store the onclick.
 * @param listObject A root node that will have its children scanned.
 */
Util.unblockOnclickList = function blockOnclickList(key, listObject) {
    if (key && listObject && listObject.childNodes) {
        Util.unblockOnclicksRecursively(key, listObject);
    }
};

/**
 * This method recursively traverses a root node and will restore the onclick any of its children.  This should be
 * used in conjunction with unblockOnclickList with the assumption that you have an undefined heirarchy of elements
 * and you want to block the element with the onclick without manual traversal.
 *
 * NOTE: This hasn't been fully tested since the left nav (where the block is used) performs an A4J update upon
 *       completion, thus not requiring a manual restoration of the onclicks.  However it's nearly identical to its
 *       blocking twin.
 *
 * @param key A string used to identify the object attribute value to temporarily store the onclick.
 * @param rootNode Node to traverse that contains the onclick you want to suppress.
 */
Util.unblockOnclicksRecursively = function unblockOnclicksRecursively(key, rootNode) {
    if (rootNode) {
        if (rootNode.onclick) {
            Util.unblockOnclick(key + rootNode.id, rootNode);
        }
        else if (rootNode.childNodes) {
            for (var i = 0; i < rootNode.childNodes.length; i++) {
                Util.unblockOnclicksRecursively(key, rootNode.childNodes[i]);
            }
        }
    }
};

/**
 * Retrieves a list of HTML Elements given a specified criteria function, tag type, root node and optional method
 * to apply a mod to the elements.  A very powerful way to dynamically search for and modify large numbers of elements
 * without using gebi.  This method merely wraps the YUI version and adds the apply parameter.  The latest
 * YUI library added this and we have yet to update our libraries.  Once we do, this method will be obselete.
 *
 * EXAMPLE (taken from CandidateProfile.js):
 *
 *      Util.getElementsBy(function(e) {return (e.id.indexOf('_label') != -1)},
 *                         "span",
 *                         details, //a div element wrapping a bunch of span elements
 *                         function(e) {YAHOO.util.Dom.addClass(e, 'strikethrough');})
 *
 * @param method function(e) object to determine criteria for searching for an element.  e is the element being
 *               evaluated.  returns a boolean; true means the element will be added to the return list.
 * @param tag String that specifies a certain tag to look for (i.e. "span")
 * @param root HTMLElement or String id of element that is the starting point for dom traversal.
 * @param apply function(e) object used to update all elements found by the YUI call.  Each element is passed in
 *              the method and applies changes to it.
 * @return Array of HTMLElements.
 */
Util.getElementsBy = function getElementsBy(method, tag, root, apply) {
    var elements = YAHOO.util.Dom.getElementsBy(method, tag, root);
    if (apply && elements) {
        for (var i = 0; i < elements.length; i++) {
            apply(elements[i]);
        }
    }
};

/**
 * Migrated this function from the v10 js files for use in v11/Ultra environment
 * 
 * @param url
 */
Util.imghack = function imghack(url) {
    var m = Util.imghack.imgs;
    var i = 0;
    while (i < m.length) {
        if (m[i].complete) {
            m.splice(i, 1);
        } else {
            ++i;
        }
    }
    (m[m.length] = new Image()).src = secureUrl(url + "&_=" + (new Date().getTime()));
};
Util.imghack.imgs = [];

/**
 * Function to un-escape HTML entities in the string.  For example, it'll convert &amp; to &
 * 
 * @param text:  the string to unescape
 */
Util.unescapeHTML = function(text) {
    if (typeof nl != 'string') nl = "\n";
    if (typeof empty != 'string') empty = "";

    return ((text || "").toString().
            replace(/\&amp\;/g, '&').
            replace(/\&lt\;/g, '<').
            replace(/\&gt\;/g, '>').
            replace(/\&quot\;/g, '"').
            replace(/\&\#39\;/g, '\'')) || empty;

};


Util.escapeDoubleQuote = function(text) {
    return ((text || "").toString().
            replace(/\"/g, '&quot;'));
};

Util.escapeQuote = function(text) {
    return (((text || "").toString().
            replace(/\"/g, '&quot;'))).
            replace(/\'/g, '&acute;');
};

Util.escapeCarriageReturn = function(text) {
    return ((text || "").toString().
            replace(/\r\n/g, '<br/>').
            replace(/\n/g, '<br/>').
            replace(/\r/g, '<br/>'));
};

/**
 * Escapes all the character case tooltips component js error
 */
Util.escapeTooltip = function(text) {
    var temp_text = Util.escapeQuote(text);
    return Util.escapeCarriageReturn(temp_text);
};
 
/*
 * Determine is the mail address is valid base on defined pattern 
 */
Util.isValidEmail = function(email) {
    var emailPatt = /^([A-Za-z0-9_\-\+])+([A-Za-z0-9_\-\+\.])*([A-Za-z0-9_\-\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return emailPatt.test(email.trim());
};

Util.addClass = function(el, className) {
    el = typeof el == 'string' ? Util.gebi(el) : el;
    if (!Util.hasClass(el, className)) {
        el.className = el.className + ' ' + className;
    }
};
Util.removeClass = function(el, className) {
    el = typeof el == 'string' ? Util.gebi(el) : el;
    while (Util.hasClass(el, className)) {
        el.className = el.className.substring(0, el.className.indexOf(className) - 1) +
                el.className.substring(el.className.indexOf(className) + className.length, el.className.length);
    }
    el.className = el.className.replace(/\s+/g, ' ');
};
Util.hasClass = function(el, className) {
    el = typeof el == 'string' ? Util.gebi(el) : el;
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
};

/**
 * Returns true if the browser supports WAI-ARIA (based on version checks).
 * IE 8+ (or 8+ in compatibility mode)
 * FF 2+
 * Safari 4+
 * Gecko 1.8+
 */
Util.isARIACapable = function() {
	return Util.ieVersion() >= 8 || Util.ieCompat() || Util.ffVersion() >= 2 || Util.safariVersion() >= 4 || Util.geckoVersion >= 1.8;
};

/**
 * This function is for fix rounded corner button .
 * IE7 has a problem with the element position. This is to re-assign the position.
 */
Util.repositionRoundedCornerElement = function(el) {
  if(Util.ieVersion() < 9 || Util.ieCompat()) {
    setTimeout(function() {
      el.style.position = 'relative'; //reset the position
    }, 50);
  }
};

/**
 * This function is for fix rounded corner button .
 * IE7 has a problem with the element position. This is to re-assign the position.
 */
Util.repositionAllRoundedCornerElements = function() {
    var PIE = window[ 'PIE' ];
    if (PIE) {
        PIE.updateAll();
    }
};
/**
 * This function is for fix rounded corner button .
 * IE7 has a problem with the element position. This is to re-assign the position.
 */
Util.updatePropsAllRoundedCornerElements = function() {
    var PIE = window[ 'PIE' ];
    if (PIE) {
        PIE.updateAllProps();
    }
};

if (!window.UIVersion) { /* UIVersion Class STARTS */
    /**
     * @param {string} name the version name
     * @param {number} ordinal the version ordinal (the position of this version relative to other versions)
     * @constructor
     */
    window.UIVersion = function (name, ordinal) {
        this.name = name;
        this.ordinal = ordinal;
    };

    (function (UIVersion) {
        var VERSION_NAME_LIST = [ 'UNKNOWN', 'V10', 'V11', 'OTHER', 'EXPRESS', 'V12' ],
            STANDARD_VERSION_MAP = {
                'V10': 1,
                'V11': 1,
                'V12': 1
            };

        /**
         * @return {boolean} whether this instance is a standard version or not
         */
        UIVersion.prototype.isStandard = function () {
            return !!STANDARD_VERSION_MAP[this.name];
        };

        /**
         * @param {UIVersion} that The instance of the UIVersion which this should be compared with
         *
         * @return -1 if this instance's ordinal value is less than the specified instance's,
         *          0 if this instance's ordinal value is equal to the specified instance's, or
         *          1 if this instance's ordinal value is greater than the specified instance's
         */
        UIVersion.prototype.compareTo = function (that) {
            if (!that && !(that instanceof UIVersion)) {
              return 1; // LOGIC if the passed uiVersion is undefined, then it is lower than the other version
            }

            var ordinal1 = this.ordinal,
                ordinal2 = that.ordinal,
                thisIsStandard = this.isStandard(),
                thatIsStandard = that.isStandard();

            if (thisIsStandard ? thatIsStandard : !thatIsStandard) {  // Logical XAND operation
                if (ordinal1 > ordinal2) {
                    return 1;
                }
                return (ordinal1 == ordinal2) ? 0 : -1;
            } else if (thisIsStandard) {
                return 1;
            } else if (thatIsStandard) {
                return -1;
            }
        };

        /**
         * @return Comparison result of instance version with the Current Company UI Version
         */
        UIVersion.prototype.compareToCurrent = function() {
            return this.compareTo(UIVersion.getCurrentInstance());
        };

        /*
         * Creates global version instances like "UIVersion.UNKNOWN", "UIVersion.V10", "UIVersion.V11", etc.
         */
        for (var index = 0; index < VERSION_NAME_LIST.length; index++) {
            var name = VERSION_NAME_LIST[index];
            UIVersion[name] = new UIVersion(name, index);
        }

        /**
         * Returns the UIVersion instance whose name matches
         * the first parameter in the specified parameters to this function
         * that is a valid name
         *
         * @return {?UIVersion} the UIVersion instance for the specified parameter name
         */
        UIVersion.getInstance = function () {
            var result,
                index,
                name;
            for (index = 0; index < arguments.length; index++) {
                name = arguments[index];
                if (name) {
                    result = UIVersion[name.toUpperCase()];
                    if (result) {
                        break;
                    }
                }
            }
            return result;
        };

        /**
         * Returns the version of the current page if available
         *
         * @return {?UIVersion} the UIVersion instance for the current page
         */
        UIVersion.getCurrentInstance = function () {
            return UIVersion.getInstance(window.uiVersion, window.pageHeaderJsonData && window.pageHeaderJsonData.uiVersion);
        };
    })(window.UIVersion);

} /* UIVersion Class ENDS */

Util.removeNumberFormatting = function(number) {
    number = number + "";
    if (decimalFormatSymbols && number.length > 0) {
        var groupRegex = new RegExp("\\" + decimalFormatSymbols.groupingSeparator, "gi");
        var decimalRegex = new RegExp("\\" + decimalFormatSymbols.decimalSeparator, "gi");
        return number.replace(groupRegex, "").replace(decimalRegex, ".");
    } else {
        return "";
    }
};
