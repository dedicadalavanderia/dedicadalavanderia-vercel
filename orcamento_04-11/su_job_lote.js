// Sustentabilidade (07/11/2026, passo 21), LOTE DE PUBLICACAO. Pedido do dono as 19h30: "veja o que o artefato sobre tratamento de
// agua fale e coloquemos a pagina de sustentabilidade no ar." O llms.txt vai pelo editor do WPCode, fora deste job.
// (1) 6163: v3 -> v4 (do ramo temporario, sha conferida), Yoast e publicada em /sustentabilidade/; (2) menu lateral (custom_html-7):
// "Sustentabilidade" depois de "Calendario da lavanderia"; (3) cache; (4) conferencia sem login.
// Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobSULT && window.__jobSULT.feito === false) return 'ja em andamento: nada feito';
window.__jobSULT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {ver: {}}};
(async () => {
  const J = window.__jobSULT;
  const D = {"pagina": {"id": 6163, "slug": "sustentabilidade", "link": "https://dedicadalavanderia.com.br/sustentabilidade/", "de": "1c1024096a84b332", "sha": "ba1dacd78a059a1d", "raw": "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/6450796f3de09eca35a82d5f93143dd43a95d5cf/orcamento_04-11/sustentabilidade_v4.txt", "yoast_titulo": "Lavanderia sustent\u00e1vel em Florian\u00f3polis | Dedicada", "yoast_desc": "Wet cleaning sem solvente, lavagem a seco em circuito fechado, 80% da \u00e1gua reaproveitada, rotas por bairro e cabides de volta na Dedicada Lavanderia.", "titulo": "Lavanderia sustent\u00e1vel em Florian\u00f3polis: o que a Dedicada faz pelo meio ambiente"}, "widget7": {"id": "custom_html-7", "de": "a9bd71455e96c9ba", "para": "14101af09298b050", "pares": [["href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></li>", "href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></li>\r\n\t  <li><a style=\"font-size: 18px; color: #ffffff; text-decoration: none;\" href=\"https://dedicadalavanderia.com.br/sustentabilidade/\">Sustentabilidade</a></li>"]]}};
  const OLA = 'Ol' + String.fromCharCode(225) + '! Vim pelo site';
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (rn.status !== 200 || !/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce: ' + rn.status);
    sessionStorage.setItem('ded_nonce', nn);
    const H = {'X-WP-Nonce': nn, 'Content-Type': 'application/json'};
    const post = async (path, body) => { const r = await dedRL(path, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify(body)}); let j = null; try { j = await r.json(); } catch (e) {} return {status: r.status, j}; };
    const lerW = async (id) => (await dedRL('/wp-json/wp/v2/widgets/' + id + '?context=edit', {headers: H, credentials: 'include'})).json();

    J.etapa = 'baixar v4';
    const P = D.pagina;
    const v4 = await fetch(P.raw, {cache: 'no-store', credentials: 'omit'}).then(r => r.text());
    if ((await dedSha16(v4)) !== P.sha) throw new Error('v4 baixada com sha diferente');

    J.etapa = 'conferir antes';
    let pg = await dedLer2('pages', P.id);
    J.res.antes = {pagina: [pg.sha, pg.st, pg.slug, pg.title]};
    if (pg.sha !== P.de && pg.sha !== P.sha) throw new Error('6163 com sha diferente: ' + pg.sha);
    if (pg.st !== 'draft' && pg.st !== 'publish') throw new Error('6163 num estado inesperado: ' + pg.st);
    if (pg.slug !== P.slug) throw new Error('6163 com slug inesperado: ' + pg.slug);
    if (pg.title !== P.titulo) throw new Error('6163 com titulo inesperado: ' + pg.title);
    const w0 = await lerW(D.widget7.id);
    const s0 = await dedSha16(w0.instance.raw.content);
    J.res.antes.widget7 = s0;
    if (s0 !== D.widget7.de && s0 !== D.widget7.para) throw new Error('widget7 com sha diferente: ' + s0);

    J.etapa = 'v4';
    if (pg.sha === P.de) {
      const g = await dedGravar2('pages', P.id, v4, P.sha);
      J.res.v4 = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('v4 nao ficou: ' + JSON.stringify(g));
      pg = await dedLer2('pages', P.id);
    } else { J.res.v4 = 'ja estava'; }

    J.etapa = 'yoast';
    J.res.yoast = await dedYoast2(P.id, P.yoast_titulo, P.yoast_desc);
    if (J.res.yoast.yoast !== 200) throw new Error('yoast: ' + JSON.stringify(J.res.yoast));

    J.etapa = 'publicar';
    if (pg.st !== 'publish') {
      const p = await post('/wp-json/wp/v2/pages/' + P.id, {status: 'publish'});
      if (p.status !== 200) throw new Error('publicar: ' + p.status);
      pg = await dedLer2('pages', P.id);
    }
    J.res.pagina = {st: pg.st, slug: pg.slug, link: pg.link, sha: pg.sha, modified: pg.modified};
    if (pg.st !== 'publish' || pg.link !== P.link || pg.sha !== P.sha) throw new Error('6163 nao ficou como esperado: ' + JSON.stringify(J.res.pagina));

    J.etapa = 'widget7';
    const w = D.widget7;
    const w1 = await lerW(w.id);
    const raw = w1.instance.raw;
    if ((await dedSha16(raw.content)) === w.para) { J.res.widget7 = 'ja estava'; }
    else {
      let novo = raw.content;
      for (const [a, b] of w.pares) { if (novo.split(a).length !== 2) throw new Error('widget7: trecho nao e unico'); novo = novo.split(a).join(b); }
      if ((await dedSha16(novo)) !== w.para) throw new Error('widget7: resultado nao bate');
      const r1 = await dedRL('/wp-json/wp/v2/widgets/' + w.id, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify({instance: {raw: Object.assign({}, raw, {content: novo})}})});
      const j2 = await lerW(w.id);
      const s2 = await dedSha16(((j2.instance || {}).raw || {}).content || '');
      J.res.widget7 = [r1.status, s2, s2 === w.para];
      if (s2 !== w.para) throw new Error('widget7 nao ficou');
    }

    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;

    J.etapa = 'conferencia sem login';
    const v = await dedVer2('/' + P.slug + '/');
    J.res.ver.pagina = v;
    J.res.ver.yoast_ok = [v.title === P.yoast_titulo, v.desc === P.yoast_desc, v.canon === P.link];
    const anon = async (u) => { const r = await dedRL(u + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}); return {st: r.status, html: await r.text()}; };
    for (const [nome, u] of [['pagina', '/' + P.slug + '/'], ['home', '/']]) {
      const h = await anon(u);
      const wa = (h.html.match(/wa\.me\/[0-9]+\?text=[^"'\s<>]+/g) || []).map(x => { try { return decodeURIComponent(x.split('?text=')[1].replace(/\+/g, ' ')); } catch (e) { return 'ERRO'; } });
      J.res.ver[nome + '_links'] = {st: h.st, links_sustentabilidade: h.html.split('href="' + P.link + '"').length - 1,
        precos_crus: (h.html.match(/\[preco[^\]]*\]/g) || []).length, noindex: /<meta[^>]+robots[^>]+noindex/i.test(h.html),
        wa_com_texto: wa.length, wa_fora_da_regra: wa.filter(t => !t.startsWith(OLA)).length,
        faq: h.html.includes('"FAQPage"'), solar: /solar/i.test(h.html.split('ded-su-faixa')[1] || '')};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
