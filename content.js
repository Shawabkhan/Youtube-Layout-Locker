let controlsLocked = false;

function toggleControlsLock() {
  const video = document.querySelector('video');
  const controls = document.querySelector('.ytp-chrome-bottom');
  const lockButton = document.getElementById('yt-lock-button');

  if (controlsLocked) {
    video.removeEventListener('play', preventAction);
    video.removeEventListener('pause', preventAction);
    controls.style.pointerEvents = 'auto';
    document.body.classList.remove('yt-lock-scroll');
    document.removeEventListener('keydown', preventKeydown);
    document.removeEventListener('fullscreenchange', handleFullScreenChange);
    controlsLocked = false;
    updateLockButton('🔓');
  } else {
    video.addEventListener('play', preventAction);
    video.addEventListener('pause', preventAction);
    controls.style.pointerEvents = 'none';
    document.body.classList.add('yt-lock-scroll');
    document.addEventListener('keydown', preventKeydown);
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    lockButton.style.pointerEvents = 'auto'; // Enable lock button
    controlsLocked = true;
    updateLockButton('🔒');
  }
}

function preventAction(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function preventKeydown(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function updateLockButton(icon) {
  const lockButton = document.getElementById('yt-lock-button');
  if (lockButton) {
    lockButton.textContent = icon;
  }
}

function createLockButton() {
  const controls = document.querySelector('.ytp-right-controls');
  if (controls && !document.getElementById('yt-lock-button')) {
    const button = document.createElement('button');
    button.id = 'yt-lock-button';
    button.textContent = '🔓';
    button.style.cssText = 'background: none; border: none; cursor: pointer; font-size: 20px; color: white; position: relative; top: -18px;';
    button.addEventListener('click', toggleControlsLock);
    controls.appendChild(button);
  }
}

function handleFullScreenChange() {
  const isFullScreen = document.fullscreenElement != null;
  if (isFullScreen && controlsLocked) {
    document.body.classList.add('yt-lock-scroll');
  } else {
    document.body.classList.remove('yt-lock-scroll');
  }
}

// Check periodically if the YouTube player controls are available
const observer = new MutationObserver(createLockButton);
observer.observe(document.body, {childList: true, subtree: true});

// Ensure the lock button is created on page load
window.addEventListener('load', createLockButton);

// Add CSS to disable scrolling when locked
const style = document.createElement('style');
style.textContent = `
  .yt-lock-scroll {
    overflow: hidden !important;
    height: 100vh !important;
    position: fixed !important;
    width: 100% !important;
  }
      .yt-lock-scroll {
    overflow-y: hidden !important;
  }
`;
document.head.appendChild(style);
