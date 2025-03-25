function toggleForms(form) {
  document
    .getElementById("loginCard")
    .classList.toggle("active", form === "login");
  document
    .getElementById("signupCard")
    .classList.toggle("active", form === "signup");
}

function signup() {
  const user = document.getElementById("signup-username").value;
  const pass = document.getElementById("signup-password").value;
  if (user && pass) {
    localStorage.setItem("username", user);
    localStorage.setItem("password", pass);
    alert("Signup successful! You can now log in.");
    toggleForms("login");
  } else {
    alert("Please enter both username and password!");
  }
}

function login() {
  const user = document.getElementById("login-username").value;
  const pass = document.getElementById("login-password").value;
  if (user && pass) {
    const storedUser = localStorage.getItem("username");
    const storedPass = localStorage.getItem("password");
    if (user === storedUser && pass === storedPass) {
      alert("Login successful!");
      window.location.href = "editor.html";
    } else {
      alert("Invalid credentials!");
    }
  } else {
    alert("Please enter both username and password!");
  }
}
