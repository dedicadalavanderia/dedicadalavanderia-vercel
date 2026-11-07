// Posts novos, job 2 (07/11/2026): publica o A (6197), grava a /blog/ v3 (20a9250084a81810), limpa o cache e confere sem login.
(() => {
if (window.__jobPN2 && window.__jobPN2.feito === false) return 'ja em andamento: nada feito';
window.__jobPN2 = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobPN2;
  const SITE = 'https://dedicadalavanderia.com.br', ID = 6197, SLUG = "como-tirar-mancha-de-protetor-solar-da-roupa", SHA_A = "58be5d5ce33fcec7";
  const RAW916 = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/112c02421c023c85deb3e85df0cc9389c935211d/orcamento_04-11/blog_916_v3.txt", SHA916 = "20a9250084a81810", ANTES916 = '385f81ab311ccd7f';
  const IMG = "mancha-de-protetor-solar-na-roupa-dedicada-lavanderia.webp";
  try {
    J.etapa = 'baixar 916';
    const c916 = await fetch(RAW916, {cache: 'no-store'}).then(r => r.text());
    if (await dedSha16(c916) !== SHA916) throw new Error('916 baixada diferente');
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const n = (await rn.text()).trim();
    if (!/^[a-f0-9]{10}$/.test(n)) throw new Error('nonce invalido');
    sessionStorage.setItem('ded_nonce', n);
    const H = {'X-WP-Nonce': n}, HJ = {'X-WP-Nonce': n, 'Content-Type': 'application/json'};
    J.etapa = 'ler A';
    const a = await dedRL('/wp-json/wp/v2/posts/' + ID + '?context=edit&_fields=id,status,slug,content', {headers: H, credentials: 'include'}).then(r => r.json());
    J.res.antes = a.status;
    if (a.slug !== SLUG || await dedSha16(a.content.raw) !== SHA_A) throw new Error('post A diferente do esperado');
    if (a.status !== 'publish') {
      J.etapa = 'publicar A';
      const r = await dedRL('/wp-json/wp/v2/posts/' + ID, {method: 'POST', headers: HJ, credentials: 'include', body: JSON.stringify({status: 'publish'})});
      const j = await r.json();
      J.res.publicar = [r.status, j.status, j.link, j.date_gmt];
      if (j.status !== 'publish' || j.link !== SITE + '/' + SLUG + '/') throw new Error('publicacao nao confere: ' + JSON.stringify(J.res.publicar));
    }
    J.etapa = '916';
    const b = await dedLer2('pages', 916);
    J.res.antes916 = b.sha;
    if (b.sha !== ANTES916 && b.sha !== SHA916) throw new Error('a 916 mudou: ' + b.sha);
    J.res.gravar916 = b.sha === SHA916 ? 'ja estava gravada' : await dedGravar2('pages', 916, c916, SHA916);
    if (J.res.gravar916 !== 'ja estava gravada' && !J.res.gravar916.ok) throw new Error('916 nao confere');
    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    J.etapa = 'conferir A sem login';
    const ra = await dedRL('/' + SLUG + '/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
    const h = await ra.text();
    J.res.semLogin = Object.assign({status: ra.status}, window.__chkBlog(h));
    const d = new DOMParser().parseFromString(h, 'text/html');
    J.res.semLogin.titulo = (d.querySelector('title') || {}).textContent;
    J.res.semLogin.ogImage = ((d.querySelector('meta[property="og:image"]') || {}).content || '').split('/').pop();
    J.res.semLogin.desc = ((d.querySelector('meta[name="description"]') || {}).content || '');
    J.res.semLogin.canonical = ((d.querySelector('link[rel="canonical"]') || {}).href || '');
    J.res.semLogin.faq = [...d.querySelectorAll('script[type="application/ld+json"]')].some(s => s.textContent.includes('"FAQPage"'));
    J.res.semLogin.imagemNoBp = [...d.querySelectorAll('script[type="application/ld+json"]')].some(s => s.textContent.includes(IMG));
    J.res.semLogin.robots = ((d.querySelector('meta[name="robots"]') || {}).content || '');
    const S = J.res.semLogin;
    if (S.status !== 200 || S.fatal || S.assina !== 1 || S.trilha !== 1 || S.revisado || S.autor !== 'jorge-mazza' || !S.faq || !S.imagemNoBp
        || S.ogImage !== IMG || S.canonical !== SITE + '/' + SLUG + '/' || /noindex/.test(S.robots) || S.h1 !== 1 || S.post_info || S.mais < 3)
      throw new Error('A sem login nao confere: ' + JSON.stringify(S));
    J.etapa = 'conferir /blog/';
    const hb = await dedRL('/blog/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}).then(r => r.text());
    J.res.blog = (hb.match(new RegExp('href="' + SITE + '/' + SLUG + '/"', 'g')) || []).length;
    if (J.res.blog < 1) throw new Error('/blog/ sem o post A');
    J.etapa = 'sitemap';
    const sm = await dedRL('/post-sitemap.xml?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}).then(r => r.text());
    J.res.sitemap = sm.includes(SITE + '/' + SLUG + '/');
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
