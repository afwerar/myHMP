var express = require('express');
var session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);
var router = express.Router();

/* GET home page. */
router.get('/',checkLogin);
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

function checkLogin(req,res,next){
  console.log(req.session);
  if (!req.session.sign) {//检查用户是否已经登录
    req.session.sign = true;
    //   return res.redirect('/login');
  }
  next();
}

module.exports = router;
