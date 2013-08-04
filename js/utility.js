(function(util) {

	util.currentTime = function() {
		// unix time stamp in seconds
		var time;
		if (!Date.now) {
			time = +new Date;
		} else {
			time = Date.now();
		}
		return Math.round(time/1000);
	};

	util.encodeParams = function(data) {
		var queryString = [];
		for (var item in data) {
			// only push to array if non-null
			if (item !== null && data.hasOwnProperty(item)) {
				queryString.push(encodeURIComponent(item) + '=' + encodeURIComponent(data[item]));
			}
		}
		return queryString.join('&');
	};

	// gets parameters from url and return an object
	// if hash is true return hash based object instead
	util.getParams = function(hash) {
		var urlParams = {};
		(function () {
			var e,
				a = /\+/g,  // Regex for replacing addition symbol with a space
				r = /([^&=]+)=?([^&]*)/g,
				q = (hash) ? window.location.hash.substring(1) : window.location.search.substring(1),
				d = function (s) { return decodeURIComponent(s.replace(a, " ")); };

			while (e = r.exec(q))
                urlParams[d(e[1])] = d(e[2]);
		})();
		
		return urlParams;
	};

	// performance testing for various random id generating functions:
	// http://jsperf.com/random-alphanumeric-string
	util.randomId = function(length, dictionary) {
		length = length || 6;
		dictionary = dictionary || 'abcdefghijklmnopqrtsuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		
		var dictionarySize = dictionary.length,
			random = '';

		for (var i = 0; i < length; i++) {
			random += dictionary.charAt(Math.floor(Math.random() * dictionarySize));
		}
		
		return random;
	};

	util.hasClass = function(el, cls) {
		return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
	};

	// stringify method from http://www.sitepoint.com/javascript-json-serialization/
	util.stringify = JSON.stringify || function (obj) {  
		var t = typeof (obj);  
		if (t !== "object" || obj === null) {  
			// simple data type  
			if (t === "string") obj = '"'+obj+'"';  
			return String(obj);  
		}  
		else {  
			// recurse array or object  
			var n, v, json = [], arr = (obj && obj.constructor == Array);  
			for (n in obj) {  
				v = obj[n]; t = typeof(v);  
				if (t === "string") v = '"'+v+'"';  
				else if (t == "object" && v !== null) v = util.stringify(v);  
				json.push((arr ? "" : '"' + n + '":') + String(v));  
			}  
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");  
		}  
	};
		
	// thanks to this Opera dev
	// http://my.opera.com/GreyWyvern/blog/show.dml/1725165
	util.clone = function(original) {
		var clone = (original instanceof Array) ? [] : {};
		for (var prop in original) {
			if (prop === 'clone') continue;
			if (original[prop] && typeof original[prop] === "object") {
				clone[prop] = original[prop].clone();
			} else {
				clone[prop] = original[prop];
			}
		} 
		
		return clone;
	};
	
	util.isEmpty = function(obj) {
		// check if there is built in property
		if (Object.keys) return Object.keys(obj).length === 0;

		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) return false;
		}

		return true;
	};
	
	util.setCookie = function(key, value, expireIn) {
		// expire date a year into the future with second resolution
		expireIn = expireIn || 365*24*60*60*1000;
		var expireDate = new Date(Alt.util.currentTime()*1000 + expireIn);
		document.cookie = key + '=' + value + 
                                  '; expires=' + expireDate.toUTCString() + 
								  '; path=/';
		return value;
	};

	util.getCookie = function(key) {
		// regex dissected:
		// ^ - match start of text
		// (?: ... )    noncapturing group
		// ( ... )      capturing group
		// [\\w]+        match 1 or more alphanumeric characters
		// $            match end of string
		var re = new RegExp('^(?:' + key + '=)([\\w]+)'),
			match = document.cookie.match(re);

		if (match) return match[1];
	};

	util.deleteCookie = function(key) {
		util.setCookie(key, '', -60*60*1000);
	};
	
	// returns first image in markup that is at least 80 x 80
	util.getMainImage = function() {
		var images = Alt.getTag('img');
		
		for (var i = 0, n = images.length; i !== n; i++) {
			if (images[i].height > 150 && images[i].width > 150) {
				return images[i].src;
			}
		}
	};
}(Alt.util = Alt.util || {}, JSON = JSON || {}));