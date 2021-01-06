const { request } = require('express')
const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('A user connected')

    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    socket.on('sendMsg', (msg, callback) => {
        const filter = new Filter()

        if(filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }
        io.emit('message', generateMessage(msg))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })
})


server.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}!`)
})