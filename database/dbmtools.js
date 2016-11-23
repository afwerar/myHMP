/**
 * Created by afwerar on 2016/11/22.
 */
var fs=require('fs');

//fs.writeFileSync('./database/portconfig.json',JSON.stringify({a:1,b:2},null,4));
function m_getSerialPort() {
    var JsonObj=JSON.parse(fs.readFileSync('./database/portconfig.json'));
    return JsonObj.serialport;
}

function m_getSocketPort() {
    var JsonObj=JSON.parse(fs.readFileSync('./database/portconfig.json'));
    return JsonObj.socketport;
}

function m_getWebPort() {
    var JsonObj=JSON.parse(fs.readFileSync('./database/portconfig.json'));
    return JsonObj.webport;
}

exports.getSerialPort = m_getSerialPort;
exports.getSocketPort = m_getSocketPort;
exports.getWebPort = m_getWebPort;

