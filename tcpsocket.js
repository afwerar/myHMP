/**
 * Created by afwerar on 2016/12/5.
 */
var net = require('net');
var io = require('./socketio');

var socketPortServerList = [];

function socketPortServer(portName,fn) {
    this.portName = portName;
    var clientList = [];
    this.socketServerCtrl = new net.createServer();
    this.writeInfo = function (data) {
        var length = clientList.length;
        for(var i=0;i<length;i++){
            clientList[i].write(data);
        }
    }
    this.socketServerCtrl.on('connection', function(client) {
        client.name = client.remoteAddress + ':' + client.remotePort;
        clientList.push(client);

        client.on('data', function(data) {
            io.writeIO(portName,data);
            console.log(client.name + ' say ' +data);
        });
        client.on('end', function() {
            console.log(client.name + ' disconnect.');
            clientList.splice(clientList.indexOf(client), 1); // 删除数组中的制定元素。这是 JS 基本功哦~
        });
        client.on('error', function(e) {
            console.log(e);
        });
    });
    this.socketServerCtrl.on('listening',function () {
        if(fn!=null) fn(true);
        console.log(portName + " is listening.");
    });
    this.socketServerCtrl.on('error',function (e) {
        if(fn!=null) fn(false);
        console.log(e);
    });
    this.socketServerCtrl.listen(portName);
}

exports.runServer = function(portNames,fn){
    var length = portNames.length;
    for (var i=0; i < length; i++) {
        this.openServer(portNames[i],fn);
    }
};
exports.openServer =function (portName,fn) {
    var index = null;
    var length = socketPortServerList.length;
    for(var i = 0;i<length;i++){
        if(socketPortServerList[i].portName===portName){
            index=i;
            break;
        }
    }
    if(index===null){
        socketPortServerList.push(new socketPortServer(portName,function (result) {
            if(!result){
                delete socketPortServerList[socketPortServerList.length-1].socketServerCtrl;
                delete socketPortServerList[socketPortServerList.length-1];
                socketPortServerList.pop();
            }
            if(fn!=null) fn(result);
        }));
    }else {
        if(fn!=null) fn(true);
    }
}
exports.closeServer = function(portName,fn) {
    var index = null;
    var length = socketPortServerList.length;
    for(var i = 0;i<length;i++){
        if(socketPortServerList[i].portName===portName){
            index=i;
            break;
        }
    }
    if(index!=null)
    {
        socketPortServerList[index].socketServerCtrl.close(function () {
            console.log(socketPortServerList[index].portName + " do not listen！");
            delete  socketPortServerList[index].socketServerCtrl;
            delete socketPortServerList[index];
            socketPortServerList.splice(index,1);
            if(fn!=null) fn(true);
        });
    }else{
        if(fn!=null) fn(true);
    }
}

exports.writePort=function(portName,data){
    var length = socketPortServerList.length;
    for (var i=0;i<length;i++){
        if(portName===socketPortServerList[i].portName){
            socketPortServerList[i].writeInfo(data);
        }
    }
}
exports.getListeningPort=function () {
    return socketPortServerList.map(function (socketServer) {
        return socketServer.portName;
    });
}