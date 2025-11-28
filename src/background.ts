// Background service worker
console.log("[Scholarly] Background script loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Scholarly] Extension installed");
});
