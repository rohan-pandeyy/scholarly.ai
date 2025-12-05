# Architecture Overview

Scholarly.ai is designed as a **Chrome Extension** with a strong emphasis on privacy, speed, and offline capability.

## Core Philosophy: Offline First

Unlike many extensions that rely heavily on cloud APIs for every interaction, Scholarly aims to perform as much processing as possible directly on the user's device.

### Benefits

- **Privacy**: User data and viewing habits stay local.
- **Reliability**: Works even with spotty internet connections.
- **Speed**: Reduced latency for AI interactions.

## High-Level Components

### 1. Content Script

- **Role**: Injected into YouTube pages.
- **Responsibilities**:
    - Capturing video frames (snapshots).
    - Reading video metadata (timestamps, title).
    - Rendering the overlay UI for taking notes and asking questions.
    - Communicating with the background service worker.

### 2. Background Service Worker

- **Role**: The central coordinator.
- **Responsibilities**:
    - Managing state (current session notes).
    - Handling PDF generation logic.
    - Orchestrating the "Offline AI" models (e.g., using Chrome's built-in AI APIs or WASM-based models).
    - Managing storage (IndexedDB/Chrome Storage).

### 3. Popup / Side Panel

- **Role**: The main user interface for reviewing notes and settings.
- **Responsibilities**:
    - Displaying the list of captured snapshots.
    - Providing the "Export to PDF" functionality.
    - Chat interface for the AI tutor.

## Process Flow

The interaction follows a strict pipeline to ensure accurate, localized, and context-aware responses:

1.  **Input**: User enters a query or takes an action (e.g., "Snap").
2.  **Language Detection**: The **Chrome Language Detection API** identifies the query's language.
3.  **Prompt Training**: The system dynamically trains multiple prompts based on the current video context and generates identifier keywords.
4.  **Master Prompt Session**: A master session evaluates the intent and determines which specialized session should handle the query.
5.  **Session Processing**: The appropriate session processes the query using the **configured AI model** (Chrome Built-in, OpenAI, Gemini, etc.).
6.  **Translation & Output**: The result is sent to the **Chrome Translation API** to convert it into the user's preferred language, and the final output is displayed with synced timestamps.

## Model Abstraction Layer

Scholarly.ai implements a **Model Abstraction Layer (MAL)** to decouple the application logic from specific AI providers. This allows users to choose their preferred intelligence backend.

### Supported Providers

1.  **Chrome Built-in AI (Default)**: Zero-setup, offline-capable, privacy-focused.
2.  **Bring Your Own Model (BYOM)**:
    - **OpenAI**: Connect via API key for GPT-4o/GPT-4-turbo.
    - **Google Gemini**: Connect via API key for Gemini 1.5 Pro/Flash.
    - **Ollama**: Connect to a local inference server (e.g., Llama 3, Mistral) for complete offline control with custom models.

## Technology Stack

### Frontend

- **Framework**: **React** (v18+) with **TypeScript** for type safety and component-based architecture.
- **Build Tool**: **Vite** for fast development and optimized production builds.
- **Styling**: **TailwindCSS** for utility-first, scoped styling that doesn't leak into host pages.
- **State Management**: **Zustand** for a lightweight, hook-based global store.

### AI & Processing

- **Abstraction**: Custom `AIProvider` interface.
- **Providers**:
    - **Chrome Built-in AI APIs** (Language Detection, Translation, Prompt, Summarization).
    - **LangChain.js** (optional) for unified interface across external providers.

### Storage & Data

- **Local Database**: **IndexedDB** (via `idb` library) for storing snapshots, notes, and vector embeddings efficiently.
- **PDF Generation**: **jspdf** combined with **html2canvas** to render rich, visual notes into downloadable PDFs.
