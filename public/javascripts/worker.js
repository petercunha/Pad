var socket = io();
var cache = "";


function processText() {
  var x = document.getElementById("text").value;
  if (cache = "") {
    cache = x;
  }
  socket.emit('datagram', { my: x });
}

socket.on('notify', function (data) {
  console.log(data.content.my);
  document.getElementById("text").value = data.content.my;
});
