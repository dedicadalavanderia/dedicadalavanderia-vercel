// Blog (07/11/2026, passo 25): PUBLICA o texto novo da /blog/ (pagina 916, v1, sha 4b0f4c7604402337) e o Yoast; limpa o cache.
// Antes de gravar, confere que a 916 e a mesma lida em 07/11 (330601134e86bdb5; copia em registros/passo25_blog_07-11/antes/).
// Ritmo: dedRL. Resultado em window.__jobBLL.
(() => {
if (window.__jobBLL && window.__jobBLL.feito === false) return 'ja em andamento: nada feito';
window.__jobBLL = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobBLL;
  const SHA = "4b0f4c7604402337", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/527d8b1ed17d97d74e269791c93cf2de0945a297/orcamento_04-11/blog_916_v1.txt", ANTES = '330601134e86bdb5';
  const Y_TIT = "Blog da Dedicada Lavanderia: manchas, tecidos e cuidados", Y_DESC = "Dicas dos s\u00f3cios da Dedicada Lavanderia, em Florian\u00f3polis desde 2003: manchas, seda e linho, l\u00e3, cama e beb\u00ea, roupas do dia a dia e quando usar lavanderia.";
  try {
    J.etapa = 'baixar';
    const conteudo = await fetch(RAW, {cache: 'no-store'}).then(r => r.text());
    J.res.baixado = {len: conteudo.length, sha: await dedSha16(conteudo)};
    if (J.res.baixado.sha !== SHA) throw new Error('sha do arquivo baixado diferente');
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const n = (await rn.text()).trim();
    if (!/^[a-f0-9]{10}$/.test(n)) throw new Error('nonce invalido');
    sessionStorage.setItem('ded_nonce', n);
    J.etapa = 'antes';
    const a = await dedLer2('pages', 916);
    J.res.antes = {sha: a.sha, len: a.len, st: a.st, slug: a.slug, title: a.title, yoast: a.yoast_title};
    if (a.sha !== ANTES && a.sha !== SHA) throw new Error('a 916 mudou desde a leitura: ' + a.sha);
    J.etapa = 'gravar';
    J.res.gravar = a.sha === SHA ? 'ja estava gravada' : await dedGravar2('pages', 916, conteudo, SHA);
    if (J.res.gravar !== 'ja estava gravada' && !J.res.gravar.ok) throw new Error('gravacao nao confere: ' + JSON.stringify(J.res.gravar));
    J.etapa = 'yoast';
    J.res.yoast = await dedYoast2(916, Y_TIT, Y_DESC);
    J.etapa = 'reler';
    const d = await dedLer2('pages', 916);
    J.res.depois = {sha: d.sha, len: d.len, st: d.st, slug: d.slug, title: d.title, yoast: d.yoast_title, ok: d.sha === SHA && d.st === 'publish' && d.slug === 'blog'};
    if (!J.res.depois.ok) throw new Error('releitura nao confere');
    J.etapa = 'cache';
    const rc = await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'});
    J.res.cache = rc.status;
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
