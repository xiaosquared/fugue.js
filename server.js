var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var staticRoot = path.join(__dirname+'/public/');

//Expose static content
app.use(express.static('public'));

//Routes
app.get('/mf', function(req, res){
    res.sendFile(staticRoot+"fugue.html");
});

app.get('/remote', function(req, res){
    res.sendFile(staticRoot+"remote.html");
});

//WS Server
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('control', function (msg) {
    console.log(msg);
    io.emit('control', msg);
  });
});

server.listen(3000,function(){
    var port = server.address().port;
    var host = server.address().address;
    (host == '::') ? host = 'localhost' : host = host;
    console.log('MFS Listening at http://%s:%s',host, port);
});
