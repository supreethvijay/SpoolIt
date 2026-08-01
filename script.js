/**
 * spoolit — Landing Page Scripts
 * Handles Video Playback (Image Thumbnail -> YouTube Embed) & Waitlist Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  const YOUTUBE_VIDEO_ID = 'IjXVorAIwHE';
  
  // Elements
  const videoCard = document.getElementById('video-card');
  const thumbnailWrapper = document.getElementById('thumbnail-wrapper');
  const iframeWrapper = document.getElementById('iframe-wrapper');
  const watchShowreelBtn = document.getElementById('watch-showreel-btn');
  const waitlistForm = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('email-input');
  const successMessage = document.getElementById('success-message');
  const navbar = document.getElementById('navbar');

  let isVideoPlaying = false;

  /**
   * Play Video Function
   * Hides the static thumbnail image wrapper and embeds the YouTube video iframe with autoplay.
   */
  function playVideo() {
    if (isVideoPlaying) return;

    isVideoPlaying = true;

    // Create YouTube Iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = 'spoolit Show Reel Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;

    // Insert iframe into container
    iframeWrapper.appendChild(iframe);

    // Hide Thumbnail & Show Video
    thumbnailWrapper.classList.add('hidden');
    iframeWrapper.classList.remove('hidden');
  }

  // Event Listener: Click on Thumbnail Image Card
  if (videoCard) {
    videoCard.addEventListener('click', (e) => {
      e.preventDefault();
      playVideo();
    });

    // Keyboard navigation (Enter / Space key)
    videoCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playVideo();
      }
    });
  }

  // Event Listener: Click on "Watch the show reel" hero button
  if (watchShowreelBtn) {
    watchShowreelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Scroll to video card smoothly
      if (videoCard) {
        videoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Trigger video play
      playVideo();
    });
  }

  // Google Apps Script Configuration
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzpbUIsmpgfbXSSqhhxpKWuc86mKlS5hOJ18Bgx7NUjUqL2TCF1IFvyLseLAjIxoY_5/exec';
  const GOOGLE_SHEET_NAME = 'Spool_Waitlist';

  const hiddenIframe = document.getElementById('hidden_iframe');
  const emailHiddenInput = document.getElementById('email-hidden-input');
  let formSubmitted = false;

  function showSuccessState() {
    if (waitlistForm) waitlistForm.classList.add('hidden');
    if (successMessage) successMessage.classList.remove('hidden');
  }

  // Handle hidden iframe load (fired when Google Apps Script completes native POST response)
  if (hiddenIframe) {
    hiddenIframe.addEventListener('load', () => {
      if (formSubmitted) {
        showSuccessState();
      }
    });
  }

  // Waitlist Form Handler
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      const email = emailInput.value.trim();
      if (!email) {
        e.preventDefault();
        return;
      }

      formSubmitted = true;

      const nowStr = new Date().toLocaleString();

      // Sync hidden email and timestamp inputs
      if (emailHiddenInput) emailHiddenInput.value = email;
      const emailAddrInput = document.getElementById('email-address-hidden-input');
      if (emailAddrInput) emailAddrInput.value = email;
      const timestampInput = document.getElementById('timestamp-hidden-input');
      if (timestampInput) timestampInput.value = nowStr;

      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
      }

      // Fire extra GET query fallback URL request
      const getUrl = `${GOOGLE_SCRIPT_URL}?email=${encodeURIComponent(email)}&Email=${encodeURIComponent(email)}&emailAddress=${encodeURIComponent(email)}&sheetName=${encodeURIComponent(GOOGLE_SHEET_NAME)}&sheet=${encodeURIComponent(GOOGLE_SHEET_NAME)}&timestamp=${encodeURIComponent(nowStr)}`;
      fetch(getUrl, { mode: 'no-cors' }).catch(() => {});

      // Fallback timeout to ensure UI updates even if iframe onload is suppressed
      setTimeout(() => {
        showSuccessState();
      }, 1200);
    });
  }

  // Header navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
      navbar.style.borderBottom = '1px solid var(--color-border)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.borderBottom = '1px solid transparent';
    }
  });
});
