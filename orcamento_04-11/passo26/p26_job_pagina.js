// Passo 26 (08/11/2026): pagina /orcamento/ (3146) v4, titulo do WordPress, Yoast, cache e conferencia sem login.
(() => {
if (window.__jobP26 && window.__jobP26.feito === false) return 'ja em andamento: nada feito';
window.__jobP26 = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobP26, D = {"id": 3146, "de": "14cb94d864acebd3", "para": "ad04e0ac20b30e1e", "titulo": "Simule o or\u00e7amento da lavanderia em Florian\u00f3polis", "yt": "Simule o or\u00e7amento da lavanderia em Florian\u00f3polis | Dedicada", "yd": "Escolha as pe\u00e7as e veja na hora o pre\u00e7o \u201ca partir de\u201d, o prazo e o dia da coleta gr\u00e1tis no seu bairro. Mande pelo WhatsApp ou para quem decide com voc\u00ea.", "raw": "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/e82b359c8a863fa9c79ebd91cb7faac582cbe4fa/orcamento_04-11/passo26/pagina-orcamento-v4.html"};
  const OLA = 'Ol' + String.fromCharCode(225) + '! Vim pelo site';
  try {
    J.etapa = 'baixar';
    const t = await fetch(D.raw, {cache: 'no-store', credentials: 'omit'}).then(r => r.text());
    if ((await dedSha16(t)) !== D.para) throw new Error('v4 baixada diferente');
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (!/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce');
    sessionStorage.setItem('ded_nonce', nn);
    const H = {'X-WP-Nonce': nn, 'Content-Type': 'application/json'};
    J.etapa = 'ler';
    let p = await dedLer2('pages', D.id);
    J.res.antes = [p.sha, p.st, p.slug, p.title];
    if (p.st !== 'publish' || p.slug !== 'orcamento' || (p.sha !== D.de && p.sha !== D.para)) throw new Error('3146 inesperada: ' + JSON.stringify(J.res.antes));
    if (p.sha === D.de) {
      J.etapa = 'gravar';
      const g = await dedGravar2('pages', D.id, t, D.para);
      J.res.gravar = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('v4 nao ficou');
    }
    if (p.title !== D.titulo) {
      J.etapa = 'titulo';
      const r = await dedRL('/wp-json/wp/v2/pages/' + D.id, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify({title: D.titulo})});
      J.res.titulo = r.status;
    }
    p = await dedLer2('pages', D.id);
    if (p.title !== D.titulo || p.sha !== D.para) throw new Error('titulo ou conteudo nao conferem: ' + p.title + ' ' + p.sha);
    J.etapa = 'yoast';
    J.res.yoast = await dedYoast2(D.id, D.yt, D.yd);
    if (J.res.yoast.yoast !== 200) throw new Error('yoast');
    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    J.etapa = 'sem login';
    const r = await dedRL('/orcamento/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
    const h = await r.text();
    const d = new DOMParser().parseFromString(h, 'text/html');
    const lds = [...d.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { return JSON.parse(s.textContent); } catch (e) { return 'ERRO'; } });
    const tipos = lds.map(j => j === 'ERRO' ? 'ERRO' : (j['@graph'] || [j]).map(x => x['@type']).join('+'));
    const faq = lds.find(j => j && j['@type'] === 'FAQPage');
    const wa = (h.match(/wa\.me\/[0-9]*\?text=[^"'\s<>]+/g) || []).length;
    const tri = d.querySelector('.ded-trilha');
    J.res.semLogin = {st: r.status, title: d.title, titleOk: d.title === D.yt, desc: (d.querySelector('meta[name="description"]') || {}).content === D.yd,
      canon: (d.querySelector('link[rel="canonical"]') || {}).href, h1: [...d.querySelectorAll('h1')].map(x => x.textContent.trim()),
      rapida: (d.querySelector('.ded-rapida') || {}).textContent, trilha: tri ? tri.textContent.trim() : null, tipos,
      faq: faq ? faq.mainEntity.length : 0, botaoEnviar: !!d.querySelector('.dlo-enviar'), msgNova: h.includes('Vim pelo site e quero confirmar o or'),
      precoCru: /\[preco/.test(h), travessao: /\u2014/.test((d.querySelector('.content') || d.body).textContent), wa};
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
