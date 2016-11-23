/**
 * Created by afwerar on 2016/11/20.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('serialportcom', { title: '串口' });
});

module.exports = router;