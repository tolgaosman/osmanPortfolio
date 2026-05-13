/* ─── Typing Effect ─── */
const phrases = [
  'Software Engineer.',
  'Front-End Developer.',
  'Problem Solver.',
  'Open to Opportunities.'
];
let pi = 0, ci = 0, deleting = false;
const el = document.getElementById('typed');

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    el.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    el.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 55 : 90);
}
type();

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── Mobile menu ─── */
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('hidden');
});
document.querySelectorAll('#mobileMenu a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobileMenu').classList.add('hidden'));
});

/* ─── Scroll Reveal ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .skill-card, .project-card, .timeline-item').forEach(el => observer.observe(el));

/* ─── Contact Form ─── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    document.getElementById('contactForm').reset();
    document.getElementById('formSuccess').classList.remove('hidden');
    setTimeout(() => document.getElementById('formSuccess').classList.add('hidden'), 5000);
  }, 1500);
}

/* ─── Smooth active nav highlight ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(l => {
    l.classList.remove('text-blue-400');
    if (l.getAttribute('href') === '#' + current) l.classList.add('text-blue-400');
  });
});
