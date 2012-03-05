var io = require('socket.io').listen(81);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

	socket.on("invite", function(data){
		socket.broadcast.emit("invite", {UID: data.targetUID});
	});
});