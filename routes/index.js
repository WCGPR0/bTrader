var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res){
    var timestamp = new Date();
    console.log("[GET] [", timestamp, "] : /hello");
    res.send('Hello World!\n');
});

module.exports = router;
