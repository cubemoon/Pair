var Room = require("./Room.js");

module.exports = function Lobby()
{
	this.classname = "Lobby";
	this.roomsDictionary = {};
	this.userDictionary = {};
	this.handlers = {};

	this.createRoom = function(owner)
	{
		console.log(owner);
		var room = new Room(owner);
		this.roomsDictionary[owner.clientID] = room;
		this.joinRoom(owner, owner.clientID);

		return room;
	}

	this.leaveRoom = function(clientID)
	{
		var user = this.userDictionary[clientID];

		if(user == null)
		{
			console.log("Lobby.leaveRoom() --> no user with id " + clientID);
			return;
		}

		var room = this.roomsDictionary[user.roomID];
		room.leave(user);

		console.log("Lobby.leaveRoom() --> room population " + room.population());

		var lastUser;
		if(room.population() == 1)
		{
			lastUser = room.getLastUser();
			//TODO:last user a odayı kapadığını haber ver
			this.handlers.roomClosedHandler(lastUser);

			console.log(this.handlers);

			room.leave(lastUser);
			this.userDictionary[lastUser.clientID] = null;
			delete this.userDictionary[lastUser.clientID];
		}

		if(room.population() == 0)
		{
			this.roomsDictionary[user.roomID] = null;
			delete this.roomsDictionary[user.roomID];
		}

		this.userDictionary[clientID] = null;
		delete this.userDictionary[clientID];

		console.log("Lobby.leaveRoom() --> room count " + this.roomCount());
		console.log("Lobby.leaveRoom() --> user count " + this.userCount());
	}

	this.joinRoom = function(user, roomID)
	{
		this.userDictionary[user.clientID] = user;
		var room = this.roomsDictionary[roomID];
		room.join(user);

		console.log("Lobby.joinRoom() --> room population " + room.population());
	}

	this.roomCount = function()
	{
		return Object.keys(this.roomsDictionary).length;
	}

	this.userCount = function()
	{
		return Object.keys(this.userDictionary).length;
	}
}