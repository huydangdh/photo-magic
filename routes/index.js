var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }, function (err, html) {
      res.status(200).send(html);
  });
});

module.exports = router;
