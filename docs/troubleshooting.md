# Troubleshooting Guide

This document lists common issues you might encounter during development and how to resolve them.

## Connection Issues

### "Cannot connect to the Vite Dev Server"

**Symptoms**: The extension popup shows an error saying it cannot connect to `http://localhost:5173`.

**Cause**:

1.  Port mismatch between the extension and the dev server.
2.  IPv4 vs IPv6 resolution issues (localhost resolving to `::1` instead of `127.0.0.1`).

**Solution**:

- Ensure `vite.config.ts` is configured to force IPv4:
  ```ts
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '127.0.0.1',
      clientPort: 5173,
    },
  }
  ```
- Restart the dev server: `npm run dev`.
- Reload the extension in `chrome://extensions`.

### "Service worker registration failed" / CORS Errors

**Symptoms**: The extension fails to load, and clicking "Errors" shows CORS errors accessing `http://localhost:5173/...`.

**Cause**:
The Chrome Extension (running on `chrome-extension://...`) is trying to fetch resources from the local dev server, but the server is not sending the correct CORS headers.

**Solution**:

- Ensure `vite.config.ts` has CORS enabled for all origins:
  ```ts
  server: {
    cors: { origin: "*" },
    // ...
  }
  ```

## Runtime Errors

### "Target container is not a DOM element"

**Symptoms**: The popup is blank, and the console shows this error.

**Cause**:
Mismatch between the ID in `index.html` and the ID used in `ReactDOM.createRoot`.

**Solution**:

- Check `index.html`: `<div id="root"></div>`
- Check `src/main.tsx`: `document.getElementById('root')`
- Ensure they match.
