// Content script
console.log("[Scholarly] Content script loaded on YouTube");

// Example: Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log("[Scholarly] Message received:", request);
  sendResponse({ status: "received" });
});
