/**
 * Created by afwerar on 2016/11/20.
 */
var express = require('express');
var router = express.Router();
var serialPort = require("serialport");
var com = require('../com');

/* GET home page. */
router.get('/', function(req, res, next) {
    serialPort.list(function (err, ports) {
        var portnames = [];
        var openportnames = com.getOpeningPort();
        ports.forEach(function(port) {
            if(port.pnpId===undefined){
                portnames.push(port.comName);
            }
        });
        res.render('serialportcom', { title: '串口' ,ports : portnames, openports:openportnames});
        delete portnames;
        delete openportnames;
    });
});

module.exports = router;