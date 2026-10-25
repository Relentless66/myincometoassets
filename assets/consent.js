/*
 * Cookie consent for Google Analytics (Consent Mode).
 * Loads BEFORE the Google tag. Analytics cookies stay off until the visitor
 * clicks Accept. The choice is remembered in localStorage.
 */
(function () {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    var KEY = 'i2a_consent';

    function read() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function write(value) {
        try { localStorage.setItem(KEY, value); } catch (e) { /* storage unavailable */ }
    }

    // Everything denied until the visitor says otherwise.
    gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
    });

    function apply(choice) {
        gtag('consent', 'update', {
            analytics_storage: choice === 'granted' ? 'granted' : 'denied'
        });
    }

    var saved = read();
    if (saved === 'granted' || saved === 'denied') apply(saved);

    var banner = null;

    function injectStyles() {
        if (document.getElementById('i2a-consent-css')) return;
        var css = document.createElement('style');
        css.id = 'i2a-consent-css';
        css.textContent =
            '#i2a-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:720px;margin:0 auto;' +
            'background:#0a170e;border:1px solid rgba(212,175,55,.45);border-radius:14px;padding:18px 20px;' +
            'box-shadow:0 18px 50px rgba(0,0,0,.6);color:#eef1ea;font:400 .9rem/1.55 Inter,system-ui,sans-serif}' +
            '#i2a-consent p{margin:0 0 14px;color:#cfd8cc}' +
            '#i2a-consent a{color:#f6dd8a;text-decoration:underline}' +
            '#i2a-consent .i2a-row{display:flex;gap:10px;flex-wrap:wrap}' +
            '#i2a-consent button{cursor:pointer;font:700 .8rem Montserrat,system-ui,sans-serif;letter-spacing:.08em;' +
            'text-transform:uppercase;padding:11px 20px;border-radius:999px;border:1px solid rgba(212,175,55,.45)}' +
            '#i2a-consent .i2a-accept{background:linear-gradient(135deg,#f8e08e,#d9a93a 45%,#f3d272 70%,#b5841f);color:#1a1203;border-color:transparent}' +
            '#i2a-consent .i2a-decline{background:transparent;color:#f6dd8a}' +
            '#i2a-consent button:focus-visible{outline:2px solid #f6dd8a;outline-offset:2px}';
        document.head.appendChild(css);
    }

    function choose(choice) {
        write(choice);
        apply(choice);
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
        banner = null;
    }

    function showBanner() {
        if (banner) return;
        injectStyles();
        banner = document.createElement('div');
        banner.id = 'i2a-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');

        var text = document.createElement('p');
        text.innerHTML = 'We use Google Analytics cookies to count visits and clicks to our Skool page. ' +
            'They only run if you accept. <a href="/privacy.html">Privacy Policy</a>';

        var row = document.createElement('div');
        row.className = 'i2a-row';

        var accept = document.createElement('button');
        accept.type = 'button';
        accept.className = 'i2a-accept';
        accept.textContent = 'Accept';
        accept.addEventListener('click', function () { choose('granted'); });

        var decline = document.createElement('button');
        decline.type = 'button';
        decline.className = 'i2a-decline';
        decline.textContent = 'Decline';
        decline.addEventListener('click', function () { choose('denied'); });

        row.appendChild(accept);
        row.appendChild(decline);
        banner.appendChild(text);
        banner.appendChild(row);
        document.body.appendChild(banner);
    }

    // Lets the footer "Cookie settings" link reopen the banner.
    window.openCookieSettings = showBanner;

    function init() {
        if (saved !== 'granted' && saved !== 'denied') showBanner();
        var link = document.getElementById('cookie-settings');
        if (link) link.addEventListener('click', showBanner);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
