// Contato (07/11/2026, passo 23), LOTE DE PUBLICACAO. Respostas do dono as 10h58 (642 "sim"; 643 "sim", ligacao; 644 "como achar
// melhor", sem o mapa embutido; 645 "sim", publicacao na 562). (1) confere a 562; (2) grava a v2; (3) titulo do WordPress = H1;
// (4) Yoast; (5) slug, modelo e data mantidos; (6) cache; (7) conferencia sem login. Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobCTLT && window.__jobCTLT.feito === false) return 'ja em andamento: nada feito';
window.__jobCTLT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobCTLT;
  const ID = 562, DE = "ab5d8e163a427e32", PARA = "5fec3d48ba389afe", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/7fc02f9b8331b4404ee48cca1b6fd8e35c45fe60/orcamento_04-11/contato_v2.txt", LINK = "https://dedicadalavanderia.com.br/contato/";
  const TITULO = "Contato da Dedicada Lavanderia, em Florian\u00f3polis: WhatsApp, e-mail e lojas", Y_TIT = "Contato e WhatsApp | Dedicada Lavanderia em Florian\u00f3polis", Y_DESC = "WhatsApp e telefone (48) 98428-0639, e-mail e as lojas do Centro e do Santa M\u00f4nica, com hor\u00e1rio e como chegar. Coleta e entrega gr\u00e1tis em Florian\u00f3polis.";
  const OLA = 'Ol' + String.fromCharCode(225) + '! Vim pelo site';
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (rn.status !== 200 || !/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce: ' + rn.status);
    sessionStorage.setItem('ded_nonce', nn);
    const H = {'X-WP-Nonce': nn, 'Content-Type': 'application/json'};
    const meta = async () => { const r = await dedRL('/wp-json/wp/v2/pages/' + ID + '?context=edit&_fields=slug,status,template,date,title,link', {headers: H, credentials: 'include'}); const x = await r.json(); return {st: x.status, slug: x.slug, template: x.template, date: x.date, title: x.title && x.title.raw, link: x.link}; };

    J.etapa = 'baixar v2';
    const v2 = await fetch(RAW, {cache: 'no-store', credentials: 'omit'}).then(r => r.text());
    if ((await dedSha16(v2)) !== PARA) throw new Error('v2 baixada com sha diferente');

    J.etapa = 'conferir antes';
    let pg = await dedLer2('pages', ID);
    const m0 = await meta();
    J.res.antes = {sha: pg.sha, meta: m0};
    if (pg.sha !== DE && pg.sha !== PARA) throw new Error('562 com sha diferente: ' + pg.sha);
    if (m0.st !== 'publish' || m0.slug !== 'contato' || m0.template !== 'full_width.php' || m0.link !== LINK) throw new Error('562 fora do esperado: ' + JSON.stringify(m0));

    J.etapa = 'v2';
    if (pg.sha === DE) {
      const g = await dedGravar2('pages', ID, v2, PARA);
      J.res.v2 = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('v2 nao ficou: ' + JSON.stringify(g));
    } else { J.res.v2 = 'ja estava'; }

    J.etapa = 'titulo';
    if (m0.title !== TITULO) {
      const rt = await dedRL('/wp-json/wp/v2/pages/' + ID, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify({title: TITULO})});
      J.res.titulo = rt.status;
      if (rt.status !== 200) throw new Error('titulo: ' + rt.status);
    } else { J.res.titulo = 'ja estava'; }

    J.etapa = 'yoast';
    J.res.yoast = await dedYoast2(ID, Y_TIT, Y_DESC);
    if (J.res.yoast.yoast !== 200) throw new Error('yoast: ' + JSON.stringify(J.res.yoast));

    J.etapa = 'conferir depois';
    pg = await dedLer2('pages', ID);
    const m1 = await meta();
    J.res.depois = {sha: pg.sha, meta: m1};
    if (pg.sha !== PARA || m1.title !== TITULO || m1.st !== 'publish' || m1.slug !== m0.slug || m1.template !== m0.template || m1.date !== m0.date) throw new Error('562 depois fora do esperado: ' + JSON.stringify(J.res.depois));

    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;

    J.etapa = 'conferencia sem login';
    const r = await dedRL('/contato/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
    const h = await r.text();
    const d = new DOMParser().parseFromString(h, 'text/html');
    const mt = s => (d.querySelector(s) || {}).content || null;
    const lds = [...d.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { return JSON.parse(s.textContent); } catch (e) { return 'ERRO'; } });
    const nos = lds.filter(x => x !== 'ERRO').flatMap(x => x['@graph'] || [x]);
    const cp = nos.filter(x => x['@type'] === 'ContactPage');
    const wa = (h.match(/wa\.me\/[0-9]+\?text=[^"'\s<>]+/g) || []).map(x => { try { return decodeURIComponent(x.split('?text=')[1].replace(/\+/g, ' ')); } catch (e) { return 'ERRO'; } });
    const corpo = (d.querySelector('.content') || d.body).textContent;
    J.res.sem_login = {st: r.status, title: d.title, title_ok: d.title === Y_TIT, desc_ok: mt('meta[name="description"]') === Y_DESC,
      canon_ok: (d.querySelector('link[rel=canonical]') || {}).href === LINK, og_title: mt('meta[property="og:title"]'),
      noindex: /noindex/i.test(mt('meta[name="robots"]') || ''), titulo_escondido: /qode-title-hidden/.test((h.match(/<body[^>]*class="([^"]*)"/) || [])[1] || ''),
      h1: [...d.querySelectorAll('h1')].map(x => x.textContent.trim()), h2: d.querySelectorAll('h2').length, h3: d.querySelectorAll('h3').length,
      ld: lds.map(x => x === 'ERRO' ? 'ERRO' : 'ok'), contactpage: cp.map(x => [x.headline || x.name || null, x.description ? x.description.slice(0, 40) : null]),
      organizacao: nos.some(x => x['@id'] === 'https://dedicadalavanderia.com.br/#organizacao'),
      formularios: (h.match(/name="field6\[\]"/g) || []).length, fc_cru: /\[fc id=/.test(h), mapa_embutido: /google\.com\/maps\/embed/.test(h),
      tel: (h.match(/href="tel:\+5548984280639"/g) || []).length, precos_crus: /\[preco/.test(corpo), travessao: corpo.includes(String.fromCharCode(8212)),
      wa_com_texto: wa.length, wa_fora_da_regra: wa.filter(t => !t.startsWith(OLA)).length,
      rapida: ((d.querySelector('.ded-rapida') || {}).textContent || '').slice(0, 120)};
    const s = J.res.sem_login;
    if (s.st !== 200 || !s.title_ok || !s.desc_ok || !s.canon_ok || s.noindex || s.h1.length !== 1 || s.ld.includes('ERRO') || s.formularios !== 1 || s.fc_cru || s.mapa_embutido || s.tel < 2 || s.wa_fora_da_regra) throw new Error('conferencia sem login: ' + JSON.stringify(s));
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
