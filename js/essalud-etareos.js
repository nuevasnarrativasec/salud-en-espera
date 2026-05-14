/* ────────────────────────────────────────────
   DATA
──────────────────────────────────────────── */
const ES_GROUPS = [
    { label: 'Neonatos', sub: '0 – 28 días', count: 591881, color: '#4DBAEC', type: 'baby', n: 2 },
    { label: 'Lactantes', sub: '1 mes – 1 año', count: 564544, color: '#EC9B4D', type: 'toddler', n: 2 },
    { label: 'Niños', sub: '1 – 14 años', count: 1750462, color: '#4DCC8A', type: 'child', n: 7 },
    { label: 'Adolescentes', sub: '15 – 17 años', count: 2340243, color: '#EC4DAB', type: 'teen', n: 10 },
    { label: 'Jóvenes', sub: '18 – 29 años', count: 2046670, color: '#9C4DEC', type: 'youth', n: 9 },
    { label: 'Adultos', sub: '30 – 59 años', count: 3586559, color: '#E8C24D', type: 'adult', n: 15 },
    { label: 'Ad. Mayores', sub: '60 – 79 años', count: 6910392, color: '#4D7EEC', type: 'adult-m', n: 28 },
    { label: 'Mayores', sub: '80+ años', count: 2893504, color: '#EC5858', type: 'elderly', n: 12 },
];

/* ────────────────────────────────────────────
   FIGURE IMAGE SETS  (alternated by fig index)
   srcs  → array de imágenes que se alternan
   w / h → tamaño visual del <img>; si se omite
           usa ES_DIM (que controla el layout)
──────────────────────────────────────────── */
const ES_IMGS = {
    baby: { srcs: ['./img/bg-neonato-1.png?v2', './img/bg-neonato-2.png?v2'], w: 36, h: 22 },
    toddler: { srcs: ['./img/bg-lactante-1.png', './img/bg-lactante-2.png'], w: 24, h: 27 },
    child: { srcs: ['./img/bg-nino-1.png', './img/bg-nino-2.png'], w: 17, h: 38 },
    teen: { srcs: ['./img/bg-adolescente-1.png', './img/bg-adolescente-2.png'] },
    youth: { srcs: ['./img/bg-joven-1.png', './img/bg-joven-2.png'] },
    adult: { srcs: ['./img/bg-adulto-1.png', './img/bg-adulto-2.png'] },
    'adult-m': { srcs: ['./img/bg-adulto-mayor-1.png', './img/bg-adulto-mayor-2.png', './img/bg-adulto-mayor-3.png'] },
    elderly: { srcs: ['./img/bg-mayores-1.png', './img/bg-mayores-2.png', './img/bg-mayores-3.png', './img/bg-mayores-4.png'] },
};

const ES_DIM = {
    baby: { w: 36, h: 28 },
    toddler: { w: 24, h: 27 },
    child: { w: 17, h: 38 },
    teen: { w: 15, h: 44 },
    youth: { w: 15, h: 44 },
    adult: { w: 15, h: 44 },
    'adult-m': { w: 15, h: 44 },
    elderly: { w: 18, h: 40 },
};

/* ────────────────────────────────────────────
   BUILD FIGURE DATA
──────────────────────────────────────────── */
const esFigures = [];
ES_GROUPS.forEach(g => {
    g.figs = [];
    for (let fi = 0; fi < g.n; fi++) {
        const fig = { fi, g, bx: 0, by: 0, ex: 0, ey: 0, el: null };
        g.figs.push(fig);
        esFigures.push(fig);
    }
});
const ES_TOTAL = esFigures.length; // 85

/* ────────────────────────────────────────────
   PROVIDER DATA (total-atenciones.xlsx)
──────────────────────────────────────────── */
const ES_ALL_TOTAL = 20684255; // EsSalud + SIS + FFAA + Privados

const ES_PROVIDERS = {
    total: {
        label: 'Total', total: 20684255,
        counts: [591881, 564544, 1750462, 2340243, 2046670, 3586559, 6910392, 2893504]
    },
    essalud: {
        label: 'EsSalud', total: 853028,
        counts: [40364, 68342, 122313, 61567, 51477, 66108, 260379, 182478]
    },
    sis: {
        label: 'SIS', total: 19701544,
        counts: [544705, 482524, 1603617, 2271898, 1989636, 3498794, 6617923, 2692447]
    },
    ffaa: {
        label: 'FF.AA.', total: 62899,
        counts: [736, 1538, 3485, 4381, 3184, 16923, 20551, 12101]
    },
    privados: {
        label: 'Privados', total: 66784,
        counts: [6076, 12140, 21047, 2397, 2373, 4734, 11539, 6478]
    }
};

