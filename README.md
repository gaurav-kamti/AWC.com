<h1>🌐 A Web Editor</h1>

<p><strong>A Web Editor</strong> is a responsive web-based code editor that allows users to write, run, and preview HTML, CSS, and JavaScript directly in the browser.</p>

<p>
🔗 <strong>Live site:</strong> 
<a href="https://awebeditor.netlify.app/" target="_blank">https://awebeditor.netlify.app/</a><br>
📁 <strong>GitHub Repository:</strong> 
<a href="https://github.com/gaurav-kamti/AWC.com/tree/deploy" target="_blank">https://github.com/gaurav-kamti/AWC.com/tree/deploy</a>
</p>

<hr>

<h2>✨ Features</h2>
<ul>
  <li>🔐 Login/Signup system for user access</li>
  <li>⚡ Live preview of HTML, CSS, and JavaScript</li>
  <li>🌗 Light/Dark theme toggle</li>
  <li>💬 Console output for debugging</li>
  <li>📱 Fully responsive and user-friendly UI</li>
</ul>

<hr>

<h2>🚀 How to Use</h2>

<h3>🔗 Option 1: Use Online</h3>
<p>Just visit the live site:<br>
<a href="https://awebeditor.netlify.app/" target="_blank">https://awebeditor.netlify.app/</a><br>
No setup required — log in and start coding!</p>

<h3>💻 Option 2: Run Locally</h3>
<ol>
  <li><strong>Download</strong> the ZIP or <strong>clone</strong> the repository:
    <pre><code>git clone https://github.com/gaurav-kamti/AWC.com.git</code></pre>
  </li>
  <li>Extract the ZIP if downloaded.</li>
  <li>Open the project folder.</li>
  <li>Double-click <code>index.html</code> to launch the editor in your browser.</li>
</ol>

<p>✅ That’s it! No need to install Node.js or run a server. Everything works right in the browser.</p>

<hr>

<h2>📁 Project Structure</h2>

<pre>
a-web-editor/
├── assets/
│   └── icons/
│       ├── dark_mode_*.svg
│       └── light_mode_*.svg
├── backend/
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── css/
│   ├── dark.css
│   ├── index.css
│   ├── light.css
│   └── styles.css
├── js/
│   ├── index.js          ← Login/Signup logic
│   └── main.js           ← Editor logic
├── editor.html           ← Main editor page
├── index.html            ← Login/Signup page
└── README.md
</pre>

<hr>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> HTML, CSS, JavaScript</li>
  <li><strong>Backend:</strong> (used for authentication and future features)
    <ul>
      <li>Node.js</li>
      <li>Express.js</li>
      <li>MongoDB (for storing user data)</li>
      <li>bcrypt (password hashing)</li>
      <li>body-parser</li>
      <li>cors</li>
      <li>fs (file system)</li>
    </ul>
  </li>
  <li><strong>Deployment:</strong> Netlify</li>
</ul>

<hr>

<h2>👤 Created by</h2>
<p><strong>Gaurav Kamti</strong></p>

<hr>

<h2>📌 Note</h2>
<p>This project is still evolving. Upcoming features may include:</p>
<ul>
  <li>Code snippet saving</li>
  <li>File-based project storage</li>
  <li>Theme customization</li>
  <li>Monaco Editor integration (planned)</li>
</ul>
