window.Ekklesia.createCampaignCarousel = function (limit = 3) {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const formatNumber = value => value.toLocaleString('pt-BR');
  const numeric = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const dateKey = date => date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
  const formatDate = key => key.split('-').reverse().join('/');

  let data = null, campaigns = [], campaignIndex = 0;
  // Os registros atuais usam quantidades. Valores monetários só entram quando fornecidos explicitamente.
  function campaignView(row) {
    const money = numeric(row.raisedAmount) && numeric(row.targetAmount);
    return {
      id: row.id, title: row.nome, description: row.description || row.descricao || 'Acompanhe a arrecadação de ' + row.tipo.toLocaleLowerCase('pt-BR') + ' e as entregas desta campanha.',
      raised: money ? row.raisedAmount : row.arrecadado,
      target: money ? row.targetAmount : row.meta,
      monetary: money, unit: row.unidade,
      donations: numeric(row.donations) ? row.donations : null,
      delivered: row.entregue,
      families: numeric(row.families) ? row.families : null,
      status: row.status, qrCode: row.qrCode || null, paymentUrl: row.paymentUrl || null,
      qrCodeDemonstrativo: row.qrCodeDemonstrativo === true
    };
  }
  function safePaymentUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
    catch { return null; }
  }
  function safeQrSource(value) {
    if (typeof value !== 'string' || !value) return null;
    if (/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)) return value;
    try {
      const url = new URL(value, new URL('../', window.location.href));
      const local = url.origin === window.location.origin && ['http:','https:','file:'].includes(url.protocol);
      return local || url.protocol === 'https:' ? url.href : null;
    } catch { return null; }
  }
  function updateCarouselIndicators() {
    $$('[data-campaign-index]').forEach((button,index) => {
      button.disabled = !campaigns[index];
      button.setAttribute('aria-pressed', String(Boolean(campaigns[index]) && index === campaignIndex));
      button.setAttribute('aria-label', 'Campanha ' + (index+1) + (campaigns[index] ? ': '+campaigns[index].title : ': não disponível'));
    });
    $('#previous-campaign').disabled = campaigns.length < 2;
    $('#next-campaign').disabled = campaigns.length < 2;
  }
  function loadCampaign(index = 0, announce = false) {
    campaignIndex = campaigns.length ? (index + campaigns.length) % campaigns.length : 0;
    const campaign = campaigns[campaignIndex];
    updateCarouselIndicators();
    $('#campaign-metrics').hidden = !campaign;
    $('#campaign-donation').hidden = !campaign;
    $('#campaign-status').textContent = campaign ? campaign.status.toUpperCase() : 'CAMPANHAS';
    $('#campaign-title').textContent = campaign?.title || 'Nenhuma campanha cadastrada';
    $('#campaign-description').textContent = campaign?.description || 'As campanhas cadastradas aparecerão aqui.';
    $('#campaign-slide').setAttribute('aria-label', campaign ? 'Campanha '+(campaignIndex+1)+' de '+campaigns.length : 'Nenhuma campanha');
    if (!campaign) return;
    const amount = value => campaign.monetary ? value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) : formatNumber(value)+' '+campaign.unit;
    const percent = campaign.target > 0 ? Math.round(campaign.raised / campaign.target * 100) : null;
    $('#campaign-raised').textContent = amount(campaign.raised);
    $('#campaign-target').textContent = 'Meta: ' + amount(campaign.target);
    $('#campaign-percent').textContent = percent === null ? 'Meta não definida' : formatNumber(percent)+'%';
    $('#campaign-progress').value = Math.min(percent ?? 0,100);
    $('#campaign-progress').setAttribute('aria-valuetext', percent === null ? 'Meta não definida' : percent+'% da meta');
    $('#campaign-donations').textContent = campaign.donations === null ? 'Não informado' : formatNumber(campaign.donations);
    $('#campaign-other').textContent = campaign.families === null ? formatNumber(campaign.delivered)+' '+campaign.unit : formatNumber(campaign.families);
    $('#campaign-other-label').textContent = campaign.families === null ? 'Entregue' : 'Famílias atendidas';
    const qr = safeQrSource(campaign.qrCode);
    const qrImage = $('#campaign-qr-image');
    qrImage.hidden = !qr;
    $('#campaign-qr-placeholder').hidden = Boolean(qr);
    $('#campaign-qr-placeholder').innerHTML = 'QR Code<br>não configurado';
    qrImage.onerror = () => { qrImage.hidden = true; $('#campaign-qr-placeholder').hidden = false; $('#campaign-qr-placeholder').textContent = 'QR Code indisponível'; };
    if (qr) { qrImage.src = qr; qrImage.alt = 'QR Code '+(campaign.qrCodeDemonstrativo?'demonstrativo ':'')+'da campanha '+campaign.title; }
    else { qrImage.removeAttribute('src'); qrImage.alt = ''; }
    const url = campaign.qrCodeDemonstrativo ? null : safePaymentUrl(campaign.paymentUrl);
    $('#donate-link').hidden = !url;
    $('#donate-unavailable').hidden = Boolean(url);
    if (url) $('#donate-link').href = url;
    else $('#donate-link').removeAttribute('href');
    $('#campaign-payment-note').textContent = campaign.qrCodeDemonstrativo ? 'QR Code demonstrativo. Não efetue pagamentos de teste.' : url ? 'Doação pelo link configurado da campanha.' : qr ? 'QR Code cadastrado. Link de doação não configurado.' : 'Doação online ainda indisponível.';
    if (announce) $('#campaign-announcement').textContent = 'Campanha '+(campaignIndex+1)+' de '+campaigns.length+': '+campaign.title;
    const slide = $('#campaign-slide');
    slide.classList.remove('campaign-enter');
    void slide.offsetWidth;
    slide.classList.add('campaign-enter');
  }
  function loadCampaigns() {
    const activeId = campaigns[campaignIndex]?.id;
    const priority = {'Em andamento':0,'Planejada':1,'Concluída':2};
    campaigns = data ? [...data.campanhas].sort((a,b)=>priority[a.status]-priority[b.status]).slice(0,limit).map(campaignView) : [];
    if (limit !== 3) $('.carousel-dots').innerHTML = campaigns.map((row,index)=>'<button type="button" data-campaign-index="'+index+'" aria-label="Campanha '+(index+1)+'"></button>').join('');
    loadCampaign(Math.max(0,campaigns.findIndex(row=>row.id===activeId)));
  }
  function advanceCampaign() { loadCampaign(campaignIndex+1, true); }
  function previousCampaign() { loadCampaign(campaignIndex-1, true); }


  $('#previous-campaign').addEventListener('click', previousCampaign);
  $('#next-campaign').addEventListener('click', advanceCampaign);
  $('.carousel-dots').addEventListener('click',event=>{
    const button=event.target.closest('[data-campaign-index]');
    if(button && !button.disabled) loadCampaign(Number(button.dataset.campaignIndex),true);
  });
  $('.dashboard-carousel').addEventListener('keydown', event=>{
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    if (event.key==='ArrowLeft') previousCampaign(); else advanceCampaign();
  });

  return { update(rows) { data = {campanhas: rows}; loadCampaigns(); } };
};