function computeNValues(counts) {
    const total = counts.reduce((a, b) => a + b, 0);
    const floored = counts.map(c => Math.floor(c / total * ES_TOTAL));
    let rem = ES_TOTAL - floored.reduce((a, b) => a + b, 0);
    const order = counts
        .map((c, i) => ({ i, frac: (c / total * ES_TOTAL) - floored[i] }))
        .sort((a, b) => b.frac - a.frac);
    for (let k = 0; k < rem; k++) floored[order[k].i]++;
    return floored;
}

function esRoundFig(n) {
    if (n < 1000) return Math.round(n / 10) * 10;
    if (n < 10000) return Math.round(n / 100) * 100;
    return Math.round(n / 1000) * 1000;
}

/* ────────────────────────────────────────────
   CREATE DOM ELEMENTS
──────────────────────────────────────────── */
const esStage = document.getElementById('esStage');

esFigures.forEach(fig => {
    const d = document.createElement('div');
    d.className = 'p-fig';
    const cfg = ES_IMGS[fig.g.type];
    const dim = ES_DIM[fig.g.type];
    const src = cfg.srcs[fig.fi % cfg.srcs.length];
    const imgW = cfg.w ?? dim.w;
    const imgH = cfg.h ?? dim.h;
    d.innerHTML = `<img src="${src}" width="${imgW}" height="${imgH}" alt="" draggable="false">`;
    esStage.appendChild(d);
    fig.el = d;
});

// Group labels
const esLblEls = ES_GROUPS.map(g => {
    const d = document.createElement('div');
    d.className = 'g-lbl';
    d.innerHTML = `
    <span class="g-lbl-name" style="color:${g.color}">${g.label}</span>
    <span class="g-lbl-sub">${g.sub}</span>
    <span class="g-lbl-count">${g.count.toLocaleString('es-PE')}</span>`;
    esStage.appendChild(d);
    return d;
});

// Tracker dots
const esTrackDots = ES_GROUPS.map(g => {
    const dot = document.createElement('div');
    dot.className = 'track-dot';
    dot.style.background = g.color;
    document.getElementById('esGroupTrack').appendChild(dot);
    return dot;
});

/* ────────────────────────────────────────────
   ATENCIONES BARS
──────────────────────────────────────────── */
(function buildEsBars() {
    const colors = ES_GROUPS.map(g => g.color);
    const cont = document.getElementById('esAtBars');
    if (!cont) return;
    const rows = 58;

    function sr(seed) {
        const x = Math.sin(seed * 9301 + 49297) * 233280;
        return x - Math.floor(x);
    }

    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div');
        row.className = 'at-row';
        const n = 2 + Math.floor(sr(r * 7 + 3) * 3);
        const weights = Array.from({ length: n }, (_, s) => 0.15 + sr(r * 31 + s * 17));
        const sum = weights.reduce((a, b) => a + b, 0);
        const gapPct = (n - 1) * 0.8;

        weights.forEach((w, s) => {
            const seg = document.createElement('div');
            seg.className = 'at-seg';
            seg.style.flex = `0 0 ${((w / sum) * (95 - gapPct)).toFixed(1)}%`;
            seg.style.background = colors[Math.floor(sr(r * 53 + s * 29 + 7) * colors.length)];
            row.appendChild(seg);
        });

        cont.appendChild(row);
    }
})();

/* ────────────────────────────────────────────
   MATH HELPERS
──────────────────────────────────────────── */
const esLerp = (a, b, t) => a + (b - a) * t;
const esClamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const esEio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ────────────────────────────────────────────
   POSITION COMPUTATION
──────────────────────────────────────────── */
let esPosOK = false;

function esComputePositions() {
    const r = esStage.getBoundingClientRect();
    const W = r.width, H = r.height;
    if (W < 50 || H < 50) return false;

    // Blob: golden-angle spiral
    const bCX = W * 0.50;
    const bCY = H * 0.50;
    const bR = Math.min(W * 0.21, H * 0.33);

    esFigures.forEach((fig, i) => {
        const angle = i * 2.399963;
        const rr = bR * Math.sqrt((i + 0.5) / ES_TOTAL);
        const d = ES_DIM[fig.g.type];
        fig.bx = bCX + rr * Math.cos(angle) - d.w / 2;
        fig.by = bCY + rr * Math.sin(angle) - d.h / 2;
    });

    // Columns
    const colW = W / ES_GROUPS.length;
    ES_GROUPS.forEach((g, gi) => {
        const d = ES_DIM[g.type];
        const perRow = g.n <= 3 ? 1 : g.n <= 8 ? 2 : g.n <= 18 ? 3 : 4;
        const rows = Math.ceil(g.n / perRow);
        const gH = 4, gW = 3;
        const blockH = rows * (d.h + gH) - gH;
        const blockW = perRow * (d.w + gW) - gW;
        const colCX = (gi + 0.5) * colW;
        const sx = colCX - blockW / 2;
        const sy = (H - blockH) * 0.42;

        esLblEls[gi].style.transform = `translate(${colCX}px, ${sy + blockH + 7}px) translateX(-50%)`;

        g.figs.forEach((fig, fi) => {
            const col = fi % perRow;
            const row = Math.floor(fi / perRow);
            fig.ex = sx + col * (d.w + gW);
            fig.ey = sy + row * (d.h + gH);
        });
    });

    return true;
}

