// Main site interactivity
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const glow = document.getElementById('cursorGlow');
  if (glow) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  const typewriter = document.getElementById('typewriter');
  if (typewriter) {
    const phrases = ['Frontend Developer', 'UI/UX Designer', 'Creative Problem Solver'];
    let phraseIndex = 0, charIndex = 0, deleting = false;
    function type() {
      const current = phrases[phraseIndex];
      typewriter.textContent = current.substring(0, charIndex);
      if (!deleting && charIndex < current.length) {
        charIndex++;
        setTimeout(type, 80);
      } else if (deleting && charIndex > 0) {
        charIndex--;
        setTimeout(type, 40);
      } else {
        deleting = !deleting;
        if (!deleting) phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, deleting ? 1500 : 400);
      }
    }
    type();
  }

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = +el.getAttribute('data-count');
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current;
    }, 20);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  const renderProjects = (container, list) => {
    if (!container) return;
    container.innerHTML = list.map(p => `
      <div class="project-card" data-category="${p.category}">
        <div class="project-thumb" style="background: ${p.gradient}">${p.icon}</div>
        <div class="project-body">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');
  };

  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) renderProjects(featuredGrid, projects.slice(0, 3));

  const projectsGrid = document.getElementById('projectsGrid');
  if (projectsGrid) {
    renderProjects(projectsGrid, projects);
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        const cards = projectsGrid.querySelectorAll('.project-card');
        cards.forEach(card => {
          const show = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      const setError = (input, errorEl, msg) => {
        const err = document.getElementById(errorEl);
        if (msg) { input.classList.add('error'); err.textContent = msg; valid = false; }
        else { input.classList.remove('error'); err.textContent = ''; }
      };

      setError(name, 'nameError', name.value.trim() ? '' : 'Please enter your name.');
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      setError(email, 'emailError', email.value.trim() ? (emailValid ? '' : 'Please enter a valid email.') : 'Please enter your email.');
      setError(message, 'messageError', message.value.trim() ? '' : 'Please enter a message.');

      if (valid) {
        const btn = document.getElementById('submitBtn');
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.disabled = false;
          form.reset();
          document.getElementById('formSuccess').classList.add('show');
          setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 4000);
        }, 1200);
      }
    });
  }
});