// Sustentabilidade (06/11/2026, passo 21): cria a PREVIA em rascunho (pagina nova, slug "sustentabilidade",
// titulo final, Yoast). Nada no ar muda. Conteudo baixado do ramo temporario pelo commit e conferido pela sha. Ritmo: dedRL.
// Resultado em window.__jobSUP.
(() => {
if (window.__jobSUP && window.__jobSUP.feito === false) return 'ja em andamento: nada feito';
window.__jobSUP = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobSUP;
  const SLUG = "sustentabilidade", TITULO = "Lavanderia sustent\u00e1vel em Florian\u00f3polis: o que a Dedicada faz pelo meio ambiente", SHA = "8b8f0d1cd97fedd6", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/8c28df588d7f4ad77b4ecfe2eb9b03b3a4d27eee/orcamento_04-11/sustentabilidade_v1.txt";
  const Y_TIT = "Lavanderia sustent\u00e1vel em Florian\u00f3polis | Dedicada", Y_DESC = "Wet cleaning sem solvente, lavagem a seco em circuito fechado, \u00e1gua tratada, energia solar, rotas por bairro e cabides de volta, na Dedicada Lavanderia.";
  const IMGS = ["/wp-content/uploads/2026/10/dedicada-lavagem-em-agua-roupas-brancas.webp", "/wp-content/uploads/2026/10/dedicada-lavagem-a-seco-firbimatic.webp", "/wp-content/uploads/2026/11/van-dedicada-lavanderia-em-frente-a-predio-residencial.webp"];
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
      for (const q of ['sustent', 'meio ambiente', 'ecol']) {
        const pe = await dedRL(`/wp-json/wp/v2/${t}?search=${encodeURIComponent(q)}&status=${st}&per_page=50&context=edit&_fields=id,status,slug`, {headers: H, credentials: 'include'}).then(r => r.json());
        J.res['busca_' + t + '_' + q] = Array.isArray(pe) ? pe.map(p => [p.id, p.status, p.slug]) : String(pe).slice(0, 120);
      }
    }
    const rd = await dedRL('/wp-json/redirection/v1/redirect?filterBy%5Burl%5D=sustent&per_page=50', {headers: H, credentials: 'include'}).then(r => r.json());
    J.res.redirection = (rd.items || []).map(x => [x.id, x.url, x.action_data && x.action_data.url, x.enabled, x.action_code]);
    if ((rd.items || []).some(x => /^\/sustentabilidade\/?$/.test(x.url))) throw new Error('regra do Redirection em /sustentabilidade/: ' + JSON.stringify(J.res.redirection));
    J.etapa = 'slug';
    for (const t of ['pages', 'posts']) {
      const j = await dedRL(`/wp-json/wp/v2/${t}?slug=${SLUG}&status=${st}&context=edit&_fields=id,status`, {headers: H, credentials: 'include'}).then(r => r.json());
      if (!Array.isArray(j)) throw new Error('resposta estranha ao checar slug em ' + t);
      if (j.length) throw new Error('slug ocupado em ' + t + ': ' + JSON.stringify(j));
    }
    J.etapa = 'imagens';
    J.res.imagens = [];
    for (const u of IMGS) {
      const ri = await dedRL(u, {method: 'HEAD', credentials: 'omit', cache: 'no-store'});
      J.res.imagens.push([u.split('/').pop(), ri.status, ri.headers.get('content-type'), ri.headers.get('content-length')]);
      if (ri.status !== 200) throw new Error('imagem fora do ar: ' + u);
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
    J.res.whats_com_texto = (hp.match(/wa\.me\/5548984280639\?text=/g) || []).length;
    J.res.amp038_conteudo = (hp.split('ded-trilha')[1] || '').split('ded-local')[0].split('&#038;').length - 1;
    J.res.h3 = (hp.match(/<h3/g) || []).length;
    J.res.previa = '/?page_id=' + pag.id + '&preview=true';
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
