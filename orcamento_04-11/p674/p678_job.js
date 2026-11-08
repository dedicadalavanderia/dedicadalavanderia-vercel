// 678 (08/11/2026, 19h5x). O dono as 19h36: "pode"; a ordem aprovada ("ok" as 19h49).
// (1) descricao do Yoast nos 9 posts sem descricao ou com descricao curta; (2) link quebrado do post 2320 para o servico de
// roupas finas; (3) no guia de cortinas (3436), o "Leia tambem" de Jurere vira o post de capas de sofa; (4) cache; (5) conferencia.
// O llms.txt (snippet 3946) vai pelo editor do WPCode, fora deste job. Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__job678 && window.__job678.feito === false) return 'ja em andamento: nada feito';
window.__job678 = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {desc: [], ver: {}}};
(async () => {
  const J = window.__job678;
  const D = {"descricoes": [{"id": 1013, "slug": "lavagem-de-edredom-de-pena-em-florianopolis", "desc": "Edredom de pena pode ir para a lavagem a seco ou em \u00e1gua, mas as penas precisam secar soltas para n\u00e3o criar cheiro nem fungos. Veja como a Dedicada cuida."}, {"id": 1028, "slug": "lavar-blusas-de-la-e-trico-a-seco-em-florianopolis", "desc": "Blusas de l\u00e3 e de tric\u00f4 encolhem e deformam na lavagem em \u00e1gua. Veja por que a Dedicada, em Florian\u00f3polis, lava a maioria delas a seco."}, {"id": 1058, "slug": "5-vantagens-de-usar-um-servico-profissional-de-lavanderia-em-florianopolis", "desc": "Ganhe tempo e trate cada tecido do jeito certo: veja 5 vantagens de usar uma lavanderia profissional com coleta e entrega em Florian\u00f3polis."}, {"id": 1030, "slug": "lavagem-de-roupas-de-tecido-polar-conforto-limpo-no-inverno", "desc": "Fleece (tecido polar) junta pelos, est\u00e1tica e cheiro, e pode endurecer na lavagem errada. Veja como lavar e como a Dedicada cuida dele em Florian\u00f3polis."}, {"id": 1054, "slug": "cuidar-da-sua-cama-e-cuidar-da-sua-saude-lavagem-profissional-de-edredons-mantas-e-roupas-de-cama-em-florianopolis", "desc": "Edredons, mantas e capas de colch\u00e3o acumulam suor, poeira e cheiro. Veja por que lavar a roupa de cama na lavanderia ajuda a dormir com mais higiene."}, {"id": 914, "slug": "a-importancia-de-lavar-roupas-sociais-ternos-e-gravatas-em-lavanderia-em-florianopolis", "desc": "Ternos e gravatas pedem lavagem a seco, tratamento de manchas e passadoria certa. Veja por que levar as roupas sociais \u00e0 lavanderia em Florian\u00f3polis."}, {"id": 2693, "slug": "de-quanto-em-quanto-tempo-lavar-itens-de-bebe", "desc": "Enxoval ap\u00f3s cada uso, ninho a cada 1 a 2 semanas, carrinho a cada 1 a 2 meses: veja de quanto em quanto tempo lavar cada item do beb\u00ea."}, {"id": 2677, "slug": "de-quanto-em-quanto-tempo-lavar-edredons", "desc": "Veja de quanto em quanto tempo lavar o edredom, por que sujeira e fungos se acumulam mesmo quando ele parece limpo e quando levar \u00e0 lavanderia."}, {"id": 2323, "slug": "por-que-suas-roupas-desbotam-e-encolhem", "desc": "Roupa que encolhe, desbota ou deforma na lavagem: veja o que causa cada problema, como diferenciar defeito do tecido de erro de lavagem e quando tem jeito."}], "post_link": {"id": 2320, "url": "/o-que-acontece-se-minha-roupa-estragar-na-lavanderia/", "de": "https://dedicadalavanderia.com.br/lavagem-de-tecidos-delicados-o-que-pode-dar-errado-e-como-evitar-prejuizos/", "para": "https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/"}, "guia": {"id": 3436, "url": "/cuidados-cortinas/", "sha": "bd0d53e6ef2c7e39", "de": "<a href=\"https://dedicadalavanderia.com.br/lavagem-cortinas-e-capas-sofa-em-jurere/\">Cortinas e capas de sof\u00e1 em Jurer\u00ea</a>", "para": "<a href=\"https://dedicadalavanderia.com.br/lavagem-de-capas-de-sofa-vale-a-pena-lavar-em-lavanderia/\">Lavagem de capas de sof\u00e1</a>"}};
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (rn.status !== 200 || !/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce: ' + rn.status);
    sessionStorage.setItem('ded_nonce', nn);
    J.etapa = 'conferir antes';
    const pl = await dedLer2('posts', D.post_link.id);
    if (pl.raw.split(D.post_link.de).length - 1 !== 1 && pl.raw.split(D.post_link.para).length - 1 < 1) throw new Error('post 2320: link nao encontrado');
    const gu = await dedLer2('pages', D.guia.id);
    if (gu.sha !== D.guia.sha) throw new Error('guia 3436 com sha diferente: ' + gu.sha);
    if (gu.raw.split(D.guia.de).length - 1 !== 1) throw new Error('guia 3436: trecho nao e unico');
    for (const x of D.descricoes) {
      J.etapa = 'descricao ' + x.id;
      const r = await dedYoast2(x.id, null, x.desc, 'posts');
      J.res.desc.push([x.id, r.yoast, r.refresh]);
      if (r.yoast !== 200) throw new Error('yoast ' + x.id + ': ' + JSON.stringify(r));
    }
    J.etapa = 'post 2320';
    if (pl.raw.split(D.post_link.de).length - 1 === 1) {
      const novo = pl.raw.split(D.post_link.de).join(D.post_link.para);
      const g = await dedGravar2('posts', D.post_link.id, novo, await dedSha16(novo));
      J.res.post = [pl.sha, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('post 2320 nao ficou');
    } else { J.res.post = 'ja estava'; }
    J.etapa = 'guia 3436';
    const novoG = gu.raw.split(D.guia.de).join(D.guia.para);
    const g2 = await dedGravar2('pages', D.guia.id, novoG, await dedSha16(novoG));
    J.res.guia = [gu.sha, g2.relido_sha, g2.ok];
    if (!g2.ok) throw new Error('guia 3436 nao ficou');
    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    J.etapa = 'conferencia sem login';
    for (const x of D.descricoes) {
      const v = await dedVer2('/' + x.slug + '/');
      J.res.ver[x.id] = [v.st, v.desc === x.desc, (v.desc || '').length];
    }
    const anon = async (u) => { const r = await dedRL(u + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'}); return {st: r.status, html: await r.text()}; };
    const a = await anon(D.post_link.url);
    J.res.ver.post = [a.st, a.html.includes(D.post_link.para), a.html.includes('lavagem-de-tecidos-delicados-o-que-pode-dar-errado')];
    const b = await anon(D.guia.url);
    J.res.ver.guia = [b.st, b.html.includes('/lavagem-de-capas-de-sofa-vale-a-pena-lavar-em-lavanderia/'), b.html.includes('lavagem-cortinas-e-capas-sofa-em-jurere')];
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
