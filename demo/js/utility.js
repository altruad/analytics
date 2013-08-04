var modalWindow = function() {

    var modal;
    
    var modalMarkup = 
    '<fieldset>\
        <label><span>From:</span><input id="from" type="email"></input></label>\
        <label><span>To:</span><input id="to" type="email"></input></label>\
        <textarea id="email-body" placeholder="Please enter your message here"></textarea>\
        <input id="email-submit" type="submit" value="Share"></input>\
    </fieldset>\
    <div id="close"></div>';
    
    function create(node) {
        modal = document.createElement('form');
        modal.className = 'altruad-modal';
        modal.innerHTML = modalMarkup;
        node.parentNode.insertBefore(modal, node.nextSibling);

        var modalClose = document.getElementById('close');

        modalClose.onclick = function() {
            modalWindow.hide();
        }
    }
    
    function position(target, child) {
        var setTop = target.offsetTop + target.offsetHeight + 40;
        // if there is no space below, place above
        if (window.innerHeight - findPos(target).top - target.offsetHeight + window.scrollY <= child.offsetHeight) {
            setTop = -(target.offsetHeight + child.offsetHeight - 35);
        }
        
        child.style.top = setTop + 'px';
    }
    
    return {
        show : function(e) {
            if (e) e.preventDefault();
            // if element already exists, don't add another one!
            var modalEl = document.getElementsByClassName('altruad-modal');
            var shareButtons = document.getElementsByClassName('sharebuttons')[0];
            
            if (modalEl.length) {
                modalEl[0].style.display = 'block';
            } else {
                // be careful .. multiple share buttons?
                create(shareButtons);
            }
            
            // always reposition in case window has changed dimensions
            position(shareButtons, modalEl[0]);
        },
        
        hide : function() {
            modal.style.display = 'none';
            fadeButtons(1);
        },
        
        success : function() {
            var markup = '<span>Email sent. Thanks for sharing!</span>';
            modal.innerHTML = markup;
            modal.className += ' email-sent';
            this.show();
            var self = this;
            // close successful send dialog after 5 seconds
            var timer = window.setTimeout(function() {
                self.hide();
                modal.innerHTML = modalMarkup;
                modal.className = 'altruad-modal';
            }, 5000);
        }
    }
}();

function fadeButtons(fadeTo, except) {
    for (var i = 0, n = buttons.length; i < n; i++) {
        if (except && hasClass(buttons[i], except)) continue;
        buttons[i].style.opacity = fadeTo;
    }
}

// unix time stamp in seconds
function currentTime() {
    var time = Date.now() || function() {
        return +new Date;
    };

	return Math.round(time/1000);
}

// takes an object and returns url parameters
function transformParams(data) {
    var queryString = [];
    for (var item in data) {
        // only push to array if non-null
        if (item !== null && data.hasOwnProperty(item))
            queryString.push(encodeURIComponent(item) + '=' + encodeURIComponent(data[item]));
    }
    return queryString.join('&');
}

// gets parameters from url and return an object
function getParams() {
	var urlParams = {};
	(function () {
		var e,
			a = /\+/g,  // Regex for replacing addition symbol with a space
			r = /([^&=]+)=?([^&]*)/g,
			d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
			q = window.location.search.substring(1);

		while (e = r.exec(q))
		   urlParams[d(e[1])] = d(e[2]);
	})();
	
	return urlParams;
}

// performance testing for various random id generating functions:
// http://jsperf.com/random-alphanumeric-string
function randomId(length, dictionary) {
	length = length || 6;
	
	var dictionary = dictionary || 'abcdefghijklmnopqrtsuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		dictionarySize = dictionary.length,
		random = '';

	for (var i = 0; i < length; i++)
		random += dictionary.charAt(Math.floor(Math.random() * dictionarySize)); 
	
	return random;
}

// careful with this guy, might overload functions defined on publisher page
// this is why I should namespace everything!
function hasClass(el, cls) {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function findPos(el) {
    var curLeft = curTop = 0
    // walk up the offset tree and add up all offsets
    // from ppk
    if (el.offsetParent) {
        do {
            curLeft += el.offsetLeft;
            curTop += el.offsetTop;
        } while (el = el.offsetParent);
    }
    
    return { 
        top : curTop,
        left : curLeft
    }
}

// the following is taken from http://www.sitepoint.com/javascript-json-serialization/
var JSON = JSON || {};

// implement JSON.stringify serialization  
JSON.stringify = JSON.stringify || function (obj) {  
    var t = typeof (obj);  
    if (t != "object" || obj === null) {  
        // simple data type  
        if (t == "string") obj = '"'+obj+'"';  
        return String(obj);  
    }  
    else {  
        // recurse array or object  
        var n, v, json = [], arr = (obj && obj.constructor == Array);  
        for (n in obj) {  
            v = obj[n]; t = typeof(v);  
            if (t == "string") v = '"'+v+'"';  
            else if (t == "object" && v !== null) v = JSON.stringify(v);  
            json.push((arr ? "" : '"' + n + '":') + String(v));  
        }  
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");  
    }  
};

// thanks to Opera dev
// http://my.opera.com/GreyWyvern/blog/show.dml/1725165
Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

// Tooltip function
var tooltip=function(){
	var id = 'share-info';
	var top = 3;
	var left = 3;
	var maxw = 300;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt,t,c,b,h;
	var ie = document.all ? true : false;
	return{
		show:function(v,w){
			if(tt == null){
				tt = document.createElement('div');
				tt.setAttribute('id',id);
				t = document.createElement('div');
				t.setAttribute('id',id + 'top');
				c = document.createElement('div');
				c.setAttribute('id',id + 'cont');
				b = document.createElement('div');
				b.setAttribute('id',id + 'bot');
				tt.appendChild(t);
				tt.appendChild(c);
				tt.appendChild(b);
				document.body.appendChild(tt);
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';
				document.onmousemove = this.pos;
			}
			tt.style.display = 'block';
			c.innerHTML = v;
			tt.style.width = w ? w + 'px' : 'auto';
			if(!w && ie){
				t.style.display = 'none';
				b.style.display = 'none';
				tt.style.width = tt.offsetWidth;
				t.style.display = 'block';
				b.style.display = 'block';
			}
			if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
			h = parseInt(tt.offsetHeight) + top;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(1)},timer);
		},
		pos:function(e){
			var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
			var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
			tt.style.top = (u - h) + 'px';
			tt.style.left = (l + left) + 'px';
		},
		fade:function(d){
			var a = alpha;
			if((a != endalpha && d == 1) || (a != 0 && d == -1)){
				var i = speed;
				if(endalpha - a < speed && d == 1){
					i = endalpha - a;
				}else if(alpha < speed && d == -1){
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = 'alpha(opacity=' + alpha + ')';
			}else{
				clearInterval(tt.timer);
				if(d == -1){tt.style.display = 'none'}
			}
		},
		hide:function(){
            clearInterval(tt.timer);
            tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
		}
	};
}();
