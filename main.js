/* ─── Typing Effect ─── */
const phrasesEN = [
  'Software Engineer.',
  'Web Developer.',
  'Problem Solver.',
  'Open to Opportunities.'
];
const phrasesTR = [
  'Yazılım Mühendisi.',
  'Front-End Geliştiricisi.',
  'Problem Çözücü.',
  'Fırsatlara Açık.'
];
let pi = 0, ci = 0, deleting = false;
const el = document.getElementById('typed');
let currentLang = 'en';

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
  currentLang = lang;
  langMenuOpen = false;
  document.getElementById('langMenu').classList.remove('open');
  document.getElementById('langChevron').classList.remove('rotated');

  // Update button label
  const flags = {
    en: '<img src="https://flagcdn.com/w20/gb.png" class="w-5 inline mr-1.5 align-middle" alt="EN"> EN',
    tr: '<img src="https://flagcdn.com/w20/tr.png" class="w-5 inline mr-1.5 align-middle" alt="TR"> TR'
  };
  document.getElementById('langCurrent').innerHTML = flags[lang] || lang.toUpperCase();

  // Highlight active option
  document.getElementById('langOptEN').classList.toggle('active', lang === 'en');
  document.getElementById('langOptTR').classList.toggle('active', lang === 'tr');

  // Save to localStorage
  localStorage.setItem('preferredLang', lang);

  // Translate custom bypassed elements
  document.querySelectorAll('.custom-translate').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text) el.textContent = text;
  });

  // Reset typing effect
  pi = 0; ci = 0; deleting = false;

  // Trigger Google Translate
  const triggerGoogleTranslate = () => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  };

  triggerGoogleTranslate();
  // Fallback retry in case Google Translate element is not fully loaded yet
  setTimeout(triggerGoogleTranslate, 200);
  setTimeout(triggerGoogleTranslate, 500);
  setTimeout(triggerGoogleTranslate, 1000);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// On page load, read from localStorage or googtrans cookie to set correct initial language UI
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
    setLang(savedLang);
  }
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
