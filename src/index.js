const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {generateMessage,generatelocationMessage} = require('./utils/messages')
const {getUser,getUsers,addUser,removeUser} = require('./utils/users')

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
var count = 0
io.on('connection', (socket) => {
    
    
    

    socket.on('join',(Username,Room,callback)=>{
        
        const {error,user} = addUser(socket.id ,Username,Room)
        console.log(user)
        if(error){
             callback(error)
        }
        else{
            
            socket.join(user.room)
            socket.emit('message',generateMessage("Welcome", user.username,user.id))
            
            socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`,user.username,user.id))
            
            io.to(user.room).emit('roomdata',{
                room: user.room,
                userslist: getUsers(user.room)
            })
            callback()
        }
    })
        
        

    socket.on('sendmsgtoserver',(msg,callback)=>{
            const user = getUser(socket.id)

            const filter = new Filter()
            const cleanmsg = filter.clean(msg)
            if(filter.isProfane(msg))
            {
                callback("bad words are not allowed") 
                io.to(user.room).emit('sendmsgtoclients',generateMessage(cleanmsg,user.username,user.id))
            }
            else{
                callback()
                io.to(user.room).emit('sendmsgtoclients',generateMessage(msg,user.username,user.id))
            }
            
        })
    

    socket.on('disconnect',()=>{
        
        const user = removeUser(socket.id)
        if(user)
        {
            socket.broadcast.to(user.room).emit('sendtoclients1',generateMessage(`${user.username} left the room`,user.username,user.id))
            io.to(user.room).emit('roomdata',{
                room: user.room,
                userslist: getUsers(user.room)
            })
        }
    })

    socket.on('sendlocation',(lat,lon)=>{
        const user = getUser(socket.id)

        io.to(user.room).emit('sendlocationtoclients',generatelocationMessage(`https://google.com/maps?q=${lat},${lon}`,user.username,user.id))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})