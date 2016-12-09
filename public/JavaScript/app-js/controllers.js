/**
 * Created by afwerar on 2016/11/28.
 */
app.controller('socketio', function($scope, socket) {
    $scope.sendtxt = '';
    $scope.rcevtxt = '';
    $scope.allports = [];
    $scope.monitorports = [];
    $scope.sendports = [];
    $scope.rcevports = [];
    $scope.openbtntxt = '连接端口';
    $scope.sendbtntxt = '发送数据';
    $scope.portschangedisable = false;
    $scope.sendbtndisable = true;

    $scope.openSerialPort = function () {
        if ($scope.openbtntxt === "连接端口") {
            var monitorportsname=[];
            var length = $scope.monitorports.length;
            for(var i=0;i<length;i++){
                if($scope.monitorports[i].monitor){
                    monitorportsname.push($scope.monitorports[i].name);
                }
            }
            if(monitorportsname.length>0){
                socket.emit('listenPorts', monitorportsname,function () {
                    $scope.portschangedisable = true;
                    $scope.sendbtndisable = false;
                    $scope.openbtntxt = '断开连接';
                });
            }else {
                alert('请选择要监听的端口');
            }
        } else {
            socket.emit('dislistenPorts');
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
        var length = $scope.monitorports.length;
        for (var i=0;i<length;i++){
            if($scope.monitorports[i].monitor){
                socket.emit('clientToServer',{name:$scope.monitorports[i].name,content:$scope.sendtxt});
            }
        }
    }
    socket.on('serverToClient', function (port, data) {
        $scope.rcevtxt += data;
    });

    $scope.getPorts = function () {
        socket.emit('getAllPorts',null,function (ports) {
            "use strict";
            $scope.allports=ports;
            var length = ports.length;
            for(var i=0;i<length;i++){
                if(ports[i].open){
                    $scope.monitorports.push({name:ports[i].name,show:true,monitor:false});
                }else {
                    $scope.monitorports.push({name:ports[i].name,show:false,monitor:false});
                }
            }
        });
    }
    $scope.mclick = function (item,index) {
        // alert(item.name + item.open);
        socket.emit('switchPort', item,function (reult) {
            if(reult){
                item.open=!item.open;
                if (item.open){
                    $scope.monitorports[index].show=true;
                }else {
                    $scope.monitorports[index].show=false;
                }
                $scope.monitorports[index].monitor=false;
            }else {
                alert('端口打开失败.');
            }
        });
        item.open=!item.open;
    }
})
