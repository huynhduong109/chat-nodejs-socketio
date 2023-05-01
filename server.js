const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { storeUser, getCurrentUser, getUsersRoom, getRoomUsers, userLeave, setUserStatus } = require('./services/users')
const formatMessage = require('./services/messages')
const SocketIOFile = require('socket.io-file');

const app = express();
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});
const PORT = 3000;
const BotName = "Thông báo: ";

const server = http.createServer(app);
const io = socketio(server);


// chạy khi client kết nối
io.on('connection', socket => {

    io.emit('rooms', [
        getRoomUsers(1),
        getRoomUsers(2),
        getRoomUsers(3),
        getRoomUsers(4)
    ]);


    // User vào phòng
    socket.on('userJoinRoom', ({ username, room }) => {
        socket.join(room);

        setUserStatus(socket.id, 'online');

        // Chào user mới vào phòng
        io.to(room).emit('serverMessage', formatMessage(BotName, `Chào mừng <b>${username}</b> vào phòng <b>${room}</b>`));
        storeUser(socket.id, username, room);

        // Gửi thông tin phòng và danh sách tất cả users trong phòng
        io.to(room).emit('roomUsers', {
            room: room,
            users: getUsersRoom(room)
        });
    })


    // Nhận tin nhắn từ client
    socket.on('chatMessage', (message) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('serverMessage', formatMessage(user.username, message));
    })


    // Chạy khi mà client mất kết nối
    // Chạy khi mà client mất kết nối
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        io.to(user.room).emit('serverMessage', formatMessage(BotName, `<b>${user.username}</b> đã rời phòng`));

        // Gửi thông tin phòng và danh sách tất cả users trong phòng
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));