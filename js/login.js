const form = document.querySelector(".login");
const usernameInput = document.getElementById("username");
const usernameError = document.getElementById("username-error");
const passwordInput = document.getElementById("password");
const passwordError = document.getElementById("password-error");
const buttonRegister = document.querySelector(".btn-register");
const success = document.getElementById("success");

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter");
});

let users = JSON.parse(localStorage.getItem("users")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (usernameInput.value === "") {
    usernameError.style.color = "red";
    usernameInput.focus();
  } else {
    usernameError.style.color = "transparent";
  }
  if (passwordInput.value === "") {
    passwordError.style.color = "red";
    passwordInput.focus();
  } else {
    passwordError.style.color = "transparent";
  }
  if (usernameInput.value === "" || passwordInput.value === "") {
    return;
  }

  let isloggedIn = false;

  users.find((item, i) => {
    if (
      item.username === usernameInput.value &&
      item.password === passwordInput.value
    ) {
      isloggedIn === true;
      success.innerHTML = `Welcome to Store ${item.username}`;
      success.style.cssText =
        "  color: #002244; font-weight:500; text-align:center ";
      window.location.href = "index.html";
    }
    if (!isloggedIn) {
      success.innerHTML = `Username or password wrong`;
      success.style.cssText = "color:red; text-align:center";
    }
  });
});

buttonRegister.addEventListener("click", () => {
  window.location.href = "register.html";
});
