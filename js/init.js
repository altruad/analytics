(function(Alt, document) {
    // Dustin Diaz domready
    Alt.domready = function(f){/in/.test(document.readyState)?setTimeout('Alt.domready('+f+')',9):f()};
    
    // general settings and flags
    Alt.countUrl = 'http://analytics.altruad.com/sharecount.php?';
    Alt.countClass ='count';
    Alt.countsFetched = false;
    Alt.classPrefix = 'altruad_'; // prefix appended to the class of each individual share button
    Alt.domIsReady = false; // set to true in ready.js
    Alt.buttonsReady = false; // indicates whether or not button code has been added to the DOM
    Alt.incentive = true;
    Alt.tooltipMessage = 'A 5 cent donation will be made to WWF Canada for every person that visits this page thanks to your share.';

    // defining order outright because the order in which object properties are looped over is 
    // implementation specific. Could make Alt.outlets an array but then there'd be some annoyances
    // when looking to access specific elements. 
    Alt.outletOrder = ['facebook', 'twitter', 'gplus', 'linkedin', 'pinterest', 'buffer', 'email'];

    Alt.outlets = {
        facebook : {
            share : 'http://facebook.com/sharer/sharer.php?',
            params : {
                u : 'shareUrl'
            },
            window : 'width=650,height=352'
        },
        twitter : {
            share : 'https://twitter.com/intent/tweet?',
            params : {
                url : 'shareUrl',
                shareText : 'title'
            },
            window : 'width=550,height=520'
        },
        gplus : {
            share : 'https://plus.google.com/share?',
            params : {
                url : 'shareUrl'
            },
            window : 'width=1100,height=850'
        },
        linkedin : {
            share : 'http://www.linkedin.com/shareArticle?',
            params : {
                url : 'shareUrl',
                mini : true
            },
            window : 'width=1003,height=413'
        },
        pinterest : {
            share : 'http://pinterest.com/pin/create/button/?',
            params : {
                url : 'shareUrl',
                description : 'title',
                media : 'image'
            },
            window : 'width=648,height=497'
        },
        buffer : {
            share : 'http://bufferapp.com/add?',
            params : {
                'data-url' : 'shareUrl',
                'data-text' : 'title'
            },
            window : 'width=968,height=525'
        },
        email : {
            share : 'mailto:?',
            params : {
                subject : 'title',
                body : 'shareUrl'
            },
            noCount : true
        }
    };

    Alt.get = function(id) {
        return document.getElementById(id);
    };
    Alt.getByClass = function(className, node, tag) {
        if (!node) node = document;
        
        if (node.getElementsByClassName) {
            // use native when we can
            return node.getElementsByClassName(className);
        } else {
            var classElements = new Array();
            // use Dustin Diaz' method when we can't
            if (!tag) tag = '*';
            
            var els = node.getElementsByTagName(tag);
            var pattern = new RegExp("(^|\\s)"+className+"(\\s|$)");
            for (var i = 0, j = 0, n = els.length; i < n; i++) {
                if (pattern.test(els[i].className)) {
                    classElements[j] = els[i];
                    j++;
                }
            }
            return classElements;
        }
    };
    Alt.getTag = function(tag) {
        return document.getElementsByTagName(tag);
    };
    Alt.bindEvent = function() {
        if (window.addEventListener) {
            return function(el, type, fn) {
                el.addEventListener(type, fn, false);
            };
        } else if (window.attachEvent) {
            return function(el, type, fn) {
                var f = function() {
                    fn.call(el, window.event);
                };
                el.attachEvent('on' + type, f);
            };
        }
    }();
    
    var countRequest = { 
        url : location.protocol + '//' + location.host + location.pathname 
    };

    // request counts for all outlets specified in Alt.outlets
    for (var outlet in Alt.outlets) {
        if (Alt.outlets.hasOwnProperty(outlet) && !outlet.noCount) {
            countRequest[outlet] = '';
        }
    }
    
    // store results on Alt.outlets object and update the DOM when ready
    Alt.setCounts = function(data) {
        for (var outlet in data) {
            // check to provent Object.prototype changes from mucking things up
            // and also to see if specific social outlet exists in settings
            if (data.hasOwnProperty(outlet) && Alt.outlets.hasOwnProperty(outlet)) {
                Alt.outlets[outlet].count = data[outlet] || 0;
            }
        }
        
        Alt.countsFetched = true;
        
        // if buttons have already been inserted by the time this callback gets
        // hit, make sure we update the counts
        if (Alt.buttonsReady) {
            Alt.setCounts();
        }
    };
    
    Alt.updateCounts =  function() {
        for (var outlet in Alt.outlets) {
            var button = Alt.getByClass(Alt.classPrefix + outlet);
            if (Alt.outlets.hasOwnProperty(outlet) && !outlet.noCount) {
                for (var i = 0, n = button.length; i !== n; i++) {
                    Alt.getByClass(Alt.countClass, button[i])[0].innerHTML = Alt.outlets[outlet].count;
                }
            }
        }       
    };

    // make request for counts
    Alt.jsonp.get(Alt.countUrl, countRequest, { name : 'callback', fun : Alt.setCounts });
}(window.Alt = window.Alt || {}, document));