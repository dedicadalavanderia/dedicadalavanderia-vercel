// Sustentabilidade (07/11/2026, 23h1x), LOTE 2. Respostas do dono as 23h02: 663 (energia solar ja funciona), 664 "pode" (wet
// cleaning com os numeros do artigo e o link; frase com o link na lavagem a seco), 665 (o link no rodape, alinhar depois), 666
// (cabide a R$ 0,20, residuo do solvente, Seitz biodegradavel, roupa sem plastico).
// (1) 6163 v4 -> v5 e Yoast; (2) rodape (custom_html-6) e copia (2533); (3) wet cleaning (685) e lavagem a seco (4598), por pares;
// (4) cache; (5) conferencia sem login. Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobSU2 && window.__jobSU2.feito === false) return 'ja em andamento: nada feito';
window.__jobSU2 = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {ver: {}}};
(async () => {
  const J = window.__jobSU2;
  const D = {"pagina": {"id": 6163, "slug": "sustentabilidade", "link": "https://dedicadalavanderia.com.br/sustentabilidade/", "de": "ba1dacd78a059a1d", "sha": "f1f9e8d5c9f7a556", "raw": "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/5e5be72bb5ff57790a1a5cea90ab2010e614ce84/orcamento_04-11/sustentabilidade_v5.txt", "yoast_titulo": "Lavanderia sustent\u00e1vel em Florian\u00f3polis | Dedicada", "yoast_desc": "Wet cleaning sem solvente, lavagem a seco em circuito fechado, 80% da \u00e1gua reaproveitada, energia solar e cabides de volta na Dedicada Lavanderia."}, "widget6": {"id": "custom_html-6", "de": "97f945fd5bbb2fbe", "para": "3b2500a60d1bd5d4", "pares": [["<li><a href=\"https://dedicadalavanderia.com.br/politica-de-privacidade/\">Pol\u00edtica de privacidade</a></li>", "<li><a href=\"https://dedicadalavanderia.com.br/sustentabilidade/\">Sustentabilidade</a></li><li><a href=\"https://dedicadalavanderia.com.br/politica-de-privacidade/\">Pol\u00edtica de privacidade</a></li>"]]}, "p2533": {"id": 2533, "de": "97f945fd5bbb2fbe", "para": "3b2500a60d1bd5d4", "pares": [["<li><a href=\"https://dedicadalavanderia.com.br/politica-de-privacidade/\">Pol\u00edtica de privacidade</a></li>", "<li><a href=\"https://dedicadalavanderia.com.br/sustentabilidade/\">Sustentabilidade</a></li><li><a href=\"https://dedicadalavanderia.com.br/politica-de-privacidade/\">Pol\u00edtica de privacidade</a></li>"]]}, "wet": {"id": 685, "de": "4557818f8cf540f0", "para": "f73f07bd37f9dc43", "pares": [["<p>Na Dedicada, a \u00e1gua das lavagens passa por tratamento para re\u00faso, em bateladas de 3 mil litros, e 80% dela \u00e9 reaproveitada. A lavanderia gasta, em m\u00e9dia, 5 mil litros de \u00e1gua por dia, e faz em m\u00e9dia uma batelada e meia de tratamento por dia.</p>", "<p>Na Dedicada, a \u00e1gua das lavagens passa por tratamento para re\u00faso, em duas bateladas de 3 mil litros por dia, e 80% dela \u00e9 reaproveitada. A lavanderia compra da rede, em m\u00e9dia, 5 mil litros de \u00e1gua por dia; em 2027, uma esta\u00e7\u00e3o nova vai reaproveitar 96%, como contamos na p\u00e1gina de <a href=\"https://dedicadalavanderia.com.br/sustentabilidade/\">sustentabilidade</a>.</p>"]], "url": "/limpeza-em-agua-wet-cleaning/"}, "seco": {"id": 4598, "de": "64487400cbfa7103", "para": "b0623c33122b7e69", "pares": [["O solvente dissolve a gordura e a oleosidade sem molhar a fibra.</li>", "O solvente dissolve a gordura e a oleosidade sem molhar a fibra. A m\u00e1quina trabalha em circuito fechado, que recupera o solvente para as lavagens seguintes, como contamos na p\u00e1gina de <a href=\"https://dedicadalavanderia.com.br/sustentabilidade/\">sustentabilidade</a>.</li>"]], "url": "/servicos/lavagem-a-seco-em-florianopolis/"}};
  const OLA = 'Ol' + String.fromCharCode(225) + '! Vim pelo site';
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (rn.status !== 200 || !/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce: ' + rn.status);
    sessionStorage.setItem('ded_nonce', nn);
    const H = {'X-WP-Nonce': nn, 'Content-Type': 'application/json'};
    const lerW = async (id) => (await dedRL('/wp-json/wp/v2/widgets/' + id + '?context=edit', {headers: H, credentials: 'include'})).json();

    J.etapa = 'baixar v5';
    const P = D.pagina;
    const v5 = await fetch(P.raw, {cache: 'no-store', credentials: 'omit'}).then(r => r.text());
    if ((await dedSha16(v5)) !== P.sha) throw new Error('v5 baixada com sha diferente');

    J.etapa = 'conferir antes';
    let pg = await dedLer2('pages', P.id);
    J.res.antes = {pagina: [pg.sha, pg.st, pg.slug]};
    if (pg.sha !== P.de && pg.sha !== P.sha) throw new Error('6163 com sha diferente: ' + pg.sha);
    if (pg.st !== 'publish' || pg.slug !== P.slug) throw new Error('6163 num estado inesperado: ' + pg.st + ' ' + pg.slug);
    const w0 = await lerW(D.widget6.id);
    const s0 = await dedSha16(w0.instance.raw.content);
    J.res.antes.widget6 = s0;
    if (s0 !== D.widget6.de && s0 !== D.widget6.para) throw new Error('widget6 com sha diferente: ' + s0);
    for (const k of ['p2533', 'wet', 'seco']) {
      const p0 = await dedLer2('pages', D[k].id);
      J.res.antes[k] = [p0.sha, p0.st];
      if (p0.st !== 'publish') throw new Error(k + ' nao esta publicada: ' + p0.st);
      if (p0.sha !== D[k].de && p0.sha !== D[k].para) throw new Error(k + ' com sha diferente: ' + p0.sha);
    }

    J.etapa = 'v5';
    if (pg.sha === P.de) {
      const g = await dedGravar2('pages', P.id, v5, P.sha);
      J.res.v5 = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('v5 nao ficou: ' + JSON.stringify(g));
    } else { J.res.v5 = 'ja estava'; }
    J.etapa = 'yoast';
    J.res.yoast = await dedYoast2(P.id, P.yoast_titulo, P.yoast_desc);
    if (J.res.yoast.yoast !== 200) throw new Error('yoast: ' + JSON.stringify(J.res.yoast));

    J.etapa = 'widget6';
    const w = D.widget6;
    const w1 = await lerW(w.id);
    const raw = w1.instance.raw;
    if ((await dedSha16(raw.content)) === w.para) { J.res.widget6 = 'ja estava'; }
    else {
      let novo = raw.content;
      for (const [a, b] of w.pares) { if (novo.split(a).length !== 2) throw new Error('widget6: trecho nao e unico'); novo = novo.split(a).join(b); }
      if ((await dedSha16(novo)) !== w.para) throw new Error('widget6: resultado nao bate');
      const r1 = await dedRL('/wp-json/wp/v2/widgets/' + w.id, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify({instance: {raw: Object.assign({}, raw, {content: novo})}})});
      const j2 = await lerW(w.id);
      const s2 = await dedSha16(((j2.instance || {}).raw || {}).content || '');
      J.res.widget6 = [r1.status, s2, s2 === w.para];
      if (s2 !== w.para) throw new Error('widget6 nao ficou');
    }
    for (const k of ['p2533', 'wet', 'seco']) {
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
    const v = await dedVer2('/' + P.slug + '/');
    J.res.ver.pagina = {st: v.st, title: v.title, desc: v.desc, canon: v.canon, h1: v.h1.length, h2: v.h2.length, ld: v.ld, precoCru: v.precoCru, travessao: v.travessao};
    J.res.ver.yoast_ok = [v.title === P.yoast_titulo, v.desc === P.yoast_desc, v.canon === P.link];
    const anon = async (u) => { const r = await dedRL(u + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}); return {st: r.status, html: await r.text()}; };
    for (const [nome, u, marcas] of [['pagina', '/' + P.slug + '/', ['R$ 0,20', 'solares', 'biodegrad', 'empresas ambientais', 'sem pl']],
                                     ['wet', D.wet.url, ['duas bateladas', '96%']], ['seco', D.seco.url, ['circuito fechado']], ['home', '/', []]]) {
      const h = await anon(u);
      const wa = (h.html.match(/wa\.me\/[0-9]+\?text=[^"'\s<>]+/g) || []).map(x => { try { return decodeURIComponent(x.split('?text=')[1].replace(/\+/g, ' ')); } catch (e) { return 'ERRO'; } });
      J.res.ver[nome] = {st: h.st, links_sustentabilidade: h.html.split('href="' + P.link + '"').length - 1,
        precos_crus: (h.html.match(/\[preco[^\]]*\]/g) || []).length, noindex: /<meta[^>]+robots[^>]+noindex/i.test(h.html),
        wa_com_texto: wa.length, wa_fora_da_regra: wa.filter(t => !t.startsWith(OLA)).length,
        marcas: marcas.filter(m => !h.html.includes(m)), rodape_13: (h.html.split('aria-labelledby="ded-rod-dedicada"')[1] || '').split('</ul>')[0].split('<li>').length - 1};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
