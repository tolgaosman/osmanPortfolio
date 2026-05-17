/* ─── Typing Effect ─── */
const phrasesEN = [
  'Software Engineer.',
  'Web Developer.',
  'Problem Solver.',
  'Open to Opportunities.'
];
const phrasesTR = [
  'Yazılım Mühendisi.',
  'Web Geliştiricisi.',
  'Problem Çözücü.',
  'Fırsatlara Açık.'
];
let pi = 0, ci = 0, deleting = false;
const el = document.getElementById('typed');
let currentLang = localStorage.getItem('preferredLang') || 'en';

function getPhrases() { return currentLang === 'en' ? phrasesEN : phrasesTR; }

function type() {
  const phrase = getPhrases()[pi];
  if (!deleting) {
    el.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % getPhrases().length; }
  }
  setTimeout(type, deleting ? 55 : 90);
}
type();

/* ─── Language Switcher ─── */
let langMenuOpen = false;

function toggleLangMenu(e) {
  e.stopPropagation();
  langMenuOpen = !langMenuOpen;
  document.getElementById('langMenu').classList.toggle('open', langMenuOpen);
  document.getElementById('langChevron').classList.toggle('rotated', langMenuOpen);
}

function setLang(lang) {
  localStorage.setItem('preferredLang', lang);
  
  // Set Google Translate cookie to trigger native translation on page load
  const domain = window.location.hostname;
  document.cookie = `googtrans=/en/${lang}; path=/;`;
  document.cookie = `googtrans=/en/${lang}; path=/; domain=${domain};`;
  document.cookie = `googtrans=/en/${lang}; path=/; domain=.${domain};`;
  
  // Reload page to apply translation natively and cleanly
  window.location.reload();
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// On page load, apply custom bypassed translations, placeholders and flag dropdown state
document.addEventListener('DOMContentLoaded', () => {
  let savedLang = localStorage.getItem('preferredLang');
  if (!savedLang) {
    const googTrans = getCookie('googtrans');
    if (googTrans) {
      const parts = googTrans.split('/');
      savedLang = parts[parts.length - 1];
    }
  }
  if (savedLang && (savedLang === 'en' || savedLang === 'tr')) {
    currentLang = savedLang;
  }

  // Update custom bypassed elements
  document.querySelectorAll('.custom-translate').forEach(el => {
    const text = el.getAttribute('data-' + currentLang);
    if (text) el.textContent = text;
  });

  // Translate form placeholders
  const placeholders = {
    en: {
      name: 'Your Name and Surname',
      email: 'Your Mail Address',
      message: 'Tell me anything...'
    },
    tr: {
      name: 'Adınız ve Soyadınız',
      email: 'E-posta Adresiniz',
      message: 'Bana aklınızdakini söyleyin...'
    }
  };
  const nameInput = document.getElementById('name');
  if (nameInput) nameInput.placeholder = placeholders[currentLang].name;
  const emailInput = document.getElementById('email');
  if (emailInput) emailInput.placeholder = placeholders[currentLang].email;
  const messageInput = document.getElementById('message');
  if (messageInput) messageInput.placeholder = placeholders[currentLang].message;

  // Set the flag UI state
  const flags = {
    en: '<img src="https://flagcdn.com/w20/gb.png" class="w-5 inline mr-1.5 align-middle" alt="EN"> EN',
    tr: '<img src="https://flagcdn.com/w20/tr.png" class="w-5 inline mr-1.5 align-middle" alt="TR"> TR'
  };
  const langCurrentEl = document.getElementById('langCurrent');
  if (langCurrentEl) {
    langCurrentEl.innerHTML = flags[currentLang] || currentLang.toUpperCase();
  }
  
  // Highlight active options
  const optEN = document.getElementById('langOptEN');
  const optTR = document.getElementById('langOptTR');
  if (optEN) optEN.classList.toggle('active', currentLang === 'en');
  if (optTR) optTR.classList.toggle('active', currentLang === 'tr');
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
  if (langMenuOpen) {
    langMenuOpen = false;
    document.getElementById('langMenu').classList.remove('open');
    document.getElementById('langChevron').classList.remove('rotated');
  }
});

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── Mobile menu ─── */
document.getElementById('menuBtn').addEventListener('click', () => {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('hidden');
  menu.classList.toggle('flex');
});
document.querySelectorAll('#mobileMenu a').forEach(a => {
  a.addEventListener('click', () => {
    const menu = document.getElementById('mobileMenu');
    menu.classList.add('hidden');
    menu.classList.remove('flex');
  });
});

/* ─── Scroll Reveal ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .skill-card, .project-card, .timeline-item').forEach(el => observer.observe(el));

/* ─── Form Button Validation ─── */
function checkFormValidity() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const btn = document.getElementById('submitBtn');
  const valid = name.length >= 5 && email.length >= 5 && message.length >= 5;
  btn.disabled = !valid;
  if (valid) {
    btn.classList.remove('opacity-40', 'cursor-not-allowed');
  } else {
    btn.classList.add('opacity-40', 'cursor-not-allowed');
  }
}
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', checkFormValidity);
});

/* ─── Contact Form → WhatsApp Redirect ─── */
function handleSubmit(e) {
  e.preventDefault();
  const userName = document.getElementById('name').value.trim();
  const userEmail = document.getElementById('email').value.trim();
  const userMessage = document.getElementById('message').value.trim();

  let text = `Merhaba, ben ${userName}.\nEmail: ${userEmail}`;
  if (userMessage) text += `\nMesaj: ${userMessage}`;

  window.open(`https://wa.me/905338346699?text=${encodeURIComponent(text)}`, '_blank');
}

/* ─── Smooth active nav highlight ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(l => {
    l.classList.remove('text-green-400');
    if (l.getAttribute('href') === '#' + current) l.classList.add('text-green-400');
  });
});
