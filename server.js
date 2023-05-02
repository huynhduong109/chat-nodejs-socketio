const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { storeUser, getCurrentUser, getUsersRoom, getRoomUsers, userLeave } = require('./services/users')
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

const roomStatus = {
    "1": "available",
    "2": "available",
    "3": "available",
    "4": "available",
    "5": "available",
    "6": "available",
    "7": "available",
    "8": "available"
};

// chạy khi client kết nối
io.on('connection', socket => {

    // gửi thông tin các phòng đến client
    const rooms = [];
    for (let roomId in roomStatus) {
        const users = getUsersRoom(roomId);
        rooms.push({ room: roomId, users: users });
    }
    socket.emit('rooms', rooms);


    // User vào phòng
    socket.on('userJoinRoom', ({ username, room }) => {
        socket.join(room);

        // Nếu phòng đang trống, cập nhật trạng thái của phòng đó thành "occupied"
        if (getUsersRoom(room).length === 0) {
            roomStatus[room] = "occupied";
        }


        // Chào user mới vào phòng
        io.to(room).emit('serverMessage', formatMessage(BotName, `Chào mừng <b>${username}</b> vào phòng <b>${room}</b>`));
        storeUser(socket.id, username, room);

        io.emit('roomStatusUpdate', roomStatus);

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
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        io.to(user.room).emit('serverMessage', formatMessage(BotName, `<b>${user.username}</b> đã rời phòng`));

        // Nếu phòng đang không còn người dùng, cập nhật trạng thái của phòng đó thành "available"
        if (getRoomUsers(user.room).length === 0) {
            roomStatus[user.room] = "available";
        }
        // Gửi thông tin phòng và danh sách tất cả users trong phòng
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsersRoom(user.room)
        });

        io.emit('roomStatusUpdate', roomStatus);

    });

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));