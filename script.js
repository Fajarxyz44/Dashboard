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

  /* ---------------- Checkout modal -> WhatsApp ---------------- */
  const WA_NUMBER = '6281234567890'; // ganti dengan nomor WhatsApp bisnis kamu (format 62xxxxxxxxxx)

  const overlay = document.getElementById('checkoutOverlay');
  const closeBtn = document.getElementById('checkoutClose');
  const titleEl = document.getElementById('checkoutTitle');
  const unitPriceEl = document.getElementById('checkoutUnitPrice');
  const totalEl = document.getElementById('checkoutTotal');
  const qtyValueEl = document.getElementById('qtyValue');
  const qtyMinusBtn = document.getElementById('qtyMinus');
  const qtyPlusBtn = document.getElementById('qtyPlus');
  const nameInput = document.getElementById('checkoutName');
  const noteInput = document.getElementById('checkoutNote');
  const waBtn = document.getElementById('checkoutWaBtn');

  let currentProduct = null;
  let qty = 1;

  const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

  const renderCheckout = () => {
    if (!currentProduct) return;
    qtyValueEl.textContent = qty;
    totalEl.textContent = formatRupiah(currentProduct.price * qty);
  };

  const openCheckout = (card) => {
    currentProduct = {
      name: card.dataset.name,
      price: parseInt(card.dataset.price, 10) || 0
    };
    qty = 1;
    titleEl.textContent = currentProduct.name;
    unitPriceEl.textContent = formatRupiah(currentProduct.price);
    nameInput.value = '';
    noteInput.value = '';
    renderCheckout();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameInput.focus(), 200);
  };

  const closeCheckout = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      if (card) openCheckout(card);
    });
  });

  closeBtn.addEventListener('click', closeCheckout);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCheckout();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeCheckout();
  });

  qtyMinusBtn.addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    renderCheckout();
  });
  qtyPlusBtn.addEventListener('click', () => {
    qty += 1;
    renderCheckout();
  });

  waBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    if (!nameInput.value.trim()) {
      nameInput.focus();
      return;
    }

    const total = currentProduct.price * qty;
    const lines = [
      `Halo, saya ingin memesan produk berikut:`,
      ``,
      `Produk: ${currentProduct.name}`,
      `Jumlah: ${qty}`,
      `Subtotal: ${formatRupiah(total)}`,
      `Nama: ${nameInput.value.trim()}`
    ];
    if (noteInput.value.trim()) {
      lines.push(`Catatan: ${noteInput.value.trim()}`);
    }

    const message = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${message}`;
    window.open(waUrl, '_blank');
    closeCheckout();
  });

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
