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
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const jsCode = jsEditor.getValue();

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
    htmlEditor.setValue("");
    cssEditor.setValue("");
    jsEditor.setValue("");
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
  downloadFile(htmlEditor.getValue(), "editor.html", "text/html");
  downloadFile(cssEditor.getValue(), "styles.css", "text/css");
  downloadFile(jsEditor.getValue(), "script.js", "text/javascript");
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
${htmlEditor.getValue()}

--- CSS ---
${cssEditor.getValue()}

--- JS ---
${jsEditor.getValue()}
  `;
  navigator.clipboard.writeText(allCode);
  alert("All code copied to clipboard!");
  menu.style.display = "none";
});

// Share Button Logic
document.getElementById("shareBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const params = new URLSearchParams({
    html: htmlEditor.getValue(),
    css: cssEditor.getValue(),
    js: jsEditor.getValue(),
  }).toString();
  const shareUrl = `${window.location.href.split("?")[0]}?${params}`;
  navigator.clipboard
    .writeText(shareUrl)
    .then(() => alert("Shareable link copied to clipboard!"));
});

// Load code from URL params if present
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("html") || params.has("css") || params.has("js")) {
    htmlEditor.setValue(decodeURIComponent(params.get("html") || ""));
    cssEditor.setValue(decodeURIComponent(params.get("css") || ""));
    jsEditor.setValue(decodeURIComponent(params.get("js") || ""));
  }
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

  // Toggle Monaco editor theme as well
  if (isLight) {
    monaco.editor.setTheme("soft-blue"); // Light theme
  } else {
    monaco.editor.setTheme("dark-blue"); // Dark theme
  }

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
    lightTheme.disabled = true;
    darkTheme.disabled = false;
    lightIcon.style.display = "none"; // Show moon icon
    darkIcon.style.display = "block"; // Hide sun icon
    localStorage.setItem("theme", "dark");
  }
});

let htmlEditor, cssEditor, jsEditor;

require(["vs/editor/editor.main"], function () {
  monaco.editor.defineTheme("soft-blue", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#f1f5f9",
      "editor.foreground": "#1a1a1a",
    },
  });

  monaco.editor.defineTheme("dark-blue", {
    base: "vs-dark", // This is the base (dark theme).
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#1E293B", // This is the background color for the dark theme
      "editor.foreground": "#ffffff",
    },
  });

  monaco.editor.setTheme("dark-blue");

  htmlEditor = monaco.editor.create(document.getElementById("htmlEditor"), {
    value: localStorage.getItem("html") || "",
    language: "html",
    theme: "dark-blue",
    automaticLayout: true,
  });

  cssEditor = monaco.editor.create(document.getElementById("cssEditor"), {
    value: localStorage.getItem("css") || "",
    language: "css",
    theme: "dark-blue",
    automaticLayout: true,
  });

  jsEditor = monaco.editor.create(document.getElementById("jsEditor"), {
    value: localStorage.getItem("js") || "",
    language: "javascript",
    theme: "dark-blue",
    automaticLayout: true,
  });

  // Save content on edit
  htmlEditor.onDidChangeModelContent(() => {
    localStorage.setItem("html", htmlEditor.getValue());
  });
  cssEditor.onDidChangeModelContent(() => {
    localStorage.setItem("css", cssEditor.getValue());
  });
  jsEditor.onDidChangeModelContent(() => {
    localStorage.setItem("js", jsEditor.getValue());
  });
});
