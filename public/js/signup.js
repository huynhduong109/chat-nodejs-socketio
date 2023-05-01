const inputUsernameRegister = document.querySelector(".input-signup-username");
const inputPasswordRegister = document.querySelector(".input-signup-password");
const btnRegister = document.querySelector(".signup__signInButton");

btnRegister.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        inputUsernameRegister.value === "" ||
        inputPasswordRegister.value === ""
    ) {
        alert("Vui lòng không để trống");
    } else {
        let existingUser = false;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            const user = JSON.parse(value);
            if (user.username === inputUsernameRegister.value) {
                existingUser = true;
                break;
            }
        }
        if (existingUser) {
            alert("Email này đã tồn tại");
        } else {
            const user = {
                username: inputUsernameRegister.value,
                password: inputPasswordRegister.value,
            };
            let json = JSON.stringify(user);
            localStorage.setItem(inputUsernameRegister.value, json);
            alert("Đăng ký thành công");
            window.location.href = "login.html";
        }
    }
});