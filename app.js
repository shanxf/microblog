
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var partials = require('express-partials');
//var MongoStore = require('connect-mongo');-已失效
var MongoStore = require("connect-mongo")(express);
var flash = require('connect-flash');
var settings = require('./settings');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//--
app.use(partials());
app.use(flash());
//--
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//--
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
  	db: settings.db
  })
}));

app.use(function(req, res,next) {
   res.locals.user = req.session.user;
   var error = req.flash('error');
   var success = req.flash('success');
   res.locals.error = error.length?error:null;
   res.locals.success = success.length?success:null;
   next();
});
//--
app.use(app.router); //保留原来的
//app.use(express.router(routes));node.js开发指南上面的（注释掉）
//--
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/*
app.get('/', routes.index);
app.get('/users', user.list);
*/
/*
app.get('/hello', routes.hello);
app.get('/user/:username', function(req, res) {
  res.send('user: ' + req.params.username);
});
app.get('/list', function(req, res) {
  res.render('list', {
    title: 'List',
    items: [1991, 'byvoid', 'express', 'Node.js']
  });
});
*/
/* express 3.x 版本中已失效
app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user;
  },
  error: function(req, res) {
    var err = req.flash('error');
    if(err.length)
      return err;
    else
      return null;
  },
  success: function(req, res) {
    var succ = req.flash('success');
    if(succ.length)
      return succ;
    else
      return null;
  }
});*/
routes(app);//这个是新加的

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


