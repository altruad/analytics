(function(modal) {
	var modalEl,
		modalMarkup = 
		'<fieldset>' +
			'<label><span>From:</span><input id="from" type="email"></input></label>' +
			'<label><span>To:</span><input id="to" type="email"></input></label>' +
			'<textarea id="email-body" placeholder="Please enter your message here"></textarea>' +
			'<input id="email-submit" type="submit" value="Share"></input>' +
		'/fieldset>' +
		'<div id="close"></div>';
	
	function create(node) {
		modalEl = document.createElement('form');
		modalEl.className = 'altruad-modal';
		modalEl.innerHTML = modalMarkup;
		node.parentNode.insertBefore(modalEl, node.nextSibling);

		var modalClose = document.getElementById('close');

		modalClose.onclick = function() {
			Alt.modal.hide();
		};
	}
	
	function position(target, child) {
		var setTop = target.offsetTop + target.offsetHeight + 40;
		// if there is no space below, place above
		if (window.innerHeight - findPos(target).top - target.offsetHeight + window.scrollY <= child.offsetHeight) {
			setTop = -(target.offsetHeight + child.offsetHeight - 35);
		}
		
		child.style.top = setTop + 'px';
	}

	modal.show = function(e) {
		if (e) e.preventDefault();
		// if element already exists, don't add another one!
		var modalEl = Alt.getByClass('altruad-modal');
		var shareButtons = Alt.getByClass('altruad')[0];
		
		if (modalEl.length) {
			modalEl[0].style.display = 'block';
		} else {
			// be careful .. multiple share buttons?
			create(shareButtons);
		}
		
		// always reposition in case window has changed dimensions
		position(shareButtons, modalEl[0]);
	};
		
	modal.hide = function() {
		modalEl.style.display = 'none';
	};
		
	modal.success = function() {
		var markup = '<span>Email sent. Thanks for sharing!</span>';
		modalEl.innerHTML = markup;
		modalEl.className += ' email-sent';
		this.show();
		var self = this;
		// close successful send dialog after 5 seconds
		var timer = window.setTimeout(function() {
			self.hide();
			modalEl.innerHTML = modalMarkup;
			modalEl.className = 'altruad-modal';
		}, 5000);
	};

	function findPos(el) {
		var curLeft = curTop = 0;
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

}(Alt.modal = Alt.modal || {}));