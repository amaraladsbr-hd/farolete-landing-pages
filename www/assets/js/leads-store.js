/* Farolete — leads + UTMs (admin) */
(function (global) {
  const LEADS_KEY = 'farolete_leads_v1';
  const TRACKING_KEY = 'farolete_tracking_v1';
  const UTM_KEY = 'farolete_utm_v1';
  const STAGE_KEY = 'farolete_lead_stage_v1';

  const DEFAULT_TRACKING = {
    gtmId: 'GTM-K9C67C98',
    metaPixelId: '',
    googleAdsId: '',
    tiktokPixelId: '',
    leadsWebhook: '',
    leadsReadKey: ''
  };

  const DEFAULT_STAGES = [
    { id: 'novo', label: 'Novo', color: '#ffc93c' },
    { id: 'contatado', label: 'Contatado', color: '#5aa9ff' },
    { id: 'orcamento', label: 'Orçamento enviado', color: '#b388ff' },
    { id: 'fechado', label: 'Fechado', color: '#3dd68c' },
    { id: 'perdido', label: 'Perdido', color: '#ff5a3c' }
  ];

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
      leadsWebhook: String(cfg.leadsWebhook || '').trim(),
      leadsReadKey: String(cfg.leadsReadKey || '').trim()
    };
    localStorage.setItem(TRACKING_KEY, JSON.stringify(clean));
    return clean;
  }

  /** Le os leads direto da planilha (via doGet do Apps Script). */
  async function fetchRemoteLeads(cfg) {
    const c = cfg || getTracking();
    if (!c.leadsWebhook) return [];
    const url = c.leadsWebhook + '?key=' + encodeURIComponent(c.leadsReadKey || '');
    const res = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const rows = await res.json();
    if (rows && rows.error) throw new Error(rows.error);
    if (!Array.isArray(rows)) return [];
    return rows.map(normalizeRemoteLead).filter(Boolean);
  }

  function normalizeRemoteLead(row) {
    if (!row || !row.id) return null;
    return {
      id: String(row.id),
      createdAt: row.createdAt || '',
      name: row.name || '',
      phone: row.phone || '',
      phoneDigits: onlyDigits(row.phoneDigits || row.phone || ''),
      page: row.page || '',
      pageTitle: row.pageTitle || '',
      message: row.message || '',
      source: row.source || '',
      utm: {
        utm_source: row.utm_source || '',
        utm_medium: row.utm_medium || '',
        utm_campaign: row.utm_campaign || '',
        utm_content: row.utm_content || '',
        utm_term: row.utm_term || '',
        gclid: row.gclid || '',
        fbclid: row.fbclid || '',
        ttclid: row.ttclid || '',
        landingPage: row.landingPage || ''
      },
      referrer: row.referrer || '',
      userAgent: row.userAgent || '',
      remote: true
    };
  }

  /** Funil (Kanban) — etapa/observacoes ficam neste navegador (nao voltam pra planilha). */
  function getStageMap() {
    try {
      const raw = localStorage.getItem(STAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStageMap(map) {
    localStorage.setItem(STAGE_KEY, JSON.stringify(map));
  }

  function getStage(id) {
    const map = getStageMap();
    return (map[id] && map[id].stage) || DEFAULT_STAGES[0].id;
  }

  function setStage(id, stage, notes) {
    const map = getStageMap();
    const prev = map[id] || {};
    map[id] = { stage: stage || prev.stage || DEFAULT_STAGES[0].id, notes: notes != null ? notes : (prev.notes || ''), updatedAt: new Date().toISOString() };
    saveStageMap(map);
    return map[id];
  }

  function getNotes(id) {
    const map = getStageMap();
    return (map[id] && map[id].notes) || '';
  }

  /** Junta leads da planilha com os salvos localmente (fallback), sem duplicar por id, aplicando etapa do funil. */
  function mergeLeads(remoteLeads, localLeads) {
    const byId = new Map();
    (localLeads || []).forEach(l => byId.set(l.id, l));
    (remoteLeads || []).forEach(l => byId.set(l.id, l)); // planilha tem prioridade quando ha o mesmo id
    const merged = Array.from(byId.values());
    merged.forEach(l => { l.stage = getStage(l.id); });
    merged.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return merged;
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
      // no-cors + text/plain: evita o preflight OPTIONS que o Apps Script
      // (e a maioria dos webhooks tipo Make/n8n) nao responde, o que faria
      // o POST cair silenciosamente mesmo com a URL certa configurada.
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(lead),
        mode: 'no-cors',
        keepalive: true
      });
    } catch (e) {
      try {
        navigator.sendBeacon(webhookUrl, new Blob([JSON.stringify(lead)], { type: 'text/plain;charset=utf-8' }));
      } catch (e2) {}
    }
  }

  global.FaroleteLeads = {
    LEADS_KEY,
    TRACKING_KEY,
    UTM_KEY,
    DEFAULT_TRACKING,
    DEFAULT_STAGES,
    uid,
    getLeads,
    saveLeads,
    addLead,
    deleteLead,
    clearLeads,
    getTracking,
    saveTracking,
    fetchRemoteLeads,
    mergeLeads,
    getStage,
    setStage,
    getNotes,
    captureUtmFromUrl,
    getStoredUtm,
    onlyDigits,
    validatePhoneBR,
    formatPhoneBR,
    postWebhook
  };
})(window);
