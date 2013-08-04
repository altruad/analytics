(function(visit) {

    visit.shareId = Alt.util.getParams(true).shareId || '';
    visit.referrer = document.referrer;
    // set user cookie if does not already exist
    visit.userCookie = Alt.util.getCookie('altruad-uid') || Alt.util.setCookie('altruad-uid', Alt.util.randomId(12));
    // set visit cookie, expires in 1 hour, but should get deleted on page unload
    visit.visitCookie = Alt.util.setCookie('altruad-vid', Alt.util.randomId(12), (60*60*1000));
    visit.clicks = [];

	visit.sendData = function(params, callback) {
		var baseUrl = 'http://analytics.altruad.com/',
			imageUrl = 'rt.gif?',
			image = new Image();

		// objects are passed by reference
		// cloning object so that we don't muck up the original object
		var toSend = Alt.util.clone(params);

		// the following are sent with every request
		toSend.publisherId = Alt.publisher;
		toSend.shareId = visit.shareId;
		toSend.userCookie = visit.userCookie;
		toSend.visitCookie = visit.visitCookie;
		
		image.src = baseUrl + imageUrl + Alt.util.encodeParams(toSend);

		if (callback) image.onload = callback;
	};

	// autoexecuted on load
	visit.begin = function() {
		visit.sendData({
			referrer : visit.referrer,
			type : 1
		});
		
		// using anonymous function here so that arguments can be passed to
		// ping function in all browsers
		
		// it is necessary to pass this since setTimeout makes the target
		// function execute in a separate context and this then refers to
		// DOMWindow
		
		visit.timer = window.setInterval(function() {
			visit.ping();
		}, 30000);
	}();

	visit.ping = function() {
		visit.sendData({
			clicks : Alt.util.stringify(visit.clicks),
			type : 3
		});
	};

	visit.end = function() {
		visit.sendData({
			clicks : Alt.util.stringify(visit.clicks),
			type : 2
		});
		
		Alt.util.deleteCookie('altruad-vid');
		clearTimeout(visit.timer);
	};

	visit.recordClick = function(data) {
		visit.clicks.push(data);
	};

}(Alt.visit = Alt.visit || {}));