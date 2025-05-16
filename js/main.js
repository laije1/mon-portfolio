/* =========================
   main.js
   Interactivité et animations du portfolio
   ========================= */

// Module Navigation fluide et menu responsive
const NavigationModule = (() => {
  const navLinks = document.querySelectorAll('.nav-anchored ul li a');
  const sections = Array.from(document.querySelectorAll('header, section'));
  const nav = document.getElementById('main-nav');
  let lastActive = navLinks[0];

  // Défilement doux
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Fermer le menu mobile si ouvert
        if (window.innerWidth < 769) nav.classList.remove('menu-open');
      }
    });
  });

  // Mise à jour du lien actif au scroll
  const updateActiveLink = () => {
    let scrollPos = window.scrollY + 120;
    let found = false;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section.offsetTop <= scrollPos) {
        navLinks.forEach(l => l.classList.remove('active'));
        const id = section.getAttribute('id') || 'hero';
        const active = Array.from(navLinks).find(l => l.getAttribute('href') === `#${id}`);
        if (active) active.classList.add('active');
        found = true;
        break;
      }
    }
    if (!found) navLinks[0].classList.add('active');
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  document.addEventListener('DOMContentLoaded', updateActiveLink);

  // Menu hamburger responsive
  const hamburgerBtn = document.createElement('button');
  hamburgerBtn.className = 'hamburger-menu';
  hamburgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
  hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  nav.appendChild(hamburgerBtn);
  hamburgerBtn.addEventListener('click', () => {
    nav.classList.toggle('menu-open');
  });
  // Fermer menu au clic sur un lien
  navLinks.forEach(link => link.addEventListener('click', () => nav.classList.remove('menu-open')));
})();

// Module Animations au scroll (Intersection Observer)
const ScrollRevealModule = (() => {
  const revealEls = document.querySelectorAll('.centered-section, .about-photo, .skills-category, .certif-card, .contact-form');
  const options = { threshold: 0.15 };
  const reveal = (el, anim) => {
    el.classList.add('reveal-on-scroll', anim);
  };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, options);
  revealEls.forEach(el => {
    let anim = 'fade';
    if (el.classList.contains('about-photo')) anim = 'slide-left';
    if (el.classList.contains('skills-category')) anim = 'scale';
    if (el.classList.contains('certif-card')) anim = 'slide-up';
    if (el.classList.contains('contact-form')) anim = 'fade';
    reveal(el, anim);
    observer.observe(el);
  });
})();

// Module Tooltips Compétences
const SkillsTooltipModule = (() => {
  const skillBadges = document.querySelectorAll('.skill-badge');
  // Détail Excel
  const excelDetails = `Tableaux croisés dynamiques\nFormules avancées\nMacros VBA\nPower Query\nAutomatisation\nReporting interactif`;
  skillBadges.forEach(badge => {
    const tooltip = badge.querySelector('.skill-tooltip');
    // Pour Excel, injecter la liste détaillée
    if (badge.dataset.skill && badge.dataset.skill.toLowerCase().includes('excel')) {
      tooltip.innerHTML = excelDetails.replace(/\n/g, '<br>');
    }
    // Affichage/dissimulation du tooltip (hover/click/touch)
    let hideTimeout;
    const showTooltip = () => {
      clearTimeout(hideTimeout);
      tooltip.style.opacity = '1';
      tooltip.style.pointerEvents = 'auto';
    };
    const hideTooltip = () => {
      hideTimeout = setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
      }, 200);
    };
    badge.addEventListener('mouseenter', showTooltip);
    badge.addEventListener('mouseleave', hideTooltip);
    badge.addEventListener('focus', showTooltip);
    badge.addEventListener('blur', hideTooltip);
    // Mobile/tactile : toggle au clic
    badge.addEventListener('touchstart', e => {
      e.stopPropagation();
      if (tooltip.style.opacity === '1') hideTooltip();
      else showTooltip();
    });
    // Fermer tooltip si clic ailleurs
    document.addEventListener('touchstart', e => {
      if (!badge.contains(e.target)) hideTooltip();
    });
  });
})();

// Module Validation Formulaire de contact
const ContactFormModule = (() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  let submitting = false;
  const showError = (input, msg) => {
    input.classList.add('error');
    input.setCustomValidity(msg);
    input.reportValidity();
  };
  const clearError = input => {
    input.classList.remove('error');
    input.setCustomValidity('');
  };
  form.addEventListener('input', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      clearError(e.target);
    }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (submitting) return;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;
    if (!name) { showError(form.name, 'Veuillez entrer votre nom.'); valid = false; }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showError(form.email, 'Veuillez entrer un email valide.'); valid = false;
    }
    if (!message) { showError(form.message, 'Veuillez entrer un message.'); valid = false; }
    if (!valid) return;
    submitting = true;
    form.classList.add('submitting');
    // Animation de confirmation
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Envoi...';
    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Envoyé !';
      form.classList.remove('submitting');
      submitting = false;
      setTimeout(() => { btn.innerHTML = btnText; }, 1800);
    }, 1200);
  });
})();

// Module Thème sombre/clair
const ThemeToggleModule = (() => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
    btn.querySelector('i').classList.toggle('fa-moon');
    btn.querySelector('i').classList.toggle('fa-sun');
  });
})();

// Optimisation scroll (debounce)
function debounce(fn, wait = 16) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}
