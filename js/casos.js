(function () {
    const track = document.getElementById('casosTrack');
    const section = document.getElementById('casosSection');
    if (!track || !section) return;

    /* ── SLIDER ───────────────────────────────────────── */
    const cards = Array.from(track.querySelectorAll('.caso-card'));
    const prevBtn = section.querySelector('.casos-prev');
    const nextBtn = section.querySelector('.casos-next');
    const dotsWrap = document.getElementById('casosDots');
    let cur = 0;

    /* ── DOTS ─────────────────────────────────────────── */
    const dots = cards.map((_, i) => {
        const d = document.createElement('button');
        d.className = 'casos-dot' + (i === 0 ? ' is-active' : '');
        d.setAttribute('aria-label', `Caso ${i + 1}`);
        d.addEventListener('click', () => go(i));
        dotsWrap.appendChild(d);
        return d;
    });

    function updateDots() {
        dots.forEach((d, i) => d.classList.toggle('is-active', i === cur));
    }

    function updateNav() {
        if (prevBtn) prevBtn.style.visibility = cur === 0 ? 'hidden' : '';
        if (nextBtn) nextBtn.style.visibility = cur === cards.length - 1 ? 'hidden' : '';
        updateDots();
    }

    function go(n) {
        n = Math.max(0, Math.min(n, cards.length - 1));
        if (n === cur) return;
        const leaving = cards[cur];
        const audio = leaving.querySelector('.caso-audio-el');
        if (audio && !audio.paused) audio.pause();
        leaving.classList.remove('is-active');
        cur = n;
        cards[cur].classList.add('is-active');
        updateNav();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => go(cur - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(cur + 1));

    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = tx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) go(diff > 0 ? cur + 1 : cur - 1);
    }, { passive: true });

    updateNav();

    /* ── HELPERS ──────────────────────────────────────── */
    function fmt(s) {
        if (!isFinite(s) || isNaN(s)) return '–:––';
        return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    }

    function setPlaying(card, playing) {
        const pi = card.querySelector('.icon-play');
        const pa = card.querySelector('.icon-pause');
        if (pi) pi.hidden = playing;
        if (pa) pa.hidden = !playing;
    }

    function pauseOthers(except) {
        track.querySelectorAll('.caso-audio-el').forEach(a => {
            if (a !== except && !a.paused) {
                a.pause();
                setPlaying(a.closest('.caso-card'), false);
            }
        });
    }

    /* ── INIT AUDIO CARDS ─────────────────────────────── */
    track.querySelectorAll('.caso-card').forEach(card => {
        const toggleBtn = card.querySelector('.js-audio-toggle');
        const audioWrap = card.querySelector('.caso-audio-wrap');
        const audio = card.querySelector('.caso-audio-el');
        const playBtn = card.querySelector('.js-ap-play');
        const rangeEl = card.querySelector('.js-ap-range');
        const closeBtn = card.querySelector('.js-ap-close');
        const currEl = card.querySelector('.js-ap-current');
        const durEl = card.querySelector('.js-ap-duration');

        if (!toggleBtn || !audio) return;

        toggleBtn.addEventListener('click', () => {
            audioWrap.hidden = false;
            toggleBtn.hidden = true;
            audio.load();
        });

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                pauseOthers(audio);
                audio.play().catch(() => { });
            } else {
                audio.pause();
            }
        });

        closeBtn.addEventListener('click', () => {
            audio.pause();
            audio.currentTime = 0;
            rangeEl.value = 0;
            if (currEl) currEl.textContent = '0:00';
            audioWrap.hidden = true;
            toggleBtn.hidden = false;
            setPlaying(card, false);
        });

        audio.addEventListener('play', () => setPlaying(card, true));
        audio.addEventListener('pause', () => setPlaying(card, false));
        audio.addEventListener('ended', () => {
            setPlaying(card, false);
            rangeEl.value = 0;
            if (currEl) currEl.textContent = '0:00';
        });

        audio.addEventListener('loadedmetadata', () => {
            if (durEl) durEl.textContent = fmt(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            rangeEl.value = (audio.currentTime / audio.duration) * 100;
            if (currEl) currEl.textContent = fmt(audio.currentTime);
        });

        rangeEl.addEventListener('input', () => {
            if (audio.duration) audio.currentTime = (rangeEl.value / 100) * audio.duration;
        });
    });

    /* ── PAUSE AL SALIR DEL VIEWPORT ──────────────────── */
    new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) {
            track.querySelectorAll('.caso-audio-el').forEach(a => {
                if (!a.paused) {
                    a.pause();
                    setPlaying(a.closest('.caso-card'), false);
                }
            });
        }
    }, { threshold: 0 }).observe(section);

})();