/* ────────────────────────────────────────────
   SCROLL PROGRESS (scoped to esSection)
──────────────────────────────────────────── */
function esGetProgress() {
    const sec = document.getElementById('esSection');
    const top = -sec.getBoundingClientRect().top;
    return esClamp(top / (sec.offsetHeight - window.innerHeight), 0, 1);
}

/* ────────────────────────────────────────────
   ANIMATION UPDATE
──────────────────────────────────────────── */
const ES_SPREAD_END = 0.44;
const ES_COLOR_START = 0.40;
const ES_LABEL_SHOW = 0.66;
const ES_FILTER_SHOW = 0.88;

function esUpdate() {
    if (!esPosOK) return;
    const p = esGetProgress();

    const spreadP = esEio(esClamp(p / ES_SPREAD_END, 0, 1));
    const colorP = esClamp((p - ES_COLOR_START) / (1 - ES_COLOR_START), 0, 1);
    const labelP = esClamp((p - ES_LABEL_SHOW) / (1 - ES_LABEL_SHOW), 0, 1);

    document.getElementById('esScrollHint').classList.toggle('gone', p > 0.04);

    esFigures.forEach(fig => {
        const x = esLerp(fig.bx, fig.ex, spreadP);
        const y = esLerp(fig.by, fig.ey, spreadP);
        fig.el.style.transform = `translate(${x}px,${y}px)`;
    });

    ES_GROUPS.forEach((g, gi) => {
        const thresh = gi / ES_GROUPS.length;
        const colored = colorP > 0 && colorP >= thresh;
        const lblVis = colored && labelP > 0 && labelP >= thresh * 0.55;

        g.figs.forEach(f => f.el.classList.toggle('lit', colored));
        esLblEls[gi].style.opacity = lblVis ? '1' : '0';
        esTrackDots[gi].classList.toggle('lit', colored);
    });

    // Filter visibility
    const showFilter = p >= ES_FILTER_SHOW;
    const filterEl = document.getElementById('esFilter');
    if (filterEl) {
        filterEl.classList.toggle('visible', showFilter);
        if (!showFilter) {
            // Blob / transition view: restore all-providers total
            document.querySelector('.panel-big-num').textContent = ES_ALL_TOTAL.toLocaleString('es-PE');
        } else if (!esFilterFirstShown) {
            // First time filter appears: initialize with total
            esFilterFirstShown = true;
            esCurrentTotal = ES_PROVIDERS.total.total;
            esActiveProvider = 'total';
            document.querySelector('.panel-big-num').textContent = ES_PROVIDERS.total.total.toLocaleString('es-PE');
        } else {
            // Scrolled back then forward: restore current provider total
            document.querySelector('.panel-big-num').textContent = esCurrentTotal.toLocaleString('es-PE');
        }
    }
}

/* ────────────────────────────────────────────
   DESKTOP INIT
──────────────────────────────────────────── */
function esInitDesktop() {
    esPosOK = esComputePositions();
    if (!esPosOK) return;

    esFigures.forEach(fig => {
        fig.el.style.transition = 'none';
        fig.el.style.transform = `translate(${fig.bx}px,${fig.by}px)`;
    });

    requestAnimationFrame(() => {
        esFigures.forEach(fig => { fig.el.style.transition = 'filter 0.7s ease'; });
        esUpdate();
    });
}

