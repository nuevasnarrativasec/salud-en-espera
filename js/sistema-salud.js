(function () {
    const btns = Array.from(document.querySelectorAll('.js-subsector'));
    const details = Array.from(document.querySelectorAll('.ss-detail'));
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const n = parseInt(btn.dataset.subsector, 10);
            const isOpen = btn.classList.contains('is-active');

            btns.forEach(b => b.classList.remove('is-active'));
            details.forEach(d => d.classList.remove('is-open'));

            if (!isOpen) {
                btn.classList.add('is-active');
                details[n].classList.add('is-open');
                if (window.innerWidth >= 768) {
                    details[n].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    });
})();
