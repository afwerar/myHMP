/**
 * Created by afwerar on 2016/11/19.
 */
var socket_io = require('socket.io');
var serialPort = require("serialport");
var com = require('./com');
var tcpSocket = require('./tcpsocket');

//在线用户
var onlineUsers = new Array();
exports.getSocketIO = function(server){
    var io = socket_io.listen(server);
    io.sockets.on('connection', function (socket) {
        var onlineUser = {};
        onlineUser.socket = socket;
        onlineUser.serialPorts = [];
        onlineUser.socketPorts = [];
        console.log('Client '+onlineUser.socket.id+' connect.');
        onlineUser.socket.on('clientToServer',function(data){
            if(onlineUser.serialPorts!=null&&onlineUser.serialPorts.indexOf(data.name)>=0)
            {
                com.writePort(data.name,data.content);
            }
            if(onlineUser.socketPorts!=null&&onlineUser.socketPorts.indexOf(data.name)>=0)
            {
                tcpSocket.writePort(data.name,data.content);
            }
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

        onlineUser.socket.on('openSerialPort',function (portName,fn) {
            com.openServer(portName,fn);
        });
        onlineUser.socket.on('closeSerialPort',function (portName,fn) {
            com.closeServer(portName,fn);
        });
        onlineUser.socket.on('switchMonitorSerialPort',function (portNames,fn) {
            onlineUser.serialPorts = null;
            onlineUser.serialPorts = portNames;
            if(onlineUser.socketPorts.length>0||onlineUser.serialPorts.length>0){
                console.log('Client '+onlineUser.socket.id+' listens to '+ onlineUser.socketPorts + onlineUser.serialPorts);
            }else{
                console.log('Client '+onlineUser.socket.id+' listens to none.');
            }
            fn();
        });

        onlineUser.socket.on('addSocketPort',function (portName,fn) {
            tcpSocket.openServer(portName,fn);
        });
        onlineUser.socket.on('removeSocketPort',function (portName,fn) {
            tcpSocket.closeServer(portName,fn);
        });
        onlineUser.socket.on('switchListenSocketPort',function (portNames,fn) {
            onlineUser.socketPorts=null;
            onlineUser.socketPorts=portNames;
            if(onlineUser.socketPorts.length>0||onlineUser.serialPorts.length>0){
                console.log('Client '+onlineUser.socket.id+' listens to '+ onlineUser.socketPorts + onlineUser.serialPorts);
            }else{
                console.log('Client '+onlineUser.socket.id+' listens to none.');
            }
            fn();
        });
        onlineUsers.push(onlineUser);
    });
};

exports.writeIO=function(portName,data){
    var length=onlineUsers.length;
    for (var i=0;i<length;i++){
        if((onlineUsers[i].serialPorts!=null&&onlineUsers[i].serialPorts.indexOf(portName)>=0)||
            (onlineUsers[i].socketPorts!=null&&onlineUsers[i].socketPorts.indexOf(portName)>=0)){
            onlineUsers[i].socket.emit('serverToClient',portName,data.toString());
        }
    }
    console.log("Server " + portName + " to client says: " + data);
    console.log(data);
}