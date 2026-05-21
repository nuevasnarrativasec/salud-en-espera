/* ─────────────────────────────────────────────
   CONFIGURACIÓN
───────────────────────────────────────────── */
const CONFIG = {
    seekThrottle: 80,
    seekThreshold: 0.08,
    requiredBuffer: 3,
};

/* ─────────────────────────────────────────────
   VIDEO SOURCE: desktop vs móvil
───────────────────────────────────────────── */
(function () {
    const source = document.getElementById('videoSource');
    if (!source) return;
    const video = document.getElementById('scrollVideo');
    const isMobile = window.innerWidth < 768;
    const url = isMobile
        ? source.getAttribute('data-src-mobile')
        : source.getAttribute('data-src-desktop');
    if (url) {
        source.setAttribute('src', url);
        video.load(); // fuerza al browser a releer <source> y cargar el video correcto
    }
})();

/* ─────────────────────────────────────────────
   REFERENCIAS DOM
───────────────────────────────────────────── */
const video = document.getElementById('scrollVideo');
const container = document.getElementById('scrollContainer');
const progressBar = document.getElementById('progressBar');
const loading = document.getElementById('loading');
const loadingStat = document.getElementById('loadingStat');
const loadingDetails = document.getElementById('loadingDetails');
const loadingProgress = document.getElementById('loadingProgress');
const bgA = document.getElementById('loadingBgA');
const bgB = document.getElementById('loadingBgB');

/* ─────────────────────────────────────────────
   ESTADÍSTICAS DE SALUD
───────────────────────────────────────────── */
const healthStats = [
    {
        title: 'Primer nivel debilitado',
        text: '¿Cómo debería ser nuestro sistema de salud?',
        image: 'https://nuevasnarrativasec.github.io/salud-en-espera/img/bg-stats-1.gif',
        imageMobile: 'https://nuevasnarrativasec.github.io/salud-en-espera/img/bg-stats-1-movil.gif'
    },
    {
        title: 'Cobertura insuficiente',
        text: 'Se requieren más de 2,000 nuevos centros de promoción y vigilancia comunal; el 74% aún no se implementa',
        image: 'https://nuevasnarrativasec.github.io/salud-en-espera/img/bg-stats-2.gif',
        imageMobile: 'https://nuevasnarrativasec.github.io/salud-en-espera/img/bg-stats-2-movil.gif'
    },
    {
        title: 'Hospitales saturados',
        text: '92% de los hospitales presentan infraestructura inadecuada y un 34% está aún por implementarse',
        image: 'https://nuevasnarrativasec.github.io/salud-en-espera/img/bg-stats-3.gif',
        imageMobile: 'https://nuevasnarrativasec.github.io/salud-en-espera/img/bg-stats-3-movil.gif'
    },
    {
        title: 'Medicamentos esenciales faltantes',
        text: 'Desde antihipertensivos hasta oncológicos, el desabastecimiento es recurrente',
        image: 'https://nuevasnarrativasec.github.io/salud-en-espera/img/bg-stats-4.gif',
        imageMobile: 'https://nuevasnarrativasec.github.io/salud-en-espera/img/bg-stats-4-movil.gif'
    }
];

/* ─────────────────────────────────────────────
   ESTADO
───────────────────────────────────────────── */
let targetTime = 0;
let isSeeking = false;
let pendingSeek = null;
let lastSeekTime = 0;
let isReady = false;
let animRunning = false;
let rafId = null;
let lastScrollY = -1;
let currentStatIndex = 0;
let statRotationInterval;
let activeBg = 'A';
const MIN_LOADING_MS = 4000;
const loadingShownAt = Date.now();

/* ─────────────────────────────────────────────
   CACHÉ DE LAYOUT
   getBoundingClientRect() y offsetHeight fuerzan
   recálculo de layout. Se cachean aquí y se
   actualizan solo en resize, no en cada frame.
───────────────────────────────────────────── */
let cachedContainerTop = 0;
let cachedScrollableH = 1;

function cacheLayout() {
    cachedContainerTop = container.getBoundingClientRect().top + window.scrollY;
    cachedScrollableH = Math.max(1, container.offsetHeight - window.innerHeight);
}

/* ─────────────────────────────────────────────
   SEEK INTELIGENTE
───────────────────────────────────────────── */
function requestSeek(time) {
    const now = performance.now();
    pendingSeek = time;
    if (isSeeking) return;
    if (now - lastSeekTime < CONFIG.seekThrottle) return;
    const delta = Math.abs(video.currentTime - pendingSeek);
    if (delta < CONFIG.seekThreshold) { pendingSeek = null; return; }
    doSeek(pendingSeek);
}

function doSeek(time) {
    isSeeking = true;
    pendingSeek = null;
    lastSeekTime = performance.now();
    video.currentTime = Math.max(0, Math.min(video.duration || 0, time));
}

video.addEventListener('seeked', () => {
    isSeeking = false;
    if (pendingSeek !== null) {
        const delta = Math.abs(video.currentTime - pendingSeek);
        if (delta >= CONFIG.seekThreshold) doSeek(pendingSeek);
        else pendingSeek = null;
    }
});

