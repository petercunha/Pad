module.exports = function(io) {
  var app = require('express');
  var router = app.Router();

  var notepadContent = { my: '' };

  io.on('connection', function(socket) {
    console.log("A user connected")
    socket.emit('notify', { content: notepadContent });

    socket.on('datagram', function (data) {
      console.log(data);
      notepadContent = data;
      socket.emit('notify', { content: notepadContent });
      socket.broadcast.emit('notify', { content: notepadContent });
    });
  });

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('pad', { title: 'Notepad' });
  });

  return router;
}
