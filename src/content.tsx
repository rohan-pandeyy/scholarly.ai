import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import styles from "./index.css?inline";

const SIDEBAR_HOST_ID = "scholarly-sidebar-host";
let root: ReactDOM.Root | null = null;
let observer: MutationObserver | null = null;
let resizeTimeout: number | null = null;

// Semantic class names
const CLASSES = {
    ROOT: "scholarly-layout-root",
    BODY: "scholarly-layout-body",
    APP: "scholarly-layout-app",
    HEADER: "scholarly-layout-header",
    PLAYER_OUTER: "scholarly-layout-player-outer",
    PLAYER_INNER: "scholarly-layout-player-inner",
    VIDEO: "scholarly-layout-video",
    CONTROLS: "scholarly-layout-controls",
    FULLSCREEN_PLAYER: "scholarly-layout-fullscreen-player",
    FULLSCREEN_CONTAINER: "scholarly-layout-fullscreen-container",
};

// CSS Variables for configuration
const CSS_VARS = `
  :root {
    --scholarly-width: 65vw;
    --scholarly-sidebar-width: 35vw;
  }
`;

// Resilient Global CSS using semantic classes
const GLOBAL_LAYOUT_CSS = `
  ${CSS_VARS}

  html[scholarly-active] {
    width: var(--scholarly-width) !important;
    overflow-x: hidden !important;
  }
  
  html[scholarly-active] body {
    width: var(--scholarly-width) !important;
    overflow-x: hidden !important;
  }

  html[scholarly-active] .${CLASSES.APP} {
    width: var(--scholarly-width) !important;
    max-width: var(--scholarly-width) !important;
  }
  
  /* Handle YouTube's fixed header */
  html[scholarly-active] .${CLASSES.HEADER} {
    width: var(--scholarly-width) !important;
    right: auto !important;
    left: 0 !important;
  }

  /* Force video player to respect container width */
  html[scholarly-active] .${CLASSES.PLAYER_OUTER} {
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Fix inner video element resizing */
  html[scholarly-active] .${CLASSES.PLAYER_INNER},
  html[scholarly-active] .${CLASSES.VIDEO} {
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
  }
  
  /* Reset video positioning if needed */
  html[scholarly-active] video.${CLASSES.VIDEO} {
    left: 0 !important;
    top: 0 !important;
    object-fit: contain !important;
  }

  /* Fix player controls clipping */
  html[scholarly-active] .${CLASSES.CONTROLS} {
    width: 100% !important;
    left: 0 !important;
  }
  
  html[scholarly-active] .ytp-chrome-controls {
    width: 100% !important;
  }
  
  html[scholarly-active] .ytp-right-controls {
    right: 0 !important;
  }

  /* Fix fullscreen video alignment */
  html[scholarly-active] .${CLASSES.FULLSCREEN_PLAYER} video {
    height: 100% !important;
    max-height: 100% !important;
  }
  
  /* Fix fullscreen video disappearing (container height collapse) */
  html[scholarly-active] .${CLASSES.FULLSCREEN_CONTAINER} {
    height: 100% !important;
  }
`;

function injectGlobalStyles() {
    if (document.getElementById("scholarly-global-styles")) return;
    const style = document.createElement("style");
    style.id = "scholarly-global-styles";
    style.textContent = GLOBAL_LAYOUT_CSS;
    document.head.appendChild(style);
}

