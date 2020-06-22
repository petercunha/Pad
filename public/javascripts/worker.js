var socket = io()
var cache = ''
var firstLoad = true

var f = window.location.pathname
var temp = f.split('/')
var pathname

if (f.substr(f.length - 1) == '/') {
  pathname = temp[temp.length - 2]
} else {
  pathname = temp[temp.length - 1]
}

// Ask server latest data
socket.emit('sync', { path: pathname })

// Set TextArea as server response
socket.on('notify', function (data) {
  document.getElementById('text').value = data.content
})

// Send latest data to server
function processText () {
  var x = document.getElementById('text').value

  if (cache != x) {
    socket.emit('data', { text: x, path: pathname })
    cache = x
  }
}
