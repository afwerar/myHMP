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
    $scope.sendBtnTxt = '发送数据';
    $scope.sendBtnDisable = true;
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
    };
    $scope.switchMonitorClick = function (item) {
        var monitorPortsName=$scope.monitorSerialPorts.filter(function (monitorPort) {
            return monitorPort.monitor;
        }).map(function (monitorPortName) {
            return monitorPortName.name;
        });
        item.monitor!=item.monitor;
        socket.emit('switchMonitorSerialPort', monitorPortsName,function () {
            if(monitorPortsName.length>0){
                $scope.sendBtnDisable = false;
            }else{
                $scope.sendBtnDisable = true;
            }
            item.monitor!=item.monitor;
            delete monitorPortsName;
        });
    };
    $scope.switchSocketListenClick = function (item) {
        console.log(item);
    };
    $scope.removeSocketClick = function (item) {
        console.log(item);
    };
    $scope.addSocketClick = function () {
        console.log($scope.addSocketPortName);
    };
})
