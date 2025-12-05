import React from 'react';
import { createRoot } from 'react-dom/client';

const SIDEBAR_WIDTH = 500;
const SIDEBAR_ID = 'scholarly-extension-sidebar';

const Sidebar: React.FC = () => {
    const handleClose = () => {
        removeSidebar();
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0f0f0f',
                borderLeft: '1px solid #3f3f3f',
                boxShadow: '-2px 0 8px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: '#ffffff',
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: '16px',
                    borderBottom: '1px solid #3f3f3f',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>
                    Scholarly.AI
                </h3>
                <button
                    onClick={handleClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '16px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        color: '#ffffff',
                        borderRadius: '4px',
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#3f3f3f')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                >
                    &#129122;
                </button>
            </div>

            {/* Content */}
            <div
                style={{
                    flex: 1,
                    padding: '16px',
                    overflowY: 'auto',
                }}
            >
                <p>Your everyday study companion for YouTube</p>
            </div>
        </div>
    );
};

// Function to push YouTube content to the left
const adjustPageLayout = () => {
    // Main page container
    const ytdApp = document.querySelector('ytd-app') as HTMLElement;
    if (ytdApp) {
        ytdApp.style.marginRight = `${SIDEBAR_WIDTH}px`;
        ytdApp.style.transition = 'margin-right 0.3s ease';
    }

    // YouTube's masthead (top header with search bar)
    const masthead = document.querySelector(
        '#masthead-container',
    ) as HTMLElement;
    if (masthead) {
        masthead.style.width = `calc(100% - ${SIDEBAR_WIDTH}px)`;
        masthead.style.transition = 'width 0.3s ease';
    }

    // YouTube's player (when watching videos)
    const player = document.querySelector('#movie_player') as HTMLElement;
    if (player) {
        player.style.maxWidth = `calc(100vw - ${SIDEBAR_WIDTH}px)`;
    }

    // Theater mode container
    const playerContainer = document.querySelector(
        '#player-container-outer',
    ) as HTMLElement;
    if (playerContainer) {
        playerContainer.style.maxWidth = `calc(100vw - ${SIDEBAR_WIDTH}px)`;
    }

    // Full-screen elements overlay
    const fullscreenContainer = document.querySelector(
        '.html5-video-container',
    ) as HTMLElement;
    if (fullscreenContainer) {
        fullscreenContainer.style.maxWidth = `calc(100vw - ${SIDEBAR_WIDTH}px)`;
    }
};

// Function to restore YouTube layout
const restorePageLayout = () => {
    const ytdApp = document.querySelector('ytd-app') as HTMLElement;
    if (ytdApp) {
        ytdApp.style.marginRight = '0';
    }

    const masthead = document.querySelector(
        '#masthead-container',
    ) as HTMLElement;
    if (masthead) {
        masthead.style.width = '';
    }

    const player = document.querySelector('#movie_player') as HTMLElement;
    if (player) {
        player.style.maxWidth = '';
    }

    const playerContainer = document.querySelector(
        '#player-container-outer',
    ) as HTMLElement;
    if (playerContainer) {
        playerContainer.style.maxWidth = '';
    }

    const fullscreenContainer = document.querySelector(
        '.html5-video-container',
    ) as HTMLElement;
    if (fullscreenContainer) {
        fullscreenContainer.style.maxWidth = '';
    }
};

// Function to inject sidebar
const injectSidebar = () => {
    // Check if sidebar already exists
    if (document.getElementById(SIDEBAR_ID)) {
        return;
    }

    // Create sidebar container
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = SIDEBAR_ID;
    sidebarContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: ${SIDEBAR_WIDTH}px;
    height: 100vh;
    z-index: 2147483647;
    overflow: hidden;
  `;

    document.body.appendChild(sidebarContainer);

    // Render React component
    const root = createRoot(sidebarContainer);
    root.render(<Sidebar />);

    // Adjust page layout
    adjustPageLayout();
};

// Function to remove sidebar
const removeSidebar = () => {
    const sidebar = document.getElementById(SIDEBAR_ID);
    if (sidebar) {
        sidebar.remove();
        restorePageLayout();
    }
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'TOGGLE_SIDEBAR') {
        const exists = document.getElementById(SIDEBAR_ID);
        if (exists) {
            removeSidebar();
        } else {
            injectSidebar();
        }
        sendResponse({ success: true });
    }
    return true;
});

// Handle YouTube's SPA navigation (page changes without reload)
let previousUrl = '';
const observer = new MutationObserver(() => {
    if (location.href !== previousUrl) {
        previousUrl = location.href;
        // Re-adjust layout if sidebar is open
        if (document.getElementById(SIDEBAR_ID)) {
            adjustPageLayout();
        }
    }
});

// Start observing YouTube's page changes
observer.observe(document.body, { childList: true, subtree: true });

// Optional: Auto-inject on video pages only
// if (window.location.pathname === '/watch') {
//   injectSidebar();
// }
