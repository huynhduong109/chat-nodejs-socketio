const joinRoomForm = document.querySelector('#join-room-form');
const roomSelect = document.querySelector('#room');
const passwordInput = document.querySelector('#password');
const passwordContainer = document.querySelector('#password-container');

joinRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const roomId = roomSelect.value;
    const roomOption = roomSelect.options[roomSelect.selectedIndex];
    const roomUsed = roomOption.dataset.used === 'true';
    const roomPassword = roomOption.dataset.password;
    if (roomUsed) {
        // Nếu phòng đã được sử dụng, hiển thị ô nhập mật khẩu
        passwordContainer.style.display = 'block';
        if (passwordInput.value === roomPassword) {
            window.location.href = `/chat.html?username=${username}&room=${roomId}&password=${roomPassword}`;
        } else {
            // Nếu mật khẩu sai, hiển thị thông báo lỗi
            alert('Mật khẩu không đúng!');
        }
    } else {
        // Nếu phòng chưa được sử dụng, ẩn ô nhập mật khẩu
        passwordContainer.style.display = 'none';
        // Nếu phòng chưa được sử dụng, tạo mật khẩu mới và chuyển đến trang chat
        const newRoomPassword = generatePassword();
        roomOption.dataset.password = newRoomPassword;

        window.location.href = `/chat.html?username=${username}&room=${roomId}&password=${newRoomPassword}`;
        roomUsed = true;
    }
});

function generatePassword() {
    // Tạo mật khẩu ngẫu nhiên
    return Math.random().toString(36).substring(2, 8);
}