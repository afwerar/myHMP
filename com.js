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
        serialPortServerList.push(new serialPortServer(portNames[i],function(result) {
            if(!result){
                delete  serialPortServerList[serialPortServerList.length-1].serialPortCtrl;
                delete serialPortServerList[serialPortServerList.length-1];
                serialPortServerList.pop();
            }
            if(fn!=null) fn(result);
        }));
    }
};

exports.closeServer = function(portName,fn){
    var portObject={index:null,name:portName}
    serialPortServerList.some(function (serialPortServer,index) {
        this.index = index;
        return serialPortServer.portName===this.name;
    },portObject);

    serialPortServerList[portObject.index].serialPortCtrl.close(function () {
        console.log(serialPortServerList[portObject.index].portName + " close successfully！");
        delete  serialPortServerList[portObject.index].serialPortCtrl;
        delete serialPortServerList[portObject.index];
        serialPortServerList.splice(portObject.index,1);
        delete portObject;
        fn(true);
    });
};

exports.switchServer = function (portObject,fn) {
    var checkOpening = serialPortServerList.some(function (serialPortServer) {
        return serialPortServer.portName===this.name;
    },{name:portObject.name});
    if(checkOpening===portObject.open){
        fn(true);
        return;
    }
    if(portObject.open){
        this.runServer([portObject.name],fn);
    }else {
        this.closeServer(portObject.name,fn);
    }
}

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