// Heuristics to find elements
function tagElements() {
    // App Root
    const app = document.querySelector("ytd-app");
    if (app) app.classList.add(CLASSES.APP);

    // Header
    const header =
        document.querySelector("#masthead-container") ||
        document.querySelector("ytd-masthead");
    if (header) header.classList.add(CLASSES.HEADER);

    // Player Outer
    const playerOuter =
        document.querySelector("ytd-watch-flexy") ||
        document.querySelector("#player-container-outer");
    if (playerOuter) playerOuter.classList.add(CLASSES.PLAYER_OUTER);

    // Player Inner / Video Containers
    const playerInner =
        document.querySelector("#player-container-inner") ||
        document.querySelector("#player-container");
    if (playerInner) playerInner.classList.add(CLASSES.PLAYER_INNER);

    // Video Elements
    const videos = document.querySelectorAll("video");
    videos.forEach((v) => v.classList.add(CLASSES.VIDEO));

    const videoContainers = document.querySelectorAll(".html5-video-container");
    videoContainers.forEach((vc) => vc.classList.add(CLASSES.VIDEO)); // Treat container as video for sizing

    // Controls
    const controls = document.querySelector(".ytp-chrome-bottom");
    if (controls) controls.classList.add(CLASSES.CONTROLS);

    // Fullscreen
    const fsPlayer = document.querySelector(
        ".html5-video-player.ytp-fullscreen"
    );
    if (fsPlayer) fsPlayer.classList.add(CLASSES.FULLSCREEN_PLAYER);

    const fsContainer = document.querySelector(
        ".html5-video-player.ytp-fullscreen .html5-video-container"
    );
    if (fsContainer) fsContainer.classList.add(CLASSES.FULLSCREEN_CONTAINER);
}

function startObserver() {
    if (observer) return;

    // Initial tag
    tagElements();

    observer = new MutationObserver((mutations) => {
        // Quick early exit: if any childList change happened, we want to retag.
        // If only attribute changes happened, only retag when it's a relevant attribute on a relevant element.
        let shouldRetag = false;

        for (const m of mutations) {
            if (
                m.type === "childList" &&
                (m.addedNodes.length || m.removedNodes.length)
            ) {
                shouldRetag = true;
                break;
            }
            if (m.type === "attributes") {
                const attr = m.attributeName;
                // Only react to attribute changes we care about:
                if (
                    attr === "class" ||
                    attr === "style" ||
                    attr === "hidden" ||
                    attr === "aria-hidden"
                ) {
                    shouldRetag = true;
                    break;
                }
            }
        }

        if (!shouldRetag) return;

        // Debounce the tagging
        if (resizeTimeout) window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
            tagElements();
        }, 100);
    });

    // Observe body but only watch for specific attribute names to reduce noise.
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style", "hidden", "aria-hidden"],
        // attributeOldValue: true // optional if you need previous value
    });
}

function stopObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

function injectSidebar() {
    if (document.getElementById(SIDEBAR_HOST_ID)) return;

    // Create host element
    const host = document.createElement("div");
    host.id = SIDEBAR_HOST_ID;
    host.style.position = "fixed";
    host.style.top = "0";
    host.style.right = "0";
    host.style.width = "var(--scholarly-sidebar-width)";
    host.style.height = "100vh";
    host.style.zIndex = "2147483647";
    host.style.backgroundColor = "white";
    host.style.boxShadow = "-2px 0 5px rgba(0, 0, 0, 0.1)";
    document.body.appendChild(host);

    // Create shadow root
    const shadow = host.attachShadow({ mode: "open" });

    // Inject styles
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    shadow.appendChild(styleElement);

    // Render App
    root = ReactDOM.createRoot(shadow);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

function removeSidebar() {
    const host = document.getElementById(SIDEBAR_HOST_ID);
    if (host && root) {
        root.unmount();
        host.remove();
        root = null;
    }
}

function toggleSidebar() {
    injectGlobalStyles();

    const isActive = document.documentElement.hasAttribute("scholarly-active");

    if (isActive) {
        // Deactivate
        document.documentElement.removeAttribute("scholarly-active");
        removeSidebar();
        stopObserver();
        window.dispatchEvent(
            new CustomEvent("SCHOLARLY_TOGGLE", { detail: { active: false } })
        );
    } else {
        // Activate
        document.documentElement.setAttribute("scholarly-active", "");
        injectSidebar();
        startObserver();
        window.dispatchEvent(
            new CustomEvent("SCHOLARLY_TOGGLE", { detail: { active: true } })
        );
    }
}

// Listen for messages
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "TOGGLE_SIDEBAR") {
        toggleSidebar();
    }
    sendResponse({ status: "received" });
});
