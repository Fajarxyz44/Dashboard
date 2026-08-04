document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById('navToggle');
  const panelLeft = document.getElementById('panelLeft');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    panelLeft.classList.toggle('open');
  });

  // close mobile panel after tapping a nav link
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      panelLeft.classList.remove('open');
    });
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('.panel-right .section');
  const navLinks = document.querySelectorAll('[data-nav]');

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------------- Animated stat counters ---------------- */
  const statValues = document.querySelectorAll('.stat-value');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target).toLocaleString('id-ID');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statValues.forEach(el => statObserver.observe(el));

  /* ---------------- Animated sales bar chart ---------------- */
  const bars = document.querySelectorAll('.bar');

  const chartObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.height = `${bar.dataset.height}%`;
          }, i * 90);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const chartCard = document.querySelector('.chart-card');
  if (chartCard) chartObserver.observe(chartCard);

  /* ---------------- CTA form ---------------- */
  const ctaForm = document.getElementById('ctaForm');
  const formSuccess = document.getElementById('formSuccess');

  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.classList.add('show');
      ctaForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    });
  }

});
