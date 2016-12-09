/**
 * Created by afwerar on 2016/11/19.
 */
var socket_io = require('socket.io');
var serialPort = require("serialport");
var com = require('./com');
var tcpSocket = require('./tcpsocket');

//在线用户
var onlineUsers = new Array();
exports.getSocketio = function(server){
    var io = socket_io.listen(server);
    io.sockets.on('connection', function (socket) {
        var onlineUser = {};
        onlineUser.socket = socket;
        onlineUser.ports = null;
        console.log('Client '+onlineUser.socket.id+' connect.');
        onlineUser.socket.on('listenPorts',function(ports,fn){
            onlineUser.ports = ports;
            console.log('Client '+onlineUser.socket.id+' listens to '+ports);
            fn();
        });
        onlineUser.socket.on('disListenPorts',function(){
            console.log('Client '+onlineUser.socket.id+' dislisten to ' + onlineUser.ports);
            onlineUser.ports = null;
        });
        onlineUser.socket.on('clientToServer',function(data){
            com.writePort(data.name,data.content);
            console.log('Client to '+data.name+' says: ' + data.content);
            console.log(new Buffer(data.content));
        });
        onlineUser.socket.on('disconnect', function() {
            var length = onlineUsers.length;
            for(var i=0;i<length;i++){
                if(onlineUser===onlineUsers[i]){
                    delete onlineUser;
                    console.log('Client '+onlineUser.socket.id+' disconnect.');
                    onlineUsers.splice(i,1);
                }
            }
        });

        onlineUser.socket.on('getAllPorts', function(data,fn) {
            serialPort.list(function (err, serialPorts) {
                var portNameObjects = {serialPortObjects:[],socketPortNames:null};
                var openingSerialPortNames = com.getOpeningPort();

                serialPorts.forEach(function(serialPort) {
                    if(serialPort.pnpId===undefined){
                        portNameObjects.serialPortObjects.push({name:serialPort.comName,open:(openingSerialPortNames.indexOf(serialPort.comName)>=0)});
                    }
                });
                portNameObjects.socketPortNames = tcpSocket.getListeningPort();
                fn(portNameObjects);
                delete portNameObjects;
                delete openingSerialPortNames;
            });
        });
        onlineUser.socket.on('switchSerialPort',function (portObject,fn) {
            com.switchServer(portObject,fn);
        });
        onlineUser.socket.on('switchSocketPort',function (portObject,fn) {
            tcpSocket.switchServer(portObject,fn);
        });
        onlineUsers.push(onlineUser);
    });
};

exports.writeIO=function(port,data){
    var length=onlineUsers.length;
    for (var i=0;i<length;i++){
        if(onlineUsers[i].ports!=null&&onlineUsers[i].ports.indexOf(port)>=0||port==='all'){
            onlineUsers[i].socket.emit('serverToClient',port,data.toString());
        }
    }
    console.log("Server " + port + " to client says: " + data);
    console.log(data);
}