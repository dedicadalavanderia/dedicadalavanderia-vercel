// Rodape (07/11/2026, passo 24): cria a PREVIA em rascunho (pagina nova, slug provisorio "previa-rodape"). O rodape do ar
// (widget custom_html-6 e pagina 2533) nao muda. Conteudo baixado do ramo temporario pelo commit e conferido pela sha.
// Ritmo: dedRL. Resultado em window.__jobRDP.
(() => {
if (window.__jobRDP && window.__jobRDP.feito === false) return 'ja em andamento: nada feito';
window.__jobRDP = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobRDP;
  const SLUG = "previa-rodape", TITULO = "Pr\u00e9via do rodap\u00e9 novo", SHA = "77978afd6d96f9bd", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/6567311db557e622ce6f512234285658fe4d8b48/orcamento_04-11/rodape_previa_v1.txt";
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
      const j0 = await dedRL(`/wp-json/wp/v2/${t}?slug=${SLUG}&status=${st}&context=edit&_fields=id,status`, {headers: H, credentials: 'include'}).then(r => r.json());
      if (!Array.isArray(j0)) throw new Error('resposta estranha ao checar slug em ' + t);
      if (j0.length) throw new Error('slug ocupado em ' + t + ': ' + JSON.stringify(j0));
    }
    J.etapa = 'post';
    const r = await dedRL('/wp-json/wp/v2/pages', {method: 'POST', headers: Object.assign({'Content-Type': 'application/json'}, H), credentials: 'include',
      body: JSON.stringify({title: TITULO, slug: SLUG, status: 'draft', parent: 0, template: '', comment_status: 'closed', ping_status: 'closed', content: conteudo})});
    const pag = await r.json();
    J.res.post = {status: r.status, id: pag.id, st: pag.status, slug: pag.slug};
    if (!pag.id) throw new Error('POST sem id: ' + JSON.stringify(pag).slice(0, 200));
    J.etapa = 'reler';
    const re = await dedLer2('pages', pag.id);
    J.res.relido = {sha: re.sha, len: re.len, st: re.st, slug: re.slug, ok: re.sha === SHA && re.st === 'draft' && re.slug === SLUG};
    if (!J.res.relido.ok) throw new Error('releitura nao bate: ' + JSON.stringify(J.res.relido));
    J.etapa = 'previa';
    const hp = await dedRL('/?page_id=' + pag.id + '&preview=true', {credentials: 'include'}).then(r => r.text());
    J.res.rodape_novo = (hp.match(/class="ded-rod"/g) || []).length;
    J.res.links_novos = ((hp.split('class="ded-rod"')[1] || '').split('class="footer_top')[0].match(/<a /g) || []).length;
    J.res.previa = '/?page_id=' + pag.id + '&preview=true';
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
