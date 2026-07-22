/* Farolete — leads + UTMs (admin) */
(function (global) {
  const LEADS_KEY = 'farolete_leads_v1';
  const TRACKING_KEY = 'farolete_tracking_v1';
  const UTM_KEY = 'farolete_utm_v1';

  const DEFAULT_TRACKING = {
    gtmId: 'GTM-K9C67C98',
    metaPixelId: '',
    googleAdsId: '',
    tiktokPixelId: '',
    leadsWebhook: ''
  };

  function uid() {
    return 'l_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getLeads() {
    try {
      const raw = localStorage.getItem(LEADS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveLeads(list) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(list));
  }

  function addLead(payload) {
    const leads = getLeads();
    const lead = {
      id: uid(),
      createdAt: new Date().toISOString(),
      name: String(payload.name || '').trim(),
      phone: String(payload.phone || '').trim(),
      phoneDigits: String(payload.phoneDigits || '').replace(/\D/g, ''),
      page: payload.page || (typeof location !== 'undefined' ? location.pathname : ''),
      pageTitle: payload.pageTitle || (typeof document !== 'undefined' ? document.title : ''),
      message: payload.message || '',
      source: payload.source || 'whatsapp',
      utm: payload.utm || getStoredUtm(),
      referrer: payload.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };
    leads.unshift(lead);
    saveLeads(leads);
    return lead;
  }

  function deleteLead(id) {
    saveLeads(getLeads().filter(l => l.id !== id));
  }

  function clearLeads() {
    localStorage.removeItem(LEADS_KEY);
  }

  function getTracking() {
    const base = Object.assign({}, DEFAULT_TRACKING, global.FaroleteSiteConfig || {});
    try {
      const raw = localStorage.getItem(TRACKING_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      return Object.assign({}, base, parsed || {});
    } catch (e) {
      return base;
    }
  }

  function saveTracking(cfg) {
    const clean = {
      gtmId: String(cfg.gtmId || '').trim(),
      metaPixelId: String(cfg.metaPixelId || '').trim(),
      googleAdsId: String(cfg.googleAdsId || '').trim(),
      tiktokPixelId: String(cfg.tiktokPixelId || '').trim(),
      leadsWebhook: String(cfg.leadsWebhook || '').trim()
    };
    localStorage.setItem(TRACKING_KEY, JSON.stringify(clean));
    return clean;
  }

  function captureUtmFromUrl() {
    if (typeof location === 'undefined') return getStoredUtm();
    const params = new URLSearchParams(location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'ttclid'];
    const found = {};
    let has = false;
    keys.forEach(k => {
      const v = params.get(k);
      if (v) { found[k] = v; has = true; }
    });
    if (has) {
      found.capturedAt = new Date().toISOString();
      found.landingPage = location.href;
      try { sessionStorage.setItem(UTM_KEY, JSON.stringify(found)); } catch (e) {}
      try { localStorage.setItem(UTM_KEY, JSON.stringify(found)); } catch (e) {}
      return found;
    }
    return getStoredUtm();
  }

  function getStoredUtm() {
    try {
      const s = sessionStorage.getItem(UTM_KEY) || localStorage.getItem(UTM_KEY);
      return s ? JSON.parse(s) : {};
    } catch (e) {
      return {};
    }
  }

  function onlyDigits(str) {
    return String(str || '').replace(/\D/g, '');
  }

  /** Telefone BR com DDD: 10 ou 11 dígitos */
  function validatePhoneBR(phone) {
    const d = onlyDigits(phone);
    if (d.length < 10 || d.length > 11) return { ok: false, error: 'Informe DDD + número (10 ou 11 dígitos).' };
    const ddd = parseInt(d.slice(0, 2), 10);
    if (ddd < 11 || ddd > 99) return { ok: false, error: 'DDD inválido.' };
    if (d.length === 11 && d[2] !== '9') return { ok: false, error: 'Celular deve começar com 9 após o DDD.' };
    return { ok: true, digits: d, formatted: formatPhoneBR(d) };
  }

  function formatPhoneBR(digits) {
    const d = onlyDigits(digits);
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return d;
  }

  async function postWebhook(lead, webhookUrl) {
    if (!webhookUrl) return;
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
        mode: 'cors',
        keepalive: true
      });
    } catch (e) {
      try {
        navigator.sendBeacon(webhookUrl, new Blob([JSON.stringify(lead)], { type: 'application/json' }));
      } catch (e2) {}
    }
  }

  global.FaroleteLeads = {
    LEADS_KEY,
    TRACKING_KEY,
    UTM_KEY,
    DEFAULT_TRACKING,
    uid,
    getLeads,
    saveLeads,
    addLead,
    deleteLead,
    clearLeads,
    getTracking,
    saveTracking,
    captureUtmFromUrl,
    getStoredUtm,
    onlyDigits,
    validatePhoneBR,
    formatPhoneBR,
    postWebhook
  };
})(window);
