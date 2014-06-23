/**
 * Created by alexey dubkov on 11/27/13.
 * main application file
 */

var port = 9004;
var site_url = 'https://dt.dubkov.com';

/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var mysql = require('mysql');                       // database
var logger = require('morgan');                     // logger
var favicon = require('serve-favicon');             // favicon
var parser = require('body-parser');
var methodOverride = require('method-override');
var static = require('serve-static');               // static files
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * Not suppurted by "pre" version of node, wich used on my AWS EC2

 var toobusy = require('toobusy');
 app.use(function(req, res, next) {
    if (toobusy()) {
        res.send(503, "I'm busy right now, sorry.");
    } else {
        next();
    }
});
*/


//app.use(serveFavicon('%PATH TO FAVICON%'));

logger.token('remote-addr', function(req){
    return req.headers['x-read-ip'] || req.headers['x-forwarded-for'];
})
logger.format('default', ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ":referrer" ":user-agent"');
app.use(logger('default'));

app.use(parser());
app.set('json spaces', 2);
app.use(methodOverride());
app.use(static(path.join(__dirname, 'public')));
//app.use(errorHandler());

app.db = mysql.createConnection({
    host    : '',
    database: '',
    user    : '',
    password: ''
});

GLOBAL.app = app;

// Initialize cities cache
var init = require('./init.js').init();

// Enable CORS on all respond
app.all('*',function(req, res, next) {
    res.header({
        'Access-Control-Allow-Methods':'OPTIONS,GET,PUT,POST,PATCH,DELETE',
        'Access-Control-Allow-Origin':site_url,
        'Access-Control-Allow-Origin':'https://wheretoeat.tk',
        'Access-Control-Allow-Credentials':'true',
        'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept'
    });
    next();
});

var router_index = require('./routes').router;

app.use(router_index);

// development only
/*if ('development' == app.get('env')) {
    app.use(errorHandler());
}*/

app.use(function(err, req, res, next) {
    res.send(404, 'Error 404. Resource not found.')
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('DineTime.org server listening on port ' + app.get('port'));
});

