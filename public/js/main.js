// Lấy tham số từ URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});



const socket = io();
// user vào phòng
socket.emit('userJoinRoom', { username, room });

// Lấy thông tin phòng và các users trong cùng phòng với mình
socket.on('roomUsers', ({ room, users }) => {
            // hiện thị số phòng
            document.getElementById('room-name').innerHTML = room;

            document.getElementById('user-name').innerHTML = username;

            // hiển thị danh sách users cùng phòng
            document.getElementById('users').innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
});


// Lắng nghe sự kiện 'rooms' từ server và cập nhật giá trị của các option
socket.on('rooms', (rooms) => {
  rooms.forEach((roomUsers) => {
      const roomOption = document.querySelector(`[value="${roomUsers.room}"]`);
      if (roomOption) {
          if (roomUsers.users.length > 0) {
              // Phòng đã có người
              roomOption.dataset.status = 'occupied';
          } else {
              // Phòng chưa có người
              roomOption.dataset.status = 'available';
          }
      }
  });
});

// Chat form
const chatForm = document.getElementById("chat-form");
// Form messages
const formMessage = document.querySelector(".chat-messages");

// Chat form submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputMessage = document.getElementById('msg').value; // lấy nội dung từ phần tử textarea
    // Gửi tin nhắn lên server
    socket.emit('chatMessage', inputMessage);
    const emojiArea = $('#msg').data('emojioneArea');
    emojiArea.setText('');
});

socket.on('rooms', (rooms) => {
  rooms.forEach((roomUsers) => {
      const roomOption = document.querySelector(`[value="${roomUsers.room}"]`);
      if (roomOption) {
          if (roomUsers.users.length > 0) {
              // Phòng đã có người
              roomOption.dataset.status = 'occupied';
          } else {
              // Phòng chưa có người
              roomOption.dataset.status = 'available';
          }
      }
  });
});

// Nhận tin nhắn từ server
socket.on('serverMessage', (msgObj) => {

    const divElement = document.createElement('div');
    divElement.classList.add('message');

    divElement.innerHTML = `
        <p class="meta">${msgObj.user} <span>${msgObj.time}</span></p>
        <p class="text">${msgObj.msgContent}</p>
    `;

    formMessage.appendChild(divElement);
});

// Gửi file
function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        const inputMessage = `<a href="${reader.result}" download="${file.name}"><i class="fas fa-paperclip"></i> ${file.name}</a>`;
        // Gửi tin nhắn lên server
        socket.emit('chatMessage', inputMessage);
    };
}
 
// Rời phòng
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Bạn có muốn rời phòng không');
    if(leaveRoom){
        window.location = '../index.html';
    }
});