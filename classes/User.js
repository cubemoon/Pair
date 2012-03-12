module.exports = function User(appID, clientID, socket)
{
	this.classname = "User";

	this.appID 		= appID;
	this.clientID 	= clientID;
	this.socket		= socket;

	this.roomID;
}