// Sustentabilidade v6 (08/11/2026): regras dos cabides (o dono, 10h16). 6163 v5 -> v6, cache, conferencia sem login.
(() => {
if (window.__jobSU3 && window.__jobSU3.feito === false) return 'ja em andamento: nada feito';
window.__jobSU3 = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobSU3, DE = 'f1f9e8d5c9f7a556', PARA = '356032dd477be917', RAW = 'https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/aa8303e526cb25c8eb65eedd94a11a6facf5b2e7/orcamento_04-11/sustentabilidade_v6.txt';
  try {
    J.etapa = 'baixar';
    const t = await fetch(RAW, {cache: 'no-store', credentials: 'omit'}).then(r => r.text());
    if ((await dedSha16(t)) !== PARA) throw new Error('v6 baixada diferente');
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (!/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce');
    sessionStorage.setItem('ded_nonce', nn);
    J.etapa = 'ler';
    const p = await dedLer2('pages', 6163);
    J.res.antes = [p.sha, p.st];
    if (p.st !== 'publish' || (p.sha !== DE && p.sha !== PARA)) throw new Error('6163 inesperada: ' + p.sha + ' ' + p.st);
    if (p.sha === DE) {
      J.etapa = 'gravar';
      const g = await dedGravar2('pages', 6163, t, PARA);
      J.res.gravar = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('v6 nao ficou');
    }
    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    J.etapa = 'sem login';
    const r = await dedRL('/sustentabilidade/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
    const h = await r.text();
    J.res.semLogin = {st: r.status, outras: h.includes('outras lavanderias'), recolhe: h.includes('recolhe os cabides em casa'), r020: h.includes('R$ 0,20'),
      faq: h.includes('"FAQPage"'), ld: [...new DOMParser().parseFromString(h, 'text/html').querySelectorAll('script[type="application/ld+json"]')].map(s => { try { JSON.parse(s.textContent); return 'ok'; } catch (e) { return 'ERRO'; } })};
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
