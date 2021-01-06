var socket = io();

//Elements
const $messageForm = document.querySelector('#msg-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMsgTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('message', (msg) => {
    const html = Mustache.render(messageTemplate, {
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('MM-DD HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (msg) => {
    console.log(msg)
    const html = Mustache.render(locationMsgTemplate, {
        url: msg.url,
        createdAt: moment(msg.createdAt).format('MM-DD HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.message.value

    $messageFormButton.setAttribute('disabled', 'disabled')

    socket.emit('sendMsg', msg, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

$shareLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not support by your browser.')
    }

    $shareLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
            $shareLocationButton.removeAttribute('disabled')
        })
    })
})