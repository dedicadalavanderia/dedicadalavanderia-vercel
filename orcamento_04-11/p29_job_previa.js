// Passo 29 (11/11/2026): PREVIA do hub de coleta com o seletor de bairro, em rascunho (pagina nova, slug provisorio
// "previa-coleta-seletor", o modelo da 1150). A 1150 no ar nao muda. Conteudo baixado do ramo temporario pelo commit e
// conferido pela sha. Ritmo: dedRL. Resultado em window.__jobP29P.
(() => {
if (window.__jobP29P && window.__jobP29P.feito === false) return 'ja em andamento: nada feito';
window.__jobP29P = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobP29P;
  const SLUG = "previa-coleta-seletor", TITULO = "Pr\u00e9via do passo 29: Coleta e entrega com o seletor de bairro", SHA = "3d8f58adfe112a70", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/92e610c68bfa068b3a466840dff4c80578e6184e/orcamento_04-11/p29_hub_previa_v1.txt", HUB_DE = "905aa27b5b060e4b", JS_SHA = "9d8886af4aa31e5b";
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
    J.etapa = 'hub no ar';
    const hub = await dedLer2('pages', 1150);
    J.res.hub = {sha: hub.sha, st: hub.st, slug: hub.slug};
    if (hub.sha !== HUB_DE || hub.st !== 'publish') throw new Error('1150 diferente do esperado: ' + JSON.stringify(J.res.hub));
    const rm = await dedRL('/wp-json/wp/v2/pages/1150?context=edit&_fields=template,parent,comment_status', {headers: H, credentials: 'include'});
    const meta = await rm.json();
    J.res.hub.template = meta.template; J.res.hub.parent = meta.parent;
    J.etapa = 'slug';
    const st = 'publish,draft,pending,private,future';
    const r1 = await dedRL(`/wp-json/wp/v2/posts?slug=${SLUG}&status=${st}&context=edit&_fields=id,status`, {headers: H, credentials: 'include'});
    const j1 = await r1.json();
    if (!Array.isArray(j1) || j1.length) throw new Error('slug ocupado em posts: ' + JSON.stringify(j1).slice(0, 200));
    const r0 = await dedRL(`/wp-json/wp/v2/pages?slug=${SLUG}&status=${st}&context=edit&_fields=id,status,slug`, {headers: H, credentials: 'include'});
    const j0 = await r0.json();
    if (!Array.isArray(j0) || j0.length > 1) throw new Error('resposta estranha ao checar o slug: ' + JSON.stringify(j0).slice(0, 200));
    let id = 0;
    if (j0.length) {
      if (j0[0].status !== 'draft') throw new Error('a pagina com o slug da previa nao e rascunho: ' + JSON.stringify(j0[0]));
      id = j0[0].id;
      J.etapa = 'regravar o rascunho';
      const g = await dedGravar2('pages', id, conteudo, SHA);
      J.res.gravar = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('o rascunho nao ficou: ' + JSON.stringify(g));
    } else {
      J.etapa = 'criar o rascunho';
      const r = await dedRL('/wp-json/wp/v2/pages', {method: 'POST', headers: Object.assign({'Content-Type': 'application/json'}, H), credentials: 'include',
        body: JSON.stringify({title: TITULO, slug: SLUG, status: 'draft', parent: 0, template: meta.template || '', comment_status: 'closed', ping_status: 'closed', content: conteudo})});
      const pag = await r.json();
      J.res.post = {status: r.status, id: pag.id, st: pag.status, slug: pag.slug, template: pag.template};
      if (!pag.id) throw new Error('POST sem id: ' + JSON.stringify(pag).slice(0, 200));
      id = pag.id;
    }
    J.res.id = id;
    J.etapa = 'reler';
    const re = await dedLer2('pages', id);
    J.res.relido = {sha: re.sha, len: re.len, st: re.st, slug: re.slug, ok: re.sha === SHA && re.st === 'draft'};
    if (!J.res.relido.ok) throw new Error('releitura nao bate: ' + JSON.stringify(J.res.relido));
    J.etapa = 'previa';
    const hp = await dedRL('/?page_id=' + id + '&preview=true&nc=' + Date.now(), {credentials: 'include', cache: 'no-store'}).then(r => r.text());
    const i = hp.indexOf('<div class="ded-rs"'), k = hp.indexOf('</script>', i);
    const cx = i >= 0 && k > i ? hp.slice(i, k) : '';
    const js = cx.slice(cx.indexOf('<script>') + 8);
    J.res.caixa = {achou: i >= 0, len: cx.length, p: (cx.match(/<p[ >]/g) || []).length, br: (cx.match(/<br/g) || []).length,
      opcoes: (cx.match(/<option /g) || []).length, h3: (cx.match(/<h3 class="ded-rs-t">/g) || []).length,
      js_len: js.length, js_sha: await dedSha16(js), js_ok: (await dedSha16(js)) === JS_SHA,
      css: (hp.match(/\.ded-rs\{max-width:640px/g) || []).length, entidade_no_js: (js.match(/&#?\w+;/g) || []).length};
    J.res.depois_da_caixa = hp.slice(k, k + 160);
    J.res.antes_da_caixa = hp.slice(Math.max(0, i - 200), i);
    J.res.previa = '/?page_id=' + id + '&preview=true';
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
