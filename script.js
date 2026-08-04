document.addEventListener('DOMContentLoaded', () => {

  /* ---------- live sync clock ---------- */
  const syncEl = document.getElementById('sync-time');
  function updateClock(){
    if(!syncEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    syncEl.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---------- left nav: active state + smooth scroll ---------- */
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('is-active'));
      item.classList.add('is-active');
      const targetId = item.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if(target){
        target.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  });

  /* ---------- search filter across material cards ---------- */
  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.material-card');
  if(searchInput){
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      cards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const desc  = card.querySelector('p')?.textContent.toLowerCase() || '';
        const type  = card.dataset.type?.toLowerCase() || '';
        const matches = title.includes(query) || desc.includes(query) || type.includes(query);
        card.style.display = matches ? '' : 'none';
      });
    });
  }

  /* ---------- animated bar chart on scroll into view ---------- */
  const bars = document.querySelectorAll('.bar');
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => chartObserver.observe(bar));

  /* ---------- quick feedback for primary action button ---------- */
  const newMaterialBtn = document.getElementById('newMaterialBtn');
  if(newMaterialBtn){
    newMaterialBtn.addEventListener('click', () => {
      newMaterialBtn.textContent = 'Tersimpan ✓';
      setTimeout(() => { newMaterialBtn.textContent = '+ Materi Baru'; }, 1600);
    });
  }

  /* ---------- download button micro-interaction ---------- */
  document.querySelectorAll('.card-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = 'Mengunduh...';
      setTimeout(() => { btn.textContent = original; }, 1200);
    });
  });

});
