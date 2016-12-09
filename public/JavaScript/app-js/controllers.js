/**
 * Created by afwerar on 2016/11/28.
 */
app.controller('socketIO', function($scope, socket) {
    $scope.sendtxt = '';
    $scope.rcevtxt = '';
    $scope.allSerialPorts = [];
    $scope.monitorSerialPorts = [];
    $scope.sendports = [];
    $scope.rcevports = [];
    $scope.openbtntxt = '连接端口';
    $scope.sendbtntxt = '发送数据';
    $scope.portschangedisable = false;
    $scope.sendbtndisable = true;

    $scope.openSerialPort = function () {
        if ($scope.openbtntxt === "连接端口") {
            var monitorPortsName=$scope.monitorSerialPorts.filter(function (monitorPort) {
                return monitorPort.monitor;
            }).map(function (monitorPortName) {
                return monitorPortName.name;
            });
            if(monitorPortsName.length>0){
                socket.emit('listenPorts', monitorPortsName,function () {
                    $scope.portschangedisable = true;
                    $scope.sendbtndisable = false;
                    $scope.openbtntxt = '断开连接';
                });
            }else {
                alert('请选择要监听的端口');
            }
        } else {
            socket.emit('disListenPorts');
            $scope.portschangedisable = false;
            $scope.sendbtndisable = true;
            $scope.openbtntxt = '连接端口';
        }
    }
    socket.on('disconnect', function () {
        $scope.portschangedisable = false;
        $scope.sendbtndisable = true;
        $scope.openbtntxt = '连接端口';
        alert('服务器失去连接，请重新刷新.');
        location.reload();
    });
    $scope.sendText = function () {
        var length = $scope.monitorSerialPorts.length;
        for (var i=0;i<length;i++){
            if($scope.monitorSerialPorts[i].monitor){
                socket.emit('clientToServer',{name:$scope.monitorSerialPorts[i].name,content:$scope.sendtxt});
            }
        }
    }
    socket.on('serverToClient', function (port, data) {
        $scope.rcevtxt += data;
    });

    $scope.getPorts = function () {
        socket.emit('getAllPorts',null,function (portNameObjects) {
            "use strict";
            $scope.allSerialPorts=portNameObjects.serialPortObjects;
            $scope.monitorSerialPorts=$scope.allSerialPorts.map(function (port){
                port.moniter=false;
                return port;
            });
        });
    }
    $scope.switchClick = function (item,index) {
        socket.emit('switchSerialPort', item,function (result) {
            if(result){
                item.open=!item.open;
                $scope.monitorSerialPorts[index].open=item.open;
                $scope.monitorSerialPorts[index].monitor=false;
            }else {
                alert('端口打开失败.');
            }
        });
        item.open=!item.open;
    }
    $scope.switchMonitorClick = function (item) {
        
    }
})
