// /**
//  * Created by QH2107 on 10/08/2016.
//  */
// var url = require('url');
// var http = require('http');
//
// var sizeOf = require('image-size');
//
//
// function getSizeImage(url,callback) {
//     var imgUrl = url;
//     var options = url.parse(imgUrl);
//
//     http.get(options, function (response) {
//         var chunks = [];
//         response.on('data', function (chunk) {
//             chunks.push(chunk);
//         }).on('end', function() {
//             var buffer = Buffer.concat(chunks);
//             var dimensions = sizeOf(buffer);
//
//             console.log(dimensions.width, dimensions.height);
//         });
//     });
// }
//
// module.exports.getSize = getSizeImage;