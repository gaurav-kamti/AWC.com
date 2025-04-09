function toggleForms(form) {
  document
    .getElementById("loginCard")
    .classList.toggle("active", form === "login");
  document
    .getElementById("signupCard")
    .classList.toggle("active", form === "signup");
}

async function signup() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  const res = await fetch("https://awc-com.onrender.com/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  alert(data.message);
  if (res.ok) toggleForms("login");
}

async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("https://awc-com.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Login successful!");
    window.location.href = "editor.html";
  } else {
    alert(data.message || "Login failed");
  }
}
