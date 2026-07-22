/* Farolete — injeta GTM, Meta Pixel, TikTok e captura UTMs */
(function () {
  if (!window.FaroleteLeads) return;
  const cfg = FaroleteLeads.getTracking();
  FaroleteLeads.captureUtmFromUrl();

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': Date.now(),
    event: 'gtm.js',
    farolete_utm: FaroleteLeads.getStoredUtm()
  });

  function injectGtm(id) {
    if (!id || document.getElementById('farolete-gtm')) return;
    const s = document.createElement('script');
    s.id = 'farolete-gtm';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);

    // noscript fallback
    if (!document.getElementById('farolete-gtm-ns')) {
      const ns = document.createElement('noscript');
      ns.id = 'farolete-gtm-ns';
      ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=' +
        encodeURIComponent(id) + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
      const mount = () => {
        if (document.body) document.body.insertBefore(ns, document.body.firstChild);
        else document.addEventListener('DOMContentLoaded', mount);
      };
      mount();
    }
  }

  function injectMetaPixel(id) {
    if (!id || window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', id);
    fbq('track', 'PageView');
  }

  function injectTikTok(id) {
    if (!id || window.ttq) return;
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
      ttq.load = function (e, n) {
        var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = i;
        ttq._t = ttq._t || {}; ttq._t[e] = +new Date; ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        var o = document.createElement('script'); o.type = 'text/javascript'; o.async = !0; o.src = i + '?sdkid=' + e + '&lib=' + t;
        var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o, a);
      };
      ttq.load(id); ttq.page();
    }(window, document, 'ttq');
  }

  if (cfg.gtmId) injectGtm(cfg.gtmId);
  if (cfg.metaPixelId) injectMetaPixel(cfg.metaPixelId);
  if (cfg.tiktokPixelId) injectTikTok(cfg.tiktokPixelId);

  // Google Ads tag via gtag se ID informado (além do GTM)
  if (cfg.googleAdsId && !window.gtag) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.googleAdsId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', cfg.googleAdsId);
  }
})();
