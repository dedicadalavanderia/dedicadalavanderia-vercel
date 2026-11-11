// 677, parte 1 (10/11/2026; o dono as 20h58: "ok, faca"): datePublished, dateModified e speakable no JSON-LD dos 17 guias e do hub.
(() => {
if (window.__job677a && window.__job677a.feito === false) return 'ja em andamento: nada feito';
window.__job677a = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: [], ver: {}};
(async () => {
  const J = window.__job677a;
  const D = {"modificado": "2026-10-29", "paginas": [{"id": 3191, "de": "74039e573235093d", "para": "5a370c315f17db3b", "publicado": "2026-09-18", "len": 50390, "url": "/cuidados-por-tecido/"}, {"id": 3208, "de": "e12568ab81cc58f5", "para": "1ea9fc74800a1c8d", "publicado": "2026-09-19", "len": 30724, "url": "/cuidados-seda/"}, {"id": 3212, "de": "3a8a863d75ee5deb", "para": "c361b7d0c758f163", "publicado": "2026-09-19", "len": 33384, "url": "/cuidados-linho/"}, {"id": 3215, "de": "4d87d7afb5f330b1", "para": "5c453c3fd9c5752a", "publicado": "2026-09-19", "len": 31716, "url": "/cuidados-la/"}, {"id": 3218, "de": "5a7db0d9ed2c1460", "para": "b51659ca77323b88", "publicado": "2026-09-19", "len": 31285, "url": "/cuidados-couro/"}, {"id": 3221, "de": "ee521d28a5bd55aa", "para": "639d44b23c4b4cdb", "publicado": "2026-09-19", "len": 29866, "url": "/cuidados-cetim-organza/"}, {"id": 3224, "de": "668d084037cc8b70", "para": "7cb8d4738b42c562", "publicado": "2026-09-19", "len": 30164, "url": "/cuidados-jeans-sarja/"}, {"id": 3227, "de": "82ea282656adac70", "para": "70c94d6325057594", "publicado": "2026-09-19", "len": 33814, "url": "/cuidados-sintetico/"}, {"id": 3236, "de": "f7849a8dc857215e", "para": "3014e49be92a5e0c", "publicado": "2026-09-22", "len": 36324, "url": "/cuidados-algodao/"}, {"id": 3239, "de": "ac9fcbe1775eacfe", "para": "feb3b97ea602136b", "publicado": "2026-09-22", "len": 35753, "url": "/cuidados-alfaiataria/"}, {"id": 3241, "de": "1fcc40c87653acda", "para": "93b8bcdd6f7b63c6", "publicado": "2026-09-22", "len": 35722, "url": "/cuidados-veludo/"}, {"id": 3243, "de": "26ed0b8debfae62c", "para": "49d198ef4915608d", "publicado": "2026-09-22", "len": 34058, "url": "/cuidados-roupa-de-cama/"}, {"id": 3245, "de": "a3ae1b3d7dfa2b5d", "para": "3b338c76ed74a696", "publicado": "2026-09-22", "len": 37343, "url": "/cuidados-tenis-calcados/"}, {"id": 3372, "de": "5d6c5b3d2b71747a", "para": "594b05717c474440", "publicado": "2026-09-27", "len": 35793, "url": "/cuidados-edredom/"}, {"id": 3436, "de": "1eeabf61175fe4a1", "para": "7cc701d6f7c0d12c", "publicado": "2026-09-27", "len": 26747, "url": "/cuidados-cortinas/"}, {"id": 3503, "de": "f1c2608d70676ed6", "para": "510c3780d102bf68", "publicado": "2026-09-27", "len": 28870, "url": "/cuidados-pelucias-fantasias/"}, {"id": 3532, "de": "0a64960a6d6ca870", "para": "54d6ae1016cff4fe", "publicado": "2026-09-27", "len": 28011, "url": "/cuidados-carrinho-de-bebe/"}, {"id": 3546, "de": "1e48f9a108d6aca2", "para": "ea03746cbf16548a", "publicado": "2026-09-27", "len": 27725, "url": "/cuidados-peles/"}]};
  const RE = /"lastReviewed":"(\d{4}-\d{2}-\d{2})"/g;
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
      const m = a.raw.match(RE) || [];
      if (m.length !== 1) throw new Error(p.id + ': lastReviewed aparece ' + m.length + ' vezes');
      const extra = ',"datePublished":"' + p.publicado + '","dateModified":"' + D.modificado + '","speakable":{"@type":"SpeakableSpecification","cssSelector":[".ded-rapida"]}';
      const novo = a.raw.replace(RE, (x) => x + extra);
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
      let ent = 0, erros = 0, speak = 0, mod = '', pub = '';
      for (const b of bl) { ent += (b.match(/&#\d+;|&[a-zA-Z]+;/g) || []).length; try { const o = JSON.parse(b); for (const x of (o['@graph'] || [o])) { if (x.speakable) { speak++; mod = x.dateModified || ''; pub = x.datePublished || ''; } } } catch (e) { erros++; } }
      J.ver[p.id] = {st: r.status, blocos: bl.length, json_erros: erros, entidades: ent, speakable: speak, mod, pub, rapida: (h.match(/class="ded-rapida"/g) || []).length};
      if (r.status !== 200 || erros || ent || speak !== 1 || mod !== D.modificado || pub !== p.publicado) throw new Error('conferencia falhou em ' + p.id + ': ' + JSON.stringify(J.ver[p.id]));
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
