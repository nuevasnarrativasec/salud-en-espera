import * as duckdb from 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm';

const PARQUET_URL = new URL('https://nuevasnarrativasec.github.io/salud-en-espera/data/digemid_esenciales.parquet', window.location.href).href;
const PAGE_SIZE = 20;

const selDepto   = document.getElementById('dgDepto');
const selProv    = document.getElementById('dgProv');
const selDist    = document.getElementById('dgDist');
const searchInp  = document.getElementById('dgSearch');
const statusEl   = document.getElementById('dgStatus');
const resultsEl  = document.getElementById('dgResults');
const suggestEl  = document.getElementById('dgSuggestions');
const btnSortAsc = document.getElementById('dgSortAsc');
const btnSortDesc= document.getElementById('dgSortDesc');

let conn = null, searchTimer = null, suggestTimer = null;
let currentOffset = 0, currentTotal = 0, currentRows = [];
let sortDir = 'ASC'; // 'ASC' | 'DESC'

/* ── Status indicator ── */
function setStatus(type, msg) {
    const icons = {
        loading: '<div class="digemid-spinner"></div>',
        ready:   '<div class="digemid-dot-ok"></div>',
        error:   '<div class="digemid-dot-err"></div>',
        query:   '<div class="digemid-spinner"></div>'
    };
    statusEl.innerHTML = `${icons[type]}<span class="digemid-status-txt">${msg}</span>`;
}

/* ── Init DuckDB ── */
async function initDB() {
    try {
        const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
        const worker = new Worker(URL.createObjectURL(new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })));
        const db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        conn = await db.connect();
        setStatus('loading', 'Indexando registros…');
        await conn.query(`CREATE VIEW medicamentos AS SELECT * FROM read_parquet('${PARQUET_URL}')`);
        const deptos = await conn.query(`SELECT DISTINCT departamento FROM medicamentos WHERE departamento IS NOT NULL ORDER BY departamento`);
        deptos.toArray().forEach(r => {
            const o = document.createElement('option');
            o.value = o.textContent = r.departamento;
            selDepto.appendChild(o);
        });
        setStatus('ready', 'Fuente: Observatorio de Precios de Medicamentos Esenciales — DIGEMID, 2026. Base de datos con 3,244,695 de registros.');
        searchInp.disabled = false;
    } catch (e) { setStatus('error', 'Error: ' + e.message); console.error(e); }
}

