// Blog (07/11/2026, passo 25): CONFERE sem login a /blog/, a /blog/page/2/, 11 posts (todos os temas e os de dados antigos)
// e 2 paginas fora do blog. So leitura. Ritmo: dedRL. Resultado em window.__jobBLC.
(() => {
if (window.__jobBLC && window.__jobBLC.feito === false) return 'ja em andamento: nada feito';
window.__jobBLC = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}, erros: []};
(async () => {
  const J = window.__jobBLC;
  const POSTS = [["/como-lavar-roupa-com-xixi/", "alejandro", "manchas", 5], ["/como-remover-manchas-amareladas-e-de-mofo-das-roupas/", "liliane", "manchas", 5], ["/minha-roupa-manchou-a-lavanderia-consegue-recuperar/", "jorge", "manchas", 5], ["/como-remover-manchas-de-gordura-das-roupas-descubra-a-solucao-definitiva/", "jorge", "manchas", 5], ["/como-lavar-roupas-de-tule-cuidados-e-dicas-essenciais/", "liliane", "tecidos-delicados", 5], ["/lavagem-de-casacos-de-la-batida-cuidados-essenciais/", "jorge", "la-e-inverno", 5], ["/de-quanto-em-quanto-tempo-lavar-itens-de-bebe/", "liliane", "cama-casa-e-bebe", 5], ["/como-lavar-calca-de-sarja-sem-desbotar/", "alejandro", "dia-a-dia", 5], ["/o-que-acontece-se-minha-roupa-estragar-na-lavanderia/", "alejandro", "quando-usar-lavanderia", 5], ["/lavanderia-hospedes-hotel-florianopolis/", "alejandro", "florianopolis", 4], ["/como-lavar-vestidos-e-pecas-em-rayon-dedicada-lavanderia/", "alejandro", "tecidos-delicados", 5]];
  const Y_TIT = "Blog da Dedicada Lavanderia: manchas, tecidos e cuidados", Y_DESC = "Dicas dos s\u00f3cios da Dedicada Lavanderia, em Florian\u00f3polis desde 2003: manchas, seda e linho, l\u00e3, cama e beb\u00ea, roupas do dia a dia e quando usar lavanderia.", H1 = "Blog da Dedicada Lavanderia: cuidados com roupas, manchas e tecidos";
  const ler = async (u) => { const r = await dedRL(u + (u.includes('?') ? '&' : '?') + 'nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}); const h = await r.text(); return {st: r.status, h, d: new DOMParser().parseFromString(h, 'text/html')}; };
  const lds = (d) => { const out = []; for (const s of d.querySelectorAll('script[type="application/ld+json"]')) { try { out.push(JSON.parse(s.textContent)); } catch (e) { out.push(null); } } return out; };
  const nos = (arr) => arr.filter(Boolean).flatMap(o => o['@graph'] || [o]);
  const txt = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  try {
    J.etapa = 'blog';
    let x = await ler('/blog/');
    let L = lds(x.d), N = nos(L);
    const h1s = [...x.d.querySelectorAll('h1')].map(e => e.textContent.trim());
    J.res.blog = {st: x.st, title: x.d.title, desc: (x.d.querySelector('meta[name="description"]') || {}).content, canon: (x.d.querySelector('link[rel="canonical"]') || {}).href,
      robots: (x.d.querySelector('meta[name="robots"]') || {}).content, h1: h1s, h2ids: [...x.d.querySelectorAll('h2[id]')].map(e => e.id), ld: L.length, ldOk: L.filter(Boolean).length,
      tipos: N.map(n => n['@type']).join(','), masonry: x.d.querySelectorAll('.blog_holder.masonry article').length, branco: /color: #ffffff;">EM FLORIAN/.test(x.h),
      posts: x.d.querySelectorAll('.ded-bl-lista a').length, wa: [...x.d.querySelectorAll('a[href*="wa.me/5548984280639?text="]')].map(a => decodeURIComponent(a.href.split('text=')[1]).slice(0, 40)),
      fatal: /Fatal error|Parse error|Warning:/.test(x.h), travessao: /\u2014/.test(txt(x.h))};
    if (x.st !== 200 || h1s.length !== 1 || h1s[0] !== H1) J.erros.push('blog: H1');
    if (J.res.blog.title !== Y_TIT || J.res.blog.desc !== Y_DESC) J.erros.push('blog: Yoast');
    if (J.res.blog.canon !== 'https://dedicadalavanderia.com.br/blog/' || /noindex/.test(J.res.blog.robots || '')) J.erros.push('blog: canonical/robots');
    if (J.res.blog.ldOk !== J.res.blog.ld || !/CollectionPage/.test(J.res.blog.tipos)) J.erros.push('blog: JSON-LD');
    if (J.res.blog.posts !== 102 || J.res.blog.masonry < 1 || J.res.blog.branco || J.res.blog.fatal) J.erros.push('blog: lista/masonry/branco/erro');
    J.etapa = 'blog2';
    x = await ler('/blog/page/2/');
    J.res.blog2 = {st: x.st, h1: [...x.d.querySelectorAll('h1')].map(e => e.textContent.trim()), temas: x.d.querySelectorAll('.ded-bl-lista').length, masonry: x.d.querySelectorAll('.blog_holder.masonry article').length,
      canon: (x.d.querySelector('link[rel="canonical"]') || {}).href, fatal: /Fatal error|Parse error|Warning:/.test(x.h)};
    if (x.st !== 200 || J.res.blog2.h1.length !== 1 || J.res.blog2.temas !== 0 || J.res.blog2.masonry < 1 || J.res.blog2.fatal) J.erros.push('blog2');
    J.etapa = 'posts';
    J.res.posts = {};
    for (const [u, socio, tema, nrel] of POSTS) {
      x = await ler(u);
      L = lds(x.d); N = nos(L);
      const bp = N.filter(n => n['@type'] === 'BlogPosting');
      const pe = N.find(n => n['@type'] === 'Person');
      const tr = N.find(n => n['@type'] === 'BreadcrumbList');
      const h2 = x.d.querySelector('h2.entry_title');
      const datas = [...x.d.querySelectorAll('.ded-blog-assina time')].map(t => t.getAttribute('datetime'));
      const r = {st: x.st, assina: x.d.querySelectorAll('.ded-blog-assina').length, por: ((x.d.querySelector('.ded-blog-por strong') || {}).textContent || ''),
        autor: bp[0] && bp[0].author && bp[0].author['@id'].split('#')[1], nbp: bp.length, pessoa: pe && pe.name, tema: bp[0] && bp[0].articleSection,
        trilha: !!(h2 && h2.previousElementSibling && h2.previousElementSibling.matches('.ded-blog-trilha')), trilhaLd: tr && tr.itemListElement.length,
        datas, pub: bp[0] && String(bp[0].datePublished).slice(0, 10), mod: bp[0] && String(bp[0].dateModified).slice(0, 10),
        mais: x.d.querySelectorAll('.ded-blog-mais li').length, ingles: /Posted at|0 Likes|Like this/.test(x.h), data_curta: !!x.d.querySelector('h2.entry_title .entry_date'),
        etiquetas: !!x.d.querySelector('.single_tags'), revisado: /Revisado por/.test(x.h), ld: L.length, ldOk: L.filter(Boolean).length, css: !!x.d.querySelector('#ded-blog-css'),
        h1: x.d.querySelectorAll('h1').length, fatal: /Fatal error|Parse error|Warning:/.test(x.h)};
      J.res.posts[u.slice(1, 30)] = r;
      const nomes = {alejandro: 'Alejandro David Mazza', liliane: 'Liliane Sella Mazza', jorge: 'Jorge Isaac Mazza'};
      const ok = r.st === 200 && r.assina === 1 && r.por === nomes[socio] && r.autor === socio + '-mazza' && r.nbp === 1 && r.pessoa === nomes[socio] && r.trilha && r.trilhaLd === 4
        && r.datas[0] === r.pub && (r.datas.length === 1 || r.datas[1] === r.mod) && r.mais === nrel && !r.ingles && !r.data_curta && !r.etiquetas && !r.revisado && r.ld === r.ldOk && r.css && r.h1 === 1 && !r.fatal;
      if (!ok) J.erros.push('post ' + u);
    }
    J.etapa = 'fora do blog';
    J.res.fora = {};
    for (const u of ['/', '/servicos/lavagem-de-edredom-em-florianopolis/']) {
      x = await ler(u);
      J.res.fora[u] = {st: x.st, assina: x.d.querySelectorAll('.ded-blog-assina').length, css: !!x.d.querySelector('#ded-blog-css'), fatal: /Fatal error|Parse error|Warning:/.test(x.h), h1: x.d.querySelectorAll('h1').length};
      if (x.st !== 200 || J.res.fora[u].assina || J.res.fora[u].css || J.res.fora[u].fatal) J.erros.push('fora ' + u);
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
