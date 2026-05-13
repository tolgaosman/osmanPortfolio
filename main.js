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
  document.getElementById('langCurrent').textContent = lang.toUpperCase();

  // Highlight active option
  document.getElementById('langOptEN').classList.toggle('active', lang === 'en');
  document.getElementById('langOptTR').classList.toggle('active', lang === 'tr');

  // Reset typing effect
  pi = 0; ci = 0; deleting = false;

  // Translate all elements with data-en / data-tr
  document.querySelectorAll('[data-en][data-tr]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text && (text.includes('<') || text.includes('&'))) {
      el.innerHTML = text;
    } else if (text) {
      el.textContent = text;
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-placeholder-en][data-placeholder-tr]').forEach(el => {
    const text = el.getAttribute('data-placeholder-' + lang);
    if (text) {
      el.placeholder = text;
    }
  });
}

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
  const phone = document.getElementById('phone').value.trim();
  const btn = document.getElementById('submitBtn');
  const valid = name.length >= 5 && email.length >= 5 && phone.length >= 5;
  btn.disabled = !valid;
  if (valid) {
    btn.classList.remove('opacity-40', 'cursor-not-allowed');
  } else {
    btn.classList.add('opacity-40', 'cursor-not-allowed');
  }
}
['name', 'email', 'phone'].forEach(id => {
  document.getElementById(id).addEventListener('input', checkFormValidity);
});

/* ─── Contact Form (WhatsApp) ─── */
function handleSubmit(e) {
  e.preventDefault();

  const userName = document.getElementById('name').value.trim();
  const userEmail = document.getElementById('email').value.trim();
  const countryCode = document.getElementById('countryCode').value;
  const userPhone = document.getElementById('phone').value.trim();

  // Create the message content
  const message = `Merhaba, ben ${userName}.\nEmail: ${userEmail}\nTelefon: ${countryCode} ${userPhone}`;
  const encodedMessage = encodeURIComponent(message);

  // Target WhatsApp Number (Tolga Osman Falay)
  const targetNumber = '905338346699';
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMessage}`;

  // Redirect to WhatsApp
  window.open(whatsappUrl, '_blank');
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
