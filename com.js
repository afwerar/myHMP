/**
 * Created by afwerar on 2016/11/19.
 */
var SerialPort = require("serialport");
var io = require('./socketio');

var serialPortServerList = [];

function serialPortServer(portName,fn) {
    this.portName = portName;
    this.serialPortCtrl = new SerialPort(portName, {
        baudrate: 9600, dataBits: 8, parity: 'none', stopBits: 1,flowControl: false
    });
    this.serialPortCtrl.on("open", function () {
        if(fn!=null) fn(true);
        console.log(portName + " open successfully！");
    });
    this.serialPortCtrl.on('data', function(data) {
        io.writeIO(portName,data);
    });
    this.serialPortCtrl.on('error', function(err) {
        if(fn!=null) fn(false);
        console.log(err);
    });
}

exports.runServer = function(portNames,fn){
    var length = portNames.length;
    for (var i=0; i < length; i++) {
        this.openServer(portNames[i],fn);
    }
};
exports.openServer = function (portName,fn) {
    var index = null;
    var length = serialPortServerList.length;
    for(var i = 0;i<length;i++){
        if(serialPortServerList[i].portName===portName){
            index=i;
            break;
        }
    }
    if(index===null){
        serialPortServerList.push(new serialPortServer(portName,function (result) {
            if(!result){
                delete serialPortServerList[serialPortServerList.length-1].socketServerCtrl;
                delete serialPortServerList[serialPortServerList.length-1];
                serialPortServerList.pop();
            }
            if(fn!=null) fn(result);
        }));
    }else {
        if(fn!=null) fn(true);
    }
}
exports.closeServer = function(portName,fn){
    var index = null;
    var length = serialPortServerList.length;
    for(var i = 0;i<length;i++){
        if(serialPortServerList[i].portName===portName){
            index=i;
            break;
        }
    }
    if(index!==null){
        serialPortServerList[index].serialPortCtrl.close(function () {
            console.log(serialPortServerList[index].portName + " close successfully！");
            delete  serialPortServerList[index].serialPortCtrl;
            delete serialPortServerList[index];
            serialPortServerList.splice(index,1);
            if(fn!=null) fn(true);
        });
    }else {
        if(fn!=null) fn(true);
    }
};

exports.writePort=function(portName,data){
    var length = serialPortServerList.length;
    for (var i=0;i<length;i++){
        if(portName===serialPortServerList[i].portName){
            serialPortServerList[i].serialPortCtrl.write(data, function(err, results) {
                if(err!=null) console.log('Error: ' + err);
                if(results!=null) console.log('Results: ' + results);
            });
        }
    }
}

exports.getOpeningPort=function () {
    return serialPortServerList.map(function (serialPortServer) {
        return serialPortServer.portName;
    });
}