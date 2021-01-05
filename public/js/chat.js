var socket = io();

socket.on('message', (msg) => {
    console.log(msg)
})


document.querySelector('#msg-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.message.value
    socket.emit('sendMsg', msg, (delivered) => {
        console.log('Delivered.',delivered)
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not support by your browser.')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})