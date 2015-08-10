// Source: http://stackoverflow.com/questions/4878145/javascript-and-webgl-external-scripts Skeen's solution
// Date of copypaste: 20.06.2015

var loadFiles = (function(){
    function loadFile(url, data, callback, errorCallback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function(){
            if (request.readyState === 4) {
                if (request.status === 200) callback(request.responseText, data);
                else errorCallback(url);
            }
        };
        request.send(null);
    }

    return function loadFiles(urls) {
        var deferred = Q.defer();
        var numUrls = urls.length;
        var numComplete = 0;
        var result = [];

        function partialCallback(text, urlIndex) {
            result[urlIndex] = text;
            numComplete++;
            if (numComplete === numUrls) deferred.resolve(result);
        }

        for (var i = 0; i < numUrls; i++) {
            loadFile(urls[i], i, partialCallback, deferred.reject);
        }

        return deferred.promise;
    };
})();
