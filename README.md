<div align="center">

# Scholarly.ai

### The Offline-First AI Study Companion for YouTube

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://developer.chrome.com/docs/extensions/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://reactjs.org/)
[![Powered by Chrome AI](https://img.shields.io/badge/Powered%20by-Chrome%20AI-4285F4.svg)](https://developer.chrome.com/docs/ai/)

[Features](#features) • [Architecture](#architecture) • [Privacy](#privacy-first-design) • [Contributing](CONTRIBUTING.md)

</div>

---

## Overview

**Scholarly.ai** transforms passive video consumption into an active learning experience. Designed for students and lifelong learners, it is a Chrome Extension that integrates seamlessly with YouTube to provide instant note-taking, doubt resolution, and content organization—all without breaking your flow.

Unlike traditional tools that rely on constant cloud connectivity, Scholarly is built with an **Offline-First** architecture, leveraging Chrome's built-in AI capabilities to process data locally on your device.

## Features

### Smart Capture

- **Timestamped Snapshots**: Instantly capture key moments. Every snapshot is linked to the exact second in the video.
- **Contextual Notes**: Add your own thoughts to every capture.

### AI-Powered Tutor

- **Instant Q&A**: Ask questions about the video content and get detailed, timestamped answers.
- **Summarization**: Generate concise summaries of long lectures or specific segments.
- **Multilingual Support**: Ask in your native language, get answers in your preferred language.

### Organization

- **PDF Export**: Compile your session into a clean, organized PDF with clickable timestamps.
- **Playlist Mode**: Merge notes from an entire course playlist into a single master document.

### Model Flexibility (BYOM)

While Scholarly works out-of-the-box with **Chrome Built-in AI**, we believe in giving you choice. Connect your preferred intelligence provider:

- **Chrome Built-in AI** (Default, Offline, Free)
- **OpenAI** (GPT-5, GPT-4o, GPT-4-turbo)
- **Google Gemini** (3, 2.5 Pro, Flash)
- **Ollama** (Local Llama 3, Mistral)

## Privacy-First Design

Scholarly.ai is engineered with privacy as a core tenet.

- **Local Processing**: Video analysis and note generation happen on your device.
- **No Data Mining**: We do not track your viewing habits or store your notes on our servers.
- **Offline Capable**: Study anywhere, even without an internet connection.

## Architecture

Scholarly uses a modern, robust tech stack designed for performance and maintainability:

| Layer        | Technology                | Role                                                 |
| :----------- | :------------------------ | :--------------------------------------------------- |
| **Core**     | **React 18 + TypeScript** | The view layer.                                      |
| **Build**    | **Vite + CRXJS**          | Bundling and HMR (Hot Module Replacement).           |
| **State**    | **Redux Toolkit**         | Managing global app state (user session, settings).  |
| **Async**    | **TanStack Query**        | Managing async data (DB reads/writes, AI responses). |
| **Router**   | **React Router**          | Navigation within the side panel.                    |
| **UI**       | **Shadcn/UI + Tailwind**  | Accessible UI components.                            |
| **Storage**  | **IndexedDB + `idb`**     | Google's standard wrapper for local storage.         |
| **AI Logic** | **LangChain.js**          | Unified interface for Chrome AI & External APIs.     |
| **PDF**      | **@react-pdf/renderer**   | React-based PDF generation.                          |

For a deep dive into the technical design, please read our [Architecture Guide](ARCHITECTURE.md).

## Contributing

We welcome contributions from the community! Whether it's a bug fix, a new feature, or documentation improvements, please check out our [Contributing Guidelines](CONTRIBUTING.md) to get started.

---

<div align="center">
Built with ❤️ for students everywhere.
<br />
<a href="https://dss-bu.vercel.app/">Data Science Society</a>
</div>
