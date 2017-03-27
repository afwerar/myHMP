var login = require('./login');
var sport = require('./serialportcom');
var users = require('./users');
var my3d = require('./my3d');

module.exports = function(app){
    app.get('/', function (req,res,next){
        res.redirect('/index');
    });
    app.get('/index',function checkLogin(req,res,next){
        // console.log(req.session);
        if (req.session.user) {//检查用户是否已经登录
            res.render('index', { title: 'Express' ,user: {username: req.session.user.username}});
        }else {
            res.render('index', { title: 'Express'});
        }
    });
    app.get('/login', login.get);
    app.post('/login', login.post);
    app.get('/logout', function (req,res,next){
        //删除Cookie
        delete req.session.user;
        res.redirect('/index');
    });
    app.get('/serialportcom', sport.get);
    app.get('/my3d', my3d.get);
    app.get('/my3d1', function(req, res, next){
        "use strict";
        res.render('my3d1');
    });
    app.get('/users', users.get);
};
