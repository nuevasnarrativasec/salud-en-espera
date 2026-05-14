(function () {
    var iframe = document.getElementById('desabastecimientoIframe');
    if (!iframe) return;
    var fired = false;

    function sendAnimate() {
        if (fired) return;
        fired = true;
        // El iframe puede no haber cargado aún: esperamos load antes de postear
        function post() { iframe.contentWindow.postMessage('animate-bars', '*'); }
        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            post();
        } else {
            iframe.addEventListener('load', post, { once: true });
        }
    }

    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) sendAnimate();
    }, { threshold: 0.1 });

    observer.observe(iframe);
})();
