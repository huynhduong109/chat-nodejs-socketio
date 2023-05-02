const inputUsernameRegister = document.querySelector(".input-signup-username");
const btnRegister = document.querySelector(".signup__signInButton");

const passwordInput = document.querySelector(".input-signup-password");
const passwordRequirements = document.querySelector(".password-requirements");
const passwordLength = document.querySelector(".password-length");
const passwordUppercase = document.querySelector(".password-uppercase");
const passwordLowercase = document.querySelector(".password-lowercase");
const passwordNumber = document.querySelector(".password-number");
const passwordSpecial = document.querySelector(".password-special");


btnRegister.addEventListener("click", (e) => {
    e.preventDefault();
    if (
        inputUsernameRegister.value === "" ||
        passwordInput.value === ""
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
                password: passwordInput.value,
            };
            let json = JSON.stringify(user);
            localStorage.setItem(inputUsernameRegister.value, json);
            alert("Đăng ký thành công");
            window.location.href = "login.html";
        }
    }
});

passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    let requirementsMet = 0;

    if (password.length >= 8) {
        passwordLength.classList.remove("unmet");
        passwordLength.classList.add("met");
        requirementsMet++;
    } else {
        passwordLength.classList.remove("met");
        passwordLength.classList.add("unmet");
    }

    if (/[A-Z]/.test(password)) {
        passwordUppercase.classList.remove("unmet");
        passwordUppercase.classList.add("met");
        requirementsMet++;
    } else {
        passwordUppercase.classList.remove("met");
        passwordUppercase.classList.add("unmet");
    }

    if (/[a-z]/.test(password)) {
        passwordLowercase.classList.remove("unmet");
        passwordLowercase.classList.add("met");
        requirementsMet++;
    } else {
        passwordLowercase.classList.remove("met");
        passwordLowercase.classList.add("unmet");
    }

    if (/\d/.test(password)) {
        passwordNumber.classList.remove("unmet");
        passwordNumber.classList.add("met");
        requirementsMet++;
    } else {
        passwordNumber.classList.remove("met");
        passwordNumber.classList.add("unmet");
    }

    if (/[^\w\s]/.test(password)) {
        passwordSpecial.classList.remove("unmet");
        passwordSpecial.classList.add("met");
        requirementsMet++;
    } else {
        passwordSpecial.classList.remove("met");
        passwordSpecial.classList.add("unmet");
    }

    if (requirementsMet === 5) {
        passwordRequirements.classList.add("valid");
        btnRegister.disabled = false;
    } else {
        passwordRequirements.classList.remove("valid");
        btnRegister.disabled = true;
    }
});