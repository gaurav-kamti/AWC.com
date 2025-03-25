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
        <\/script>
    `;

  const iframeDoc = preview.contentDocument || preview.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(completeCode);
  iframeDoc.close();
  iframeDoc.body.style.color = "white";
  consoleEl.innerHTML = ""; // Clear console on each run
});

//New Button Logic
document.getElementById("newPageBtn").addEventListener("click", () => {
  const confirmClear = confirm("Are you sure you want to clear all code?");
  if (confirmClear) {
    document.getElementById("htmlCode").value = "";
    document.getElementById("cssCode").value = "";
    document.getElementById("jsCode").value = "";
    consoleEl.innerHTML = ""; // Optional: also clear the console
    preview.srcdoc = ""; // Optional: clear the iframe output
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

// Download logic (inside Show More)
document.getElementById("downloadBtn").addEventListener("click", () => {
  const htmlBlob = new Blob([document.getElementById("htmlCode").value], {
    type: "text/html",
  });
  const cssBlob = new Blob([document.getElementById("cssCode").value], {
    type: "text/css",
  });
  const jsBlob = new Blob([document.getElementById("jsCode").value], {
    type: "text/javascript",
  });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(htmlBlob);
  a.download = "editor.html";
  a.click();

  a.href = URL.createObjectURL(cssBlob);
  a.download = "styles.css";
  a.click();

  a.href = URL.createObjectURL(jsBlob);
  a.download = "script.js";
  a.click();

  menu.style.display = "none"; // auto-close the menu
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

// Ctrl + S shortcut for running code
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    document.getElementById("runBtn").click();
  }
});

document.getElementById("shareBtn").addEventListener("click", (e) => {
  e.preventDefault(); // 🚫 Prevent page reload/jump

  const html = encodeURIComponent(document.getElementById("htmlCode").value);
  const css = encodeURIComponent(document.getElementById("cssCode").value);
  const js = encodeURIComponent(document.getElementById("jsCode").value);

  const shareUrl = `${window.location.origin}${window.location.pathname}?html=${html}&css=${css}&js=${js}`;

  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      alert("Shareable link copied to clipboard!");
    })
    .catch((err) => {
      alert("Failed to copy link.");
      console.error(err);
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
