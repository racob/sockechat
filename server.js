const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, getUsersList, userLeave } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set  static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "SockeBot";

//Run when client connects
io.on('connection', socket => {
    socket.on('joinChat', (username) => {
        const user = userJoin(socket.id, username);

        //Welcome current user
        socket.emit('message', formatMessage(botName,'Welcome to Sockechat!'));

        //Broadcast when a user connects
        socket.broadcast.emit('message', formatMessage(botName, `${user.username} has joined the chat`));
        io.emit('usersList', getUsersList());

        
    });

    // Handle typing event
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });
    
    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }

        io.emit('usersList', getUsersList());
    });

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.emit('message', formatMessage(user.username,msg));
    })

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));