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
    // Xóa tin nhắn ở ô input
    document.getElementById('msg').value = '';
    document.getElementById('msg').blur();
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

// Khi kết nối với server thành công
socket.on('connect', () => {
    // Gửi yêu cầu lấy danh sách các phòng
    socket.emit('getRooms');
  });
  
  // Lắng nghe sự kiện trả về danh sách các phòng
  socket.on('roomList', (rooms) => {
    // Cập nhật trạng thái của các phòng trong form
    const roomOptions = document.querySelectorAll('.room-option');
    roomOptions.forEach((option) => {
      const roomId = option.value;
      const roomData = rooms.find((room) => room.id === roomId);
      if (roomData) {
        option.dataset.used = true;
      } else {
        option.dataset.used = false;
      }
    });
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