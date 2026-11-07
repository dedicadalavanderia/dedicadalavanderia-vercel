// Contato (07/11/2026, passo 23): cria a PREVIA em rascunho (pagina nova, slug provisorio "previa-contato", titulo final,
// modelo full_width.php, Yoast). A 562 (/contato/) no ar nao muda. Conteudo baixado do ramo temporario pelo commit e conferido
// pela sha. Ritmo: dedRL. Resultado em window.__jobCTP.
(() => {
if (window.__jobCTP && window.__jobCTP.feito === false) return 'ja em andamento: nada feito';
window.__jobCTP = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobCTP;
  const SLUG = "previa-contato", TITULO = "Contato da Dedicada Lavanderia, em Florian\u00f3polis: WhatsApp, e-mail e lojas", SHA = "919a3e1e2f3333c1", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/ce11c07476fc4d11e2bfa266f0167a829c76c5f6/orcamento_04-11/contato_v1.txt";
  const Y_TIT = "Contato e WhatsApp | Dedicada Lavanderia em Florian\u00f3polis", Y_DESC = "WhatsApp (48) 98428-0639, e-mail e as lojas do Centro e do Santa M\u00f4nica, com hor\u00e1rio e como chegar. Coleta e entrega gr\u00e1tis em Florian\u00f3polis.";
  const IMGS = ["/wp-content/uploads/2026/10/dedicada-lavanderia-fachada-centro-florianopolis.webp"];
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
    J.etapa = 'slug';
    const st = 'publish,draft,pending,private,future';
    for (const t of ['pages', 'posts']) {
      const r0 = await dedRL(`/wp-json/wp/v2/${t}?slug=${SLUG}&status=${st}&context=edit&_fields=id,status`, {headers: H, credentials: 'include'});
      const j0 = await r0.json();
      if (!Array.isArray(j0)) throw new Error('resposta estranha ao checar slug em ' + t);
      if (j0.length) throw new Error('slug ocupado em ' + t + ': ' + JSON.stringify(j0));
    }
    J.etapa = 'pagina 562';
    const p562 = await dedLer2('pages', 562);
    J.res.p562 = {sha: p562.sha, st: p562.st, slug: p562.slug};
    if (p562.sha !== 'ab5d8e163a427e32' || p562.st !== 'publish') throw new Error('562 diferente do lido: ' + JSON.stringify(J.res.p562));
    J.etapa = 'imagens';
    J.res.imagens = [];
    for (const u of IMGS) {
      const ri = await dedRL(u, {method: 'HEAD', credentials: 'omit', cache: 'no-store'});
      J.res.imagens.push([u.split('/').pop(), ri.status, ri.headers.get('content-type'), ri.headers.get('content-length')]);
      if (ri.status !== 200) throw new Error('imagem fora do ar: ' + u);
    }
    J.etapa = 'post';
    const r = await dedRL('/wp-json/wp/v2/pages', {method: 'POST', headers: Object.assign({'Content-Type': 'application/json'}, H), credentials: 'include',
      body: JSON.stringify({title: TITULO, slug: SLUG, status: 'draft', parent: 0, template: 'full_width.php', comment_status: 'closed', ping_status: 'closed', content: conteudo})});
    const pag = await r.json();
    J.res.post = {status: r.status, id: pag.id, st: pag.status, slug: pag.slug, template: pag.template};
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
    J.res.formularios = (hp.match(/name="field6\[\]"/g) || []).length;
    J.res.iframes_mapa = (hp.match(/google\.com\/maps\/embed/g) || []).length;
    J.res.h2 = (hp.match(/<h2/g) || []).length;
    J.res.h3 = (hp.match(/<h3/g) || []).length;
    J.res.previa = '/?page_id=' + pag.id + '&preview=true';
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
