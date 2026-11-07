// Posts novos, job 3 (07/11/2026): I no 2196, 7 posts agendados, /blog/ v4 (a179abf4d3a84eea), cache e conferencia sem login.
(() => {
if (window.__jobPN4 && window.__jobPN4.feito === false) return 'ja em andamento: nada feito';
window.__jobPN4 = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {agendados: {}}};
(async () => {
  const J = window.__jobPN4;
  const SITE = 'https://dedicadalavanderia.com.br';
  const RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/7f6a62f00c926591481b7cd828d6225a7aca3aa4/orcamento_04-11/", AGE = [["C", 6199, "2026-11-10T12:00:00", "9a524ab777030ad7", "como-tirar-cheiro-de-suor-da-roupa"], ["G", 6203, "2026-11-13T12:00:00", "751a8d8f9d2f37e2", "como-tirar-mancha-de-acai-da-roupa"], ["F", 6202, "2026-11-16T12:00:00", "16b8ffb79cb54d4e", "casa-de-praia-cheiro-de-guardado-na-roupa-de-cama"], ["B", 6198, "2026-11-19T12:00:00", "644b78091a7c00c5", "como-tirar-mofo-do-couro"], ["D", 6200, "2026-11-22T12:00:00", "5f12e4b84ab66620", "como-lavar-kimono"], ["H", 6204, "2026-11-25T12:00:00", "9870b2986f5d320d", "como-usar-amaciante"], ["E", 6201, "2026-11-28T12:00:00", "e53e7d4f97772d03", "rouparia-de-hotel-e-pousada"]], SHA916 = "a179abf4d3a84eea", ANTES916 = '20a9250084a81810';
  const I = {arquivo: "I_como-tirar-manchas-de-ferrugem-das-roupas.html", sha: "396ba7508e96596c", titulo: "Como tirar ferrugem da roupa (e por que a \u00e1gua sanit\u00e1ria piora)", excerpt: "Sem \u00e1gua sanit\u00e1ria, que escurece a mancha, sem esfregar e sem ferro: a ferrugem pede um tira-manchas pr\u00f3prio, antes da lavagem.",
             yt: "Como tirar ferrugem da roupa: o que fazer e o que piora", yd: "Mancha de ferrugem no len\u00e7ol, na camisa ou no casaco? N\u00e3o use \u00e1gua sanit\u00e1ria, que escurece a mancha. Veja como tirar e quando a mancha \u00e9 de protetor solar.", foco: "tirar ferrugem da roupa", midia: 6196, slug: "como-tirar-manchas-de-ferrugem-das-roupas"};
  try {
    J.etapa = 'baixar';
    const cI = await fetch(RAW + 'posts_novos/' + I.arquivo, {cache: 'no-store'}).then(r => r.text());
    if (await dedSha16(cI) !== I.sha) throw new Error('I baixado diferente');
    const c916 = await fetch(RAW + 'blog_916_v4.txt', {cache: 'no-store'}).then(r => r.text());
    if (await dedSha16(c916) !== SHA916) throw new Error('916 baixada diferente');
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const n = (await rn.text()).trim();
    if (!/^[a-f0-9]{10}$/.test(n)) throw new Error('nonce invalido');
    sessionStorage.setItem('ded_nonce', n);
    const H = {'X-WP-Nonce': n}, HJ = {'X-WP-Nonce': n, 'Content-Type': 'application/json'};
    J.etapa = 'I: ler 2196';
    const a = await dedRL('/wp-json/wp/v2/posts/2196?context=edit&_fields=id,status,slug,title,content,excerpt,featured_media,meta', {headers: H, credentials: 'include'}).then(r => r.json());
    if (a.slug !== I.slug || a.status !== 'publish') throw new Error('2196 inesperado: ' + a.slug + ' ' + a.status);
    window.__antes2196 = {titulo: a.title.raw, content: a.content.raw, excerpt: a.excerpt.raw, midia: a.featured_media, meta: a.meta};
    J.res.antes2196 = {sha: await dedSha16(a.content.raw), len: a.content.raw.length, titulo: a.title.raw, midia: a.featured_media};
    if (J.res.antes2196.sha !== I.sha) {
      J.etapa = 'I: gravar 2196';
      const r = await dedRL('/wp-json/wp/v2/posts/2196', {method: 'POST', headers: HJ, credentials: 'include', body: JSON.stringify({
        title: I.titulo, content: cI, excerpt: I.excerpt, featured_media: I.midia,
        meta: {_yoast_wpseo_title: I.yt, _yoast_wpseo_metadesc: I.yd, _yoast_wpseo_focuskw: I.foco}})});
      const j = await r.json();
      if (!r.ok) throw new Error('gravar 2196: HTTP ' + r.status + ' ' + JSON.stringify(j).slice(0, 200));
    }
    const v = await dedRL('/wp-json/wp/v2/posts/2196?context=edit&_fields=status,slug,title,content,featured_media,meta,date', {headers: H, credentials: 'include'}).then(r => r.json());
    J.res.depois2196 = {sha: await dedSha16(v.content.raw), titulo: v.title.raw === I.titulo, midia: v.featured_media, status: v.status, slug: v.slug, data: v.date,
                        yoast: v.meta._yoast_wpseo_title === I.yt && v.meta._yoast_wpseo_metadesc === I.yd};
    if (J.res.depois2196.sha !== I.sha || !J.res.depois2196.titulo || v.status !== 'publish' || v.slug !== I.slug || !J.res.depois2196.yoast)
      throw new Error('2196 nao confere: ' + JSON.stringify(J.res.depois2196));
    J.etapa = 'agendar';
    for (const [k, id, data, sha, slug] of AGE) {
      const p = await dedRL('/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=id,status,slug,content,date', {headers: H, credentials: 'include'}).then(r => r.json());
      if (p.slug !== slug || await dedSha16(p.content.raw) !== sha) throw new Error('rascunho ' + k + ' diferente');
      if (!(p.status === 'future' && p.date === data)) {
        if (p.status !== 'draft' && p.status !== 'future') throw new Error('status inesperado ' + k + ': ' + p.status);
        const r = await dedRL('/wp-json/wp/v2/posts/' + id, {method: 'POST', headers: HJ, credentials: 'include', body: JSON.stringify({status: 'future', date: data, date_gmt: data})});
        const j = await r.json();
        if (!r.ok) throw new Error('agendar ' + k + ': HTTP ' + r.status + ' ' + JSON.stringify(j).slice(0, 200));
      }
      const q = await dedRL('/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=status,date,date_gmt,slug', {headers: H, credentials: 'include'}).then(r => r.json());
      J.res.agendados[k] = [id, q.status, q.date, q.date_gmt, q.slug];
      if (q.status !== 'future' || q.date !== data || q.slug !== slug) throw new Error('agendamento nao confere: ' + k + ' ' + JSON.stringify(J.res.agendados[k]));
    }
    J.etapa = '916';
    const b = await dedLer2('pages', 916);
    J.res.antes916 = b.sha;
    if (b.sha !== ANTES916 && b.sha !== SHA916) throw new Error('a 916 mudou: ' + b.sha);
    J.res.gravar916 = b.sha === SHA916 ? 'ja estava gravada' : await dedGravar2('pages', 916, c916, SHA916);
    if (J.res.gravar916 !== 'ja estava gravada' && !J.res.gravar916.ok) throw new Error('916 nao confere');
    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    J.etapa = 'conferir sem login';
    const hb = await dedRL('/blog/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}).then(r => r.text());
    J.res.blog = {A: hb.includes(SITE + '/como-tirar-mancha-de-protetor-solar-da-roupa/'), tituloI: hb.includes(I.titulo.replace(/\(/g, '(')),
                  agendadosVisiveis: AGE.filter(x => hb.includes(SITE + '/' + x[4] + '/')).map(x => x[0]), marcas: (hb.match(/data-ded-post=/g) || []).length};
    if (!J.res.blog.A || J.res.blog.agendadosVisiveis.length) throw new Error('/blog/ nao confere: ' + JSON.stringify(J.res.blog));
    const r2 = await dedRL('/' + I.slug + '/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
    const h2 = await r2.text();
    const c2 = window.__chkBlog(h2);
    J.res.semLogin2196 = {status: r2.status, assina: c2.assina, autor: c2.autor, revisado: c2.revisado, h1: c2.h1, mod: c2.mod, h2t: c2.h2txt, fatal: c2.fatal, mais: c2.mais};
    if (r2.status !== 200 || c2.assina !== 1 || c2.autor !== 'liliane-mazza' || c2.revisado || c2.fatal) throw new Error('2196 sem login nao confere: ' + JSON.stringify(J.res.semLogin2196));
    const r3 = await dedRL('/' + AGE[0][4] + '/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
    J.res.agendadoSemLogin = r3.status;
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
