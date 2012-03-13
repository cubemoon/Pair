var io = null;

exports.start = function(ioS)
{
	io = ioS;

	var Lobby 		= require("./PairLobby.js");
	var User 		= require("./PairUser.js");
	var Constant 	= require("./PairConstants.js");

	var lobby = new Lobby();
	lobby.handlers = {roomClosedHandler:roomClosedHandler};


	io.sockets.on('connection', function (socket) {
		socket.on(Constant.CREATE_ROOM, function(data){
			if(data.appID == ""  ||  data.appID == null)
			{
				console.log("LOGIN -> app has no id");
				return;
			}

			var user = new User(data.appID, socket.id, socket);
			var room = lobby.createRoom(user);
			socket.broadcast.emit(Constant.ROOM_CREATED, {roomID : room.id, targetID : data.targetID});
		});

		socket.on(Constant.DISCONNECT, function(data){
			lobby.leaveRoom(data.clientID);
		});

		socket.on(Constant.JOIN_ROOM, function(data){
			var user = new User(data.appID, socket.id, socket);
			lobby.joinRoom(user, data.roomID);
		});

		socket.on('disconnect', function () {
			lobby.leaveRoom(socket.id);
		});

		socket.on(Constant.SEND_TO_ROOM, function(data){
			var users = lobby.getRoomUsers(socket.id);

			for(var key in users)
			{
				var user = users[key];
				if(user.clientID != socket.id)
				{
					user.socket.emit(Constant.RECEIVED_FROM_ROOM, data);
				}
			}
		});

	});
}


/**********  HANDLERS  **********/

function roomClosedHandler(user)
{
	user.socket.emit("ALL_LEFT");
}
