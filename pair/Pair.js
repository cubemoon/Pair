var Lobby 		= require("./PairLobby.js");
var User 		= require("./PairUser.js");
var Constant 	= require("./PairConstants.js");

var io = null;
var lobby;

exports.start = function(ioS)
{
	io = ioS;

	lobby = new Lobby();
	lobby.handlers = {roomClosedHandler:roomClosedHandler};


	io.sockets.on('connection', function (socket) {
		socket.on(Constant.DISCONNECT, function(data){
			lobby.leaveRoom(data.clientID);
		});

		socket.on(Constant.JOIN_ROOM, function(data){
			if(data.appID == ""  ||  data.appID == null)
			{
				console.log("LOGIN -> app has no id");
				return;
			}

			var user = new User(data.appID, socket.id, socket);

			if(lobby.doesRoomExists(data.roomID))
				joinRoom(user, data.roomID);
			else
				createRoom(socket, user, data.roomID);
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

/**********  SOCKET EVENTS  **********/
function joinRoom(user, roomID)
{
	lobby.joinRoom(user, roomID);
}

function createRoom(socket, user, roomID)
{
	var room = lobby.createRoom(user, roomID);
	socket.broadcast.emit(Constant.ROOM_CREATED, {roomID : room.id});
}


/**********  ACTIONS  **********/


/**********  HANDLERS  **********/

function roomClosedHandler(user)
{
	user.socket.emit("ALL_LEFT");
}
