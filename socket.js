/**
 * Created by afwerar on 2016/12/5.
 */
var net = require('net');
var chatServer = net.createServer(),
    clientList = [];

chatServer.on('connection', function(client) {
    client.name = client.remoteAddress + ':' + client.remotePort;
    client.write('Hi ' + client.name + '!\n');
    console.log(client);
    clientList.push(client);

    client.on('data', function(data) {
        broadcast(data, client);
    });

    client.on('end', function() {
        clientList.splice(clientList.indexOf(client), 1); // 删除数组中的制定元素。这是 JS 基本功哦~
    });
    client.on('error', function(e) {
        console.log(e);
    });
});
function broadcast(message, client) {
    var cleanup = [];
    for(var i=0;i<clientList.length;i+=1) {
        if(client === clientList[i]) {
            if(clientList[i].writable) { // 先检查 sockets 是否可写
                clientList[i].write(client.name + " says " + message +'\r\n');
            } else {
                cleanup.push(clientList[i]); // 如果不可写，收集起来销毁。销毁之前要 Socket.destroy() 用 API 的方法销毁。
                clientList[i].destroy();
            }

        }
    }  //Remove dead Nodes out of write loop to avoid trashing loop index
    for(i=0;i<cleanup.length;i+=1) {
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
}

chatServer.listen(9000);