/* =========================
   skills-interaction.js
   (Module séparé pour interactions avancées sur les compétences)
   ========================= */

// Ce module est optionnel si vous souhaitez ajouter des interactions plus poussées (ex : modale, focus clavier, etc.)
// Ici, on complète le module principal si besoin.

// Exemple : focus clavier sur les badges de compétences
(function() {
  const skillBadges = document.querySelectorAll('.skill-badge');
  skillBadges.forEach(badge => {
    badge.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        badge.focus();
        const tooltip = badge.querySelector('.skill-tooltip');
        if (tooltip) {
          tooltip.style.opacity = tooltip.style.opacity === '1' ? '0' : '1';
          tooltip.style.pointerEvents = tooltip.style.opacity === '1' ? 'auto' : 'none';
        }
      }
      if (e.key === 'Escape') {
        const tooltip = badge.querySelector('.skill-tooltip');
        if (tooltip) {
          tooltip.style.opacity = '0';
          tooltip.style.pointerEvents = 'none';
        }
      }
    });
  });
})();
