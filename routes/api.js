var express = require('express');
var router = express.Router();
var api = require('../modules/api-dream-scope');
var image = require('../modules/image-size');

/***********************************************************************************************************************
 * Lấy về ảnh theo số lượng.
 **********************************************************************************************************************/
 
router.get('/homepage/:limit/:offset', function (req, res) {
    var limit = req.params.limit;
    var offset = req.params.offset;

    api.get(limit, offset, function callback(body) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(body);
    });
});

/***********************************************************************************************************************
 * Gửi yêu cầu xử lý ảnh.
 **********************************************************************************************************************/

router.post('/images', function (req, res) {
    var image_base64 = req.body.image_base64;
    var filter = req.body.filter;

    api.post("https://dreamscopeapp.com/api/images/", image_base64, filter, function callback(body) {
        res.setHeader('Content-Type', 'application/json');
        var result = JSON.parse(body);
        res.status(200).send(JSON.stringify({
            id: result.uuid,
            original_url: result.original_url,
            last_modified: result.last_modified,
            filter_name: result.filter_name,
            processing_status: result.processing_status
        }, null, 3));
    });
});

/***********************************************************************************************************************
 * Trả về trạng thái xử lý ảnh.
 **********************************************************************************************************************/

router.get('/images/status/:uuid', function imageResponse(req, res, next) {
    var uuid = req.params.uuid;

    api.status(uuid, function imageResponse(status) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(status);
    });
});

module.exports = router;
