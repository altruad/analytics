var buttons = document.getElementsByClassName('altruad');


for (var i = 0, n = buttons.length; i < n; i++) {
    buttons[i].onclick = newShare;
    /*
    buttons[i].onmouseout = tooltip.hide;

    var estimatedAmounts = {
        twitter : 7.6,
        facebook : 8.6,
        google : 5.6,
        email : 7.0
    };
    
    var message = 'Your share will raise an estimated <em>&#162;';
    
    switch (buttons[i].id) {
        case 'twitter' :
            message += estimatedAmounts.twitter;
            break;
        case 'facebook' :
            message += estimatedAmounts.facebook;
            break;
        case 'google' :
            message += estimatedAmounts.google;
            break;
        case 'email' :
            message += estimatedAmounts.email;
            break;
    }
    
    message += '</em>.';
    
    buttons[i].onmouseover = tooltip.show;
    */
}

/*
document.getElementById('hotspot').onmouseover = tooltip.show;
document.getElementById('hotspot').onmouseout = tooltip.hide;
*/

var links = document.getElementsByTagName('a');

for (var i = 0, n = links.length; i < n; i++) {
    // if the link clicked is our share button, do not bind event
    if (hasClass(links[i], 'altruad')) continue;
    
    // note, should not be using onclick since only one of these can be bound
    // per link
    links[i].onclick = anchorClick;
}

function newShare(e) {

    var shareTypes = ['twitter', 'facebook', 'email', 'google'],
        classList = this.className.split(' ');
    
    for (var i = 0, n = shareTypes.length; i != n; i++) {
        if (classList.indexOf(shareTypes[i]) !== -1) {
            var shareType = shareTypes[i];
            break;
        }
    }

    var id = randomId(),
        shareText = document.title,
        shareUrl = document.URL.split('?')[0] + '?shareId=' + id,
        queryString;
        
    var shareInfo = {
        url : document.URL,
        shareId : id,
        pageTitle : shareText,
        shareType : shareType,
        type : 0
    };

    var apiUrls = {
        'twitter' : 'https://twitter.com/intent/tweet?',
        'facebook' : 'http://facebook.com/sharer/sharer.php?',
        'google' : 'https://plus.google.com/share?'
    };
    
    switch (shareType) {
        case 'facebook':
            queryString = transformParams({u : shareUrl});
            
            this.href = apiUrls.facebook + queryString;
            // no actual verification is being done
            verifiedShare(shareInfo);
            break;
        case 'twitter':
            queryString = transformParams({
                url : shareUrl,
                text : shareText,
                //hashtags : 'altruad'
            });

            this.href = apiUrls.twitter + queryString;
            verifiedShare(shareInfo);
            /*
            twttr.events.bind('tweet', function(event) {
                console.log('tweet complete');
                verifiedShare(shareInfo);
            });
            */
            
            break;
        case 'google':
            queryString = transformParams({
                url : shareUrl
            });
            
            this.href = apiUrls.google + queryString;
            // no actual verification is being done
            verifiedShare(shareInfo);
            break;
        case 'email':
            // no actual verification is being done
            
            var html = '<input></input>';
            modalWindow.show(e);
            fadeButtons(0.5, 'email');
            
            var emailSubmit = document.getElementById('email-submit');
            
            emailSubmit.onclick = function(e) {
                console.log('new email share');
                e.preventDefault();
                shareInfo.to = document.getElementById('to').value;
                shareInfo.from = document.getElementById('from').value;
                shareInfo.message = document.getElementById('email-body').value;
                verifiedShare(shareInfo);
                modalWindow.success();
            }
            
            break;
    }

    function verifiedShare(params) {
        new Share(params);
        // var shareUrl = document.URL.split('?')[0] + '?shareId=' + id;
        // window.location = shareUrl;
    }
}

// New visitor
var visit = new Visit();
visit.begin();

// Visitor has clicked a link
function anchorClick(e) {
    e = e || window.event;
    // cross browser target identification adapted from ppk
    var targ;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;

    visit.recordClick({
        targetId : targ.id,
        href : targ.href,
        linkText : targ.innerText
    });
}

// Visitor leaves
window.onbeforeunload = function() {
    visit.end();
}
