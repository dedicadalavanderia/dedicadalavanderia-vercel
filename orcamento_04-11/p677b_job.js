// 677b (10/11/2026; o dono as 21h33: "acho que e bom tirar as datas da atualizacao do google"): sem dateModified e sem lastReviewed no JSON-LD dos 17 guias e do hub.
(() => {
if (window.__job677b && window.__job677b.feito === false) return 'ja em andamento: nada feito';
window.__job677b = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: [], ver: {}};
(async () => {
  const J = window.__job677b;
  const D = {"paginas":[{"id":3191,"de":"5a370c315f17db3b","para":"0c671f695acf7375","publicado":"2026-09-18","url":"/cuidados-por-tecido/"},{"id":3208,"de":"1ea9fc74800a1c8d","para":"ce22f0fe6ae40c60","publicado":"2026-09-19","url":"/cuidados-seda/"},{"id":3212,"de":"c361b7d0c758f163","para":"332afa4003cf6e3e","publicado":"2026-09-19","url":"/cuidados-linho/"},{"id":3215,"de":"5c453c3fd9c5752a","para":"45c361d3f63c3fd7","publicado":"2026-09-19","url":"/cuidados-la/"},{"id":3218,"de":"b51659ca77323b88","para":"d8ddf141d480b59f","publicado":"2026-09-19","url":"/cuidados-couro/"},{"id":3221,"de":"639d44b23c4b4cdb","para":"c82271dafcdf1df3","publicado":"2026-09-19","url":"/cuidados-cetim-organza/"},{"id":3224,"de":"7cb8d4738b42c562","para":"0e6460544348bcc2","publicado":"2026-09-19","url":"/cuidados-jeans-sarja/"},{"id":3227,"de":"70c94d6325057594","para":"72394e4b56677d13","publicado":"2026-09-19","url":"/cuidados-sintetico/"},{"id":3236,"de":"3014e49be92a5e0c","para":"a101b77b419f134f","publicado":"2026-09-22","url":"/cuidados-algodao/"},{"id":3239,"de":"feb3b97ea602136b","para":"2988ae33d504c206","publicado":"2026-09-22","url":"/cuidados-alfaiataria/"},{"id":3241,"de":"93b8bcdd6f7b63c6","para":"bb303ef0338065d3","publicado":"2026-09-22","url":"/cuidados-veludo/"},{"id":3243,"de":"49d198ef4915608d","para":"0860630384eed1e6","publicado":"2026-09-22","url":"/cuidados-roupa-de-cama/"},{"id":3245,"de":"3b338c76ed74a696","para":"c82540e8dc7ef17f","publicado":"2026-09-22","url":"/cuidados-tenis-calcados/"},{"id":3372,"de":"594b05717c474440","para":"07d3a12427e807da","publicado":"2026-09-27","url":"/cuidados-edredom/"},{"id":3436,"de":"7cc701d6f7c0d12c","para":"697be25305d0b5e9","publicado":"2026-09-27","url":"/cuidados-cortinas/"},{"id":3503,"de":"510c3780d102bf68","para":"1419de4a79a76af5","publicado":"2026-09-27","url":"/cuidados-pelucias-fantasias/"},{"id":3532,"de":"54d6ae1016cff4fe","para":"1ce7b87170db5a70","publicado":"2026-09-27","url":"/cuidados-carrinho-de-bebe/"},{"id":3546,"de":"ea03746cbf16548a","para":"977588bcd471e20b","publicado":"2026-09-27","url":"/cuidados-peles/"}]};
  const RE_REV = /"lastReviewed":"\d{4}-\d{2}-\d{2}",/g;
  const MOD = ',"dateModified":"2026-10-29"';
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const n = (await rn.text()).trim();
    if (!/^[a-f0-9]{10}$/.test(n)) throw new Error('nonce invalido');
    sessionStorage.setItem('ded_nonce', n);
    for (const p of D.paginas) {
      const R = {id: p.id};
      J.res.push(R);
      J.etapa = 'pagina ' + p.id;
      const a = await dedLer2('pages', p.id);
      R.antes = a.sha;
      if (a.st !== 'publish') throw new Error(p.id + ' nao publicada: ' + a.st);
      if (a.sha === p.para) { R.res = 'ja estava'; continue; }
      if (a.sha !== p.de) throw new Error(p.id + ' com sha diferente: ' + a.sha);
      const m = a.raw.match(RE_REV) || [];
      if (m.length !== 1) throw new Error(p.id + ': lastReviewed aparece ' + m.length + ' vezes');
      if (a.raw.split(MOD).length !== 2) throw new Error(p.id + ': dateModified nao aparece 1 vez');
      const novo = a.raw.replace(RE_REV, '').replace(MOD, '');
      const s = await dedSha16(novo);
      if (s !== p.para) throw new Error(p.id + ': sha depois diferente do esperado: ' + s);
      const g = await dedGravar2('pages', p.id, novo, p.para);
      R.gravar = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error(p.id + ' nao ficou: ' + JSON.stringify(g));
    }
    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;
    J.etapa = 'conferencia sem login';
    for (const p of D.paginas) {
      const r = await dedRL(p.url + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
      const h = await r.text();
      const bl = [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map(x => x[1]);
      let ent = 0, erros = 0, speak = 0, pub = '', modNo = 0, revNo = 0, revisor = 0;
      const modTotal = bl.join('').split('"dateModified"').length - 1, revTotal = bl.join('').split('"lastReviewed"').length - 1;
      for (const b of bl) { ent += (b.match(/&#\d+;|&[a-zA-Z]+;/g) || []).length; try { const o = JSON.parse(b); for (const x of (o['@graph'] || [o])) { if (x.speakable) { speak++; pub = x.datePublished || ''; if (x.dateModified) modNo++; if (x.lastReviewed) revNo++; if (x.reviewedBy) revisor++; } } } catch (e) { erros++; } }
      J.ver[p.id] = {st: r.status, blocos: bl.length, json_erros: erros, entidades: ent, speakable: speak, pub, modNo, revNo, revisor, modTotal, revTotal, rapida: (h.match(/class="ded-rapida"/g) || []).length};
      if (r.status !== 200 || erros || ent || speak !== 1 || pub !== p.publicado || modNo || revNo || revisor !== 1) throw new Error('conferencia falhou em ' + p.id + ': ' + JSON.stringify(J.ver[p.id]));
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
