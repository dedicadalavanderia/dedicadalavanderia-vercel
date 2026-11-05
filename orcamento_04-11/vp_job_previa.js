// Vale-presente (05/11/2026, passo 18): cria a PREVIA em rascunho (pagina nova, slug "vale-presente", titulo final, Yoast).
// Nada no ar muda. Conteudo baixado do ramo temporario pelo commit e conferido pela sha. Ritmo: dedRL. Resultado em window.__jobVPP.
(() => {
if (window.__jobVPP && window.__jobVPP.feito === false) return 'ja em andamento: nada feito';
window.__jobVPP = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobVPP;
  const SLUG = "vale-presente", TITULO = "Vale-presente da Dedicada Lavanderia: d\u00ea de presente roupa lavada e passada", SHA = "8bd227fff04f264f", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/8ea026c40ffdcfd7fb840cbd6116a964c2c19ff1/orcamento_04-11/vale_v1.txt";
  const Y_TIT = "Vale-presente de lavanderia em Florian\u00f3polis | Dedicada", Y_DESC = "Vale-presente da Dedicada Lavanderia no valor que voc\u00ea escolher, para usar em qualquer servi\u00e7o em at\u00e9 3 meses. Compra pelo WhatsApp ou na loja.";
  const faixa = (h) => { const b = (h.match(/<body[^>]*class="([^"]*)"/) || [])[1] || ''; const h1 = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()); return {titulo_escondido: /qode-title-hidden/.test(b), h1}; };
  try {
    J.etapa = 'baixar';
    const conteudo = await fetch(RAW, {cache: 'no-store'}).then(r => r.text());
    J.res.baixado = {len: conteudo.length, sha: await dedSha16(conteudo)};
    if (J.res.baixado.sha !== SHA) throw new Error('sha do arquivo baixado diferente');
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const n = (await rn.text()).trim();
    if (!/^[a-f0-9]{10}$/.test(n)) throw new Error('nonce invalido');
    sessionStorage.setItem('ded_nonce', n);
    const H = {'X-WP-Nonce': n};
    J.etapa = 'leituras';
    const st = 'publish,draft,pending,private,future';
    for (const t of ['pages', 'posts']) {
      const pe = await dedRL(`/wp-json/wp/v2/${t}?search=presente&status=${st}&per_page=50&context=edit&_fields=id,status,slug`, {headers: H, credentials: 'include'}).then(r => r.json());
      J.res['busca_' + t] = Array.isArray(pe) ? pe.map(p => [p.id, p.status, p.slug]) : String(pe).slice(0, 120);
    }
    const rd = await dedRL('/wp-json/redirection/v1/redirect?filterBy%5Burl%5D=presente&per_page=50', {headers: H, credentials: 'include'}).then(r => r.json());
    J.res.redirection = (rd.items || []).map(x => [x.id, x.url, x.action_data && x.action_data.url, x.enabled, x.action_code]);
    if ((rd.items || []).some(x => /^\/vale-presente\/?$/.test(x.url))) throw new Error('regra do Redirection em /vale-presente/: ' + JSON.stringify(J.res.redirection));
    J.etapa = 'slug';
    for (const t of ['pages', 'posts']) {
      const j = await dedRL(`/wp-json/wp/v2/${t}?slug=${SLUG}&status=${st}&context=edit&_fields=id,status`, {headers: H, credentials: 'include'}).then(r => r.json());
      if (!Array.isArray(j)) throw new Error('resposta estranha ao checar slug em ' + t);
      if (j.length) throw new Error('slug ocupado em ' + t + ': ' + JSON.stringify(j));
    }
    J.etapa = 'post';
    const r = await dedRL('/wp-json/wp/v2/pages', {method: 'POST', headers: Object.assign({'Content-Type': 'application/json'}, H), credentials: 'include',
      body: JSON.stringify({title: TITULO, slug: SLUG, status: 'draft', parent: 0, template: '', comment_status: 'closed', ping_status: 'closed', content: conteudo})});
    const pag = await r.json();
    J.res.post = {status: r.status, id: pag.id, st: pag.status, slug: pag.slug};
    if (!pag.id) throw new Error('POST sem id: ' + JSON.stringify(pag).slice(0, 200));
    J.etapa = 'reler';
    const re = await dedLer2('pages', pag.id);
    J.res.relido = {sha: re.sha, len: re.len, st: re.st, slug: re.slug, title: re.title, ok: re.sha === SHA && re.st === 'draft' && re.slug === SLUG};
    if (!J.res.relido.ok) throw new Error('releitura nao bate: ' + JSON.stringify(J.res.relido));
    J.etapa = 'yoast';
    J.res.yoast = await dedYoast2(pag.id, Y_TIT, Y_DESC);
    J.etapa = 'previa';
    const hp = await dedRL('/?page_id=' + pag.id + '&preview=true', {credentials: 'include'}).then(r => r.text());
    J.res.faixa = faixa(hp);
    J.res.whats = (hp.match(/wa\.me\/5548984280639\?text=/g) || []).length;
    J.res.amp038 = (hp.match(/&#038;/g) || []).length;
    J.res.previa = '/?page_id=' + pag.id + '&preview=true';
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
