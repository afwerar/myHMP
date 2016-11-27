/**
 * Created by afwerar on 2016/11/19.
 */
var socket_io = require('socket.io');
var com = require('./com');

//在线用户
var onlineUsers = new Array();
exports.getSocketio = function(server){
    var io = socket_io.listen(server);
    io.sockets.on('connection', function (socket) {
        var onlineUser = {};
        onlineUser.socket = socket;
        onlineUser.port = null;
        onlineUser.socket.emit('online');
        console.log('Client '+onlineUser.socket.id+' Online.');
        onlineUser.socket.on('openPort',function(port){
            onlineUser.port = port;
            console.log('Client connect to ' + port);
            onlineUser.socket.emit('openSuccess');
        });
        onlineUser.socket.on('closePort',function(){
            console.log('Client disconnect to ' + onlineUser.port);
            onlineUser.port = null;
        });
        onlineUser.socket.on('clientToServer',function(port,data){
            com.writePort(port,data);
            console.log("Client to "+port+" says: " + data);
            console.log(new Buffer(data));
        });
        onlineUser.socket.on('disconnect', function() {
            var length = onlineUsers.length;
            for(var i=0;i<length;i++){
                if(onlineUser===onlineUsers[i]){
                    delete onlineUser;
                    console.log('Client '+onlineUser.socket.id+' Outline.');
                    onlineUsers.splice(i,1);
                }
            }
        });
        onlineUsers.push(onlineUser);
    });
};

exports.writeIO=function(port,data){
    var length=onlineUsers.length;
    for (var i=0;i<length;i++){
        if(onlineUsers[i].port===port||port==='all'){
            onlineUsers[i].socket.emit('serverToClient',port,data.toString());
        }
    }
    console.log("Server " + port + " to client says: " + data);
    console.log(data);
}