# Project Rules

## Launching the Application Locally
When asked to open or launch this web application locally, **always start a local development server** (such as running `npx serve` or `python -m http.server`) and launch the resulting `localhost` URL in the browser. 

**Do NOT** open `index.html` directly from the filesystem using commands like `Start-Process "index.html"`. The application uses ES Modules (`<script type="module">`), which will fail to load over the `file:///` protocol due to browser CORS policies.

**CRITICAL**: When starting the server in the background on Windows, explicitly pass the project directory to `npx serve` (e.g., `npx.cmd -y serve c:\git\tagb`) or avoid using `Start-Job`. PowerShell background jobs will default to the user's home directory (`C:\`), causing the server to serve the wrong folder if the path isn't explicitly provided.
