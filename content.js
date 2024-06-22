function playVideo() {
  const video = document.querySelector("video");
  if (video && video.paused) {
    video.play();
    console.log("Video played");
  }
}

function pauseVideo() {
  const video = document.querySelector("video");
  if (video && !video.paused) {
    video.pause();
    console.log("Video paused");
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.action === "play") {
    playVideo();
  } else if (message.action === "pause") {
    pauseVideo();
  }
});
