/**
 * Created by afwerar on 2016/12/5.
 */
var net = require('net');
var socketPortServerList = [];

function socketPortServer(portName,fn) {
    this.portName = portName;
    var clientList = [];
    this.socketServerCtrl = new net.createServer();
    this.socketServerCtrl.on('connection', function(client) {
        client.name = client.remoteAddress + ':' + client.remotePort;
        client.write('Hi ' + client.name + '!\n');
        console.log(client.name + ' connect.');
        clientList.push(client);

        client.on('data', function(data) {
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
        socketPortServerList.push(new socketPortServer(portNames[i],function (result) {
            if(!result){
                delete socketPortServerList[socketPortServerList.length-1].socketServerCtrl;
                delete socketPortServerList[socketPortServerList.length-1];
                socketPortServerList.pop();
            }
            if(fn!=null) fn(result);
        }));
    }
};

exports.closeServer = function(portName,fn) {
    var portObject={index:null,name:portName}
    socketPortServerList.some(function (socketPortServer,index) {
        this.index = index;
        return socketPortServer.portName===this.name;
    },portObject);

    socketPortServerList[portObject.index].serialPortCtrl.close(function () {
        console.log(socketPortServerList[portObject.index].portName + " do not listen！");
        delete  socketPortServerList[portObject.index].serialPortCtrl;
        delete socketPortServerList[portObject.index];
        socketPortServerList.splice(portObject.index,1);
        delete portObject;
        fn(true);
    });
}

exports.switchServer = function (portObject,fn) {
    var checkOpening = socketPortServerList.some(function (socketPortServer) {
        return socketPortServer.portName===this.name;
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
    var length = socketPortServerList.length;
    for (var i=0;i<length;i++){
        if(portName===socketPortServerList[i].portName){
            socketPortServerList[i].socketServerCtrl.write(data, function(err, results) {
                if(err!=null) console.log('Error: ' + err);
                if(results!=null) console.log('Results: ' + results);
            });
        }
    }
}

exports.getListeningPort=function () {
    return socketPortServerList.map(function (socketServer) {
        return socketServer.portName;
    });
}