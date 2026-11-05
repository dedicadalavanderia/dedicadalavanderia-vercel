// Indique e ganhe (05/11/2026, passo 17), LOTE DE PUBLICACAO. Ok do dono as 18h57 (590 "aprovado"; 591 "ok": rodape, menu
// lateral, pacotes e llms.txt; 592 "ok"). O llms.txt vai pelo editor do WPCode, fora deste job.
// (1) 6144 publicada (texto v2, sem mudar); (2) rodape (custom_html-6) e copia (2533); (3) menu lateral (custom_html-7);
// (4) pacotes (1689) por pares; (5) cache; (6) conferencia sem login. Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobIGLT && window.__jobIGLT.feito === false) return 'ja em andamento: nada feito';
window.__jobIGLT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {ver: {}}};
(async () => {
  const J = window.__jobIGLT;
  const D = {"pagina":{"id":6144,"sha":"3f6eab3f1f15de75","slug":"indique","link":"https://dedicadalavanderia.com.br/indique/"},"widget6":{"id":"custom_html-6","de":"179ab10463d119a7","para":"e735f0c7288f871a","pares":[["href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></span>","href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></span>"]]},"p2533":{"id":2533,"de":"c683b42033207db9","para":"564823f906f8a413","pares":[["href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></span>","href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></span>"]]},"widget7":{"id":"custom_html-7","de":"0576f704f63061a3","para":"6032f5862d15bc17","pares":[["href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></li>","href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></li>\r\n\t  <li><a style=\"font-size: 18px; color: #ffffff; text-decoration: none;\" href=\"https://dedicadalavanderia.com.br/indique/\">Indique e ganhe</a></li>"]]},"pacotes":{"id":1689,"de":"24eda7ccf9e93a8f","para":"e97e214961f8efd1","pares":[["As outras pe\u00e7as seguem a <a href=\"https://dedicadalavanderia.com.br/servicos/\">tabela de pre\u00e7os</a>.","As outras pe\u00e7as seguem a <a href=\"https://dedicadalavanderia.com.br/servicos/\">tabela de pre\u00e7os</a>. E no <a href=\"https://dedicadalavanderia.com.br/indique/\">indique e ganhe</a>, quem indica um amigo novo ganha 2 pe\u00e7as lavadas e passadas, e o amigo ganha outras 2 no primeiro pedido."],["br/servicos/\\\">tabela de pre\\u00e7os</a>","br/servicos/\\\">tabela de pre\\u00e7os</a>. E no <a href=\\\"https://dedicadalavanderia.com.br/indique/\\\">indique e ganhe</a>, quem indica um amigo novo ganha 2 pe\\u00e7as lavadas e passadas, e o amigo ganha outras 2 no primeiro pedido"]]}};
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
    J.res.antes = {p6144: [pg.sha, pg.st, pg.slug]};
    if (pg.sha !== P.sha) throw new Error('6144 com sha diferente: ' + pg.sha);
    if (pg.st !== 'draft' && pg.st !== 'publish') throw new Error('6144 num estado inesperado: ' + pg.st);
    for (const k of ['widget6', 'widget7']) {
      const w = await lerW(D[k].id); const s = await dedSha16(w.instance.raw.content);
      J.res.antes[k] = s;
      if (s !== D[k].de && s !== D[k].para) throw new Error(k + ' com sha diferente: ' + s);
    }
    for (const k of ['p2533', 'pacotes']) {
      const p = await dedLer2('pages', D[k].id);
      J.res.antes[k] = p.sha;
      if (p.sha !== D[k].de && p.sha !== D[k].para) throw new Error(k + ' com sha diferente: ' + p.sha);
    }

    J.etapa = 'publicar';
    if (pg.st !== 'publish') {
      if (pg.slug !== P.slug) throw new Error('6144 com slug inesperado: ' + pg.slug);
      const p = await post('/wp-json/wp/v2/pages/' + P.id, {status: 'publish'});
      if (p.status !== 200) throw new Error('publicar: ' + p.status);
      pg = await dedLer2('pages', P.id);
    }
    J.res.pagina = {st: pg.st, slug: pg.slug, link: pg.link, sha: pg.sha, modified: pg.modified};
    if (pg.st !== 'publish' || pg.link !== P.link || pg.sha !== P.sha) throw new Error('6144 nao ficou como esperado: ' + JSON.stringify(J.res.pagina));

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
    for (const k of ['p2533', 'pacotes']) {
      J.etapa = k;
      const d = D[k];
      const p1 = await dedLer2('pages', d.id);
      if (p1.sha === d.para) { J.res[k] = 'ja estava'; continue; }
      const r = await dedPares2('pages', d.id, {de: d.de, para: d.para, pares: d.pares});
      J.res[k] = [r.relido_sha || null, r.ok || false, r.erro || null];
      if (!r.ok) throw new Error(k + ': ' + (r.erro || 'nao ok'));
    }

    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;

    J.etapa = 'conferencia sem login';
    J.res.ver.pagina = await dedVer2('/' + P.slug + '/');
    const anon = async (u) => { const r = await dedRL(u + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}); return {st: r.status, html: await r.text()}; };
    for (const [nome, u] of [['pagina', '/indique/'], ['home', '/'], ['pacotes', '/pacotes/']]) {
      const h = await anon(u);
      J.res.ver[nome + '_links'] = {st: h.st, links_indique: h.html.split('href="' + P.link + '"').length - 1,
        precos_crus: (h.html.match(/\[preco[^\]]*\]/g) || []).length, noindex: /<meta[^>]+robots[^>]+noindex/i.test(h.html),
        script: h.html.includes("b.href='https://wa.me/?text='+encodeURIComponent(")};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
