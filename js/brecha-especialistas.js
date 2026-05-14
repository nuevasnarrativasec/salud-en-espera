(function () {
    var BRECHA = {
        'Amazonas': { cancer: 136, mental: 184, nacimientos: 4594, tmm: 130.6, oncologo: [0, 0, 0, 0], cir_oncologo: [0, 2, 0, 2], psiquiatra: [7, 10, 0, 17], psicologo: [558, 29, 0, 587], obstetra: [1730, 103, 0, 1833], ginecologo: [11, 45, 0, 56] },
        'Áncash': { cancer: 1330, mental: 56, nacimientos: 13224, tmm: 37.8, oncologo: [0, 5, 0, 5], cir_oncologo: [0, 5, 0, 5], psiquiatra: [5, 9, 0, 14], psicologo: [557, 88, 0, 645], obstetra: [1771, 319, 0, 2090], ginecologo: [81, 111, 0, 192] },
        'Apurímac': { cancer: 385, mental: 377, nacimientos: 5320, tmm: 37.6, oncologo: [0, 1, 0, 1], cir_oncologo: [0, 1, 0, 1], psiquiatra: [3, 6, 0, 9], psicologo: [689, 41, 0, 730], obstetra: [1963, 118, 0, 2081], ginecologo: [80, 33, 0, 113] },
        'Arequipa': { cancer: 2180, mental: 989, nacimientos: 16099, tmm: 37.3, oncologo: [3, 0, 20, 23], cir_oncologo: [1, 0, 22, 23], psiquiatra: [34, 2, 5, 41], psicologo: [841, 19, 24, 884], obstetra: [1437, 66, 85, 1588], ginecologo: [49, 30, 49, 128] },
        'Ayacucho': { cancer: 1021, mental: 499, nacimientos: 7872, tmm: 50.8, oncologo: [1, 11, 0, 12], cir_oncologo: [0, 2, 0, 2], psiquiatra: [18, 19, 0, 37], psicologo: [841, 87, 0, 928], obstetra: [1965, 326, 0, 2291], ginecologo: [18, 129, 0, 147] },
        'Cajamarca': { cancer: 1181, mental: 1014, nacimientos: 17624, tmm: 90.8, oncologo: [0, 11, 0, 11], cir_oncologo: [2, 16, 0, 18], psiquiatra: [24, 13, 0, 37], psicologo: [1341, 263, 0, 1604], obstetra: [2995, 250, 0, 3245], ginecologo: [174, 119, 0, 293] },
        'Callao': { cancer: 763, mental: 905, nacimientos: 11891, tmm: 16.8, oncologo: [0, 0, 18, 18], cir_oncologo: [0, 5, 13, 18], psiquiatra: [8, 1, 5, 14], psicologo: [310, 22, 23, 355], obstetra: [517, 87, 44, 648], ginecologo: [17, 25, 42, 84] },
        'Cusco': { cancer: 2330, mental: 1728, nacimientos: 16194, tmm: 61.8, oncologo: [1, 1, 7, 9], cir_oncologo: [7, 0, 5, 12], psiquiatra: [27, 4, 3, 34], psicologo: [792, 46, 17, 855], obstetra: [2112, 252, 95, 2459], ginecologo: [175, 46, 23, 244] },
        'Huancavelica': { cancer: 133, mental: 384, nacimientos: 3555, tmm: 84.4, oncologo: [0, 5, 0, 5], cir_oncologo: [0, 0, 0, 0], psiquiatra: [6, 5, 0, 11], psicologo: [1100, 34, 0, 1134], obstetra: [2238, 192, 0, 2430], ginecologo: [129, 76, 0, 205] },
        'Huánuco': { cancer: 341, mental: 958, nacimientos: 10892, tmm: 36.7, oncologo: [0, 5, 0, 5], cir_oncologo: [2, 0, 0, 2], psiquiatra: [46, 10, 0, 56], psicologo: [530, 34, 0, 564], obstetra: [1646, 92, 0, 1738], ginecologo: [98, 103, 0, 201] },
        'Ica': { cancer: 721, mental: 398, nacimientos: 13157, tmm: 38.0, oncologo: [1, 7, 0, 8], cir_oncologo: [3, 4, 0, 7], psiquiatra: [11, 8, 0, 19], psicologo: [320, 49, 0, 369], obstetra: [492, 189, 0, 681], ginecologo: [16, 78, 0, 94] },
        'Junín': { cancer: 2086, mental: 1123, nacimientos: 17598, tmm: 56.8, oncologo: [1, 29, 10, 40], cir_oncologo: [0, 10, 0, 10], psiquiatra: [18, 13, 3, 34], psicologo: [1282, 69, 20, 1371], obstetra: [2603, 251, 62, 2916], ginecologo: [126, 87, 34, 247] },
        'La Libertad': { cancer: 1455, mental: 1116, nacimientos: 23241, tmm: 47.3, oncologo: [0, 0, 7, 7], cir_oncologo: [0, 0, 11, 11], psiquiatra: [7, 1, 9, 17], psicologo: [931, 206, 17, 1154], obstetra: [2146, 512, 60, 2718], ginecologo: [109, 134, 45, 288] },
        'Lambayeque': { cancer: 3313, mental: 339, nacimientos: 0, tmm: 0, oncologo: [0, 3, 11, 14], cir_oncologo: [0, 2, 2, 4], psiquiatra: [47, 5, 2, 54], psicologo: [727, 20, 13, 760], obstetra: [1248, 69, 30, 1347], ginecologo: [62, 49, 26, 137] },
        'Lima Metropolitana': { cancer: 141041, mental: 7420, nacimientos: 106549, tmm: 28.2, oncologo: [13, 13, 417, 443], cir_oncologo: [12, 16, 28, 56], psiquiatra: [185, 37, 251, 473], psicologo: [3696, 139, 328, 4163], obstetra: [6112, 526, 597, 7235], ginecologo: [439, 351, 442, 1232] },
        'Loreto': { cancer: 628, mental: 895, nacimientos: 17476, tmm: 194.6, oncologo: [0, 0, 8, 8], cir_oncologo: [0, 0, 6, 6], psiquiatra: [13, 1, 2, 16], psicologo: [434, 19, 10, 463], obstetra: [2307, 105, 59, 2471], ginecologo: [57, 28, 24, 109] },
        'Madre de Dios': { cancer: 73, mental: 7, nacimientos: 3643, tmm: 109.8, oncologo: [2, 1, 0, 3], cir_oncologo: [0, 1, 0, 1], psiquiatra: [1, 4, 0, 5], psicologo: [147, 15, 0, 162], obstetra: [431, 12, 0, 443], ginecologo: [6, 5, 0, 11] },
        'Moquegua': { cancer: 47, mental: 203, nacimientos: 1714, tmm: 0, oncologo: [0, 2, 0, 2], cir_oncologo: [1, 3, 0, 4], psiquiatra: [7, 3, 0, 10], psicologo: [293, 14, 0, 307], obstetra: [315, 84, 0, 399], ginecologo: [5, 25, 0, 30] },
        'Pasco': { cancer: 88, mental: 296, nacimientos: 3107, tmm: 64.4, oncologo: [0, 1, 0, 1], cir_oncologo: [0, 0, 0, 0], psiquiatra: [3, 14, 0, 17], psicologo: [535, 28, 0, 563], obstetra: [1379, 109, 0, 1488], ginecologo: [84, 44, 0, 128] },
        'Piura': { cancer: 1032, mental: 615, nacimientos: 24633, tmm: 60.9, oncologo: [0, 19, 0, 19], cir_oncologo: [4, 1, 0, 5], psiquiatra: [20, 5, 0, 25], psicologo: [1084, 33, 0, 1117], obstetra: [2683, 213, 0, 2896], ginecologo: [274, 124, 0, 398] },
        'Puno': { cancer: 365, mental: 559, nacimientos: 11121, tmm: 116.9, oncologo: [0, 3, 0, 3], cir_oncologo: [1, 1, 0, 2], psiquiatra: [28, 4, 0, 32], psicologo: [1138, 92, 0, 1230], obstetra: [2195, 327, 0, 2522], ginecologo: [121, 122, 0, 243] },
        'San Martín': { cancer: 1172, mental: 129, nacimientos: 13128, tmm: 53.3, oncologo: [1, 4, 0, 5], cir_oncologo: [6, 1, 0, 7], psiquiatra: [11, 5, 0, 16], psicologo: [630, 47, 0, 677], obstetra: [1929, 299, 0, 2228], ginecologo: [35, 90, 0, 125] },
        'Tacna': { cancer: 157, mental: 250, nacimientos: 3272, tmm: 0, oncologo: [0, 2, 0, 2], cir_oncologo: [0, 4, 0, 4], psiquiatra: [2, 6, 0, 8], psicologo: [252, 18, 0, 270], obstetra: [423, 41, 0, 464], ginecologo: [9, 23, 0, 32] },
        'Tumbes': { cancer: 107, mental: 49, nacimientos: 3314, tmm: 30.2, oncologo: [0, 1, 0, 1], cir_oncologo: [0, 0, 0, 0], psiquiatra: [4, 5, 0, 9], psicologo: [208, 8, 0, 216], obstetra: [343, 22, 0, 365], ginecologo: [14, 25, 0, 39] },
        'Ucayali': { cancer: 364, mental: 126, nacimientos: 12260, tmm: 73.4, oncologo: [1, 1, 0, 2], cir_oncologo: [0, 1, 0, 1], psiquiatra: [6, 3, 0, 9], psicologo: [392, 26, 0, 418], obstetra: [1269, 67, 0, 1336], ginecologo: [28, 25, 0, 53] }
    };

    var AREAS = {
        'Cáncer': { keys: ['oncologo', 'cir_oncologo'], labels: ['Oncólogo', 'Cirujano Oncólogo'] },
        'Salud Mental': { keys: ['psiquiatra', 'psicologo'], labels: ['Psiquiatra', 'Psicólogo'] },
        'Maternidad': { keys: ['obstetra', 'ginecologo'], labels: ['Obstetra', 'Ginecólogo'] }
    };

    var SVG_IDS = {
        'Amazonas': 'PE-AMA', 'Áncash': 'PE-ANC', 'Apurímac': 'PE-APU',
        'Arequipa': 'PE-ARE', 'Ayacucho': 'PE-AYA', 'Cajamarca': 'PE-CAJ',
        'Callao': 'PE-CAL', 'Cusco': 'PE-CUS', 'Huancavelica': 'PE-HUV',
        'Huánuco': 'PE-HUC', 'Ica': 'PE-ICA', 'Junín': 'PE-JUN',
        'La Libertad': 'PE-LAL', 'Lambayeque': 'PE-LAM', 'Lima Metropolitana': 'PE-LIM',
        'Loreto': 'PE-LOR', 'Madre de Dios': 'PE-MDD', 'Moquegua': 'PE-MOQ',
        'Pasco': 'PE-PAS', 'Piura': 'PE-PIU', 'Puno': 'PE-PUN',
        'San Martín': 'PE-SAM', 'Tacna': 'PE-TAC', 'Tumbes': 'PE-TUM',
        'Ucayali': 'PE-UCA'
    };

    var selRegion = document.getElementById('brechaRegion');
    var selEnf = document.getElementById('brechaEnf');
    var selEsp = document.getElementById('brechaEsp');
    var svgWrap = document.getElementById('brechaSvgWrap');
    var resultado = document.getElementById('brechaResultado');
    var tablaWrap = document.getElementById('brechaTablaWrap');
    var tablaBody = document.getElementById('brechaTablaBody');
    if (!selRegion || !svgWrap) return;

    var svgDoc = null;

    function fmt(n) { return n.toLocaleString('es-PE'); }

    function highlightRegion(region) {
        if (!svgDoc) return;
        svgDoc.querySelectorAll('path.mapa-activa').forEach(function (p) { p.classList.remove('mapa-activa'); });
        if (!region) return;
        var id = SVG_IDS[region];
        if (id) {
            var path = svgDoc.getElementById(id);
            if (path) path.classList.add('mapa-activa');
        }
    }

    function showResumen(region) {
        var d = BRECHA[region];
        resultado.innerHTML =
            '<div class="brecha-res-region">' + region + '</div>' +
            '<div class="brecha-res-carga">' +
            '<div class="brecha-res-carga-titulo">Carga de enfermedad</div>' +
            '<div class="brecha-res-carga-item"><span class="brecha-res-carga-num">' + fmt(d.cancer) + '</span><span class="brecha-res-carga-label">pacientes de cáncer</span></div>' +
            '<div class="brecha-res-carga-item"><span class="brecha-res-carga-num">' + fmt(d.mental) + '</span><span class="brecha-res-carga-label">casos de salud mental</span></div>' +
            (d.nacimientos > 0 ? '<div class="brecha-res-carga-item"><span class="brecha-res-carga-num">' + fmt(d.nacimientos) + '</span><span class="brecha-res-carga-label">nacimientos</span></div>' : '') +
            (d.tmm > 0 ? '<div class="brecha-res-carga-item"><span class="brecha-res-carga-num">' + d.tmm + '</span><span class="brecha-res-carga-label">muertes maternas por 100 000 nacidos</span></div>' : '') +
            '</div>' +
            '<p class="brecha-res-hint"></p>';
    }

    function buildTabla(region, filtroArea, filtroEsp) {
        tablaBody.innerHTML = '';
        var d = BRECHA[region];
        Object.keys(AREAS).forEach(function (areaName) {
            var area = AREAS[areaName];
            area.keys.forEach(function (key, idx) {
                var label = area.labels[idx];
                var vals = d[key];
                var tr = document.createElement('tr');

                var isHighlighted = (!filtroArea && !filtroEsp) ||
                    (filtroArea === areaName && (!filtroEsp || filtroEsp === label));
                var isDimmed = (filtroArea || filtroEsp) && !isHighlighted;

                if (isHighlighted && (filtroArea || filtroEsp)) tr.classList.add('brecha-row-highlight');
                if (isDimmed) tr.classList.add('brecha-row-dimmed');

                var areaCell = idx === 0
                    ? '<td class="brecha-area-cell" rowspan="2">' + areaName + '</td>'
                    : '';

                tr.innerHTML = areaCell +
                    '<td>' + label + '</td>' +
                    [vals[0], vals[1], vals[2]].map(function (v) {
                        return '<td' + (v === 0 ? ' class="brecha-zero"' : '') + '>' + (v === 0 ? '—' : v) + '</td>';
                    }).join('') +
                    '<td class="brecha-total-cell">' + (vals[3] === 0 ? '<span class="brecha-zero">0</span>' : vals[3]) + '</td>';

                tablaBody.appendChild(tr);
            });
        });
        tablaWrap.hidden = false;
    }

    function onRegionChange() {
        var region = selRegion.value;
        selEnf.innerHTML = '<option value="">— Selecciona —</option>';
        selEnf.disabled = !region;
        selEsp.innerHTML = '<option value="">— Selecciona área primero —</option>';
        selEsp.disabled = true;
        tablaWrap.hidden = true;
        resultado.innerHTML = '<p class="mapa-placeholder">Selecciona una región para ver la brecha de especialistas.</p>';
        highlightRegion(region || null);
        if (!region) return;

        Object.keys(AREAS).forEach(function (a) {
            var opt = document.createElement('option');
            opt.value = a; opt.textContent = a;
            selEnf.appendChild(opt);
        });
        showResumen(region);
        buildTabla(region, '', '');
    }

    function onEnfChange() {
        var region = selRegion.value;
        var area = selEnf.value;
        selEsp.innerHTML = '<option value="">— Todas —</option>';
        selEsp.disabled = !area;
        if (!region) return;
        if (area && AREAS[area]) {
            AREAS[area].labels.forEach(function (l) {
                var opt = document.createElement('option');
                opt.value = l; opt.textContent = l;
                selEsp.appendChild(opt);
            });
        }
        buildTabla(region, area, '');
    }

    function onEspChange() {
        var region = selRegion.value;
        var area = selEnf.value;
        var esp = selEsp.value;
        if (!region) return;
        buildTabla(region, area, esp);
        if (esp) {
            setTimeout(function () {
                tablaWrap.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 50);
        }
    }

    function onMapClick(e) {
        var path = e.target.closest('path');
        if (!path) return;
        var pathId = path.id;
        var region = Object.keys(SVG_IDS).find(function (r) { return SVG_IDS[r] === pathId; });
        if (!region || !BRECHA[region]) return;
        selRegion.value = region;
        onRegionChange();
    }

    // Poblar dropdown de regiones
    Object.keys(BRECHA).sort(function (a, b) { return a.localeCompare(b, 'es'); }).forEach(function (r) {
        var opt = document.createElement('option');
        opt.value = r; opt.textContent = r;
        selRegion.appendChild(opt);
    });

    selRegion.addEventListener('change', onRegionChange);
    selEnf.addEventListener('change', onEnfChange);
    selEsp.addEventListener('change', onEspChange);

    // Cargar SVG del mapa
    fetch('./img/peru.svg').then(function (r) { return r.text(); }).then(function (svgText) {
        svgWrap.innerHTML = svgText;
        svgDoc = svgWrap.querySelector('svg');
        if (svgDoc) {
            if (!svgDoc.getAttribute('viewBox')) {
                var vw = parseFloat(svgDoc.getAttribute('width')) || 543;
                var vh = parseFloat(svgDoc.getAttribute('height')) || 792;
                svgDoc.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
            }
            svgDoc.setAttribute('width', '100%');
            svgDoc.setAttribute('height', '100%');
            svgDoc.removeAttribute('xml:space');
            svgDoc.addEventListener('click', onMapClick);
            svgDoc.querySelectorAll('path').forEach(function (p) {
                if (Object.values(SVG_IDS).indexOf(p.id) !== -1) p.classList.add('mapa-clickable');
            });
        }
    }).catch(function (err) { console.error('Error cargando SVG brecha:', err); });
})();
