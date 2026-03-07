// ===== Typing Animation =====
const phrases = [
  "Trade Smarter with",
  "Automate Your Success with",
  "Maximize Profits with",
  "Analyze Markets with",
  "Win Every Trade with"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingEl = null;

function typeEffect() {
  typingEl = typingEl || document.getElementById('typing-text');
  if (!typingEl) return;

  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    if (charIndex < currentPhrase.length) {
      charIndex++;
      typingEl.textContent = currentPhrase.slice(0, charIndex);
      setTimeout(typeEffect, 80);
    } else {
      setTimeout(() => { isDeleting = true; typeEffect(); }, 2000);
    }
  } else {
    if (charIndex > 0) {
      charIndex--;
      typingEl.textContent = currentPhrase.slice(0, charIndex);
      setTimeout(typeEffect, 30);
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeEffect();
    }
  }
}

// ===== Check User & Show Page =====
function initPage() {
  const loadingScreen = document.getElementById('loading-screen');
  const mainPage = document.getElementById('main-page');

  // Check localStorage for user code
  const userCode = localStorage.getItem('sufia_user_code');
  if (userCode) {
    // Redirect to home page if user is logged in
    window.location.href = '/home/' + encodeURIComponent(userCode);
    return;
  }

  // Show main page, hide loading
  loadingScreen.style.display = 'none';
  mainPage.style.display = 'block';

  // Start typing animation
  typeEffect();
}

// ===== PWA Install =====
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function setupInstallButton() {
  const btn = document.getElementById('install-btn');
  if (!btn) return;

  // Check if already installed (standalone mode)
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    btn.textContent = 'Installed';
    btn.classList.add('installed');
    btn.removeAttribute('href');
    btn.style.cursor = 'default';
    return;
  }

  btn.addEventListener('click', async (e) => {
    if (btn.classList.contains('installed')) {
      e.preventDefault();
      return;
    }
    if (deferredPrompt) {
      e.preventDefault();
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        btn.textContent = 'Installed';
        btn.classList.add('installed');
        btn.removeAttribute('href');
        btn.style.cursor = 'default';
      }
      deferredPrompt = null;
    }
  });
}

window.addEventListener('appinstalled', () => {
  const btn = document.getElementById('install-btn');
  if (btn) {
    btn.textContent = 'Installed';
    btn.classList.add('installed');
    btn.removeAttribute('href');
    btn.style.cursor = 'default';
  }
  deferredPrompt = null;
});

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ===== Start =====
document.addEventListener('DOMContentLoaded', () => {
  initPage();
  setupInstallButton();
});
