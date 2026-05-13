/* ─── EmailJS Init ─── */
// IMPORTANT: Replace these with your real EmailJS credentials from emailjs.com
// Service ID: create a service connected to tofbusiness2002@gmail.com
// Template ID: create a template with {{from_name}}, {{reply_to}}, {{message}} variables
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

(function () { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); })();

/* ─── Typing Effect ─── */
const phrasesEN = [
  'Software Engineer.',
  'Front-End Developer.',
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

/* ─── Contact Form (EmailJS) ─── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  successEl.classList.add('hidden');
  errorEl.classList.add('hidden');

  const userName = document.getElementById('name').value;
  const userMessage = document.getElementById('message').value;
  const formattedMessage = `Name/İsim: ${userName}\n\nMessage/Mesaj:\n${userMessage}`;

  const templateParams = {
    from_name: userName,
    reply_to: document.getElementById('email').value,
    message: formattedMessage,
    to_email: 'tofbusiness2002@gmail.com'
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      document.getElementById('contactForm').reset();
      successEl.classList.remove('hidden');
      setTimeout(() => successEl.classList.add('hidden'), 6000);
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      errorEl.classList.remove('hidden');
      setTimeout(() => errorEl.classList.add('hidden'), 6000);
    });
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
