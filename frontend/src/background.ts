chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
        chrome.tabs.sendMessage(
            tab.id,
            { type: 'TOGGLE_SIDEBAR' },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error:', chrome.runtime.lastError.message);
                } else {
                    console.log('Sidebar toggled:', response);
                }
            },
        );
    }
});
