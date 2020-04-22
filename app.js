var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {

    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('chat', '<i>' + socket.pseudo + ' a rejoint le chat !</i>');
        socket.emit('chat', '<i>' + socket.pseudo + ' a rejoint le chat !</i>');
    });

    socket.on('chat', function (message) {

        var mess = '<span style="background-color:#333; color:#BBB;"">' + socket.pseudo + '</span> : ' + message;

        // Envoi du message aux autres
        socket.broadcast.emit('chat', mess);
        // Envoi du message sur sa propre page :
        socket.emit('chat', mess);
    });
});


server.listen(8080);
