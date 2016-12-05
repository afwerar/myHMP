/**
 * Created by afwerar on 2016/11/27.
 */
// var session = require('express-session');
var mysql = require('../util/mysqltools');

exports.get = function(req, res, next){
    "use strict";
    res.render('login');
}
exports.post = function(req, res, next){
    "use strict";
    var username = req.body.username;
    var pwd = req.body.pwd;
    // console.log(req.session);
    if(typeof(req.session) == 'undefined'){
        req.error = '用户登录session出现问题';
        res.render('login') ;
    }else{
        mysql.getUserAccount(username,function(err, rows, fields) {
            if (err) throw err;
            // console.log(rows);
            if (rows.length>0&&rows[0].password===pwd){
                req.session.user={username: username};
                res.redirect('/index');
            }else{
                req.error = '用户名密码错误';
                res.render('login') ;
            }
        });
    }
}