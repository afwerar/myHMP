/**
 * Created by afwerar on 2016/11/19.
 */
var SerialPort = require("serialport");
var io = require('./socketio');

var serialports = new Array();

function creatSerialPort(port) {
    this._port = port;
    var serialPort = new SerialPort(port, {
        baudrate: 9600, dataBits: 8, parity: 'none', stopBits: 1,flowControl: false
    });
    serialPort.on("open", function () {
        console.log(port + " open successfully！");
    });
    serialPort.on('data', function(data) {
        io.writeIO(port,data);
    });
    serialPort.on('error', function(err) {
        console.log(err);
    });
}

exports.runServer = function(spconfigs){
    var length = spconfigs.length;
    for (var i=0; i < length; i++) {
        serialports.push(new creatSerialPort(spconfigs[i]));
    }
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