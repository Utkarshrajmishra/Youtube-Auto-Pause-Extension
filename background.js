let enabled = true;

function injectContentScript(tabId, callback) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["content.js"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error injecting content script: ",
          chrome.runtime.lastError.message
        );
      } else {
        callback();
      }
    }
  );
}

function sendMessageToTab(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        "Error sending message: ",
        chrome.runtime.lastError.message
      );
    } else {
      console.log("Message sent to tab", tabId, message);
    }
  });
}

function handleTabUpdate(tabId, changeInfo, tab) {
  if (
    enabled &&
    changeInfo.status === "complete" &&
    tab.url.includes("youtube.com")
  ) {
    injectContentScript(tabId, () => {
      sendMessageToTab(tabId, { action: "play" });
    });
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (enabled) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.url.includes("youtube.com")) {
        injectContentScript(tab.id, () => {
          sendMessageToTab(tab.id, { action: "play" });
        });
      } else {
        sendMessageToTab(tab.id, { action: "pause" });
      }
    });
  }
});

chrome.tabs.onUpdated.addListener(handleTabUpdate);

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (enabled) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url.includes("youtube.com")) {
          injectContentScript(tabs[0].id, () => {
            sendMessageToTab(tabs[0].id, { action: "pause" });
          });
        }
      });
    } else {
      chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url.includes("youtube.com")) {
          injectContentScript(tabs[0].id, () => {
            sendMessageToTab(tabs[0].id, { action: "play" });
          });
        }
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "enable") {
    enabled = true;
    console.log("Extension enabled");
    sendResponse({ status: "enabled" });
  } else if (message.action === "disable") {
    enabled = false;
    console.log("Extension disabled");
    sendResponse({ status: "disabled" });
  }
  return true; // Indicates you want to send a response asynchronously
});
