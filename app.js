var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8081);

io.configure(function () {
  io.set("close timeout", 50);
});

function handler (req, res) {
  fs.readFile(__dirname + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


var Lobby 	= require("./classes/Lobby.js");
var User 	= require("./classes/User.js");


var lobby = new Lobby();
lobby.handlers = {roomClosedHandler:roomClosedHandler};


io.sockets.on('connection', function (socket) {


	socket.on("LOGIN", function(data){
		var user = new User(data.appID, socket.id, socket);
		var room = lobby.createRoom(user);
		socket.broadcast.emit("OPEN_ROOM", {roomID : room.id, targetID : data.targetID});
	});

	socket.on("DISCONNECT", function(data){
		lobby.leaveRoom(data.clientID);
	});



	socket.on("JOIN_ROOM", function(data){
		var user = new User(data.appID, socket.id, socket);
		lobby.joinRoom(user, data.roomID);
	});

	socket.on('disconnect', function () {
		lobby.leaveRoom(socket.id);
	});

});


/**********  HANDLERS  **********/

function roomClosedHandler(user)
{
	user.socket.emit("ALL_LEFT");
}