function esc(s) { return String(s).replace(/'/g, "''"); }

/* ── Location cascades ── */
selDepto.addEventListener('change', async () => {
    const d = selDepto.value;
    selProv.innerHTML = '<option value="">— Todas —</option>';
    selDist.innerHTML = '<option value="">— Todos —</option>';
    selProv.disabled = !d; selDist.disabled = true;
    if (d && conn) {
        const rows = await conn.query(`SELECT DISTINCT provincia FROM medicamentos WHERE departamento='${esc(d)}' AND provincia IS NOT NULL ORDER BY provincia`);
        rows.toArray().forEach(r => { const o = document.createElement('option'); o.value = o.textContent = r.provincia; selProv.appendChild(o); });
    }
    triggerSearch(0);
});

selProv.addEventListener('change', async () => {
    const d = selDepto.value, p = selProv.value;
    selDist.innerHTML = '<option value="">— Todos —</option>';
    selDist.disabled = !p;
    if (p && conn) {
        const rows = await conn.query(`SELECT DISTINCT distrito FROM medicamentos WHERE departamento='${esc(d)}' AND provincia='${esc(p)}' AND distrito IS NOT NULL ORDER BY distrito`);
        rows.toArray().forEach(r => { const o = document.createElement('option'); o.value = o.textContent = r.distrito; selDist.appendChild(o); });
    }
    triggerSearch(0);
});

selDist.addEventListener('change', () => triggerSearch(0));

/* ── Sort buttons ── */
btnSortAsc.addEventListener('click', () => {
    if (sortDir === 'ASC') return;
    sortDir = 'ASC';
    btnSortAsc.classList.add('active');
    btnSortDesc.classList.remove('active');
    triggerSearch(0);
});
btnSortDesc.addEventListener('click', () => {
    if (sortDir === 'DESC') return;
    sortDir = 'DESC';
    btnSortDesc.classList.add('active');
    btnSortAsc.classList.remove('active');
    triggerSearch(0);
});

/* ── Search input: suggestions + main search ── */
searchInp.addEventListener('input', () => {
    // Suggestions: fast, short debounce
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(() => fetchSuggestions(), 200);
    // Main search: longer debounce
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { hideSuggestions(); triggerSearch(0); }, 450);
});

searchInp.addEventListener('blur', () => {
    // Delay hide so clicks on suggestions register
    setTimeout(hideSuggestions, 180);
});

searchInp.addEventListener('focus', () => {
    if (searchInp.value.trim().length >= 2) fetchSuggestions();
});

/* ── Suggestions logic ── */
async function fetchSuggestions() {
    const term = searchInp.value.trim();
    if (!conn || term.length < 2) { hideSuggestions(); return; }
    const t = esc(term.toUpperCase());
    try {
        const rows = (await conn.query(
            `SELECT texto, fuente FROM (
                SELECT DISTINCT termino_busqueda AS texto, 'término' AS fuente
                FROM medicamentos
                WHERE UPPER(termino_busqueda) LIKE '%${t}%'
                AND termino_busqueda IS NOT NULL
                UNION
                SELECT DISTINCT nombre_producto AS texto, 'producto' AS fuente
                FROM medicamentos
                WHERE UPPER(nombre_producto) LIKE '%${t}%'
                AND nombre_producto IS NOT NULL
            ) combined
            ORDER BY texto LIMIT 8`
        )).toArray();
        renderSuggestions(rows.map(r => ({ texto: r.texto, fuente: r.fuente })).filter(r => r.texto));
    } catch (e) { hideSuggestions(); }
}

function renderSuggestions(items) {
    if (!items.length) { hideSuggestions(); return; }
    const term = searchInp.value.trim().toUpperCase();
    suggestEl.innerHTML = items.map(({ texto, fuente }) => {
        // Bold-highlight the matching portion
        const idx = texto.toUpperCase().indexOf(term);
        let label = texto;
        if (idx !== -1) {
            label = texto.slice(0, idx)
                + `<mark>${texto.slice(idx, idx + term.length)}</mark>`
                + texto.slice(idx + term.length);
        }
        const badge = fuente === 'producto'
            ? `<span class="dg-suggest-badge dg-suggest-badge-prod">producto</span>`
            : `<span class="dg-suggest-badge">término</span>`;
        return `<li data-value="${texto}">${label}${badge}</li>`;
    }).join('');
    suggestEl.classList.add('open');
    suggestEl.querySelectorAll('li').forEach(li => {
        li.addEventListener('mousedown', (e) => {
            e.preventDefault(); // prevent blur
            searchInp.value = li.dataset.value;
            hideSuggestions();
            triggerSearch(0);
        });
    });
}

function hideSuggestions() {
    suggestEl.classList.remove('open');
    suggestEl.innerHTML = '';
}

/* ── Main search query ── */
async function triggerSearch(offset) {
    if (!conn) return;
    const term = searchInp.value.trim();
    const depto = selDepto.value, prov = selProv.value, dist = selDist.value;
    if (!term && !depto) {
        resultsEl.innerHTML = `<div class="digemid-empty"><div class="dg-icon">💊</div><p>Selecciona un departamento o escribe el nombre de un medicamento para comenzar.</p></div>`;
        return;
    }
    setStatus('query', 'Buscando…');
    const clauses = [];
    if (depto) clauses.push(`departamento = '${esc(depto)}'`);
    if (prov)  clauses.push(`provincia = '${esc(prov)}'`);
    if (dist)  clauses.push(`distrito = '${esc(dist)}'`);
    if (term)  {
        const t = esc(term.toUpperCase());
        clauses.push(`(UPPER(termino_busqueda) LIKE '%${t}%' OR UPPER(nombre_producto) LIKE '%${t}%' OR UPPER(sustancia_activa) LIKE '%${t}%')`);
    }
    const WHERE = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
    const ORDER = `ORDER BY precio_soles ${sortDir} NULLS LAST`;
    try {
        currentTotal = Number((await conn.query(`SELECT COUNT(*) as n FROM medicamentos ${WHERE}`)).toArray()[0].n);
        const rows = (await conn.query(
            `SELECT termino_busqueda,nombre_producto,sustancia_activa,concentracion,
                    forma_farmaceutica,laboratorio,precio_soles,tipo_establecimiento,
                    farmacia_botica,direccion,departamento,provincia,distrito
             FROM medicamentos ${WHERE} ${ORDER}
             LIMIT ${PAGE_SIZE} OFFSET ${offset}`
        )).toArray();
        if (offset === 0) currentRows = rows; else currentRows = currentRows.concat(rows);
        currentOffset = offset;
        renderResults();
        setStatus('ready', `${currentTotal.toLocaleString()} resultados encontrados`);
    } catch (e) { setStatus('error', 'Error: ' + e.message); console.error(e); }
}

/* ── Render results table ── */
function renderResults() {
    if (!currentRows.length) {
        resultsEl.innerHTML = `<div class="digemid-empty"><div class="dg-icon">🔎</div><p>Sin resultados. Prueba con otro término o amplía los filtros.</p></div>`;
        return;
    }
    const hasMore = currentTotal > currentOffset + PAGE_SIZE;
    const sortLabel = sortDir === 'ASC' ? '↑ Menor a mayor precio' : '↓ Mayor a menor precio';
    const tbody = currentRows.map((r, i) => {
        const precio = r.precio_soles != null ? `S/ ${Number(r.precio_soles).toFixed(2)}` : '—';
        const isPriv = (r.tipo_establecimiento || '').toLowerCase().includes('priv');
        const isBest = i === 0 && sortDir === 'ASC';
        return `<tr>
        <td><span class="${isBest ? 'dg-td-price dg-td-price-best' : 'dg-td-price'}">${precio}</span></td>
        <td class="dg-td-med"><strong>${r.termino_busqueda || r.nombre_producto || '—'}</strong><span>${[r.nombre_producto, r.concentracion, r.laboratorio].filter(Boolean).join(' · ')}</span></td>
        <td class="dg-td-med"><strong>${r.farmacia_botica || '—'}</strong><span>${r.direccion || ''}</span></td>
        <td class="dg-td-loc">${r.distrito || ''}<br>${r.provincia || ''}<br><strong>${r.departamento || ''}</strong></td>
        <td><span class="${isPriv ? 'dg-tag dg-tag-priv' : 'dg-tag dg-tag-pub'}">${isPriv ? 'Privado' : 'Público'}</span></td>
    </tr>`;
    }).join('');
    resultsEl.innerHTML = `
    <div class="digemid-results-hdr">
        <div class="digemid-results-count"><strong>${currentTotal.toLocaleString()}</strong> resultados · mostrando ${currentRows.length}</div>
        <div class="digemid-sort-note">${sortLabel}</div>
    </div>
    <div class="digemid-table-wrap"><table class="digemid-table"><thead><tr><th>Precio</th><th>Medicamento</th><th>Establecimiento</th><th>Ubicación</th><th>Tipo</th></tr></thead><tbody>${tbody}</tbody></table></div>
    ${hasMore ? `<div class="digemid-load-more-wrap"><button class="digemid-btn-more" id="dgBtnMore">Ver más resultados</button></div>` : ''}`;
    if (hasMore) document.getElementById('dgBtnMore').addEventListener('click', () => triggerSearch(currentOffset + PAGE_SIZE));
}

initDB();
