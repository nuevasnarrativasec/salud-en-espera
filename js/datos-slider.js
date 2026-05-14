(function () {
    const slides = Array.from(document.querySelectorAll('.ds-slide'));
    const prevBtn = document.querySelector('.ds-prev');
    const nextBtn = document.querySelector('.ds-next');
    const vp = document.querySelector('.ds-viewport');
    const dotsEl = document.querySelector('.ds-dots');
    if (!slides.length) return;

    let cur = 0;

    /* ── Bullets ─────────────────────────────────────── */
    const dots = slides.map((_, i) => {
        const b = document.createElement('button');
        b.className = 'ds-dot' + (i === 0 ? ' is-active' : '');
        b.setAttribute('aria-label', 'Slide ' + (i + 1));
        b.addEventListener('click', () => go(i));
        dotsEl.appendChild(b);
        return b;
    });

    function updateDots() {
        dots.forEach((d, i) => d.classList.toggle('is-active', i === cur));
    }

    function updateNav() {
        prevBtn.style.visibility = cur === 0 ? 'hidden' : '';
        nextBtn.style.visibility = cur === slides.length - 1 ? 'hidden' : '';
    }

    function go(n) {
        n = Math.max(0, Math.min(n, slides.length - 1));
        if (n === cur) return;
        slides[cur].classList.remove('is-active');
        cur = n;
        slides[cur].classList.add('is-active');
        updateNav();
        updateDots();
    }

    prevBtn.addEventListener('click', () => go(cur - 1));
    nextBtn.addEventListener('click', () => go(cur + 1));

    let tx = 0;
    vp.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    vp.addEventListener('touchend', e => {
        const diff = tx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) go(diff > 0 ? cur + 1 : cur - 1);
    }, { passive: true });

    updateNav();
})();
