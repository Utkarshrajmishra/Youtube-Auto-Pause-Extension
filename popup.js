document.getElementById("enable").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "enable" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        "Error sending enable message: ",
        chrome.runtime.lastError.message
      );
    } else {
      console.log("Enable message response:", response);
    }
  });
});

document.getElementById("disable").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "disable" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        "Error sending disable message: ",
        chrome.runtime.lastError.message
      );
    } else {
      console.log("Disable message response:", response);
    }
  });
});
