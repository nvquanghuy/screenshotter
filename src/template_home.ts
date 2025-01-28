export const templateHome = `
<html>
  <head>
    <title>Screenshotter</title>
    <style>
      body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
      code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
      .url-form { margin: 20px 0; }
      .url-input { width: 70%; padding: 8px; font-size: 16px; }
      .submit-btn { padding: 8px 16px; font-size: 16px; background: #0366d6; color: white; border: none; border-radius: 4px; cursor: pointer; }
      .submit-btn:hover { background: #0255b3; }
    </style>
  </head>
  <body>
    <h1>Screenshotter</h1>
    <p>This API provides webpage screenshots in PNG format (1000px wide)</p>

    <h2>How to</h2>
    <p>Append your URL to take screenshot after the app URL</p>
    <code>GET /https://example.com</code>
    
    <h2>Take a screenshot</h2>
    <form class="url-form" onsubmit="takeScreenshot(event)">
      <input value="https://example.com" type="url" id="urlInput" class="url-input" placeholder="Enter website URL (e.g. https://example.com)" />
      <button type="submit" class="submit-btn">Capture</button>
    </form>

    <script>
      function takeScreenshot(event) {
        event.preventDefault();
        const url = document.getElementById('urlInput').value;
        if (url) {
          window.location.href = '/' + url;
        }
      }
    </script>
    
    <p>Examples</p>
    <ul>
      <li><a href="/https://example.com">Example.com</a></li>
      <li><a href="/https://github.com">Take screenshot of GitHub</a></li>
      <li><a href="/https://www.youtube.com/watch?v=dQw4w9WgXcQ">Youtube</a></li>
    </ul>
    
    <p>Note: URLs without http(s) prefix will be automatically normalized</p>
  </body>
</html>
`