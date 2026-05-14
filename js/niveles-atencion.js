(function () {
    const btns = Array.from(document.querySelectorAll('.js-nivel-btn'));
    const drPanel = document.getElementById('nivelesDr');
    const panels = Array.from(document.querySelectorAll('.nivel-panel'));
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const wasActive = btn.classList.contains('is-active');
            const n = parseInt(btn.dataset.nivel, 10);

            btns.forEach(b => b.classList.remove('is-active'));
            panels.forEach(p => { p.hidden = true; });

            if (wasActive) {
                drPanel.hidden = false;
            } else {
                btn.classList.add('is-active');
                drPanel.hidden = true;
                void panels[n].offsetWidth;
                panels[n].hidden = false;
            }
        });
    });
})();
