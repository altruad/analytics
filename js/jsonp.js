(function (jsonp, d) {
    var request = 0,
        callbacks = {};
    
    // takes callback object of the form:
    // { 
    //		name : 'customCallback',
    //		fun : myCallbackFunction
    // }
    // this allows for callbacks with names other than the generic 'callback' or 'jsonp'
    jsonp.get = function(url, data, callback) {
        var head = Alt.getTag('head')[0],
            script = d.createElement('script');

        data[callback.name] = 'Alt.jsonp.callbacks.request_' + request;
        
        callbacks['request_' + request] = function(data) {
            head.removeChild(script);
            delete callbacks['request_' + request];
            callback.fun(data);
        };

        request++;
        
        if (!Alt.util.isEmpty(data)) url += Alt.util.encodeParams(data);

        script.type = 'text/javascript';
        script.async = true;
        script.src = url;
        
        head.appendChild(script);
    };
    
    jsonp.callbacks = callbacks;


}(Alt.jsonp = Alt.jsonp || {}, document));