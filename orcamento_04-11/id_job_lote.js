// Para idosos (05/11/2026, passo 16), LOTE DE PUBLICACAO. Ok do dono as 12h14 (578 "aprovado"; 579 "ok": rodape, menu
// lateral, pagina da coleta e llms.txt; 580: Pix de onde estiver, sem link de pagamento). O llms.txt vai pelo editor do WPCode.
// (1) v3 no rascunho 6138 e publicacao; (2) rodape (custom_html-6) e copia (2533); (3) menu lateral (custom_html-7);
// (4) hub de coleta (1150) por pares; (5) cache; (6) conferencia sem login. Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobIDLT && window.__jobIDLT.feito === false) return 'ja em andamento: nada feito';
window.__jobIDLT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {ver: {}}};
(async () => {
  const J = window.__jobIDLT;
  const D = {"pagina":{"id":6138,"de":"769d58aabaac2af4","sha":"f2d8685267918c69","slug":"para-idosos","link":"https://dedicadalavanderia.com.br/para-idosos/","raw":"https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/2232a6e376297941c68610006d5501835eb06c02/orcamento_04-11/idosos_v3.txt"},"widget6":{"id":"custom_html-6","de":"70b49e26537efd46","para":"179ab10463d119a7","pares":[["href=\"https://dedicadalavanderia.com.br/para-empresas/\">Para empresas</a></span>","href=\"https://dedicadalavanderia.com.br/para-empresas/\">Para empresas</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></span>"]]},"p2533":{"id":2533,"de":"778f61173fb44bde","para":"c683b42033207db9","pares":[["href=\"https://dedicadalavanderia.com.br/para-empresas/\">Para empresas</a></span>","href=\"https://dedicadalavanderia.com.br/para-empresas/\">Para empresas</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></span>"]]},"widget7":{"id":"custom_html-7","de":"5205f568143d8724","para":"0576f704f63061a3","pares":[["href=\"https://dedicadalavanderia.com.br/para-empresas/\">Para empresas</a></li>","href=\"https://dedicadalavanderia.com.br/para-empresas/\">Para empresas</a></li>\r\n\t  <li><a style=\"font-size: 18px; color: #ffffff; text-decoration: none;\" href=\"https://dedicadalavanderia.com.br/para-idosos/\">Para idosos</a></li>"]]},"hub":{"id":1150,"de":"5ddce85d0075c384","para":"f177a92c5c537282","pares":[["quem tem im\u00f3vel de temporada encontra o servi\u00e7o de enxoval na <a href=\"https://dedicadalavanderia.com.br/servicos/lavanderia-para-airbnb-em-florianopolis/\">p\u00e1gina de Airbnb</a>. N\u00e3o v\u00e3o na coleta","quem tem im\u00f3vel de temporada encontra o servi\u00e7o de enxoval na <a href=\"https://dedicadalavanderia.com.br/servicos/lavanderia-para-airbnb-em-florianopolis/\">p\u00e1gina de Airbnb</a>, e a fam\u00edlia que cuida das roupas de um idoso v\u00ea como funciona a coleta em casa ou no lar de idosos na p\u00e1gina da <a href=\"https://dedicadalavanderia.com.br/para-idosos/\">lavanderia para idosos</a>. N\u00e3o v\u00e3o na coleta"]]}};
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (rn.status !== 200 || !/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce: ' + rn.status);
    sessionStorage.setItem('ded_nonce', nn);
    const H = {'X-WP-Nonce': nn, 'Content-Type': 'application/json'};
    const post = async (path, body) => { const r = await dedRL(path, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify(body)}); let j = null; try { j = await r.json(); } catch (e) {} return {status: r.status, j}; };
    const lerW = async (id) => (await dedRL('/wp-json/wp/v2/widgets/' + id + '?context=edit', {headers: H, credentials: 'include'})).json();

    J.etapa = 'baixar v3';
    const P = D.pagina;
    const v3 = await fetch(P.raw, {cache: 'no-store'}).then(r => r.text());
    J.res.v3 = {len: v3.length, sha: await dedSha16(v3)};
    if (J.res.v3.sha !== P.sha) throw new Error('v3 baixada com sha diferente: ' + J.res.v3.sha);

    J.etapa = 'conferir antes';
    let pg = await dedLer2('pages', P.id);
    J.res.antes = {p6138: [pg.sha, pg.st, pg.slug]};
    if (pg.sha !== P.de && pg.sha !== P.sha) throw new Error('6138 com sha diferente: ' + pg.sha);
    if (pg.st !== 'draft' && !(pg.st === 'publish' && pg.sha === P.sha)) throw new Error('6138 num estado inesperado: ' + pg.st);
    for (const k of ['widget6', 'widget7']) {
      const w = await lerW(D[k].id); const s = await dedSha16(w.instance.raw.content);
      J.res.antes[k] = s;
      if (s !== D[k].de && s !== D[k].para) throw new Error(k + ' com sha diferente: ' + s);
    }
    for (const k of ['p2533', 'hub']) {
      const p = await dedLer2('pages', D[k].id);
      J.res.antes[k] = p.sha;
      if (p.sha !== D[k].de && p.sha !== D[k].para) throw new Error(k + ' com sha diferente: ' + p.sha);
    }

    J.etapa = 'v3 no rascunho';
    if (pg.sha !== P.sha) {
      const g = await dedGravar2('pages', P.id, v3, P.sha);
      J.res.v3_gravada = g;
      if (!g.ok) throw new Error('v3 nao ficou: ' + JSON.stringify(g));
    } else { J.res.v3_gravada = 'ja estava'; }

    J.etapa = 'publicar';
    pg = await dedLer2('pages', P.id);
    if (pg.st !== 'publish') {
      if (pg.st !== 'draft' || pg.slug !== P.slug || pg.sha !== P.sha) throw new Error('6138 num estado inesperado: ' + pg.st + ' ' + pg.slug + ' ' + pg.sha);
      const p = await post('/wp-json/wp/v2/pages/' + P.id, {status: 'publish'});
      if (p.status !== 200) throw new Error('publicar: ' + p.status);
      pg = await dedLer2('pages', P.id);
    }
    J.res.pagina = {st: pg.st, slug: pg.slug, link: pg.link, sha: pg.sha, modified: pg.modified};
    if (pg.st !== 'publish' || pg.link !== P.link || pg.sha !== P.sha) throw new Error('6138 nao ficou como esperado: ' + JSON.stringify(J.res.pagina));

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
    for (const k of ['p2533', 'hub']) {
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
    for (const [nome, u] of [['pagina', '/para-idosos/'], ['home', '/'], ['hub', '/lavanderia-coleta-e-entrega-em-florianopolis/']]) {
      const h = await anon(u);
      J.res.ver[nome + '_links'] = {st: h.st, links_idosos: h.html.split('href="' + P.link + '"').length - 1,
        precos_crus: (h.html.match(/\[preco[^\]]*\]/g) || []).length, noindex: /<meta[^>]+robots[^>]+noindex/i.test(h.html)};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
