// Calendario da lavanderia (06/11/2026, passo 20), LOTE DE PUBLICACAO. Respostas do dono as 09h52 (619 "sim", a previa v2;
// 620 "correto"; 621 "ok"; 622 "sim": rodape, menu lateral, llms.txt e uma frase com o link nas paginas de edredom e de casacos).
// O llms.txt vai pelo editor do WPCode, fora deste job.
// (1) 6157 publicada (texto v2, ja no rascunho; Yoast conferido sem login); (2) rodape (custom_html-6) e copia (2533);
// (3) menu lateral (custom_html-7); (4) edredom (3799) e casacos (4578): a frase com o link; (5) cache; (6) conferencia sem login.
// Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobCLLT && window.__jobCLLT.feito === false) return 'ja em andamento: nada feito';
window.__jobCLLT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {ver: {}}};
(async () => {
  const J = window.__jobCLLT;
  const D = {"pagina":{"id":6157,"sha":"1d205d5f0cf1982a","slug":"calendario-da-lavanderia","link":"https://dedicadalavanderia.com.br/calendario-da-lavanderia/","yoast_titulo":"O que lavar em cada m\u00eas em Florian\u00f3polis | Dedicada","yoast_desc":"Quando lavar edredom, casaco, cortina e roupa de inverno em Florian\u00f3polis: o que lavar em cada m\u00eas, com o clima da Ilha, dicas contra o mofo e lembrete."},"widget6":{"id":"custom_html-6","de":"48a879834005c155","para":"dc10e1d0fbcc1ca0","pares":[["href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></span>","href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></span>"]]},"p2533":{"id":2533,"de":"c5ddccdda5afb72e","para":"9c98ea7b24a92dc3","pares":[["href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></span>","href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></span><br />\r\n<span style=\"color: #ffffff;\"><a style=\"color: #ffffff;\" href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></span>"]]},"widget7":{"id":"custom_html-7","de":"d1e071b5e10005ac","para":"b68deda6c371ac1f","pares":[["href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></li>","href=\"https://dedicadalavanderia.com.br/trabalhe-conosco/\">Trabalhe conosco</a></li>\r\n\t  <li><a style=\"font-size: 18px; color: #ffffff; text-decoration: none;\" href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">Calend\u00e1rio da lavanderia</a></li>"]]},"edredom":{"id":3799,"de":"1431686fe0dff6ec","para":"a7507caa14b5bc43","pares":[["cuidados com edredom</a>.</p>","cuidados com edredom</a>. A \u00e9poca de lavar, antes do frio e antes de guardar, est\u00e1 no <a href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">calend\u00e1rio da lavanderia</a>.</p>"]],"url":"/servicos/lavagem-de-edredom-em-florianopolis/"},"casacos":{"id":4578,"de":"a3b324cb80c4af7d","para":"3d40f81731d0a75c","pares":[["\">peles</a>.</p>","\">peles</a>. A \u00e9poca de lavar, antes do frio e antes de guardar, est\u00e1 no <a href=\"https://dedicadalavanderia.com.br/calendario-da-lavanderia/\">calend\u00e1rio da lavanderia</a>.</p>"]],"url":"/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/"}};
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
    if (pg.sha !== P.sha) throw new Error('6157 com sha diferente: ' + pg.sha);
    if (pg.st !== 'draft' && pg.st !== 'publish') throw new Error('6157 num estado inesperado: ' + pg.st);
    for (const k of ['widget6', 'widget7']) {
      const w = await lerW(D[k].id); const s = await dedSha16(w.instance.raw.content);
      J.res.antes[k] = s;
      if (s !== D[k].de && s !== D[k].para) throw new Error(k + ' com sha diferente: ' + s);
    }
    for (const k of ['p2533', 'edredom', 'casacos']) {
      const p0 = await dedLer2('pages', D[k].id);
      J.res.antes[k] = [p0.sha, p0.st];
      if (p0.st !== 'publish') throw new Error(k + ' nao esta publicada: ' + p0.st);
      if (p0.sha !== D[k].de && p0.sha !== D[k].para) throw new Error(k + ' com sha diferente: ' + p0.sha);
    }

    J.etapa = 'publicar';
    if (pg.st !== 'publish') {
      if (pg.slug !== P.slug) throw new Error('6157 com slug inesperado: ' + pg.slug);
      const p = await post('/wp-json/wp/v2/pages/' + P.id, {status: 'publish'});
      if (p.status !== 200) throw new Error('publicar: ' + p.status);
      pg = await dedLer2('pages', P.id);
    }
    J.res.pagina = {st: pg.st, slug: pg.slug, link: pg.link, sha: pg.sha, modified: pg.modified};
    if (pg.st !== 'publish' || pg.link !== P.link || pg.sha !== P.sha) throw new Error('6157 nao ficou como esperado: ' + JSON.stringify(J.res.pagina));

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
    for (const k of ['p2533', 'edredom', 'casacos']) {
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
    for (const [nome, u] of [['pagina', '/' + P.slug + '/'], ['home', '/'], ['trabalhe', '/trabalhe-conosco/'], ['edredom', D.edredom.url], ['casacos', D.casacos.url]]) {
      const h = await anon(u);
      const wa = (h.html.match(/wa\.me\/[0-9]+\?text=[^"'\s<>]+/g) || []).map(x => { try { return decodeURIComponent(x.split('?text=')[1].replace(/\+/g, ' ')); } catch (e) { return 'ERRO'; } });
      J.res.ver[nome + '_links'] = {st: h.st, links_calendario: h.html.split('href="' + P.link + '"').length - 1,
        frase: /A época de lavar, antes do frio e antes de guardar, está no <a href="https:\/\/dedicadalavanderia\.com\.br\/calendario-da-lavanderia\/">calendário da lavanderia<\/a>\./.test(h.html),
        precos_crus: (h.html.match(/\[preco[^\]]*\]/g) || []).length, noindex: /<meta[^>]+robots[^>]+noindex/i.test(h.html),
        wa_com_texto: wa.length, wa_fora_da_regra: wa.filter(t => !t.startsWith('Olá! Vim pelo site')).length};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
