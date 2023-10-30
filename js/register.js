const form = document.querySelector(".register-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("username-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const buttonRegister = document.querySelector(".btn-register");

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    buttonRegister.click();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newUsers = {
    username: usernameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  if (usernameInput.value === "") {
    usernameError.style.color = "red";
    usernameInput.focus();
  } else {
    usernameError.style.color = "transparent";
  }
  if (emailInput.value === "") {
    emailError.style.color = "red";
    emailInput.focus();
  } else {
    emailError.style.color = "transparent";
  }
  if (passwordInput.value === "") {
    passwordError.style.color = "red";
    passwordInput.focus();
  } else {
    passwordError.style.color = "transparent";
  }
  if (
    usernameInput.value === "" ||
    emailInput.value === "" ||
    passwordInput.value === ""
  ) {
    return;
  }

  let localRepo = JSON.parse(localStorage.getItem("users")) || [];
  localRepo.push(newUsers);
  localStorage.setItem("users", JSON.stringify(localRepo));

  usernameInput.value === "",
    emailInput.value === "",
    passwordInput.value === "";

  const modal = document.querySelector(".modal");
  const modalText = document.querySelector(".modal-content span");

  modal.style.display = "flex";
  modalText.innerHTML = `Hello <b>${usernameInput.value}<b/>`;

  setTimeout(() => {
    modal.style.display = "none";
    window.location.href = "login.html";
  }, 3000);
});
