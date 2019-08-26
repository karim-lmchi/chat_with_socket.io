// Modules to import
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    // Allows to block the HTML characters, Converts all eligible characters to HTML entities
    // (equivalent security to htmlentities in PHP)
    ent = require('ent');

// loading of the page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // As soon as we are given a nickname, we store it in session variable and we inform the other users
    socket.on('new_user', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_user', pseudo);
    });

    // As soon as we receive a message, we recover the nickname of its author and we send it to other users
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});

server.listen(8080);