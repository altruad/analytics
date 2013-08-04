(function(events) {
	events.newShare = function(e) {
    
        var shareType = this.className.substring(Alt.classPrefix.length),
            outlet;

        if (Alt.outlets.hasOwnProperty(shareType)) {
            outlet = Alt.outlets[shareType];
        } else {
            // if there is no setting to handle this share, return immediately
            return;
        }

		var id = Alt.util.randomId(),
			queryString = {};
            
        var shareParams = {
            shareUrl : document.URL.split('#')[0] + '#shareId=' + id,
            title : document.title,
            image : Alt.util.getMainImage()
        };
			
        // assign proper values for each required parameter
        for (var prop in outlet.params) {
            if (outlet.params.hasOwnProperty(prop)) {
                // when value is not a string, treat as constant
                if (typeof outlet.params[prop] === 'string') {
                    queryString[prop] = shareParams[outlet.params[prop]];
                } else {
                    queryString[prop] = outlet.params[prop];
                }
            }
        }

        if (shareType !== 'email') {
            window.open(outlet.share + Alt.util.encodeParams(queryString), '', outlet.window);
        } else {
            window.location.href = outlet.share + Alt.util.encodeParams(queryString);
        }

        // sent to analytics server
        // type 0 indicates new share.. might be wise to switch to a simple 'enum'
		var analytics = {
			url : document.URL,
			shareId : id,
			pageTitle : document.title,
			shareType : shareType,
			type : 0
		};

        // note : no verification is taking place for any share types
		Alt.visit.shareId = analytics.shareId;
		Alt.visit.sendData(analytics);

	};

	// Visitor has clicked a link
	events.anchorClick = function(e) {
		e = e || window.event;
		// cross browser target identification adapted from ppk
		var targ;
		if (e.target) targ = e.target;
		else if (e.srcElement) targ = e.srcElement;
		if (targ.nodeType === 3) // defeat Safari bug
			targ = targ.parentNode;

		Alt.visit.recordClick({
			targetId : targ.id,
			href : targ.href,
			linkText : targ.innerText
		});
	};
	
	events.unload = function() {
		Alt.visit.end();
	};
}(Alt.events = Alt.events || {}));