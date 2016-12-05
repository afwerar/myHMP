/**
 * Created by afwerar on 2016/11/27.
 */
var mysql = require('mysql');
var config = require('../config/config');
var mysqlcode = require('./mysqlcode');

function m_getTableAllText(tablename,callback) {
    var commandtext = mysqlcode.gettablealltext.replace("TABLENAME",tablename);

    var connection = mysql.createConnection(config.mysql);
    connection.connect();
    connection.query(commandtext,callback);
    connection.end();
}

function m_getTableRowText(tablename,columnname,rowtext,callback) {
    var commandtext1 = mysqlcode.gettablerowtext.replace("TABLENAME",tablename);
    var commandtext2 = commandtext1.replace("COLUMNNAME",columnname);
    var commandtext3 = commandtext2.replace("ROWTEXT",rowtext);

    var connection = mysql.createConnection(config.mysql);
    connection.connect();
    connection.query(commandtext3, callback);
    connection.end();
}

exports.getTestText=function (callback) {
    m_getTableAllText('test',callback);
}

exports.getUsersAccount=function (callback) {
    m_getTableAllText('users',callback);
}

exports.getUserAccount=function (name,callback) {
    m_getTableRowText('users','name',name,callback);
}