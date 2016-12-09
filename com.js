/**
 * Created by afwerar on 2016/11/19.
 */
var SerialPort = require("serialport");
var io = require('./socketio');

var serialports = new Array();

function creatSerialPort(port,fn) {
    this._port = port;
    this.serialPort = new SerialPort(port, {
        baudrate: 9600, dataBits: 8, parity: 'none', stopBits: 1,flowControl: false
    });
    this.serialPort.on("open", function () {
        if(fn!=null) fn(true);
        console.log(port + " open successfully！");
    });
    this.serialPort.on('data', function(data) {
        io.writeIO(port,data);
    });
    this.serialPort.on('error', function(err) {
        if(fn!=null) fn(false);
        console.log(err);
    });
}

exports.runServer = function(spconfigs,fn){
    var length = spconfigs.length;
    for (var i=0; i < length; i++) {
        serialports.push(new creatSerialPort(spconfigs[i],fn));
    }
};

exports.closeServer = function(index,fn){
    serialports[index].serialPort.close(function () {
        // serialports[index].destroy();
        console.log(serialports[index]._port + " close successfully！");
        delete serialports[index];
        serialports.splice(index,1);
        fn(true);
    });
};

exports.writePort=function(port,data){
    var length = serialports.length;
    for (var i=0;i<length;i++){
        if(serialports[i].serialPort.isOpen()&&(port==="all"||port===serialports[i]._port)){
            serialports[i].serialPort.write(data, function(err, results) {
                if(err!=null) console.log('Error: ' + err);
                if(results!=null) console.log('Results: ' + results);
            });
        }
    }
}

exports.getOpeningPort=function () {
    var openList = [];
    var length = serialports.length;
    for (var i=0;i<length;i++){
        if(serialports[i].serialPort.isOpen()){
            openList.push(serialports[i]._port);
        }
    }
    return openList;
}