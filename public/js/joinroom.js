const joinRoomForm = document.querySelector('#join-room-form');
const roomSelect = document.querySelector('#room');
const passwordInput = document.getElementById('password');
const passwordContainer = document.getElementById('password-container');
const submitButton = document.querySelector('button[type="submit"]');

function confirmExit() {
    if (confirm("Bạn có chắc chắn muốn thoát?")) {
        window.location.href = "login.html"; // Chuyển hướng đến trang login.html
    }
}

joinRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomSelectcheck = document.getElementById('room');
    const selectedRoom = roomSelectcheck.options[roomSelectcheck.selectedIndex];
    if (!selectedRoom.value) {
        alert('Vui lòng chọn phòng!');
        return false;
    };
});

roomSelect.addEventListener('change', function() {
    roomSelect.querySelectorAll('option').forEach(option => {
        option.removeAttribute('data-password');
    });
    const username = document.querySelector('#username').value;
    const roomId = roomSelect.value;
    const roomOption = roomSelect.options[roomSelect.selectedIndex];
    const roomPassword = roomOption.dataset.password;
    const status = roomOption.getAttribute('data-status');

    if (status === 'occupied') {
        passwordContainer.style.display = 'block';
        if (!passwordInput.value) {
            alert('Vui lòng nhập mật khẩu để vào phòng');
        } else {
            submitButton.removeEventListener('click', handlePasswordSubmit);
            submitButton.addEventListener('click', handlePasswordSubmit);

            function handlePasswordSubmit(event) {
                if (passwordInput.value === roomPassword) {
                    window.location.href = `/chat.html?username=${username}&room=${roomId}&password=${roomPassword}`;
                } else if (!passwordInput.value) {
                    alert('Vui lòng nhập mật khẩu để vào phòng!');
                } else { alert('Mật khẩu không đúng!'); }
            }
        }
    } else {
        passwordContainer.style.display = 'none';
        const newRoomPassword = generatePassword();
        roomOption.dataset.password = newRoomPassword;
        submitButton.removeEventListener('click', handlePasswordSubmit);
        submitButton.addEventListener('click', function(event) {
            window.location.href = `/chat.html?username=${username}&room=${roomId}&password=${newRoomPassword}`;
        });
    }
});

function generatePassword() {
    return Math.random().toString(36).substring(2, 8);
}