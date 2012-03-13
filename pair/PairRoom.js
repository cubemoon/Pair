module.exports = function Room(owner)
{
	this.classname = "Room";

	this.id = owner.clientID;
	this.owner = owner;
	this.users = {};

	this.join = function(user)
	{
		this.users[user.clientID] = user;
		user.roomID = this.id;
	}

	this.leave = function(user)
	{
		this.users[user.clientID] = null;
		delete this.users[user.clientID];
	}

	this.population = function()
	{
		return Object.keys(this.users).length;
	}

	this.getLastUser = function()
	{
		return this.users[Object.keys(this.users)[0]];
	}
}