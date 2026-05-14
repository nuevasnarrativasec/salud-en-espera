(function () {
    var SVG_IDS = {
        'Amazonas': 'PE-AMA',
        'Áncash': 'PE-ANC',
        'Apurímac': 'PE-APU',
        'Arequipa': 'PE-ARE',
        'Ayacucho': 'PE-AYA',
        'Cajamarca': 'PE-CAJ',
        'Cusco': 'PE-CUS',
        'Huancavelica': 'PE-HUV',
        'Huánuco': 'PE-HUC',
        'Ica': 'PE-ICA',
        'Junín': 'PE-JUN',
        'La Libertad': 'PE-LAL',
        'Lambayeque': 'PE-LAM',
        'Lima': 'PE-LIM',
        'Loreto': 'PE-LOR',
        'Madre de Dios': 'PE-MDD',
        'Moquegua': 'PE-MOQ',
        'Pasco': 'PE-PAS',
        'Piura': 'PE-PIU',
        'Puno': 'PE-PUN',
        'San Martín': 'PE-SAM',
        'Tacna': 'PE-TAC',
        'Tumbes': 'PE-TUM',
        'Ucayali': 'PE-UCA'
    };

    var selRegion = document.getElementById('mapaRegion');
    var selEsp = document.getElementById('mapaEsp');
    var svgWrap = document.getElementById('mapaSvgWrap');
    var resultado = document.getElementById('mapaResultado');
    if (!selRegion || !svgWrap) return;

    var DATA = null;
    var svgDoc = null;
    var activeRegion = null;

    function highlightRegion(region) {
        if (!svgDoc) return;
        svgDoc.querySelectorAll('path.mapa-activa').forEach(function (p) {
            p.classList.remove('mapa-activa');
        });
        var id = SVG_IDS[region];
        if (id) {
            var path = svgDoc.getElementById(id);
            if (path) path.classList.add('mapa-activa');
            // Lima: también destacar provincia y Callao
            if (region === 'Lima') {
                ['PE-LMA', 'PE-CAL'].forEach(function (extra) {
                    var p2 = svgDoc.getElementById(extra);
                    if (p2) p2.classList.add('mapa-activa');
                });
            }
        }
    }

    function showResult(region, esp, dias) {
        resultado.innerHTML =
            '<div class="mapa-res-esp">' + esp + '</div>' +
            '<div class="mapa-res-region">Región: ' + region + '</div>' +
            '<p class="mapa-res-texto">Conseguir una cita en el sistema público toma en promedio desde que la solicita:</p>' +
            '<div class="mapa-res-dias"><span>' + dias + '</span> días</div>';
    }

    function showRegionOnly(region) {
        resultado.innerHTML =
            '<div class="mapa-res-region-solo">' + region + '</div>' +
            '<p class="mapa-placeholder mapa-placeholder--small">Ahora selecciona una especialidad.</p>';
    }

    function populateEsp(region) {
        selEsp.innerHTML = '';
        selEsp.disabled = false;
        var opt0 = document.createElement('option');
        opt0.value = ''; opt0.textContent = '— Selecciona —';
        selEsp.appendChild(opt0);
        var esps = Object.keys(DATA[region]).sort();
        esps.forEach(function (e) {
            var opt = document.createElement('option');
            opt.value = e; opt.textContent = e;
            selEsp.appendChild(opt);
        });
    }

    function onRegionChange() {
        var region = selRegion.value;
        activeRegion = region || null;
        selEsp.innerHTML = '<option value="">— Selecciona —</option>';
        selEsp.disabled = true;
        resultado.innerHTML = '<p class="mapa-placeholder">Selecciona una región y especialidad<br>para ver los tiempos de espera.</p>';
        if (!region) { highlightRegion(null); return; }
        highlightRegion(region);
        populateEsp(region);
        showRegionOnly(region);
    }

    function onEspChange() {
        var region = selRegion.value;
        var esp = selEsp.value;
        if (!region || !esp) return;
        var dias = DATA[region][esp];
        if (dias !== undefined) showResult(region, esp, dias);
    }

    function onMapClick(e) {
        var path = e.target.closest('path');
        if (!path) return;
        var pathId = path.id;
        var region = Object.keys(SVG_IDS).find(function (r) {
            return SVG_IDS[r] === pathId ||
                (r === 'Lima' && (pathId === 'PE-LMA' || pathId === 'PE-CAL'));
        });
        if (!region || !DATA[region]) return;
        selRegion.value = region;
        onRegionChange();
    }

    Promise.all([
        fetch('./data/tiempos.json').then(function (r) { return r.json(); }),
        fetch('./img/peru.svg').then(function (r) { return r.text(); })
    ]).then(function (results) {
        DATA = results[0];
        var svgText = results[1];

        // Inyectar SVG
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
            // Cursor pointer en regiones con datos
            svgDoc.querySelectorAll('path').forEach(function (p) {
                if (SVG_IDS[Object.keys(SVG_IDS).find(function (r) { return SVG_IDS[r] === p.id; })]) {
                    p.classList.add('mapa-clickable');
                }
            });
        }

        // Poblar dropdown de regiones (orden alfabético)
        Object.keys(DATA).sort(function (a, b) { return a.localeCompare(b, 'es'); }).forEach(function (r) {
            var opt = document.createElement('option');
            opt.value = r; opt.textContent = r;
            selRegion.appendChild(opt);
        });

        selRegion.addEventListener('change', onRegionChange);
        selEsp.addEventListener('change', onEspChange);
    }).catch(function (err) {
        console.error('Error cargando datos del mapa:', err);
    });
})();
