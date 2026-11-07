// Acessibilidade (07/11/2026, passo 22), LOTE DE PUBLICACAO. Respostas do dono as 09h26 (637 "sim", a previa; 638 "sim", nomes nos
// botoes, ja no snippet 6170; 639 "nao instalar"; 640 "sim": llms.txt e frases nas paginas Para idosos e do Santa Monica; 636 "pode":
// link com o simbolo no rodape e no menu). O llms.txt vai pelo editor do WPCode, fora deste job.
// (1) 6168: v1 -> v2 (do ramo temporario, sha conferida) e publicada; (2) rodape (custom_html-6) e copia (2533); (3) menu lateral
// (custom_html-7); (4) Para idosos (6138) e Santa Monica (1602): a frase com o link; (5) cache; (6) conferencia sem login.
// Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobACLT && window.__jobACLT.feito === false) return 'ja em andamento: nada feito';
window.__jobACLT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {ver: {}}};
(async () => {
  const J = window.__jobACLT;
  const D = {"pagina":{"id":6168,"de":"d7b5d16dd9dc1bb5","sha":"2571854e4ad53e07","slug":"acessibilidade","link":"https://dedicadalavanderia.com.br/acessibilidade/","raw":"https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/8071a16f00784ed99296f627fb8d9de01e104ffc/orcamento_04-11/acessibilidade_v2.txt","yoast_titulo":"Acessibilidade | Dedicada Lavanderia em Florian\u00f3polis","yoast_desc":"Coleta e entrega at\u00e9 a porta, pedido pelo WhatsApp por texto ou \u00e1udio, loja com entrada, banheiro e vaga acess\u00edveis e um site com zoom e fotos descritas."},"widget6":{"id":"custom_html-6","de":"dc10e1d0fbcc1ca0","para":"e5f8b5731e661d82","pares":[["href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></span>","href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/acessibilidade/\"><svg aria-hidden=\"true\" focusable=\"false\" width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"currentColor\" style=\"vertical-align: -2px; margin-right: 5px;\"><path d=\"M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z\"/></svg>Acessibilidade</a></span>"]]},"p2533":{"id":2533,"de":"9c98ea7b24a92dc3","para":"2d78622654f433c3","pares":[["href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></span>","href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/acessibilidade/\"><svg aria-hidden=\"true\" focusable=\"false\" width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"currentColor\" style=\"vertical-align: -2px; margin-right: 5px;\"><path d=\"M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z\"/></svg>Acessibilidade</a></span>"]]},"widget7":{"id":"custom_html-7","de":"b68deda6c371ac1f","para":"a9bd71455e96c9ba","pares":[["href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></li>","href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></li>\r\n\t  <li><a style=\"font-size: 18px; color: #ffffff; text-decoration: none;\" href=\"https://dedicadalavanderia.com.br/acessibilidade/\"><svg aria-hidden=\"true\" focusable=\"false\" width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"currentColor\" style=\"vertical-align: -2px; margin-right: 5px;\"><path d=\"M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z\"/></svg>Acessibilidade</a></li>"]]},"idosos":{"id":6138,"de":"f2d8685267918c69","para":"c113f2dcf2aff872","pares":[[">loja do Santa M\u00f4nica</a>.</li>",">loja do Santa M\u00f4nica</a>. Para quem tem dificuldade de descer, o motorista leva a roupa at\u00e9 a porta (veja a p\u00e1gina de <a href=\"https://dedicadalavanderia.com.br/acessibilidade/\">acessibilidade</a>).</li>"]],"url":"/para-idosos/"},"santa_monica":{"id":1602,"de":"3759a728d7fdd9ad","para":"0996314f4f5e6dc1","pares":[["<p><strong>Acessibilidade:</strong> a loja tem entrada, banheiro e vaga de estacionamento acess\u00edveis.</p>","<p><strong>Acessibilidade:</strong> a loja tem entrada, banheiro e vaga de estacionamento acess\u00edveis; o atendimento priorit\u00e1rio, o pedido por \u00e1udio e a entrega at\u00e9 a porta est\u00e3o na p\u00e1gina de <a href=\"https://dedicadalavanderia.com.br/acessibilidade/\">acessibilidade</a>.</p>"]],"url":"/lavanderia-no-santa-monica/"}};
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

    J.etapa = 'baixar v2';
    const P = D.pagina;
    const v2 = await fetch(P.raw, {cache: 'no-store', credentials: 'omit'}).then(r => r.text());
    if ((await dedSha16(v2)) !== P.sha) throw new Error('v2 baixada com sha diferente');

    J.etapa = 'conferir antes';
    let pg = await dedLer2('pages', P.id);
    J.res.antes = {pagina: [pg.sha, pg.st, pg.slug]};
    if (pg.sha !== P.de && pg.sha !== P.sha) throw new Error('6168 com sha diferente: ' + pg.sha);
    if (pg.st !== 'draft' && pg.st !== 'publish') throw new Error('6168 num estado inesperado: ' + pg.st);
    for (const k of ['widget6', 'widget7']) {
      const w = await lerW(D[k].id); const s = await dedSha16(w.instance.raw.content);
      J.res.antes[k] = s;
      if (s !== D[k].de && s !== D[k].para) throw new Error(k + ' com sha diferente: ' + s);
    }
    for (const k of ['p2533', 'idosos', 'santa_monica']) {
      const p0 = await dedLer2('pages', D[k].id);
      J.res.antes[k] = [p0.sha, p0.st];
      if (p0.st !== 'publish') throw new Error(k + ' nao esta publicada: ' + p0.st);
      if (p0.sha !== D[k].de && p0.sha !== D[k].para) throw new Error(k + ' com sha diferente: ' + p0.sha);
    }

    J.etapa = 'v2';
    if (pg.sha === P.de) {
      const g = await dedGravar2('pages', P.id, v2, P.sha);
      J.res.v2 = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('v2 nao ficou: ' + JSON.stringify(g));
      pg = await dedLer2('pages', P.id);
    } else { J.res.v2 = 'ja estava'; }

    J.etapa = 'publicar';
    if (pg.st !== 'publish') {
      if (pg.slug !== P.slug) throw new Error('6168 com slug inesperado: ' + pg.slug);
      const p = await post('/wp-json/wp/v2/pages/' + P.id, {status: 'publish'});
      if (p.status !== 200) throw new Error('publicar: ' + p.status);
      pg = await dedLer2('pages', P.id);
    }
    J.res.pagina = {st: pg.st, slug: pg.slug, link: pg.link, sha: pg.sha, modified: pg.modified};
    if (pg.st !== 'publish' || pg.link !== P.link || pg.sha !== P.sha) throw new Error('6168 nao ficou como esperado: ' + JSON.stringify(J.res.pagina));

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
    for (const k of ['p2533', 'idosos', 'santa_monica']) {
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
    J.res.ver.pagina = v;
    J.res.ver.yoast_ok = [v.title === P.yoast_titulo, v.desc === P.yoast_desc, v.canon === P.link];
    const anon = async (u) => { const r = await dedRL(u + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}); return {st: r.status, html: await r.text()}; };
    for (const [nome, u] of [['pagina', '/' + P.slug + '/'], ['home', '/'], ['idosos', D.idosos.url], ['santa_monica', D.santa_monica.url]]) {
      const h = await anon(u);
      const wa = (h.html.match(/wa\.me\/[0-9]+\?text=[^"'\s<>]+/g) || []).map(x => { try { return decodeURIComponent(x.split('?text=')[1].replace(/\+/g, ' ')); } catch (e) { return 'ERRO'; } });
      J.res.ver[nome + '_links'] = {st: h.st, links_acessibilidade: h.html.split('href="' + P.link + '"').length - 1,
        simbolo: h.html.split('href="' + P.link + '"><svg aria-hidden="true"').length - 1,
        precos_crus: (h.html.match(/\[preco[^\]]*\]/g) || []).length, noindex: /<meta[^>]+robots[^>]+noindex/i.test(h.html),
        zoom_ok: !/user-scalable=no/.test(h.html), nomes_snippet: h.html.includes('ded-pular'),
        wa_com_texto: wa.length, wa_fora_da_regra: wa.filter(t => !t.startsWith(OLA)).length};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
