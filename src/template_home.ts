export const templateHome = `
<html>
  <head>
    <title>Screenshotter</title>
    <style>
      body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; }
      code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Screenshotter</h1>
    <p>This API provides webpage screenshots in PNG format (1000px wide)</p>
    
    <h2>Endpoints:</h2>

    <p>Append your URL to take screenshot after the app URL</p>
    
    <code>GET /https://example.com</code>
    
    <h2>Examples:</h2>
    <ul>
      <li><a href="/https://example.com">Example.com</a></li>
      <li><a href="/https://github.com">Take screenshot of GitHub</a></li>
      <li><a href="/https://www.youtube.com/watch?v=dQw4w9WgXcQ">Youtube</a></li>
    </ul>
    
    <p>Note: URLs without http(s) prefix will be automatically normalized</p>
  </body>
</html>
`