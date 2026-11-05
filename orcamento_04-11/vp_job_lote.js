// Vale-presente (05/11/2026, passo 18), LOTE DE PUBLICACAO. Ok do dono as 20h03 (597 "aprovado"; 598 "ok": o saldo fica no
// cadastro de quem ganhou; 599 "ok": rodape, menu lateral e llms.txt). O llms.txt vai pelo editor do WPCode, fora deste job.
// (1) 6149 publicada (texto v1, sem mudar); (2) rodape (custom_html-6) e copia (2533); (3) menu lateral (custom_html-7);
// (4) cache; (5) conferencia sem login. Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobVPLT && window.__jobVPLT.feito === false) return 'ja em andamento: nada feito';
window.__jobVPLT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {ver: {}}};
(async () => {
  const J = window.__jobVPLT;
  const D = {"pagina":{"id":6149,"sha":"8bd227fff04f264f","slug":"vale-presente","link":"https://dedicadalavanderia.com.br/vale-presente/"},"widget6":{"id":"custom_html-6","de":"e735f0c7288f871a","para":"fdbdeac43d0d1aca","pares":[["href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></span>","href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></span>"]]},"p2533":{"id":2533,"de":"564823f906f8a413","para":"ba2d38edeb250f3e","pares":[["href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></span>","href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></span>"]]},"widget7":{"id":"custom_html-7","de":"6032f5862d15bc17","para":"a82a63824ffbd253","pares":[["href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></li>","href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></li>\r\n\t  <li><a style=\"font-size: 18px; color: #ffffff; text-decoration: none;\" href=\"https://dedicadalavanderia.com.br/vale-presente/\">Vale-presente</a></li>"]]}};
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
    if (pg.sha !== P.sha) throw new Error('6149 com sha diferente: ' + pg.sha);
    if (pg.st !== 'draft' && pg.st !== 'publish') throw new Error('6149 num estado inesperado: ' + pg.st);
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
      if (pg.slug !== P.slug) throw new Error('6149 com slug inesperado: ' + pg.slug);
      const p = await post('/wp-json/wp/v2/pages/' + P.id, {status: 'publish'});
      if (p.status !== 200) throw new Error('publicar: ' + p.status);
      pg = await dedLer2('pages', P.id);
    }
    J.res.pagina = {st: pg.st, slug: pg.slug, link: pg.link, sha: pg.sha, modified: pg.modified};
    if (pg.st !== 'publish' || pg.link !== P.link || pg.sha !== P.sha) throw new Error('6149 nao ficou como esperado: ' + JSON.stringify(J.res.pagina));

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
    for (const [nome, u] of [['pagina', '/vale-presente/'], ['home', '/'], ['indique', '/indique/']]) {
      const h = await anon(u);
      J.res.ver[nome + '_links'] = {st: h.st, links_vale: h.html.split('href="' + P.link + '"').length - 1,
        precos_crus: (h.html.match(/\[preco[^\]]*\]/g) || []).length, noindex: /<meta[^>]+robots[^>]+noindex/i.test(h.html)};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
