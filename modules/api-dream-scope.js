/**
 * Created by QH2107 on 30/07/2016.
 */
var request = require('request'),
    cachedRequest = require('cached-request')(request),
    cacheDirectory = "/tmp/cache";
cachedRequest.setCacheDirectory(cacheDirectory);

var zlib = require('zlib');
var har = {
    "method": "",
    "url": "",
    "httpVersion": "HTTP/1.1",
    "headers": [{
        "name": "Origin",
        "value": "https://dreamscopeapp.com"
    }, {
        "name": "Host",
        "value": "dreamscopeapp.com"
    }, {
        "name": "Accept-Language",
        "value": "vi,en;q=0.8"
    }, {
        "name": "Accept-Encoding",
        "value": "gzip, deflate, sdch"
    }, {
        "name": "User-Agent",
        "value": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36"
    }, {
        "name": "Content-Type",
        "value": "application/json;charset=UTF-8"
    }, {
        "name": "Accept",
        "value": "application/json, text/plain, */*"
    }, {
        "name": "Referer",
        "value": "https://dreamscopeapp.com/editor"
    }, {
        "name": "x-apicache-bypass",
        "value": "false"
    }, {
        "name": "Connection",
        "value": "keep-alive"
    }],
    "postData": {
        "mimeType": "application/json;charset=UTF-8",
        "text": "{\"private\":false,\"retain_color\":\"0\",\"processing_status\":2,\"image_base64\":\"\",\"filter\":\"blue_anime\"}"
    }
};

/**
 * Gửi request đến API DreamScope.
 * @param {string} url
 * @param {string} imageBase64
 * @param {string} nameFilter
 * @param callback
 */

function sendRequest(url, imageBase64, nameFilter, callback) {
    har.headers.url = url;
    har.postData.text = "{\"private\":false,\"retain_color\":\"0\",\"processing_status\":2,\"image_base64\":\"" + imageBase64 + "\",\"filter\":\"" + nameFilter + "\"}";

    cachedRequest({
        method: "POST",
        uri: url,
        har: har,
        encoding: null
    }, function postResponse(err, res, body) {
        if (err) {
            throw new Error(err);
        }
        zlib.gunzip(body, function(err, unzipped) {
            var data = unzipped.toString('utf-8');
            return callback(data);
        });
    });
}

/**
 * Lấy ảnh theo số lượng.
 * @param {number} limit
 * @param {number} offset
 * @param callback
 */

function getImages(limit, offset, callback) {
    var url = "https://dreamscopeapp.com/api/images?limit=" + limit + "&offset=" + offset + "&sorting=score";
    har.url = url;
    har.headers.method = "GET";
    har.postData.mimeType = null;
    har.postData.text = null;

    cachedRequest({
        method: "GET",
        uri: url,
        har: har,
        encoding: null
    }, function getResponse(err, res, body) {
        if (err) {
            throw new Error(err);
        }
        zlib.gunzip(body, function(err, unzipped) {
            var data = unzipped.toString('utf-8');
            return callback(data);
        });
    });
}

/**
 * Kiểm tra trạng thái xử lý ảnh.
 * @param uuid
 * @param callback
 */

function imageStatus(uuid, callback) {
    var url = "https://dreamscopeapp.com/api/images/" + uuid;
    har.url = url;
    har.headers.method = "GET";
    har.postData.mimeType = null;
    har.postData.text = null;

    request({
            method: "GET",
            uri: url,
            har: har,
            encoding: null
        },
        function imageStatusResponse(err, res, body) {
            if (err) {
                throw new Error(err);
            }
            zlib.gunzip(body, function(err, unzipped) {
                var data = unzipped.toString('utf-8');
                var json = JSON.parse(data);

                if (json.processing_status === 2) {
                    return callback(data);
                }
                return callback("{\"processing_status\": 0,\"uuid\": \"" + uuid + "\"}");
            });
        });
}

module.exports.get = getImages;
module.exports.post = sendRequest;
module.exports.status = imageStatus;
