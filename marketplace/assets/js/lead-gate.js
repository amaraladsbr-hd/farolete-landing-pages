/* Farolete — gate de lead antes do WhatsApp (nome + telefone com DDD) */
(function () {
  if (!window.FaroleteLeads) return;

  const WHATSAPP = (window.FaroleteSiteConfig && FaroleteSiteConfig.whatsapp) || '5531999971820';
  let pendingMsg = 'Olá! Vi a página da Farolete e quero saber mais.';
  let pendingEl = null;

  const css = `
  .fl-gate-overlay{
    position:fixed; inset:0; z-index:9999;
    background:rgba(8,8,7,0.78); backdrop-filter:blur(6px);
    display:flex; align-items:flex-start; justify-content:center;
    overflow-y:auto; -webkit-overflow-scrolling:touch;
    padding:max(1rem, env(safe-area-inset-top)) 1rem max(1.2rem, env(safe-area-inset-bottom));
    opacity:0; pointer-events:none; transition:opacity 0.25s ease;
  }
  .fl-gate-overlay.open{ opacity:1; pointer-events:auto; }
  .fl-gate-card{
    width:100%; max-width:420px; margin:min(8vh, 3rem) auto;
    background:#141210; color:#f7f4ee;
    border:1px solid rgba(247,244,238,0.14);
    box-shadow:0 24px 60px rgba(0,0,0,0.5);
    padding:1.6rem 1.4rem 1.4rem; font-family:'Barlow', system-ui, sans-serif;
    transform:translateY(12px); transition:transform 0.3s cubic-bezier(0.22,1,0.36,1);
  }
  .fl-gate-overlay.open .fl-gate-card{ transform:translateY(0); }
  .fl-gate-card h3{
    font-family:'Anton', Impact, sans-serif; font-weight:400;
    font-size:1.45rem; text-transform:uppercase; letter-spacing:0.4px;
    color:#ffc93c; margin:0 0 0.4rem; padding-right:1.6rem;
  }
  .fl-gate-card p{ margin:0 0 1.1rem; color:#a39d91; font-size:0.92rem; line-height:1.5; }
  .fl-gate-field{ margin-bottom:0.9rem; }
  .fl-gate-field label{
    display:block; font-family:'Barlow Condensed', sans-serif; font-weight:600;
    font-size:0.72rem; letter-spacing:1.5px; text-transform:uppercase;
    color:#ffc93c; margin-bottom:0.35rem;
  }
  .fl-gate-field input{
    width:100%; box-sizing:border-box; background:#1c1914;
    border:1px solid rgba(247,244,238,0.14); color:#f7f4ee;
    padding:0.8rem 0.9rem; font:inherit; font-size:16px;
  }
  .fl-gate-field input:focus{ outline:1px solid #ffc93c; }
  .fl-gate-error{
    display:none; color:#ff5a3c; font-size:0.85rem; margin:0.2rem 0 0.8rem;
  }
  .fl-gate-error.show{ display:block; }
  .fl-gate-actions{ display:flex; gap:0.6rem; flex-wrap:wrap; margin-top:0.6rem; }
  .fl-gate-btn{
    flex:1; min-width:120px; border:none; cursor:pointer;
    font-family:'Barlow Condensed', sans-serif; font-weight:700;
    letter-spacing:1px; text-transform:uppercase; font-size:0.88rem;
    padding:0.9rem 1rem; background:#ffc93c; color:#080807;
  }
  .fl-gate-btn:hover{ background:#ff8f1c; }
  .fl-gate-cancel{
    background:transparent; color:#f7f4ee; border:1px solid rgba(247,244,238,0.2);
  }
  .fl-gate-cancel:hover{ border-color:#ffc93c; color:#ffc93c; }
  .fl-gate-close{
    position:absolute; top:0.7rem; right:0.85rem; background:none; border:none;
    color:#a39d91; font-size:1.4rem; cursor:pointer; line-height:1;
  }
  .fl-gate-wrap{ position:relative; }
  @media (max-width:480px){
    .fl-gate-card{ margin:0.6rem auto 2rem; padding:1.35rem 1.15rem 1.2rem; }
    .fl-gate-card h3{ font-size:1.3rem; }
  }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'fl-gate-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'flGateTitle');
  overlay.innerHTML = `
    <div class="fl-gate-wrap fl-gate-card">
      <button type="button" class="fl-gate-close" aria-label="Fechar">&times;</button>
      <h3 id="flGateTitle">Antes de falar conosco</h3>
      <p>Preencha seu nome e WhatsApp com DDD pra gente te atender melhor.</p>
      <div class="fl-gate-error" id="flGateError"></div>
      <form id="flGateForm" autocomplete="on">
        <div class="fl-gate-field">
          <label for="flGateName">Nome completo</label>
          <input id="flGateName" name="name" type="text" required maxlength="80" placeholder="Seu nome" autocomplete="name">
        </div>
        <div class="fl-gate-field">
          <label for="flGatePhone">Telefone / WhatsApp (com DDD)</label>
          <input id="flGatePhone" name="phone" type="tel" inputmode="numeric" required
            placeholder="(31) 99999-0000" autocomplete="tel" maxlength="16">
        </div>
        <div class="fl-gate-actions">
          <button type="button" class="fl-gate-btn fl-gate-cancel">Cancelar</button>
          <button type="submit" class="fl-gate-btn">Continuar no WhatsApp</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);

  const form = overlay.querySelector('#flGateForm');
  const nameEl = overlay.querySelector('#flGateName');
  const phoneEl = overlay.querySelector('#flGatePhone');
  const errEl = overlay.querySelector('#flGateError');

  function scrollFieldIntoView(el) {
    setTimeout(() => {
      try {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } catch (err) {
        el.scrollIntoView(true);
      }
    }, 280);
  }

  function openGate(msg, el) {
    pendingMsg = msg || pendingMsg;
    pendingEl = el || null;
    errEl.classList.remove('show');
    errEl.textContent = '';
    document.body.classList.add('fl-gate-open');
    overlay.classList.add('open');
    overlay.scrollTop = 0;
    setTimeout(() => nameEl.focus(), 50);
  }

  function closeGate() {
    overlay.classList.remove('open');
    document.body.classList.remove('fl-gate-open');
    pendingEl = null;
  }

  function maskPhone(value) {
    const d = FaroleteLeads.onlyDigits(value).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  phoneEl.addEventListener('input', () => {
    phoneEl.value = maskPhone(phoneEl.value);
  });
  nameEl.addEventListener('focus', () => scrollFieldIntoView(nameEl));
  phoneEl.addEventListener('focus', () => scrollFieldIntoView(phoneEl));

  overlay.querySelector('.fl-gate-close').addEventListener('click', closeGate);
  overlay.querySelector('.fl-gate-cancel').addEventListener('click', closeGate);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeGate(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeGate();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameEl.value.trim();
    const phoneCheck = FaroleteLeads.validatePhoneBR(phoneEl.value);
    if (!name || name.length < 2) {
      errEl.textContent = 'Informe seu nome.';
      errEl.classList.add('show');
      nameEl.focus();
      return;
    }
    if (!phoneCheck.ok) {
      errEl.textContent = phoneCheck.error;
      errEl.classList.add('show');
      phoneEl.focus();
      return;
    }

    const utm = FaroleteLeads.getStoredUtm();
    const lead = FaroleteLeads.addLead({
      name,
      phone: phoneCheck.formatted,
      phoneDigits: phoneCheck.digits,
      message: pendingMsg,
      page: location.pathname + location.search,
      pageTitle: document.title,
      source: 'whatsapp_gate',
      utm,
      referrer: document.referrer
    });

    const cfg = FaroleteLeads.getTracking();
    FaroleteLeads.postWebhook(lead, cfg.leadsWebhook);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'farolete_lead',
      lead_name: name,
      lead_phone: phoneCheck.digits,
      lead_page: lead.page,
      utm_source: utm.utm_source || '',
      utm_medium: utm.utm_medium || '',
      utm_campaign: utm.utm_campaign || '',
      utm_content: utm.utm_content || '',
      utm_term: utm.utm_term || ''
    });

    if (window.fbq) {
      try { fbq('track', 'Contact', { content_name: 'WhatsApp Lead' }); } catch (err) {}
      try { fbq('track', 'Lead'); } catch (err) {}
    }
    if (window.ttq) {
      try { ttq.track('Contact'); } catch (err) {}
    }

    // Mensagem do WhatsApp so leva o que a pessoa quer (produto/servico).
    // Nome e telefone ficam so no lead salvo (localStorage + planilha), nao no texto.
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(pendingMsg)}`;
    closeGate();
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (mobile) {
      window.location.href = url;
      return;
    }
    const go = document.createElement('a');
    go.href = url;
    go.target = '_blank';
    go.rel = 'noopener noreferrer';
    document.body.appendChild(go);
    go.click();
    go.remove();
  });

  function resolveMsg(el) {
    if (!el) return pendingMsg;
    const data = el.getAttribute('data-msg');
    if (data) return data;
    try {
      const href = el.getAttribute('href') || '';
      const u = new URL(href, location.href);
      const t = u.searchParams.get('text');
      if (t) return decodeURIComponent(t);
    } catch (err) {}
    return 'Olá! Vi a página da Farolete e quero saber mais.';
  }

  function isWhatsLink(el) {
    if (!el || !el.closest) return null;
    const a = el.closest('a');
    if (!a) return null;
    if (a.classList.contains('whats-cta') || a.classList.contains('mobile-cta-fab')) return a;
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href.includes('wa.me/') || href.includes('api.whatsapp.com') || href.includes('whatsapp.com/send')) return a;
    return null;
  }

  document.addEventListener('click', (e) => {
    const a = isWhatsLink(e.target);
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    openGate(resolveMsg(a), a);
  }, true);

  window.FaroleteLeadGate = { open: openGate, close: closeGate };
})();
