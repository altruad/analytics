function Visit () {

    this.shareId = getParams().shareId || '';
    this.referrer = document.referrer;
    // set user cookie if does not already exist
    this.userCookie = this.getCookie('altruad-uid') || this.setCookie('altruad-uid', randomId(12));
    // set visit cookie, expires in 1 hour, but should get deleted on page unload
    this.visitCookie = this.setCookie('altruad-vid', randomId(12), (60*60*1000));
    this.clicks = [];
    
    this.timer; // holds timer id so it can be cleared when visit is over
}

Visit.prototype.sendData = function(params, callback) {
    var baseUrl = 'http://analytics.altruad.com/',
        imageUrl = 'rt.gif?',
        image = new Image();

    // objects are passed by reference
    // cloning object so that we don't muck up the original object
    var toSend = params.clone();

    // the following are sent with every request
    toSend.publisherId = options.publisher;
    toSend.shareId = this.shareId;
    toSend.userCookie = this.userCookie;
    toSend.visitCookie = this.visitCookie;
    
    image.src = baseUrl + imageUrl + transformParams(toSend);

    if (callback) image.onload = callback;
}

Visit.prototype.begin = function() {
    this.sendData({
        referrer : this.referrer,
        type : 1
    });
    
    // using anonymous function here so that arguments can be passed to
    // ping function in all browsers
    
    // it is necessary to pass this since setTimeout makes the target
    // function execute in a separate context and this then refers to
    // DOMWindow
    
    self = this;
    
    //this.timer = setTimeout(this.ping);
    this.timer = window.setInterval(function() {
        self.ping(self);
    }, 30000);
}

Visit.prototype.ping = function(self) {
    console.log('ping!');
    
    self.sendData({
        clicks : JSON.stringify(self.clicks),
        type : 3
    });
}

Visit.prototype.end = function() {
    console.log('visit ending');
    this.sendData({
        clicks : JSON.stringify(this.clicks),
        type : 2
    });
    
    this.deleteCookie('altruad-vid');
    
    clearTimeout(this.timer);
}

Visit.prototype.setCookie = function(key, value, expireIn) {
    // expire date a year into the future with second resolution
    expireIn = expireIn || 365*24*60*60*1000;
	var expireDate = new Date(currentTime()*1000 + expireIn);
	document.cookie = key + '=' + value + 
					  '; expires=' + expireDate.toUTCString() +
					  '; path=/';
    return value;
}

Visit.prototype.getCookie = function(key) {
    // regex dissected:
    // ^ - match start of text
    // (?: ... )    noncapturing group
    // ( ... )      capturing group
    // [\\w]+        match 1 or more alphanumeric characters
    // $            match end of string
	var re = new RegExp('^(?:' + key + '=)([\\w]+)'),
		match = document.cookie.match(re);

	if (match) return match[1];
}

Visit.prototype.deleteCookie = function(key) {
    this.setCookie(key, '', -60*60*1000);
}

Visit.prototype.recordClick = function(data) {
    this.clicks.push(data);
    console.log(this.clicks);
}
