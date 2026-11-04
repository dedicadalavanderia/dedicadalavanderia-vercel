/*
 * Dedicada Lavanderia \u00b7 C\u00f3digo de origem nos bot\u00f5es do WhatsApp do site (WEB-) e evento do GA4
 * Snippet WPCode (JavaScript), local "Site Wide Footer". Vers\u00e3o 2 (04/11/2026, resposta 562).
 * N\u00e3o muda nada que o visitante v\u00ea na p\u00e1gina. No clique, acrescenta \u00e0 mensagem do WhatsApp
 * "(c\u00f3digo WEB-DDMM-XX, p\u00e1gina: <nome da p\u00e1gina>)", para a equipe saber de que p\u00e1gina veio o contato,
 * e conta o clique no GA4. Vale para os links do WhatsApp da Dedicada (wa.me, api.whatsapp.com e
 * web.whatsapp.com, com ou sem o 9) e para o bot\u00e3o verde flutuante (plugin WP WhatsApp Chat, que abre
 * o WhatsApp por window.open). A p\u00e1gina de or\u00e7amento tem o pr\u00f3prio c\u00f3digo (SITE-) e fica de fora.
 * O servidor troca acentos por entidades dentro de <script>: o montar.mjs escapa este arquivo (s\u00f3 ASCII).
 */
(function () {
  'use strict';
  var NUMEROS = ['5548984280639', '554884280639'];
  var JA_TEM = /c\u00f3digo (IA|SITE|WEB)-\d{4}-[A-Z0-9]{2}/;
  var codigo = null;

  function gerar() {
    var letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', d = new Date();
    return 'WEB-' + ('0' + d.getDate()).slice(-2) + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
      letras.charAt(Math.floor(Math.random() * letras.length)) + letras.charAt(Math.floor(Math.random() * letras.length));
  }

  // Nome curto da p\u00e1gina: o t\u00edtulo da aba sem " - Dedicada" e sem o que vem depois de " (", ":" ou ",".
  // Na p\u00e1gina inicial, devolve null (a marca diz s\u00f3 "p\u00e1gina inicial").
  function pagina() {
    if (location.pathname === '/' || location.pathname === '') return null;
    var t = String(document.title || '').replace(/\s*[-|\u2013]\s*Dedicada.*$/i, '');
    t = t.split(/\s\(|:|,|\s[\u2013-]\s/)[0].replace(/\s+/g, ' ').trim();
    if (!t) t = decodeURIComponent(location.pathname).replace(/^\/|\/$/g, '');
    return t.length > 60 ? t.slice(0, 57) + '...' : t;
  }

  // Devolve o endere\u00e7o com o c\u00f3digo, ou null se n\u00e3o for um WhatsApp da Dedicada.
  function comCodigo(href) {
    var u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    var host = u.hostname.replace(/^www\./, ''), numero = '';
    if (host === 'wa.me') numero = u.pathname.replace(/\D/g, '');
    else if (host === 'api.whatsapp.com' || host === 'web.whatsapp.com') numero = (u.searchParams.get('phone') || '').replace(/\D/g, '');
    else return null;
    if (NUMEROS.indexOf(numero) === -1) return null;
    var texto = u.searchParams.get('text') || '';
    if (JA_TEM.test(texto)) return {href: u.href, novo: false};
    codigo = codigo || gerar();
    var nome = pagina();
    var marca = 'c\u00f3digo ' + codigo + (nome === null ? ', p\u00e1gina inicial' : ', p\u00e1gina: ' + nome);
    // Texto de uma linha: o c\u00f3digo vai no fim. Modelo de v\u00e1rias linhas (com campos para preencher no fim):
    // o c\u00f3digo vai numa linha logo depois da primeira, para n\u00e3o ficar no lugar onde a pessoa escreve.
    var limpo = texto.replace(/\s+$/, ''), linhas = limpo.split('\n'), novo;
    if (!limpo) novo = 'Ol\u00e1! Vim pelo site da Dedicada (' + marca + ').';
    else if (linhas.length > 1) { linhas.splice(1, 0, '(' + marca + ')'); novo = linhas.join('\n'); }
    else novo = limpo + ' (' + marca + ')';
    // Monta a consulta \u00e0 m\u00e3o, com %20 nos espa\u00e7os (o "+" aparece literal em alguns aplicativos).
    var partes = [];
    u.searchParams.forEach(function (v, k) { if (k !== 'text') partes.push(encodeURIComponent(k) + '=' + encodeURIComponent(v)); });
    partes.push('text=' + encodeURIComponent(novo));
    return {href: u.origin + u.pathname + '?' + partes.join('&') + u.hash, novo: true};
  }

  function contar(origem) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'whatsapp_click', { origem: origem, pagina: location.pathname, codigo: codigo || '' });
    window.gtag('event', 'generate_lead', { lead_source: origem, pagina: location.pathname });
  }

  // Links <a> do WhatsApp (bot\u00f5es da p\u00e1gina, telefone, rodap\u00e9).
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="wa.me/"], a[href*="whatsapp.com/send"]') : null;
    if (!a || (a.className && String(a.className).indexOf('dlo-whats') !== -1)) return;
    var r = comCodigo(a.href);
    if (!r) return;
    if (r.novo) a.href = r.href;
    contar('pagina');
  }, true);

  // Bot\u00e3o verde flutuante e outros que abrem o WhatsApp por window.open.
  var abrir = window.open;
  if (typeof abrir === 'function') {
    window.open = function (url) {
      var args = Array.prototype.slice.call(arguments);
      try {
        var r = typeof url === 'string' || url instanceof URL ? comCodigo(String(url)) : null;
        if (r) { if (r.novo) args[0] = r.href; contar('botao_flutuante'); }
      } catch (e) { /* segue como est\u00e1 */ }
      return abrir.apply(window, args);
    };
  }
})();
