module.exports = function(io) {
  var app = require('express');
  var router = app.Router();
  var pages = new Map();

  io.on('connection', function(socket) {
    console.log("A user connected")

    socket.on('sync', function (data) {
      if (pages.has(data.path)) {
        socket.emit('notify', { content: pages.get(data.path) });
        console.log("Paste accessed: " + data.path);
      } else {
        socket.emit('notify', { content: 'Pad created! Share the URL with a friend to edit text in real-time.' });
        console.log("Created paste: " + data.path);
      }
    });

    socket.on('datagram', function (data) {
      pages.set(data.path, data.text);
      var curr = pages.get(data.path);

      console.log(data.text);

      socket.emit('notify', { content: curr });
      socket.broadcast.emit('notify', { content: curr });
    });
  });

  /* GET pad by unique id */
  router.get('/:id', function(req, res, next) {
    res.render('pad', { title: 'Notepad' });
  });

  return router;
}
