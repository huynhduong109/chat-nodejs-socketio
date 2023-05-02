// validation form login
const inputUsername = document.querySelector(".input-login-username");
const inputPassword = document.querySelector(".input-login-password");
const btnLogin = document.querySelector(".login__signInButton");

// validation form login

btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputUsername.value === "" || inputPassword.value === "") {
        alert("Vui lòng không để trống!");
    } else {
        const user = JSON.parse(localStorage.getItem(inputUsername.value));
        if (user !== null && user.username === inputUsername.value && user.password === inputPassword.value) {
            window.location.href = "index.html";
        } else {
            alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
    }
});