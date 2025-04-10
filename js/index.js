function toggleForms(form) {
  document
    .getElementById("loginCard")
    .classList.toggle("active", form === "login");
  document
    .getElementById("signupCard")
    .classList.toggle("active", form === "signup");
}

async function signup() {
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;

  // 🚫 Prevent empty input
  if (!username || !password) {
    alert("Username and password cannot be empty.");
    return;
  }

  // ✅  Minimum length check
  if (username.length < 6) {
    alert("Username must be at least 6 characters.");
    return;
  }

  // ✅  Strong password pattern
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordPattern.test(password)) {
    alert(
      "Password must include 1 capital letter, 1 lowercase, 1 number, and 1 special character."
    );
    return;
  }

  // ✅ Proceed to signup
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

function handleLoginClick(btn) {
  const originalText = btn.innerText;
  btn.classList.add("clicked");

  setTimeout(() => {
    btn.disabled = true;
    btn.innerText = "Logging in...";
    btn.classList.remove("clicked");

    login().finally(() => {
      btn.disabled = false;
      btn.innerText = originalText;
    });
  }, 150);
}

function handleSignupClick(btn) {
  const originalText = btn.innerText;
  btn.classList.add("clicked");

  setTimeout(() => {
    btn.disabled = true;
    btn.innerText = "Signing up...";
    btn.classList.remove("clicked");

    signup().finally(() => {
      btn.disabled = false;
      btn.innerText = originalText;
    });
  }, 150);
}
