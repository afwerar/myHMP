/**
 * Created by afwerar on 2016/11/28.
 */
app.controller('socketIO', function($scope, socket) {
    $scope.sendTxt = '';
    $scope.receiveTxt = '';
    $scope.allSerialPorts = [];
    $scope.monitorSerialPorts = [];
    $scope.socketPorts = [];
    $scope.sendPorts = [];
    $scope.addSocketPortName = '';

    socket.on('disconnect', function () {
        $scope.sendBtnDisable = true;
        alert('服务器失去连接，请重新刷新.');
        location.reload();
    });
    $scope.sendText = function () {
        var length = $scope.monitorSerialPorts.length;
        for (var i=0;i<length;i++){
            if($scope.monitorSerialPorts[i].monitor){
                socket.emit('clientToServer',{name:$scope.monitorSerialPorts[i].name,content:$scope.sendTxt});
            }
        }
        length = $scope.socketPorts.length;
        for (var i=0;i<length;i++){
            if($scope.socketPorts[i].listen){
                socket.emit('clientToServer',{name:$scope.socketPorts[i].name,content:$scope.sendTxt});
            }
        }
    };
    socket.on('serverToClient', function (port, data) {
        $scope.receiveTxt += data;
    });

    $scope.getPorts = function () {
        socket.emit('getAllPorts',null,function (portNameObjects) {
            "use strict";
            $scope.allSerialPorts=portNameObjects.serialPortObjects;
            $scope.monitorSerialPorts=$scope.allSerialPorts.map(function (port){
                port.moniter=false;
                return port;
            });
            var length=portNameObjects.socketPortNames.length;
            for(var i=0;i<length;i++)
            {
                $scope.socketPorts.push({name:portNameObjects.socketPortNames[i],listen:false});
            }
        });
    };
    $scope.switchClick = function (item,index) {
        if(item.open){
            socket.emit('openSerialPort', item.name,function (result) {
                if(result){
                    item.open=!item.open;
                    $scope.monitorSerialPorts[index].open=item.open;
                    $scope.monitorSerialPorts[index].monitor=false;
                }else {
                    alert('端口打开失败.');
                }
            });
        }else{
            socket.emit('closeSerialPort', item.name,function (result) {
                if(result){
                    item.open=!item.open;
                    $scope.monitorSerialPorts[index].open=item.open;
                    $scope.monitorSerialPorts[index].monitor=false;
                }else {
                    alert('端口关闭失败.');
                }
            });
        }
        item.open=!item.open;
    };
    $scope.switchMonitorClick = function (item) {
        var monitorPortsName=$scope.monitorSerialPorts.filter(function (monitorPort) {
            return monitorPort.monitor;
        }).map(function (monitorPortName) {
            return monitorPortName.name;
        });
        item.monitor!=item.monitor;
        socket.emit('switchMonitorSerialPort', monitorPortsName,function () {
            item.monitor!=item.monitor;
            delete monitorPortsName;
        });
    };
    $scope.addSocketClick = function () {
        console.log($scope.addSocketPortName);
        socket.emit('addSocketPort', $scope.addSocketPortName,function (result) {
            if(result){
                $scope.socketPorts.push({name:$scope.addSocketPortName,listen:false});
                $scope.addSocketPortName='';
            }else {
                alert('端口'+$scope.addSocketPortName+'打开失败！')
            }
        });
    };
    $scope.removeSocketClick = function (item,index) {
        socket.emit('removeSocketPort', item.name,function (result) {
            if(result){
                $scope.socketPorts.splice(index,1);
            }else {
                alert('端口'+item.name+'关闭失败！')
            }
        });
    };
    $scope.switchListenSocketClick = function (item) {
        var listenSocketPortsName=$scope.socketPorts.filter(function (listenSocketPort) {
            return listenSocketPort.listen;
        }).map(function (socketListenPortName) {
            return socketListenPortName.name;
        });
        item.monitor!=item.monitor;
        socket.emit('switchListenSocketPort', listenSocketPortsName,function () {
            item.monitor!=item.monitor;
            delete listenSocketPortsName;
        });
    };
})
