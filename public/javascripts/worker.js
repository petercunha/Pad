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

// Run when DOM ready
window.onload = async function() {
  var textElement = document.getElementById('text')

  // Initialize encryption
  const salt = new TextEncoder().encode('hcvDtp51dTiaLGFXKBWD6r7OhQMZ87ph')
  if (!window.location.hash) {
    window.location.hash = await generatePassword(16)
  }
  const key = await deriveKey(window.location.hash.substr(1), salt)

  // Ask server latest data
  socket.emit('sync', { path: pathname })

  // Set TextArea as server response
  socket.on('notify', async function (data) {
    if (data.path == pathname) {
      if (data.content) {
        try {
          data.content = await decrypt(data.content, key)
        } catch(e) {
          console.log('Unable to decrypt note. Disable update.')
          window.processText = function() {}  // avoid overwrite
          textElement.disabled = true
          textElement.value = 'Unable to decrypt note. Please append the correct password to the URL "#<password>" and reload.'
          return
        }
      }
      textElement.value = data.content
    } else {
      console.log('Recieved: ' + data.path + ' Have: ' + pathname)
    }
  })

  // Send latest data to server
  window.processText = async function () {
    var x = textElement.value

    if (cache != x) {
      socket.emit('data', { text: await encrypt(x, key), path: pathname })
      cache = x
    }
  }
}
