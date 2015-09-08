var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var staticRoot = path.join(__dirname+'/public/');

////////////////////
// MIDI RECORDING //
////////////////////
var fs = require('fs');
var now = require("performance-now");
var midijs = require('midijs');
var ChannelEvent = midijs.File.ChannelEvent;

var midi = require('midi');
var input = new midi.input();
input.openPort(0);
input.on('message', function(deltaT, msg) {
    var type = msg[0];
    var pitch = msg[1];
    var vel = msg[2];

    prevTime = currentTime;
    currentTime = now();
    var time = (currentTime - prevTime)/4;

    switch(type) {
        case 144:
            console.log("note on: " + pitch + " vel " + vel);
            track.addEvent(new ChannelEvent(ChannelEvent.TYPE.NOTE_ON, {
                note: pitch,
                velocity: vel
            }, 0, time));
            break;
        case 128:
            console.log("note off: " + pitch + " time " + deltaT);
            track.addEvent(new ChannelEvent(ChannelEvent.TYPE.NOTE_OFF, {
                note: pitch,
                velocity: vel
            }, 0, time));
            break;
        case 176:
            console.log("controller: " + pitch + " vel " + vel);
            track.addEvent(new ChannelEvent(ChannelEvent.TYPE.CONTROLLER, {
                controller: pitch,
                value: vel
            }, 0, time));
            break;
    }
});

var file, track, prevTime, currentTime;
function beginMIDIFile() {
    file = new midijs.File();
    file.addTrack(0, []);
    track = file.getTrack(0);

    prevTime = now();
    currentTime = prevTime;
    console.log("start time ", prevTime);
}

function endMIDIFile() {
    console.log("end time ", now());
    file.getData(function (err, data) {
        if (err)
            throw err;
        fs.writeFile('test2.mid', data, function(err) {
            if (err)
                throw err;
        });
    })

    //fs.writeFileSync('test.mid', file.toBytes(), 'binary');
}



//Expose static content
app.use(express.static('public'));

//Routes
app.get('/andante', function(req, res){
    res.sendFile(staticRoot+"andante.html");
});

app.get('/mf', function(req, res){
    res.sendFile(staticRoot+"fugue.html");
});

app.get('/remote', function(req, res){
    res.sendFile(staticRoot+"remote.html");
});

//WS Server
io.on('connection', function(socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('control', function(msg) {
    console.log('control', msg);
    io.emit('control', msg);
  });
  socket.on('song', function(msg) {
      console.log('song', msg);
     io.emit('song', msg);
  });
  socket.on('mode', function(msg) {
      console.log('mode', msg);
      io.emit('mode', msg);
  });
  socket.on('lights', function() {
      console.log('lights toggle');
      io.emit('lights');
  });
  socket.on('speed', function(msg) {
      console.log('speed', msg);
      io.emit('speed', msg);
  });
  socket.on('record', function(msg) {
     console.log('record', msg);
     io.emit('record', msg);
     if (msg == 'start') {
        beginMIDIFile();
    } else if (msg == 'stop') {
        endMIDIFile();
    }
  });
});

server.listen(3000,function(){
    var port = server.address().port;
    var host = server.address().address;
    (host == '::') ? host = 'localhost' : host = host;
    console.log('MFS Listening at http://%s:%s',host, port);
});
