// Passo 30, publicacao (12/11/2026; o dono as 09h19: 708 "sim", 709 "ja vamos fazer em todas"): faixa de prova perto dos
// botoes do meio e do fim nas pagina de pacotes (1689; o dono as 09h54, 711: "ok, pode alterar em pacotes"). Resultado em window.__jobP30b.
(() => {
if (window.__jobP30b && window.__jobP30b.feito === false) return 'ja em andamento: nada feito';
window.__jobP30b = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: [], gravadas: [], ver: {}};
(async () => {
  const J = window.__jobP30b;
  const D = {"paginas":[{"id":1689,"url":"https://dedicadalavanderia.com.br/pacotes/","grupo":"pacotes","de":"cc6c1b4a4f58ec8d","para":"5bbb3aa5d97ce9c1","pares":[["</style>\n<nav class=\"ded-trilha\"",".ded-prova{max-width:560px;margin:18px auto;padding:14px 16px;border:1px solid #d3d3d3;border-left:3px solid #1e4468;background:#fff;text-align:left}.ded-prova-itens{margin:0 0 10px;font-size:14px;line-height:1.6;color:#303030}.ded-prova-itens a{color:#1e4468 !important;text-decoration:underline;text-underline-offset:3px}.ded-prova-estrela{color:#c9a227}.ded-prova blockquote{margin:0;padding:0;border:0;background:none;quotes:none}.ded-prova blockquote:before,.ded-prova blockquote:after{display:none;content:none}.ded-prova blockquote p{margin:0 0 4px;font-size:14px;line-height:1.6;font-style:italic;color:#303030}.ded-prova cite{display:block;font-style:normal;font-size:12px;line-height:1.5;color:#555}</style>\n<nav class=\"ded-trilha\""],["</figure>\n[/vc_column_text][vc_empty_space height=\"30\"][vc_column_text]\n<p class=\"ded-sv-meio\"","</figure><div class=\"ded-prova\"><p class=\"ded-prova-itens\"><span class=\"ded-prova-estrela\" aria-hidden=\"true\">\u2605</span> <a href=\"https://www.google.com/maps?cid=12049800564194816433\" rel=\"noopener\">4,7 no Google</a><span class=\"ded-prova-sep\" aria-hidden=\"true\"> \u00b7 </span>Desde 2003<span class=\"ded-prova-sep\" aria-hidden=\"true\"> \u00b7 </span><a href=\"https://dedicadalavanderia.com.br/garantia/\">Garantia por escrito</a>: falha nossa, relavamos ou recuperamos a pe\u00e7a, sem custo.</p><blockquote><p>\u201c(\u2026) Respeita os prazos de entrega. Recomendo sempre aos meus conhecidos.\u201d</p><cite>Julio Moreira Gon\u00e7alves \u00b7 5 estrelas no Google</cite></blockquote></div>\n[/vc_column_text][vc_empty_space height=\"30\"][vc_column_text]\n<p class=\"ded-sv-meio\""],["\n<p class=\"ded-sv-fim\"><a class=\"ded-sv-btn\"","\n<div class=\"ded-prova\"><p class=\"ded-prova-itens\"><span class=\"ded-prova-estrela\" aria-hidden=\"true\">\u2605</span> <a href=\"https://www.google.com/maps?cid=12049800564194816433\" rel=\"noopener\">4,7 no Google</a><span class=\"ded-prova-sep\" aria-hidden=\"true\"> \u00b7 </span>Desde 2003<span class=\"ded-prova-sep\" aria-hidden=\"true\"> \u00b7 </span><a href=\"https://dedicadalavanderia.com.br/garantia/\">Garantia por escrito</a>: falha nossa, relavamos ou recuperamos a pe\u00e7a, sem custo.</p><blockquote><p>\u201c(\u2026) D\u00e1 pra sentir que o servi\u00e7o \u00e9 feito com aten\u00e7\u00e3o e responsabilidade, o que passa muita confian\u00e7a. \u00d3tima op\u00e7\u00e3o pra quem quer praticidade e qualidade sem surpresas desagrad\u00e1veis.\u201d</p><cite>Daniel Xavier \u00b7 5 estrelas no Google</cite></blockquote></div><p class=\"ded-sv-fim\"><a class=\"ded-sv-btn\""]],"meio":"\u26054,7noGoogle\u00b7Desde2003\u00b7Garantiaporescrito:falhanossa,relavamosourecuperamosape\u00e7a,semcusto.\"(...)Respeitaosprazosdeentrega.Recomendosempreaosmeusconhecidos.\"JulioMoreiraGon\u00e7alves\u00b75estrelasnoGoogle","fim":"\u26054,7noGoogle\u00b7Desde2003\u00b7Garantiaporescrito:falhanossa,relavamosourecuperamosape\u00e7a,semcusto.\"(...)D\u00e1prasentirqueoservi\u00e7o\u00e9feitocomaten\u00e7\u00e3oeresponsabilidade,oquepassamuitaconfian\u00e7a.\u00d3timaop\u00e7\u00e3opraquemquerpraticidadeequalidadesemsurpresasdesagrad\u00e1veis.\"DanielXavier\u00b75estrelasnoGoogle","faq":17,"whats_conteudo":6}],"css":".ded-prova{max-width:560px"};
  const limpa = (s) => s.replace(/\s+/g, ' ').trim();
  const norm = (s) => s.normalize('NFC').replace(/[\u2018\u2019\u00b4`]/g, "'").replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, '...').replace(/[\u2013\u2014]/g, '-').replace(/\u00d7/g, 'x').replace(/\s+/g, '');
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const n = (await rn.text()).trim();
    if (!/^[a-f0-9]{10}$/.test(n)) throw new Error('nonce invalido');
    sessionStorage.setItem('ded_nonce', n);
    // 1. le as 19 e monta o texto novo de cada uma; so grava se todas estiverem como esperado
    const prontos = [];
    for (const p of D.paginas) {
      const R = {id: p.id, grupo: p.grupo};
      J.res.push(R);
      J.etapa = 'leitura ' + p.id + ' (' + J.res.length + '/' + D.paginas.length + ')';
      const a = await dedLer2('pages', p.id);
      R.antes = a.sha;
      if (a.st !== 'publish') throw new Error(p.id + ' nao publicada: ' + a.st);
      if (a.sha === p.para) { R.res = 'ja estava'; continue; }
      if (a.sha !== p.de) throw new Error(p.id + ' com sha diferente: ' + a.sha);
      let novo = a.raw;
      for (const [de, para] of p.pares) {
        if (novo.split(de).length !== 2) throw new Error(p.id + ': trecho nao aparece 1 vez: ' + de.slice(0, 60));
        novo = novo.split(de).join(para);
      }
      const s = await dedSha16(novo);
      if (s !== p.para) throw new Error(p.id + ': sha depois diferente do esperado: ' + s);
      prontos.push([p, R, novo]);
    }
    // 2. grava, na ordem (as 9 da previa, depois as 10), e rele cada uma
    for (const [p, R, novo] of prontos) {
      J.etapa = 'gravacao ' + p.id + ' (' + (J.gravadas.length + 1) + '/' + prontos.length + ')';
      const g = await dedGravar2('pages', p.id, novo, p.para);
      R.gravar = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error(p.id + ' nao ficou: ' + JSON.stringify(g));
      R.res = 'gravada';
      J.gravadas.push(p.id);
    }
    J.etapa = 'cache';
    J.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    // 3. conferencia sem login das 19 (todas, mesmo se uma falhar; o erro sai no fim, com a lista)
    const falhas = [];
    for (const p of D.paginas) {
      J.etapa = 'conferencia ' + p.id + ' (' + (Object.keys(J.ver).length + 1) + '/' + D.paginas.length + ')';
      const r = await dedRL(p.url + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
      const h = await r.text();
      const doc = new DOMParser().parseFromString(h, 'text/html');
      const bl = [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((x) => x[1]);
      let ent = 0, erros = 0, faqld = -1;
      for (const b of bl) {
        ent += (b.match(/&#\d+;|&[a-zA-Z]+;/g) || []).length;
        try { const o = JSON.parse(b); for (const x of (o['@graph'] || [o])) if (x['@type'] === 'FAQPage') faqld = x.mainEntity.length; } catch (e) { erros++; }
      }
      const FX = [...doc.querySelectorAll('.ded-prova')];
      const d2 = doc.body.cloneNode(true);
      d2.querySelectorAll('script,style,noscript').forEach((x) => x.remove());
      const corpo = limpa(d2.textContent);
      const can = doc.querySelector('link[rel="canonical"]');
      const V = {st: r.status, faixas: FX.length, css: h.split(D.css).length - 1,
        meio: FX[0] ? norm(FX[0].textContent) === p.meio : false, fim: FX[1] ? norm(FX[1].textContent) === p.fim : false,
        depois_da_fala: FX[0] && FX[0].previousElementSibling ? FX[0].previousElementSibling.tagName : '',
        antes_do_botao: FX[1] && FX[1].nextElementSibling ? FX[1].nextElementSibling.className : '',
        blocos: bl.length, json_erros: erros, entidades: ent, faq: doc.querySelectorAll('.ded-faq details').length, faq_ld: faqld,
        h1: doc.querySelectorAll('h1').length, preco_cru: (corpo.match(/\[preco/g) || []).length,
        whats: doc.querySelectorAll('a[href*="wa.me/5548984280639?text="]').length, canonical: can ? can.getAttribute('href') === p.url : null};
      J.ver[p.id] = V;
      if (V.st !== 200 || V.faixas !== 2 || V.css !== 1 || !V.meio || !V.fim || V.json_erros || V.entidades || V.faq !== p.faq
        || V.faq_ld !== p.faq || V.preco_cru || V.whats < p.whats_conteudo) falhas.push(p.id);
    }
    J.falhas = falhas;
    if (falhas.length) throw new Error('conferencia falhou em ' + falhas.join(', ') + ': ' + JSON.stringify(falhas.map((i) => [i, J.ver[i]])));
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
