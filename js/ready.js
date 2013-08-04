// when dom is ready, bind events
// note the Alt's in here cannot get renamed when minified because setTimeout which is used by domready switches the execution context to global
// for this reason the design pattern is broken until a workaround is found or a domready function which avoids the use of setTimeout is used
Alt.domready(function() {
    Alt.domIsReady = true;

	Alt.bindEvent(window, 'beforeunload', Alt.events.unload);

	var buttons = [],
        insertCounts = Alt.countsFetched; // save ref to original value

	for (var i = 0, n = Alt.outletOrder.length; i !== n; i++) {
		buttons.push(document.createElement('span'));
		buttons[i].className = Alt.classPrefix + Alt.outletOrder[i];

        var outlet = Alt.outlets[Alt.outletOrder[i]];
		if (!outlet.noCount) {
			var countSpan = document.createElement('span');
			countSpan.className = Alt.countClass;
            // if count request has already come in, insert numbers right now
            if (insertCounts) {
                countSpan.innerHTML = outlet.count;
            }
			buttons[i].appendChild(countSpan);
		}
	}

	// add incentive span after all buttons
    if (Alt.incentive) {
        var incentive = document.createElement('span');
        incentive.className = 'incentive';
        var charity = document.createElement('span');
        charity.className = 'charity';
        incentive.appendChild(charity);
        buttons.push(incentive);
    }

	var shareBar = Alt.getByClass('altruad');

	for (var i = 0, n = shareBar.length; i < n; i++) {
		for (var j = 0, m = buttons.length; j !== m; j++) {
			var clone = buttons[j].cloneNode(true);
			shareBar[i].appendChild(clone);

			// event binding for individual buttons
			Alt.bindEvent(clone, 'click', Alt.events.newShare);
            
            // for incentive only
            Alt.bindEvent(clone, 'mouseover', function() {
				Alt.tooltip.show(Alt.tooltipMessage);
			});
			Alt.bindEvent(clone, 'mouseout', Alt.tooltip.hide);
		}
	}
    
    Alt.buttonsReady = true;

    // in the highly unlikely event that the counts return during the creation
    // of the DOM skeleton for the buttons, set the counts now
    if (insertCounts !== Alt.countsFetched) {
        Alt.updateCounts();
    }

    var links = Alt.getTag('a');

	for (var i = 0, n = links.length; i < n; i++) {
		Alt.bindEvent(links[i], 'click', Alt.events.anchorClick);
	}
});