/* ────────────────────────────────────────────
   MOBILE INIT
──────────────────────────────────────────── */
function esInitMobile() {
    esPosOK = esComputePositions();
    if (!esPosOK) return;

    const maxX = Math.max(...esFigures.map(f => f.ex + ES_DIM[f.g.type].w));
    esStage.style.width = (maxX + 56) + 'px';

    esFigures.forEach(fig => {
        fig.el.style.transition = 'none';
        fig.el.style.transform = `translate(${fig.ex}px,${fig.ey}px)`;
    });

    esLblEls.forEach(l => { l.style.opacity = '0'; });

    const sec = document.getElementById('esSection');
    const io = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        ES_GROUPS.forEach((g, gi) => {
            setTimeout(() => {
                g.figs.forEach(f => {
                    f.el.style.transition = 'filter 0.6s ease';
                    f.el.classList.add('lit');
                });
                esLblEls[gi].style.opacity = '1';
            }, gi * 260);
        });

        // Show filter after cascade finishes
        setTimeout(() => {
            const filterEl = document.getElementById('esFilter');
            if (filterEl && !esFilterFirstShown) {
                esFilterFirstShown = true;
                esCurrentTotal = ES_PROVIDERS.total.total;
                esActiveProvider = 'total';
                filterEl.classList.add('visible');
                document.querySelector('.panel-big-num').textContent = ES_PROVIDERS.total.total.toLocaleString('es-PE');
            }
        }, ES_GROUPS.length * 260 + 600);
    }, { threshold: 0.25 });

    io.observe(sec);
}

/* ────────────────────────────────────────────
   PROVIDER SWITCH
──────────────────────────────────────────── */
let esActiveProvider = null;
let esFilterFirstShown = false;
let esCurrentTotal = ES_ALL_TOTAL;

function switchProvider(key) {
    if (key === esActiveProvider) return;
    esActiveProvider = key;

    const prov = ES_PROVIDERS[key];
    const nValues = computeNValues(prov.counts);

    // Reassign figures to groups proportionally and update their images
    let figIdx = 0;
    ES_GROUPS.forEach((g, gi) => {
        g.n = nValues[gi];
        g.count = prov.counts[gi];
        g.figs = [];
        for (let fi = 0; fi < g.n && figIdx < esFigures.length; fi++, figIdx++) {
            const fig = esFigures[figIdx];
            fig.g = g;
            fig.fi = fi;
            g.figs.push(fig);
            const cfg = ES_IMGS[g.type];
            const dim = ES_DIM[g.type];
            const img = fig.el.querySelector('img');
            img.src = cfg.srcs[fi % cfg.srcs.length];
            img.width = cfg.w ?? dim.w;
            img.height = cfg.h ?? dim.h;
        }
    });

    const ok = esComputePositions();
    if (!ok) return;

    // Animate figures to new exploded positions
    esFigures.forEach(fig => {
        fig.el.style.transition = 'transform 0.75s ease, color 0.45s ease, filter 0.45s ease';
        fig.el.style.color = fig.g.color;
        fig.el.classList.add('lit');
        fig.el.style.transform = `translate(${fig.ex}px,${fig.ey}px)`;
    });

    // Update group labels
    esLblEls.forEach((lbl, gi) => {
        lbl.querySelector('.g-lbl-count').textContent = ES_GROUPS[gi].count.toLocaleString('es-PE');
        lbl.style.opacity = '1';
    });

    // Update header numbers
    esCurrentTotal = prov.total;
    document.querySelector('.panel-big-num').textContent = prov.total.toLocaleString('es-PE');
    const perFig = esRoundFig(prov.total / ES_TOTAL);
    const noteEl = document.getElementById('esNote');
    if (noteEl) noteEl.textContent = 'Cada figura ≈ ' + perFig.toLocaleString('es-PE') + ' personas';

    // Update filter buttons
    document.querySelectorAll('.es-filter-btn').forEach(btn =>
        btn.classList.toggle('is-active', btn.dataset.provider === key)
    );

    // Mobile: recalculate stage width
    if (esIsMobile()) {
        const maxX = Math.max(...esFigures.map(f => f.ex + ES_DIM[f.g.type].w));
        esStage.style.width = (maxX + 56) + 'px';
    }

    setTimeout(() => {
        esFigures.forEach(fig => { fig.el.style.transition = 'filter 0.7s ease'; });
    }, 900);
}

/* ────────────────────────────────────────────
   BOOT
──────────────────────────────────────────── */
const esIsMobile = () => window.innerWidth <= 767;

requestAnimationFrame(() => requestAnimationFrame(() => {
    if (esIsMobile()) esInitMobile();
    else esInitDesktop();
}));

// Filter buttons
document.querySelectorAll('.es-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => switchProvider(btn.dataset.provider));
});

// Scroll (desktop)
let esRafPending = false;
window.addEventListener('scroll', () => {
    if (esIsMobile() || esRafPending) return;
    esRafPending = true;
    requestAnimationFrame(() => { esUpdate(); esRafPending = false; });
}, { passive: true });

// Resize
let esResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(esResizeTimer);
    esResizeTimer = setTimeout(() => {
        esPosOK = false;
        if (esIsMobile()) esInitMobile();
        else { esPosOK = esComputePositions(); if (esPosOK) esUpdate(); }
    }, 150);
});
