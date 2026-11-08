// Diagnostico (673) e preco no schema (674), 08/11/2026, 13h4x. O dono as 13h43: "Pode".
// (1) baixa as 3 paginas do ramo temporario (sha conferida); (2) confere o estado do ar; (3) grava 3165, 5888 e 6073;
// (4) Yoast da 3165 (titulo novo, descricao igual); (5) cache; (6) conferencia sem login. Para no primeiro erro. Ritmo: dedRL (6 s).
// O JavaScript do Diagnostico (snippet 3164) vai pelo editor do WPCode, fora deste job.
(() => {
if (window.__job672 && window.__job672.feito === false) return 'ja em andamento: nada feito';
window.__job672 = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {antes: {}, ver: {}}};
(async () => {
  const J = window.__job672;
  const D = {"paginas": [{"id": 3165, "de": "4533e1fd13b81458", "para": "6fbbf752dadfdbaf", "raw": "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/cf7059dc47bd1a733007244a7cd3756c5092fb26/orcamento_04-11/p672/pagina-diagnostico-3165_v_08-11.html", "url": "/diagnostico-de-manchas/"}, {"id": 5888, "de": "ff5bd2e0f79405f2", "para": "c3985b318e21f3c4", "raw": "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/cf7059dc47bd1a733007244a7cd3756c5092fb26/orcamento_04-11/p674/maquina-5888_v_08-11.html", "url": "/maquina-de-lavar-quebrou/"}, {"id": 6073, "de": "8292d706bfade2a6", "para": "9d532c50f690e4c3", "raw": "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/cf7059dc47bd1a733007244a7cd3756c5092fb26/orcamento_04-11/p674/empresas-6073_v_08-11.html", "url": "/para-empresas/"}], "yoast": {"id": 3165, "titulo": "Tirar mancha de roupa: o que fazer antes de lavar | Dedicada", "desc": "Mancha fresca, seca ou j\u00e1 lavada: o que fazer em casa, quando levar \u00e0 lavanderia e como a Dedicada trata 44 manchas em 23 pe\u00e7as. Florian\u00f3polis.", "url": "/diagnostico-de-manchas/", "link": "https://dedicadalavanderia.com.br/diagnostico-de-manchas/"}};
  const OLA = 'Ol' + String.fromCharCode(225) + '! Vim pelo site';
  const PELO = 'pelo diagn' + String.fromCharCode(243) + 'stico de manchas';
  try {
    J.etapa = 'baixar';
    for (const p of D.paginas) {
      p.txt = await fetch(p.raw, {cache: 'no-store', credentials: 'omit'}).then(r => r.text());
      if ((await dedSha16(p.txt)) !== p.para) throw new Error(p.id + ': baixada com sha diferente');
    }
    J.etapa = 'conferir antes';
    for (const p of D.paginas) {
      const a = await dedLer2('pages', p.id);
      J.res.antes[p.id] = [a.sha, a.st, a.slug];
      if (a.st !== 'publish') throw new Error(p.id + ' nao esta publicada: ' + a.st);
      if (a.sha !== p.de && a.sha !== p.para) throw new Error(p.id + ' com sha diferente: ' + a.sha);
      p.atual = a.sha;
    }
    for (const p of D.paginas) {
      J.etapa = 'gravar ' + p.id;
      if (p.atual === p.para) { J.res[p.id] = 'ja estava'; continue; }
      const g = await dedGravar2('pages', p.id, p.txt, p.para);
      J.res[p.id] = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error(p.id + ' nao ficou: ' + JSON.stringify(g));
    }
    J.etapa = 'yoast';
    J.res.yoast = await dedYoast2(D.yoast.id, D.yoast.titulo, D.yoast.desc);
    if (J.res.yoast.yoast !== 200) throw new Error('yoast: ' + JSON.stringify(J.res.yoast));
    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    J.etapa = 'conferencia sem login';
    const v = await dedVer2(D.yoast.url);
    J.res.ver.diag = {st: v.st, title: v.title, desc: v.desc, canon: v.canon, h1: v.h1.length, ld: v.ld, precoCru: v.precoCru, travessao: v.travessao};
    J.res.ver.yoast_ok = [v.title === D.yoast.titulo, v.desc === D.yoast.desc, v.canon === D.yoast.link];
    for (const p of D.paginas) {
      const r = await dedRL(p.url + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
      const h = await r.text();
      const bl = [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
      let ent = 0, erros = 0, speak = false;
      for (const b of bl) { ent += (b.match(/&#\d+;|&[a-zA-Z]+;/g) || []).length; try { const o = JSON.parse(b); if (JSON.stringify(o).includes('SpeakableSpecification')) speak = true; } catch (e) { erros++; } }
      const wa = (h.match(/wa\.me\/[0-9]+\?text=[^"'\s<>]+/g) || []).map(x => { try { return decodeURIComponent(x.split('?text=')[1].replace(/\+/g, ' ')); } catch (e) { return 'ERRO'; } });
      J.res.ver[p.id] = {st: r.status, blocos: bl.length, entidades: ent, json_erros: erros, speakable: speak, precos_crus: (h.match(/\[preco[^\]]*\]/g) || []).length,
        wa: wa.length, wa_fora: wa.filter(t => !t.startsWith(OLA)).length, wa_pelo_diag: wa.filter(t => t.includes(PELO)).length,
        noindex: /<meta[^>]+robots[^>]+noindex/i.test(h)};
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
