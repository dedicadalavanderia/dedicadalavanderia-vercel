// Blog, resposta 655 (07/11/2026): para cada um dos 10 posts repetidos sem clique: confere o post (publicado) e o Redirection,
// cria o 301 para o post que fica (grupo 1), confere o 301 sem login, passa o post para RASCUNHO (nada apagado) e confere de novo.
// Depois grava a /blog/ v2 (385f81ab311ccd7f) e limpa o cache. Para no primeiro erro. Ritmo: dedRL. Resultado em window.__jobBL2.
(() => {
if (window.__jobBL2 && window.__jobBL2.feito === false) return 'ja em andamento: nada feito';
window.__jobBL2 = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {posts: []}};
(async () => {
  const J = window.__jobBL2;
  const SITE = 'https://dedicadalavanderia.com.br';
  const JUNTAR = [[3092, "vale-a-pena-usar-uma-lavanderia", 2440, "vale-a-pena-lavar-roupa-em-lavanderia"], [905, "vantagens-de-utilizar-uma-lavanderia-em-florianopolis-em-vez-de-lavar-roupas-em-casa", 1058, "5-vantagens-de-usar-um-servico-profissional-de-lavanderia-em-florianopolis"], [2355, "quando-a-lavagem-profissional-e-indispensavel", 2341, "quais-roupas-nao-devem-ser-lavadas-em-casa"], [2682, "lavagem-roupas-delicadas", 2270, "como-lavar-roupas-delicadas-sem-estragar"], [2304, "como-fazer-a-lavagem-de-tecidos-delicados", 2270, "como-lavar-roupas-delicadas-sem-estragar"], [1101, "lavagem-de-calca-jeans-em-florianopolis", 1871, "lavagem-de-calca-jeans-como-manter-a-cor-e-a-durabilidade"], [1011, "roupas-de-la-cuidado-profissional-que-faz-a-diferenca-no-inverno", 3085, "como-nao-encolher-roupas-de-la-veja-os-cuidados-essenciais"], [1051, "roupas-de-inverno-dicas-de-armazenamento-e-como-lava-las-utilizando-lavanderia-em-florianopolis", 2314, "cuidados-essenciais-com-suas-roupas-de-inverno"], [1036, "cobertores-mantas-e-cobertas-limpeza-profunda-para-um-inverno-mais-saudavel", 3100, "como-lavar-um-cobertor-pesado-com-seguranca-guia-completo"], [2418, "lavanderia-que-remove-cheiro-de-urina-no-estreito", 2257, "como-lavar-roupa-com-xixi"]];
  const SHA = "385f81ab311ccd7f", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/bb1cccbcca290791ce2c6cdf24e53d8c0b06a19d/orcamento_04-11/blog_916_v2.txt", ANTES = '4b0f4c7604402337';
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
    const H = {'X-WP-Nonce': n}, HJ = {'X-WP-Nonce': n, 'Content-Type': 'application/json'};
    const regra = async (slug) => { const j = await dedRL('/wp-json/redirection/v1/redirect?filterBy%5Burl%5D=' + encodeURIComponent(slug) + '&per_page=50&page=0', {headers: H, credentials: 'include'}).then(r => r.json());
      return (j.items || []).filter(x => x.url.replace(/\/+$/, '') === '/' + slug); };
    const segue = async (slug) => { const r = await dedRL('/' + slug + '/?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store', redirect: 'follow'}); return {st: r.status, redirected: r.redirected, final: r.url.split('?')[0]}; };
    for (const [id, slug, alvo, alvoSlug] of JUNTAR) {
      const P = {id, slug, alvo};
      J.res.posts.push(P);
      J.etapa = 'post ' + id;
      const p = await dedRL('/wp-json/wp/v2/posts/' + id + '?context=edit&_fields=id,status,slug', {headers: H, credentials: 'include'}).then(r => r.json());
      P.antes = p.status;
      if (p.slug !== slug) throw new Error('slug diferente no post ' + id + ': ' + p.slug);
      if (p.status !== 'publish' && p.status !== 'draft') throw new Error('status inesperado no post ' + id + ': ' + p.status);
      const a = await dedRL('/wp-json/wp/v2/posts/' + alvo + '?context=edit&_fields=id,status,slug', {headers: H, credentials: 'include'}).then(r => r.json());
      if (a.status !== 'publish' || a.slug !== alvoSlug) throw new Error('alvo ' + alvo + ' fora do ar ou com outro slug');
      let ex = await regra(slug);
      if (ex.length && !(ex.length === 1 && ex[0].action_data && ex[0].action_data.url === '/' + alvoSlug + '/')) throw new Error('regra diferente ja existe para ' + slug + ': ' + JSON.stringify(ex.map(x => [x.id, x.action_data])));
      if (!ex.length) {
        const r = await dedRL('/wp-json/redirection/v1/redirect', {method: 'POST', headers: HJ, credentials: 'include', body: JSON.stringify({
          url: '/' + slug + '/', match_data: {source: {flag_case: false, flag_query: 'pass', flag_regex: false, flag_trailing: true}},
          action_code: 301, action_type: 'url', action_data: {url: '/' + alvoSlug + '/'}, match_type: 'url', group_id: 1,
          title: 'Post juntado (resposta 655, 07/11): ' + id + ' para ' + alvo, regex: false})});
        P.criar = r.status;
        if (!r.ok) throw new Error('criar regra ' + slug + ': HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
        ex = await regra(slug);
        if (ex.length !== 1 || ex[0].action_data.url !== '/' + alvoSlug + '/' || ex[0].action_code !== 301 || !ex[0].enabled) throw new Error('regra nao confere: ' + slug);
      }
      P.regra = ex[0].id;
      P.antes301 = await segue(slug);
      if (!P.antes301.redirected || P.antes301.final !== SITE + '/' + alvoSlug + '/' || P.antes301.st !== 200) throw new Error('301 nao funciona (antes do rascunho): ' + slug + ' ' + JSON.stringify(P.antes301));
      if (p.status === 'publish') {
        const r = await dedRL('/wp-json/wp/v2/posts/' + id, {method: 'POST', headers: HJ, credentials: 'include', body: JSON.stringify({status: 'draft'})});
        const j = await r.json();
        P.rascunho = [r.status, j.status];
        if (j.status !== 'draft') throw new Error('rascunho nao confere: ' + id);
      }
      P.depois301 = await segue(slug);
      if (!P.depois301.redirected || P.depois301.final !== SITE + '/' + alvoSlug + '/' || P.depois301.st !== 200) throw new Error('301 nao funciona (depois do rascunho): ' + slug);
      P.ok = true;
    }
    J.etapa = '916';
    const b = await dedLer2('pages', 916);
    J.res.antes916 = {sha: b.sha, len: b.len};
    if (b.sha !== ANTES && b.sha !== SHA) throw new Error('a 916 mudou: ' + b.sha);
    J.res.gravar916 = b.sha === SHA ? 'ja estava gravada' : await dedGravar2('pages', 916, conteudo, SHA);
    if (J.res.gravar916 !== 'ja estava gravada' && !J.res.gravar916.ok) throw new Error('916 nao confere');
    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
