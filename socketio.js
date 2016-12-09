/**
 * Created by afwerar on 2016/11/19.
 */
var socket_io = require('socket.io');
var serialPort = require("serialport");
var com = require('./com');

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
        onlineUser.socket.on('dislistenPorts',function(){
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
            serialPort.list(function (err, ports) {
                var portnames = [];
                var openportnames = com.getOpeningPort();

                ports.forEach(function(port) {
                    if(port.pnpId===undefined){
                        portnames.push({name:port.comName,open:(openportnames.indexOf(port.comName)>=0)});
                    }
                });
                fn(portnames);
                delete portnames;
                delete openportnames;
            });
        });
        onlineUser.socket.on('switchPort',function (port,fn) {
            var openPortNames = com.getOpeningPort();
            var index = openPortNames.indexOf(port.name);
            if((index>=0)!=port.open){
                if(port.open){
                    com.runServer([port.name],fn);
                }else{
                    com.closeServer(index,fn);
                }
            }else {
                fn(false);
            }
        })
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