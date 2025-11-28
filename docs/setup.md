# Setup Guide

Welcome to the Scholarly project! This guide will help you set up your development environment.

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher (usually comes with Node.js)
- **Chromium Based Browser**: For testing the extension (eg, Google Chrome, Brave, etc.)

## Installation

1. **Fork the Scholarly repository**: https://github.com/dss-bu/scholarly.ai

2. **Open your Terminal (Linux/MacOS) or Powershell (Windows)**

3. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/scholarly.ai.git
   cd scholarly.ai
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

We use **Vite** with **HMR (Hot Module Replacement)** for a fast development experience.

1.  **Start the Development Server**:

    ```bash
    npm run dev
    ```

    This command will:
    - Start a local server at `http://127.0.0.1:5173`
    - Watch for file changes and rebuild the extension automatically.

2.  **Load the Extension in Chrome**:
    - Open Chrome and navigate to `chrome://extensions`.
    - Enable **Developer mode** (toggle in the top right).
    - Click **Load unpacked**.
    - Select the `dist` directory in your project folder (`scholarly.ai/dist`).

3.  **Verify Setup**:
    - You should see the **Scholarly** extension card.
    - Click the extension icon in the toolbar to open the popup.
    - Navigate to YouTube to test the content script injection.

## Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist` directory. This is the folder you would zip and upload to the Chrome Web Store.
