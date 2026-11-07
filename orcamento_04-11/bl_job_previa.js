// Blog (07/11/2026, passo 25): cria a PREVIA da /blog/ em rascunho (pagina nova "blog-previa-25", modelo blog-masonry.php,
// conteudo v1). Nada no ar muda. Conteudo baixado do ramo temporario pelo commit e conferido pela sha. Ritmo: dedRL.
// Resultado em window.__jobBLP.
(() => {
if (window.__jobBLP && window.__jobBLP.feito === false) return 'ja em andamento: nada feito';
window.__jobBLP = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobBLP;
  const SLUG = "blog-previa-25", TITULO = "Blog (pr\u00e9via do passo 25, 07/11)", SHA = "2f3987d2fc94735b", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/38184fa74b49261b006706338bdb593c7fc76bde/orcamento_04-11/blog_916_v1.txt";
  const Y_TIT = "Blog da Dedicada Lavanderia: manchas, tecidos e cuidados", Y_DESC = "Dicas dos s\u00f3cios da Dedicada Lavanderia, em Florian\u00f3polis desde 2003: manchas, seda e linho, l\u00e3, cama e beb\u00ea, roupas do dia a dia e quando usar lavanderia.";
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
      const j = await dedRL(`/wp-json/wp/v2/${t}?slug=${SLUG}&status=${st}&context=edit&_fields=id,status`, {headers: H, credentials: 'include'}).then(r => r.json());
      if (!Array.isArray(j)) throw new Error('resposta estranha ao checar slug em ' + t);
      if (j.length) throw new Error('slug ocupado em ' + t + ': ' + JSON.stringify(j));
    }
    J.etapa = 'a 916 antes';
    const a = await dedLer2('pages', 916);
    J.res.p916 = {sha: a.sha, len: a.len, st: a.st, slug: a.slug};
    if (a.sha !== '330601134e86bdb5') throw new Error('a 916 mudou desde a leitura: ' + a.sha);
    J.etapa = 'post';
    const r = await dedRL('/wp-json/wp/v2/pages', {method: 'POST', headers: Object.assign({'Content-Type': 'application/json'}, H), credentials: 'include',
      body: JSON.stringify({title: TITULO, slug: SLUG, status: 'draft', parent: 0, template: 'blog-masonry.php', comment_status: 'closed', ping_status: 'closed', content: conteudo})});
    const pag = await r.json();
    J.res.post = {status: r.status, id: pag.id, st: pag.status, slug: pag.slug, template: pag.template};
    if (!pag.id) throw new Error('POST sem id: ' + JSON.stringify(pag).slice(0, 200));
    J.etapa = 'reler';
    const re = await dedLer2('pages', pag.id);
    J.res.relido = {sha: re.sha, len: re.len, st: re.st, slug: re.slug, ok: re.sha === SHA && re.st === 'draft' && re.slug === SLUG};
    if (!J.res.relido.ok) throw new Error('releitura nao bate: ' + JSON.stringify(J.res.relido));
    J.etapa = 'yoast';
    J.res.yoast = await dedYoast2(pag.id, Y_TIT, Y_DESC);
    J.etapa = 'previa';
    const hp = await dedRL('/?page_id=' + pag.id + '&preview=true', {credentials: 'include'}).then(r => r.text());
    const b = (hp.match(/<body[^>]*class="([^"]*)"/) || [])[1] || '';
    const lds = [...hp.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
    let ldOk = 0; for (const s of lds) { try { JSON.parse(s); ldOk++; } catch (e) {} }
    J.res.html = {len: hp.length, titulo_escondido: /qode-title-hidden/.test(b), h1: [...hp.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim().slice(0, 90)),
      h2_ids: [...hp.matchAll(/<h2 id="([^"]+)"/g)].map(m => m[1]), artigos_masonry: (hp.match(/<article /g) || []).length,
      ld: lds.length, ld_ok: ldOk, wa_com_texto: (hp.match(/wa\.me\/5548984280639\?text=/g) || []).length, branco: /color: #ffffff/.test(hp),
      posts_linkados: (hp.match(/class="ded-bl-lista"/g) || []).length, paginacao: /class="pagination"/.test(hp)};
    J.res.previa = '/?page_id=' + pag.id + '&preview=true';
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
