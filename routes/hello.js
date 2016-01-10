var express = require('express');
var router = express.Router();

/* GET hello world */
router.get('/', function(req, res, next) {
    var timestamp = new Date();
    console.log("[GET] [", timestamp, "] : /hello");
    res.send('Hello World!\n');
});

module.exports = router;
