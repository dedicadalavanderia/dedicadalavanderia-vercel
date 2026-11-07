// Rodape (07/11/2026, passo 24), LOTE DE PUBLICACAO. Respostas do dono as 12h02 (647 "sim"; 648 sem a razao social; 649 sem a
// RBSites). (1) custom_html-6 = v3; (2) 2533 = o mesmo HTML; (3) text-8 = texto novo; (4) text-6 para os inativos (sem apagar);
// (5) cache; (6) conferencia sem login. Para no primeiro erro. Ritmo: dedRL (6 s).
(() => {
if (window.__jobRDLT && window.__jobRDLT.feito === false) return 'ja em andamento: nada feito';
window.__jobRDLT = {inicio: new Date().toLocaleTimeString('pt-BR'), feito: false, etapa: '', res: {}};
(async () => {
  const J = window.__jobRDLT;
  const W_DE = "e5f8b5731e661d82", P_DE = "2d78622654f433c3", PARA = "97f945fd5bbb2fbe", RAW = "https://raw.githubusercontent.com/dedicadalavanderia/dedicadalavanderia-vercel/e26726bc1d2804446b0716cd7980ad2aa85ea4b2/orcamento_04-11/rodape_widget_v3.txt";
  const TEXTO = "Dedicada Lavanderia, em Florian\u00f3polis desde 2003 \u00b7 CNPJ 05.383.860/0001-75";
  try {
    J.etapa = 'nonce';
    const rn = await dedRL('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'});
    const nn = (await rn.text()).trim();
    if (rn.status !== 200 || !/^[0-9a-f]{10}$/.test(nn)) throw new Error('nonce: ' + rn.status);
    sessionStorage.setItem('ded_nonce', nn);
    const H = {'X-WP-Nonce': nn, 'Content-Type': 'application/json'};
    const lerW = async (id) => (await dedRL('/wp-json/wp/v2/widgets/' + id + '?context=edit', {headers: H, credentials: 'include'})).json();
    const gravW = async (id, corpo) => { const r = await dedRL('/wp-json/wp/v2/widgets/' + id, {method: 'POST', headers: H, credentials: 'include', body: JSON.stringify(corpo)}); return r.status; };

    J.etapa = 'baixar';
    const novo = await fetch(RAW, {cache: 'no-store', credentials: 'omit'}).then(r => r.text());
    if ((await dedSha16(novo)) !== PARA) throw new Error('widget baixado com sha diferente');

    J.etapa = 'conferir antes';
    const w6 = await lerW('custom_html-6');
    const s6 = await dedSha16(w6.instance.raw.content);
    const p0 = await dedLer2('pages', 2533);
    const t8 = await lerW('text-8');
    const t6 = await lerW('text-6');
    J.res.antes = {w6: s6, w6_sidebar: w6.sidebar, p2533: [p0.sha, p0.st], t8_sidebar: t8.sidebar, t8: (t8.instance.raw.text || '').slice(0, 60), t6_sidebar: t6.sidebar, t6: (t6.instance.raw.text || '').slice(0, 60)};
    if (s6 !== W_DE && s6 !== PARA) throw new Error('custom_html-6 com sha diferente: ' + s6);
    if (w6.sidebar !== 'footer_column_1') throw new Error('custom_html-6 fora do footer_column_1: ' + w6.sidebar);
    if (p0.sha !== P_DE && p0.sha !== PARA) throw new Error('2533 com sha diferente: ' + p0.sha);
    const t8ok = (t8.instance.raw.text || '') === TEXTO;
    if (!t8ok && !/2024 Todos os direitos reservados/.test(t8.instance.raw.text || '')) throw new Error('text-8 com texto inesperado');
    const t6ja = t6.sidebar === 'wp_inactive_widgets';
    if (!t6ja && (t6.sidebar !== 'footer_text_right' || !/RBSites/.test(t6.instance.raw.text || ''))) throw new Error('text-6 inesperado: ' + t6.sidebar);

    J.etapa = 'custom_html-6';
    if (s6 !== PARA) {
      const st = await gravW('custom_html-6', {instance: {raw: Object.assign({}, w6.instance.raw, {content: novo})}});
      const r6 = await lerW('custom_html-6');
      const s = await dedSha16(((r6.instance || {}).raw || {}).content || '');
      J.res.w6 = [st, s, s === PARA, r6.sidebar];
      if (s !== PARA) throw new Error('custom_html-6 nao ficou');
    } else { J.res.w6 = 'ja estava'; }

    J.etapa = '2533';
    if (p0.sha !== PARA) {
      const g = await dedGravar2('pages', 2533, novo, PARA);
      J.res.p2533 = [g.status, g.relido_sha, g.ok];
      if (!g.ok) throw new Error('2533 nao ficou: ' + JSON.stringify(g));
    } else { J.res.p2533 = 'ja estava'; }

    J.etapa = 'text-8';
    if (!t8ok) {
      const st = await gravW('text-8', {instance: {raw: Object.assign({}, t8.instance.raw, {text: TEXTO})}});
      const r8 = await lerW('text-8');
      J.res.t8 = [st, r8.instance.raw.text === TEXTO, r8.sidebar];
      if (r8.instance.raw.text !== TEXTO) throw new Error('text-8 nao ficou');
    } else { J.res.t8 = 'ja estava'; }

    J.etapa = 'text-6';
    if (!t6ja) {
      const st = await gravW('text-6', {sidebar: 'wp_inactive_widgets'});
      const r6b = await lerW('text-6');
      J.res.t6 = [st, r6b.sidebar, /RBSites/.test((r6b.instance.raw || {}).text || '')];
      if (r6b.sidebar !== 'wp_inactive_widgets') throw new Error('text-6 nao foi para os inativos: ' + r6b.sidebar);
    } else { J.res.t6 = 'ja estava'; }

    J.etapa = 'cache';
    J.res.cache = (await dedRL('/wp-admin/index.php?nfd_purge_all=1', {credentials: 'include'})).status;

    J.etapa = 'conferencia sem login';
    J.res.sem_login = {};
    for (const [nome, u] of [['inicio', '/'], ['contato', '/contato/'], ['camisa', '/servicos/lavar-e-passar-camisa-social-em-florianopolis/'], ['jurere', '/lavanderia-em-jurere/']]) {
      const r = await dedRL(u + '?nc=' + Date.now(), {credentials: 'omit', cache: 'no-store'});
      const h = await r.text();
      const d = new DOMParser().parseFromString(h, 'text/html');
      const f = d.querySelector('footer');
      const fh = f ? f.innerHTML : '';
      J.res.sem_login[nome] = {st: r.status, rodape_novo: (fh.match(/class="ded-rod"/g) || []).length, links_rodape: f ? f.querySelectorAll('.ded-rod a').length : 0,
        antigo: /Retirada de Manchas Amareladas|class="qbutton|\[vc_/.test(fh), rbsites: /RBSites/i.test(h), texto_baixo: f ? f.textContent.includes('em Florian' + String.fromCharCode(243) + 'polis desde 2003') && f.textContent.includes('CNPJ 05.383.860/0001-75') : false,
        ano_2024: /2024 Todos os direitos/.test(fh), h_no_rodape: f ? f.querySelectorAll('h1,h2,h3,h4,h5,h6').length : -1, h1_pagina: d.querySelectorAll('h1').length,
        erro_php: /Fatal error|Warning:|Parse error/.test(h)};
      const s = J.res.sem_login[nome];
      if (s.st !== 200 || s.rodape_novo !== 1 || s.links_rodape < 70 || s.antigo || s.rbsites || !s.texto_baixo || s.ano_2024 || s.h_no_rodape !== 0 || s.erro_php) throw new Error('conferencia sem login (' + nome + '): ' + JSON.stringify(s));
    }
    J.etapa = 'fim';
  } catch (e) { J.erro = String(e); }
  J.feito = true; J.fim = new Date().toLocaleTimeString('pt-BR');
})();
return 'iniciado';
})()
