var socket = io();
var cache = "";
var firstLoad = true;

var f = window.location.pathname;
var temp = f.split("/");
var pathname;

if (f.substr(f.length - 1) == "/") {
  pathname = temp[temp.length - 2];
} else {
  pathname = temp[temp.length - 1];
}

// Ask server latest data
socket.emit('sync', { path: pathname });

// Set TextArea as server response
socket.on('notify', function (data) {
  if (data.path == pathname) {
    document.getElementById("text").value = data.content;
  } else {
    console.log("Recieved: " + data.path + " Have: " + pathname);
  }
});

// Send latest data to server
function processText() {
    console.log("Activated");
    var x = document.getElementById("text").value;

    if (cache = "") {
      cache = x;
    }

    socket.emit('datagram', { text: x, path: pathname });
}
