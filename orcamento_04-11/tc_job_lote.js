// Trabalhe conosco (05/11/2026, passo 19), LOTE DE PUBLICACAO. Respostas do dono as 20h49 (603 "ok", com a v3 sem "lavanderia
// de familia"; 608 "sim": rodape, menu lateral e llms.txt). O llms.txt vai pelo editor do WPCode, fora deste job.
// (1) 6152 publicada (texto v3, ja no rascunho); (2) rodape (custom_html-6) e copia (2533); (3) menu lateral (custom_html-7);
// (4) cache; (5) conferencia sem login. Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobTCLT && window.__jobTCLT.feito === false) return 'ja em andamento: nada feito';
window.__jobTCLT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {ver: {}}};
(async () => {
  const J = window.__jobTCLT;
  const D = {"pagina":{"id":6152,"sha":"3f58608d1bb67a7e","slug":"trabalhe-conosco","link":"https://dedicadalavanderia.com.br/trabalhe-conosco/"},"widget6":{"id":"custom_html-6","de":"fdbdeac43d0d1aca","para":"48a879834005c155","pares":[["href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></span>","href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></span>"]]},"p2533":{"id":2533,"de":"ba2d38edeb250f3e","para":"c5ddccdda5afb72e","pares":[["href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></span>","href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></span>"]]},"widget7":{"id":"custom_html-7","de":"a82a63824ffbd253","para":"d1e071b5e10005ac","pares":[["href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></li>","href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></li>\r\n\t  <li><a style=\"font-size: 18px; color: #ffffff; text-decoration: none;\" href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></li>"]]}};
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (rn.status !== 200 || !/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce: ' + rn.status);
    sessionStorage.setItem('ded_nonce', nn);
    const H = {'X-WP-Nonce': nn, 'Content-Type': 'application/json'};
    const post = async (path, body) => { const r = await dedRL(path, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify(body)}); let j = null; try { j = await r.json(); } catch (e) {} return {status: r.status, j}; };
    const lerW = async (id) => (await dedRL('/wp-json/wp/v2/widgets/' + id + '?context=edit', {headers: H, credentials: 'include'})).json();

    J.etapa = 'conferir antes';
    const P = D.pagina;
    let pg = await dedLer2('pages', P.id);
    J.res.antes = {pagina: [pg.sha, pg.st, pg.slug]};
    if (pg.sha !== P.sha) throw new Error('6152 com sha diferente: ' + pg.sha);
    if (pg.st !== 'draft' && pg.st !== 'publish') throw new Error('6152 num estado inesperado: ' + pg.st);
    for (const k of ['widget6', 'widget7']) {
      const w = await lerW(D[k].id); const s = await dedSha16(w.instance.raw.content);
      J.res.antes[k] = s;
      if (s !== D[k].de && s !== D[k].para) throw new Error(k + ' com sha diferente: ' + s);
    }
    const p0 = await dedLer2('pages', D.p2533.id);
    J.res.antes.p2533 = p0.sha;
    if (p0.sha !== D.p2533.de && p0.sha !== D.p2533.para) throw new Error('p2533 com sha diferente: ' + p0.sha);

    J.etapa = 'publicar';
    if (pg.st !== 'publish') {
      if (pg.slug !== P.slug) throw new Error('6152 com slug inesperado: ' + pg.slug);
      const p = await post('/wp-json/wp/v2/pages/' + P.id, {status: 'publish'});
      if (p.status !== 200) throw new Error('publicar: ' + p.status);
      pg = await dedLer2('pages', P.id);
    }
    J.res.pagina = {st: pg.st, slug: pg.slug, link: pg.link, sha: pg.sha, modified: pg.modified};
    if (pg.st !== 'publish' || pg.link !== P.link || pg.sha !== P.sha) throw new Error('6152 nao ficou como esperado: ' + JSON.stringify(J.res.pagina));

    for (const k of ['widget6', 'widget7']) {
      J.etapa = k;
      const w = D[k];
      const w1 = await lerW(w.id);
      const raw = w1.instance.raw;
      if ((await dedSha16(raw.content)) === w.para) { J.res[k] = 'ja estava'; continue; }
      let novo = raw.content;
      for (const [a, b] of w.pares) { if (novo.split(a).length !== 2) throw new Error(k + ': trecho nao e unico'); novo = novo.split(a).join(b); }
      if ((await dedSha16(novo)) !== w.para) throw new Error(k + ': resultado nao bate');
      const r1 = await dedRL('/wp-json/wp/v2/widgets/' + w.id, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify({instance: {raw: Object.assign({}, raw, {content: novo})}})});
      const j2 = await lerW(w.id);
      const s2 = await dedSha16(((j2.instance || {}).raw || {}).content || '');
      J.res[k] = [r1.status, s2, s2 === w.para];
      if (s2 !== w.para) throw new Error(k + ' nao ficou');
    }
    J.etapa = 'p2533';
    const d = D.p2533;
    const p1 = await dedLer2('pages', d.id);
    if (p1.sha === d.para) { J.res.p2533 = 'ja estava'; } else {
      const r = await dedPares2('pages', d.id, {de: d.de, para: d.para, pares: d.pares});
      J.res.p2533 = [r.relido_sha || null, r.ok || false, r.erro || null];
      if (!r.ok) throw new Error('p2533: ' + (r.erro || 'nao ok'));
    }

    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;

    J.etapa = 'conferencia sem login';
    J.res.ver.pagina = await dedVer2('/' + P.slug + '/');
    const anon = async (u) => { const r = await dedRL(u + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}); return {st: r.status, html: await r.text()}; };
    for (const [nome, u] of [['pagina', '/trabalhe-conosco/'], ['home', '/'], ['vale', '/vale-presente/']]) {
      const h = await anon(u);
      J.res.ver[nome + '_links'] = {st: h.st, links_trabalhe: h.html.split('href="' + P.link + '"').length - 1,
        precos_crus: (h.html.match(/\[preco[^\]]*\]/g) || []).length, noindex: /<meta[^>]+robots[^>]+noindex/i.test(h.html),
        form2: /fc-form-2|data-id="2"|formcraft/.test(h.html) && /Mandar o curr/.test(h.html), shortcode_cru: /\[fc id=/.test(h.html)};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
