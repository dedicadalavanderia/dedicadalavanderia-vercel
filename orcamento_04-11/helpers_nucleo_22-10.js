window.__rl = window.__rl || {ultimo: 0, intervalo: 6000, parado: false, log: []};

window.dedSha16 = async (s) => { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,16); };

window.dedSha12 = async (s) => (await window.dedSha16(s)).slice(0,12);

window.dedGunzip = async (b64) => { const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0)); return await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text(); };

window.dedChunk = async (nome, i, texto, sha12) => { const h = await window.dedSha12(texto); if (h !== sha12) return {i, len: texto.length, ok: false, h, esperado: sha12}; sessionStorage.setItem('ded_up_'+nome+'_'+i, texto); return {i, len: texto.length, ok: true}; };

window.dedMontar = async (nome, n, sha16) => { let b64 = ''; for (let i = 0; i < n; i++) { const p = sessionStorage.getItem('ded_up_'+nome+'_'+i); if (!p) return {ok:false, erro:'falta pedaco '+i}; b64 += p; } const txt = await window.dedGunzip(b64); const sha = await window.dedSha16(txt); if (sha !== sha16) return {ok:false, sha, len: txt.length}; sessionStorage.setItem('ded_novo_'+nome, txt); return {ok:true, sha, len: txt.length}; };

window.dedRL = async (url, opts = {}) => {
  if (window.__rl.parado) throw new Error('parado (servidor recusou antes)');
  const espera = window.__rl.ultimo + window.__rl.intervalo - Date.now();
  if (espera > 0) await new Promise(r => setTimeout(r, espera));
  window.__rl.ultimo = Date.now();
  const ac = new AbortController(); const to = setTimeout(() => ac.abort(), 60000);
  let r;
  try { r = await fetch(url, Object.assign({signal: ac.signal}, opts)); } finally { clearTimeout(to); }
  window.__rl.log.push([new Date().toLocaleTimeString('pt-BR'), (opts.method || 'GET'), url.slice(0, 90), r.status]);
  if (r.status === 429 || r.status >= 500) { window.__rl.parado = true; throw new Error('servidor respondeu ' + r.status + ' em ' + url.slice(0, 80)); }
  return r;
};

window.dedLer2 = async (tipo, id) => { const n = sessionStorage.getItem('ded_nonce'); const r = await window.dedRL('/wp-json/wp/v2/' + tipo + '/' + id + '?context=edit', {headers: {'X-WP-Nonce': n}, credentials: 'include'}); const j = await r.json(); const raw = (j.content && j.content.raw) || ''; return {status: r.status, sha: await window.dedSha16(raw), len: raw.length, raw, title: j.title && j.title.raw, st: j.status, slug: j.slug, link: j.link, modified: j.modified, yoast_title: j.yoast_head_json && j.yoast_head_json.title}; };

window.dedGravar2 = async (tipo, id, conteudo, esperadoSha) => { const sha = await window.dedSha16(conteudo); if (sha !== esperadoSha) return {erro: 'sha do conteudo nao bate', sha}; const n = sessionStorage.getItem('ded_nonce'); const r = await window.dedRL('/wp-json/wp/v2/' + tipo + '/' + id, {method: 'POST', headers: {'X-WP-Nonce': n, 'Content-Type': 'application/json'}, credentials: 'include', body: JSON.stringify({content: conteudo})}); const j = await r.json(); const relido = await window.dedLer2(tipo, id); return {status: r.status, modified: j.modified, relido_sha: relido.sha, relido_len: relido.len, ok: relido.sha === esperadoSha}; };

// P.vezes (opcional, padrão 1): quantas vezes cada trecho deve aparecer; todas as ocorrências são trocadas (18/10, hub de Canasvieiras)
window.dedPares2 = async (tipo, id, P) => { const v = P.vezes || 1; const d = await window.dedLer2(tipo, id); if (d.sha !== P.de) return {erro: 'sha no servidor nao e o esperado', sha: d.sha, st: d.st, len: d.len}; let t = d.raw; const falhas = []; for (const [a, b] of P.pares) { const c = t.split(a).length - 1; if (c !== v) { falhas.push([a.slice(0, 60), c]); continue; } t = t.split(a).join(b); } const sha = await window.dedSha16(t); if (falhas.length || sha !== P.para) return {erro: 'resultado nao bate', falhas, sha, esperado: P.para}; const g = await window.dedGravar2(tipo, id, t, P.para); return Object.assign({id, de: P.de, para: P.para}, g); };

window.dedVer2 = async (url) => {
  const r = await window.dedRL(url + (url.includes('?') ? '&' : '?') + 'nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
  const html = await r.text();
  const d = new DOMParser().parseFromString(html, 'text/html');
  const m = s => (d.querySelector(s) || {}).content;
  const lds = [...d.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { JSON.parse(s.textContent); return 'ok'; } catch (e) { return 'ERRO'; } });
  const corpo = (d.querySelector('.content') || d.body);
  const texto = corpo ? corpo.textContent : '';
  return {st: r.status, final: r.url.replace(location.origin, ''), title: d.title, desc: m('meta[name="description"]'), canon: (d.querySelector('link[rel=canonical]') || {}).href,
    h1: [...d.querySelectorAll('h1')].map(h => h.textContent.trim()), h2: [...d.querySelectorAll('h2')].map(h => h.textContent.trim().replace(/\s+/g, ' ')),
    ld: lds, precoCru: /\[preco/.test(texto), travessao: /—/.test(texto), rapida: ((d.querySelector('.ded-rapida') || {}).textContent || '').slice(0, 220)};
};

window.dedYoast2 = async (id, titulo, desc, tipo = 'pages') => { const n = sessionStorage.getItem('ded_nonce'); const it = {id}; if (titulo) it.seo_title = titulo; if (desc) it.meta_description = desc; const r = await window.dedRL('/wp-json/yoast/v1/bulk_editor/update_search', {method: 'POST', headers: {'X-WP-Nonce': n, 'Content-Type': 'application/json'}, credentials: 'same-origin', body: JSON.stringify({items: [it]})}); const j = await r.json(); const r2 = await window.dedRL('/wp-json/wp/v2/' + tipo + '/' + id, {method: 'POST', headers: {'X-WP-Nonce': n, 'Content-Type': 'application/json'}, credentials: 'same-origin', body: '{}'}); return {yoast: r.status, resp: JSON.stringify(j).slice(0, 200), refresh: r2.status}; };
'helpers ok: ' + ['dedRL','dedSha16','dedChunk','dedMontar','dedLer2','dedGravar2','dedPares2','dedVer2','dedYoast2'].map(f => typeof window[f] === 'function' ? 1 : 0).join('')
