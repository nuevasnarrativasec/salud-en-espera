(function () {
    /* ─── Data ─── */
    var AREAS = [
        {
            id: 'cancer', type: 'ratio',
            unit: 'PACIENTES', specLabel: 'ONCÓLOGO',
            patColor: '#4a7790', specColor: '#851f18',
            cards: [
                {
                    region: 'Amazonas', n: 136, s: 1,
                    desc: 'Una región con casos de cáncer registrados no tiene oncólogo. Los pacientes deben trasladarse a Lima o morir esperando.',
                    note: '*Solo 1 oncólogo contratado por la red. Sin cirujano oncólogo.'
                },
                {
                    region: 'Lima Metropolitana', n: 283, s: 1,
                    desc: 'Incluso donde hay más oncólogos del país, la carga es casi 6 veces el estándar recomendado.',
                    note: 'El estándar OPS es 50 casos por oncólogo.'
                },
                {
                    region: 'Apurímac', n: 198, s: 1,
                    desc: 'Casi 200 pacientes por oncólogo. Una de las brechas más críticas fuera de Lima.',
                    note: ''
                },
                {
                    region: 'Lambayeque', n: 184, s: 1,
                    desc: 'Lambayeque tiene la mayor carga de cáncer per cápita fuera de Lima y uno de los peores ratios de atención.',
                    note: ''
                }
            ]
        },
        {
            id: 'materna', type: 'rate',
            rateMax: 194,
            rateLabel: 'por 100,000 nacidos vivos',
            cards: [
                {
                    region: 'Loreto', rate: 194, lima: 28,
                    desc: 'En Loreto, la tasa de mortalidad materna es de 194 muertes por cada 100,000 nacidos vivos. En Lima, es de 28. Casi 7 veces menos. La meta que el Perú se comprometió a alcanzar en 2030 con los ODS es 70 — Loreto casi la triplica.',
                    gyn: null
                },
                {
                    region: 'Amazonas', rate: 130,
                    desc: 'Segunda tasa de mortalidad materna más alta del país. Pocos ginecólogos y alta dispersión geográfica explican la brecha.',
                    gyn: 56
                },
                {
                    region: 'Puno', rate: 116,
                    desc: 'Alta tasa a pesar de contar con más ginecólogos que otras regiones — la dispersión geográfica impide el acceso.',
                    gyn: 243
                },
                {
                    region: 'Madre de Dios', rate: 109,
                    desc: 'Con apenas 11 ginecólogos para toda la región, la atención obstétrica especializada es casi inexistente fuera de Puerto Maldonado.',
                    gyn: 11
                }
            ]
        },
        {
            id: 'mental', type: 'ratio',
            unit: 'CASOS', specLabel: 'PSIQUIATRA',
            patColor: '#4a7790', specColor: '#851f18',
            cards: [
                {
                    region: 'La Libertad', n: 66, s: 1,
                    desc: 'La Libertad duplica la carga promedio por psiquiatra. Segunda región más afectada después del Callao.',
                    note: ''
                },
                {
                    region: 'Callao', n: 65, s: 1,
                    desc: 'El Callao tiene la segunda peor relación casos/psiquiatra del país, a pesar de ser una región urbana con mejor acceso en teoría.',
                    note: ''
                },
                {
                    region: 'Loreto', n: 56, s: 1,
                    desc: 'Loreto concentra brechas críticas en los tres grandes ejes del especial: cáncer, salud materna y salud mental simultáneamente.',
                    note: ''
                },
                {
                    region: 'Cusco', n: 51, s: 1,
                    desc: 'Cusco tiene la mayor carga de salud mental registrada fuera de Lima, con una relación casos/psiquiatra también crítica.',
                    note: ''
                }
            ]
        },
        {
            id: 'brecha', type: 'multi',
            cards: [
                {
                    region: 'Loreto',
                    desc: 'La única región del país con brecha crítica simultánea en mortalidad materna, salud mental y cáncer. El caso más urgente del especial.',
                    metrics: [
                        { val: '194', label: 'muertes maternas por 100k nacidos' },
                        { val: '56', label: 'casos de salud mental por psiquiatra' },
                        { val: '79', label: 'pacientes de cáncer por oncólogo' }
                    ]
                },
                {
                    region: 'Amazonas',
                    desc: 'Amazonas combina alta mortalidad materna, ausencia de oncólogos y escasez de psiquiatras. Las tres brechas en una región de solo 432,000 personas.',
                    metrics: [
                        { val: '130', label: 'muertes maternas por 100k nacidos' },
                        { val: '17', label: 'psiquiatras en toda la región' }
                    ]
                },
                {
                    region: 'Cajamarca',
                    desc: 'Cajamarca acumula el mayor número de muertes maternas absolutas fuera de Lima, y su carga de salud mental por psiquiatra supera la media nacional.',
                    metrics: [
                        { val: '90', label: 'muertes maternas por 100k nacidos' },
                        { val: '16', label: 'muertes maternas registradas' },
                        { val: '1.014', label: 'casos de salud mental sin cobertura' },
                        { val: '37', label: 'psiquiatras en toda la región' }
                    ]
                }
            ]
        }
    ];

    /* ─── SVG generators ─── */
    function makeDotSVG(n, dotR, fill, sz) {
        sz = sz || 200;
        var cx = sz / 2, cy = sz / 2;
        var step = dotR * 2 + 1.5;
        var R = cx - dotR - 1;
        // Genera todas las posiciones del grid dentro del círculo
        var all = [];
        for (var iy = 0; ; iy++) {
            var y = cy - R + dotR + iy * step;
            if (y > cy + R) break;
            for (var ix = 0; ; ix++) {
                var x = cx - R + dotR + ix * step;
                if (x > cx + R) break;
                var dx = x - cx, dy = y - cy;
                var d2 = dx * dx + dy * dy;
                if (d2 <= R * R) all.push([x, y, d2]);
            }
        }
        // Ordena del centro hacia afuera para que el corte sea radial
        all.sort(function (a, b) { return a[2] - b[2]; });
        var pts = all.slice(0, n);
        var circles = pts.map(function (p) {
            return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + dotR + '" fill="' + fill + '"/>';
        }).join('');
        return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 ' + sz + ' ' + sz + '">' + circles + '</svg>';
    }

    function makeSpecSVG(fill, sz) {
        sz = sz || 200;
        var c = sz / 2, r = sz * 0.05;
        return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 ' + sz + ' ' + sz + '"><circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="' + fill + '"/></svg>';
    }

    // Genera círculo de dots con el centro destacado (hiColor) y el resto en loColor.
    // nHighlight = cuántos dots del centro se colorean → permite comparar entre regiones.
    function makePropDotSVG(nHighlight, hiColor, loColor, dotR, sz) {
        sz = sz || 200;
        var cx = sz / 2, cy = sz / 2;
        var step = dotR * 2 + 1.5;
        var R = cx - dotR - 1;
        var all = [];
        for (var iy = 0; ; iy++) {
            var y = cy - R + dotR + iy * step;
            if (y > cy + R) break;
            for (var ix = 0; ; ix++) {
                var x = cx - R + dotR + ix * step;
                if (x > cx + R) break;
                var dx = x - cx, dy = y - cy;
                var d2 = dx * dx + dy * dy;
                if (d2 <= R * R) all.push([x, y, d2]);
            }
        }
        all.sort(function (a, b) { return a[2] - b[2]; });
        var circles = all.map(function (p, i) {
            var fill = i < nHighlight ? hiColor : loColor;
            return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + dotR + '" fill="' + fill + '"/>';
        }).join('');
        return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 ' + sz + ' ' + sz + '">' + circles + '</svg>';
    }

    /* ─── Card builders ─── */
    function buildRatioCard(card, area) {
        return '<div class="evz-card">' +
            '<h3 class="evz-region">' + card.region + '</h3>' +
            '<p class="evz-desc">' + card.desc + '</p>' +
            '<div class="evz-viz">' +
            '<div class="evz-viz-side">' +
            makeDotSVG(card.n, 4, area.patColor, 200) +
            '<div class="evz-fig-num">' + card.n + ' ' + area.unit + '</div>' +
            '</div>' +
            '<div class="evz-viz-side">' +
            makeSpecSVG(area.specColor, 200) +
            '<div class="evz-fig-num">' + card.s + ' ' + area.specLabel + '</div>' +
            '</div>' +
            '</div>' +
            (card.note ? '<p class="evz-note">' + card.note + '</p>' : '') +
            '</div>';
    }

    function buildRateCard(card, area) {
        var totalApprox = 314;
        var maxHighlight = Math.round(totalApprox * 0.25);
        var nHighlight = Math.round(card.rate / area.rateMax * maxHighlight);
        var rateSvg = makePropDotSVG(nHighlight, '#4a7790', 'transparent', 4, 200);

        if (card.gyn) {
            // Side-by-side: mortalidad | ginecólogos (igual que cáncer/salud mental)
            var gynSvg = makeDotSVG(card.gyn, 4, '#851f18', 200);
            return '<div class="evz-card">' +
                '<h3 class="evz-region">' + card.region + '</h3>' +
                '<p class="evz-desc">' + card.desc + '</p>' +
                '<div class="evz-viz">' +
                '<div class="evz-viz-side">' +
                rateSvg +
                '<div class="evz-fig-num">' + card.rate + '</div>' +
                '<div class="evz-fig-label">muertes maternas ' + area.rateLabel + '</div>' +
                '</div>' +
                '<div class="evz-viz-side">' +
                gynSvg +
                '<div class="evz-fig-num">' + card.gyn + '</div>' +
                '<div class="evz-fig-label">ginecólogos en la región</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        // Con comparación Lima: layout side-by-side
        if (card.lima !== undefined) {
            var limaNHighlight = card.lima;
            var limaSvg = makePropDotSVG(limaNHighlight, '#851f18', 'transparent', 4, 200);
            return '<div class="evz-card">' +
                '<h3 class="evz-region">' + card.region + '</h3>' +
                '<p class="evz-desc">' + card.desc + '</p>' +
                '<div class="evz-viz">' +
                '<div class="evz-viz-side">' +
                rateSvg +
                '<div class="evz-fig-num">' + card.rate + '</div>' +
                '<div class="evz-fig-label">muertes maternas ' + area.rateLabel + '</div>' +
                '</div>' +
                '<div class="evz-viz-side">' +
                limaSvg +
                '<div class="evz-fig-num">' + card.lima + '</div>' +
                '<div class="evz-fig-label">muertes maternas en Lima ' + area.rateLabel + '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        // Sin datos adicionales: visualización centrada
        return '<div class="evz-card">' +
            '<h3 class="evz-region">' + card.region + '</h3>' +
            '<p class="evz-desc">' + card.desc + '</p>' +
            '<div class="evz-prop-wrap">' +
            rateSvg +
            '<div class="evz-prop-stat">' +
            '<span class="evz-rate-big">' + card.rate + '</span>' +
            '<span class="evz-rate-unit">muertes maternas ' + area.rateLabel + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    function buildMultiCard(card) {
        var metricsHtml = card.metrics.map(function (m) {
            return '<div class="evz-metric">' +
                '<span class="evz-metric-val">' + m.val + '</span>' +
                '<span class="evz-metric-label">' + m.label + '</span>' +
                '</div>';
        }).join('');
        return '<div class="evz-card">' +
            '<h3 class="evz-region">' + card.region + '</h3>' +
            '<p class="evz-desc">' + card.desc + '</p>' +
            '<div class="evz-metrics">' + metricsHtml + '</div>' +
            '</div>';
    }

    /* ─── State ─── */
    var currentArea = 0;
    var currentPage = 0;

    var track = document.getElementById('evzTrack');
    var viewport = document.getElementById('evzViewport');
    var pipsEl = document.getElementById('evzPips');
    var btnPrev = document.getElementById('evzPrev');
    var btnNext = document.getElementById('evzNext');

    function getPerPage() { return window.innerWidth <= 640 ? 1 : 2; }

    function totalPages() {
        return Math.ceil(AREAS[currentArea].cards.length / getPerPage());
    }

    function buildCards() {
        var area = AREAS[currentArea];
        track.innerHTML = '';
        area.cards.forEach(function (card) {
            var html;
            if (area.type === 'ratio') html = buildRatioCard(card, area);
            else if (area.type === 'rate') html = buildRateCard(card, area);
            else html = buildMultiCard(card);
            track.insertAdjacentHTML('beforeend', html);
        });
    }

    function buildPips() {
        pipsEl.innerHTML = '';
        var n = totalPages();
        for (var i = 0; i < n; i++) {
            var btn = document.createElement('button');
            btn.className = 'evz-pip' + (i === currentPage ? ' is-active' : '');
            btn.setAttribute('aria-label', 'Página ' + (i + 1));
            (function (idx) {
                btn.addEventListener('click', function () { goTo(idx); });
            })(i);
            pipsEl.appendChild(btn);
        }
    }

    function goTo(page) {
        var pages = totalPages();
        currentPage = Math.max(0, Math.min(page, pages - 1));
        var W = viewport.offsetWidth;
        var gap = 24;
        track.style.transform = 'translateX(-' + (currentPage * (W + gap)) + 'px)';
        btnPrev.disabled = currentPage === 0;
        btnNext.disabled = currentPage >= pages - 1;
        pipsEl.querySelectorAll('.evz-pip').forEach(function (p, i) {
            p.classList.toggle('is-active', i === currentPage);
        });
    }

    function renderArea(idx) {
        currentArea = idx;
        currentPage = 0;
        document.querySelectorAll('.evz-tab').forEach(function (t, i) {
            t.classList.toggle('is-active', i === idx);
        });
        buildCards();
        buildPips();
        goTo(0);
    }

    /* ─── Events ─── */
    document.querySelectorAll('.evz-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            renderArea(parseInt(tab.dataset.area, 10));
        });
    });
    btnPrev.addEventListener('click', function () { goTo(currentPage - 1); });
    btnNext.addEventListener('click', function () { goTo(currentPage + 1); });

    var swipeTx = 0;
    viewport.addEventListener('touchstart', function (e) { swipeTx = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
        var diff = swipeTx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? currentPage + 1 : currentPage - 1);
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            buildPips();
            goTo(currentPage);
        }, 150);
    });

    /* ─── Init ─── */
    renderArea(0);
})();