/* ─────────────────────────────────────────────
   SCROLL → TIEMPO DE VIDEO
───────────────────────────────────────────── */
function getScrollProgress() {
    // Usa window.scrollY + valores cacheados: sin forzar layout en el hot path.
    const scrolled = window.scrollY - cachedContainerTop;
    return Math.max(0, Math.min(1, scrolled / cachedScrollableH));
}

function updateFromScroll() {
    const progress = getScrollProgress();
    progressBar.style.width = (progress * 100) + '%';
    if (video.duration) {
        targetTime = video.duration * progress;
        requestSeek(targetTime);
    }
}

/* ─────────────────────────────────────────────
   LOOP DE ANIMACIÓN (auto-suspendible)
   El loop se activa con el scroll y se detiene
   solo cuando no hay cambio de scroll ni seek
   pendiente, liberando el hilo principal.
───────────────────────────────────────────── */
function startAnimLoop() {
    if (rafId !== null) return; // ya hay un loop corriendo

    function loop() {
        if (!isReady) { rafId = requestAnimationFrame(loop); return; }

        const currentScrollY = window.scrollY;
        const scrollChanged = currentScrollY !== lastScrollY;
        const hasPending = pendingSeek !== null;

        if (scrollChanged || hasPending) {
            lastScrollY = currentScrollY;
            const progress = getScrollProgress();
            progressBar.style.width = (progress * 100) + '%';
            if (video.duration) {
                const t = video.duration * progress;
                if (Math.abs(t - (pendingSeek ?? video.currentTime)) > CONFIG.seekThreshold) {
                    requestSeek(t);
                }
            }
            rafId = requestAnimationFrame(loop);
        } else {
            // Sin actividad: el loop se suspende hasta el próximo scroll
            rafId = null;
            animRunning = false;
        }
    }

    animRunning = true;
    rafId = requestAnimationFrame(loop);
}

/* ─────────────────────────────────────────────
   CROSSFADE DE FONDO
───────────────────────────────────────────── */
function updateStatBackground(stat, immediate = false) {
    const isMobile = window.innerWidth < 768;
    const imgUrl = isMobile ? stat.imageMobile : stat.image;

    if (immediate) {
        bgA.style.backgroundImage = `url('${imgUrl}')`;
        bgA.style.opacity = '1';
        bgB.style.opacity = '0';
        activeBg = 'A';
        return;
    }

    const preload = new window.Image();
    preload.onload = () => {
        if (activeBg === 'A') {
            bgB.style.backgroundImage = `url('${imgUrl}')`;
            bgB.style.opacity = '1';
            setTimeout(() => { bgA.style.opacity = '0'; activeBg = 'B'; }, 500);
        } else {
            bgA.style.backgroundImage = `url('${imgUrl}')`;
            bgA.style.opacity = '1';
            setTimeout(() => { bgB.style.opacity = '0'; activeBg = 'A'; }, 500);
        }
    };
    preload.onerror = () => preload.onload();
    preload.src = imgUrl;
}

function rotateStats() {
    currentStatIndex = (currentStatIndex + 1) % healthStats.length;
    const stat = healthStats[currentStatIndex];
    loadingStat.style.opacity = '0';
    loadingStat.style.transform = 'translateY(12px)';
    updateStatBackground(stat);
    setTimeout(() => {
        loadingStat.innerHTML = `<strong>${stat.title}</strong>${stat.text}`;
        loadingStat.style.opacity = '1';
        loadingStat.style.transform = 'translateY(0)';
    }, 350);
}

/* ─────────────────────────────────────────────
   LOADING / BUFFER
───────────────────────────────────────────── */
function checkBuffer() {
    if (!video.duration) return;
    let buffered = 0;
    for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= 0.1) { buffered = video.buffered.end(i); break; }
    }
    const pct = Math.min(100, (buffered / CONFIG.requiredBuffer) * 100);
    loadingProgress.style.width = pct + '%';
    loadingDetails.textContent = `Buffering… ${buffered.toFixed(1)}s / ${CONFIG.requiredBuffer}s`;
    if (buffered >= CONFIG.requiredBuffer) showExperience();
    else setTimeout(checkBuffer, 300);
}

function showExperience() {
    const elapsed = Date.now() - loadingShownAt;
    const delay = Math.max(0, MIN_LOADING_MS - elapsed);
    setTimeout(() => {
        isReady = true;
        clearInterval(statRotationInterval);
        loading.classList.add('hidden');
        updateFromScroll();
    }, delay);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
video.addEventListener('loadedmetadata', () => {
    console.log(`✅ Metadata cargada | Duración: ${video.duration.toFixed(2)}s`);
    loadingDetails.textContent = 'Descargando buffer inicial…';
    cacheLayout(); // medidas estables una vez que el layout está completo
    video.currentTime = 0;
    checkBuffer();
    startAnimLoop();
});

updateStatBackground(healthStats[0], true);
statRotationInterval = setInterval(rotateStats, 6000);

if (video.readyState >= 1) video.dispatchEvent(new Event('loadedmetadata'));

/* ─────────────────────────────────────────────
   EVENTOS — video scroll
───────────────────────────────────────────── */
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            if (isReady) {
                updateFromScroll();
                startAnimLoop(); // reactiva el loop si estaba suspendido
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

window.addEventListener('resize', () => {
    cacheLayout(); // recalcula medidas del contenedor al cambiar el viewport
    if (isReady) updateFromScroll();
});
