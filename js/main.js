const tabs = document.querySelectorAll(".tab");
const editors = document.querySelectorAll(".editor");
const preview = document.getElementById("preview");
const consoleEl = document.getElementById("console");

// Tab switching logic
document.querySelector(".tab-buttons").addEventListener("click", (event) => {
  if (!event.target.classList.contains("tab")) return;
  document.querySelector(".tab.active")?.classList.remove("active");
  document.querySelector(".editor.active")?.classList.remove("active");
  event.target.classList.add("active");
  document.getElementById(event.target.dataset.tab).classList.add("active");
});

// Run button logic
document.getElementById("runBtn").addEventListener("click", () => {
  const html = document.getElementById("htmlCode").value;
  const css = `<style>${document.getElementById("cssCode").value}</style>`;
  const jsCode = document.getElementById("jsCode").value;

  const completeCode = `
        ${html}
        ${css}
        <script>
            window.onerror = function(msg, src, line, col, err) {
                parent.postMessage({ type: 'error', message: msg + ' at line ' + line + ', column ' + col }, '*');
            };
            console.log = function(msg) { parent.postMessage({ type: 'log', message: msg }, '*'); };
            console.error = function(msg) { parent.postMessage({ type: 'error', message: msg }, '*'); };
            try {
                ${jsCode}
            } catch (e) {
                window.onerror(e.message, '', 0, 0, e);
            }
        </script>
    `;

  const iframeDoc = preview.contentDocument || preview.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(completeCode);
  iframeDoc.close();

  const isLightMode = !document.getElementById("light-theme").disabled;
  const textColor = isLightMode ? "#102C57" : "white"; // Blue in light mode, White in dark mode
  const style = document.createElement("style");
  style.innerHTML = `body { color: ${textColor} !important; font-weight: bold; }`;
  iframeDoc.head.appendChild(style);

  consoleEl.innerHTML = ""; // Clear console on each run
});

// New Page Button Logic
document.getElementById("newPageBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all code?")) {
    ["htmlCode", "cssCode", "jsCode"].forEach(
      (id) => (document.getElementById(id).value = "")
    );
    consoleEl.innerHTML = "";
    preview.contentDocument.open();
    preview.contentDocument.write("");
    preview.contentDocument.close();
  }
});

// Console message listener from iframe
function logMessage(type, message) {
  const logEntry = document.createElement("div");
  logEntry.style.color = type === "error" ? "red" : "#0f0"; // Red for errors, green for logs
  logEntry.textContent = message;
  consoleEl.appendChild(logEntry); // Append new entry instead of rewriting HTML
}

// Console message listener from iframe
window.addEventListener("message", (event) => {
  logMessage(event.data.type, event.data.message);
});

// Show More menu toggle logic
const btn = document.querySelector(".show-more-btn");
const menu = document.getElementById("showMoreMenu");

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.style.display = menu.style.display === "block" ? "none" : "block";
});

window.addEventListener("click", () => {
  menu.style.display = "none";
});

// Download files function
function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.getElementById("downloadBtn").addEventListener("click", () => {
  downloadFile(
    document.getElementById("htmlCode").value,
    "editor.html",
    "text/html"
  );
  downloadFile(
    document.getElementById("cssCode").value,
    "styles.css",
    "text/css"
  );
  downloadFile(
    document.getElementById("jsCode").value,
    "script.js",
    "text/javascript"
  );
});

// Shortcuts logic (inside Show More)
document.getElementById("shortcutsBtn").addEventListener("click", () => {
  alert(
    "Shortcuts:\n- Ctrl + S to run\n- Click on tabs to switch\n- Use the Run button to preview\n- Download button to save files"
  );
  menu.style.display = "none";
});

// Copy All logic (inside Show More)
document.getElementById("copyAllBtn").addEventListener("click", () => {
  const allCode = `
--- HTML ---
${document.getElementById("htmlCode").value}

--- CSS ---
${document.getElementById("cssCode").value}

--- JS ---
${document.getElementById("jsCode").value}
  `;
  navigator.clipboard.writeText(allCode);
  alert("All code copied to clipboard!");
  menu.style.display = "none";
});

// Share Button Logic
document.getElementById("shareBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const params = new URLSearchParams({
    html: document.getElementById("htmlCode").value,
    css: document.getElementById("cssCode").value,
    js: document.getElementById("jsCode").value,
  }).toString();
  const shareUrl = `${window.location.href.split("?")[0]}?${params}`;
  navigator.clipboard
    .writeText(shareUrl)
    .then(() => alert("Shareable link copied to clipboard!"));
});

// Load code from URL params on page load
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  ["html", "css", "js"].forEach((lang) => {
    document.getElementById(`${lang}Code`).value = decodeURIComponent(
      params.get(lang) || ""
    );
  });
});

// Load code from URL params if present
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("html") || params.has("css") || params.has("js")) {
    document.getElementById("htmlCode").value = decodeURIComponent(
      params.get("html") || ""
    );
    document.getElementById("cssCode").value = decodeURIComponent(
      params.get("css") || ""
    );
    document.getElementById("jsCode").value = decodeURIComponent(
      params.get("js") || ""
    );
  }
});

function updateLineNumbers(textarea, lineNumberElement) {
  const lines = textarea.value.split("\n").length;
  lineNumberElement.innerText = Array.from(
    { length: lines },
    (_, i) => i + 1
  ).join("\n");
}

// Attach input listeners
["html", "css", "js"].forEach((lang) => {
  const textarea = document.getElementById(`${lang}Code`);
  const lines = document.getElementById(`${lang}Lines`);

  textarea.addEventListener("input", () => updateLineNumbers(textarea, lines));
  textarea.addEventListener("scroll", () => {
    lines.scrollTop = textarea.scrollTop;
  });

  // Initialize numbers on load
  updateLineNumbers(textarea, lines);
});

// Save on every keystroke
["html", "css", "js"].forEach((lang) => {
  const textarea = document.getElementById(`${lang}Code`);
  textarea.value = localStorage.getItem(lang) || ""; // Load saved code

  textarea.addEventListener("input", () => {
    localStorage.setItem(lang, textarea.value);
  });
});

// Light/Dark Mode Toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  const lightTheme = document.getElementById("light-theme");
  const darkTheme = document.getElementById("dark-theme");
  const lightIcon = document.querySelector(".light-icon"); // Moon icon 🌙
  const darkIcon = document.querySelector(".dark-icon"); // Sun icon ☀️

  const isLight = lightTheme.disabled;
  lightTheme.disabled = !isLight;
  darkTheme.disabled = isLight;

  // Toggle icons correctly
  lightIcon.style.display = isLight ? "block" : "none"; // Moon shows in light mode
  darkIcon.style.display = isLight ? "none" : "block"; // Sun shows in dark mode

  // Save theme preference
  localStorage.setItem("theme", isLight ? "dark" : "light");
});

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const lightTheme = document.getElementById("light-theme");
  const darkTheme = document.getElementById("dark-theme");
  const lightIcon = document.querySelector(".light-icon"); // Moon icon 🌙
  const darkIcon = document.querySelector(".dark-icon"); // Sun icon ☀️

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    lightTheme.disabled = true;
    darkTheme.disabled = false;
    lightIcon.style.display = "none"; // Hide moon icon
    darkIcon.style.display = "block"; // Show sun icon
  } else {
    lightTheme.disabled = false;
    darkTheme.disabled = true;
    lightIcon.style.display = "block"; // Show moon icon
    darkIcon.style.display = "none"; // Hide sun icon
  }
});
