var app = require('express')
var shortid = require('shortid')
var router = app.Router()

module.exports = function (io) {
  var welcomeMessage = 'Pad created! Share the URL with a friend to edit text in real-time.'
  var pages = new Map() // Stores Pad data

  // Handle WebSocket connections
  io.on('connection', function (socket) {
    console.log('A user connected')

    // Handle sync request
    socket.on('sync', function (data) {
      if (pages.has(data.path)) {
        // Page exists, notify with pad data
        notify(socket, pages.get(data.path), data.path)
        console.log('Paste accessed: ' + data.path)
      } else {
        // Page doesn't exist, notify with new pad
        notify(socket, '', data.path)
        console.log('Created paste: ' + data.path)
      }

      // Remove junk objects from Map, save space
      clearUpMemory()
    })

    // Handle incoming data from user
    socket.on('data', function (data) {
      // Update pad data in memory
      pages.set(data.path, data.text)
      var curr = pages.get(data.path)

      // Notify everyone of update
      notifyAll(socket, curr, data.path)
    })
  })

  // Send update to client
  function notify (socket, c, p) {
    socket.emit('notify', { content: c, path: p })
  }

  // Send update to all clients
  function notifyAll (socket, c, p) {
    socket.broadcast.emit('notify', { content: c, path: p })
  }

  // Clean up memory if Map gets too full
  function clearUpMemory () {
    for (var [key, value] of pages) {
      if (value == '') {
        pages.delete(key)
      }
    }
  }

  /* GET pad by unique id */
  router.get('/:id', function (req, res, next) {
    res.render('pad', { title: 'Pad', temp: welcomeMessage })
  })

  /* Handle POST, redirect to GET pad by unique id */
  router.post('/:id', function (req, res, next) {
    res.render('pad', { title: 'Pad', temp: welcomeMessage })
  })

  /* Handle index requests for /Pad */
  router.get('/', function (req, res, next) {
    var sid = shortid.generate()
    res.render('index', { title: 'Welcome to Pad', buttonLbl: 'Get started', id: sid })
  })

  return router
}
