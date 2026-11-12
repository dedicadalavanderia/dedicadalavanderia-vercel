// Passo 30 (11/11/2026): PREVIA da faixa de prova em rascunho (paginas novas "previa-faixa-<nome>", o modelo da original).
// As paginas do ar nao mudam. Conteudo baixado do ramo temporario pelo commit e conferido pela sha. Resultado em window.__jobP30P.
(() => {
if (window.__jobP30P && window.__jobP30P.feito === false) return 'ja em andamento: nada feito';
window.__jobP30P = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: []};
(async () => {
  const J = window.__jobP30P;
  const D = [{"id":1398,"slug":"previa-faixa-cortinas","de":"88480c0414397154","para":"15e15924aa1b4631","raw":"https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/242ccd140ee93f20568c2674b7150e650b90d0fb/orcamento_04-11/p30_previa_1398.txt","titulo":"Pr\u00e9via do passo 30: faixa de prova (cortinas)"},{"id":4121,"slug":"previa-faixa-noiva","de":"428b1f92ffa360f6","para":"18005f73697805c9","raw":"https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/242ccd140ee93f20568c2674b7150e650b90d0fb/orcamento_04-11/p30_previa_4121.txt","titulo":"Pr\u00e9via do passo 30: faixa de prova (noiva)"}];
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const n = (await rn.text()).trim();
    if (!/^[a-f0-9]{10}$/.test(n)) throw new Error('nonce invalido');
    sessionStorage.setItem('ded_nonce', n);
    const H = {'X-WP-Nonce': n};
    const st = 'publish,draft,pending,private,future';
    for (const p of D) {
      const R = {id: p.id, slug: p.slug};
      J.res.push(R);
      J.etapa = 'baixar ' + p.id;
      const conteudo = await fetch(p.raw, {cache: 'no-store'}).then(r => r.text());
      R.baixado = await dedSha16(conteudo);
      if (R.baixado !== p.para) throw new Error(p.id + ': sha do arquivo baixado diferente');
      J.etapa = 'pagina do ar ' + p.id;
      const a = await dedLer2('pages', p.id);
      R.ar = [a.sha, a.st];
      if (a.sha !== p.de || a.st !== 'publish') throw new Error(p.id + ' diferente do esperado: ' + JSON.stringify(R.ar));
      const meta = await (await dedRL('/wp-json/wp/v2/pages/' + p.id + '?context=edit&_fields=template', {headers: H, credentials: 'include'})).json();
      J.etapa = 'slug ' + p.id;
      const j1 = await (await dedRL(`/wp-json/wp/v2/posts?slug=${p.slug}&status=${st}&context=edit&_fields=id`, {headers: H, credentials: 'include'})).json();
      if (!Array.isArray(j1) || j1.length) throw new Error('slug ocupado em posts: ' + p.slug);
      const j0 = await (await dedRL(`/wp-json/wp/v2/pages?slug=${p.slug}&status=${st}&context=edit&_fields=id,status`, {headers: H, credentials: 'include'})).json();
      if (!Array.isArray(j0) || j0.length > 1) throw new Error('resposta estranha no slug ' + p.slug);
      let id = 0;
      if (j0.length) {
        if (j0[0].status !== 'draft') throw new Error('a pagina com o slug da previa nao e rascunho: ' + p.slug);
        id = j0[0].id;
        J.etapa = 'regravar ' + id;
        const g = await dedGravar2('pages', id, conteudo, p.para);
        R.gravar = [g.status, g.relido_sha, g.ok];
        if (!g.ok) throw new Error('o rascunho nao ficou: ' + JSON.stringify(g));
      } else {
        J.etapa = 'criar ' + p.slug;
        const r = await dedRL('/wp-json/wp/v2/pages', {method: 'POST', headers: Object.assign({'Content-Type': 'application/json'}, H), credentials: 'include',
          body: JSON.stringify({title: p.titulo, slug: p.slug, status: 'draft', parent: 0, template: meta.template || '', comment_status: 'closed', ping_status: 'closed', content: conteudo})});
        const pag = await r.json();
        R.post = [r.status, pag.id, pag.status, pag.template];
        if (!pag.id) throw new Error('POST sem id: ' + JSON.stringify(pag).slice(0, 200));
        id = pag.id;
      }
      R.rascunho = id;
      J.etapa = 'reler ' + id;
      const re = await dedLer2('pages', id);
      R.relido = [re.sha, re.st];
      if (re.sha !== p.para || re.st !== 'draft') throw new Error('releitura nao bate: ' + JSON.stringify(R.relido));
      J.etapa = 'previa ' + id;
      const hp = await dedRL('/?page_id=' + id + '&preview=true&nc=' + Date.now(), {credentials: 'include', cache: 'no-store'}).then(r => r.text());
      const doc = new DOMParser().parseFromString(hp, 'text/html');
      const F = [...doc.querySelectorAll('.ded-prova')];
      R.previa = {faixas: F.length, css: (hp.match(/\.ded-prova\{max-width:560px/g) || []).length,
        texto: F.map(x => x.textContent.replace(/\s+/g, ' ').trim().slice(0, 120)),
        whats: doc.querySelectorAll('a[href*="wa.me/5548984280639?text="]').length, url: '/?page_id=' + id + '&preview=true'};
      if (R.previa.faixas !== 2 || R.previa.css !== 1) throw new Error('previa sem as 2 faixas: ' + JSON.stringify(R.previa));
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
