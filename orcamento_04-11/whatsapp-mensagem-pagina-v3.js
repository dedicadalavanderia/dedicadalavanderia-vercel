/*
 * Dedicada Lavanderia \u00b7 Mensagem do WhatsApp de acordo com a p\u00e1gina (e evento do GA4)
 * Snippet WPCode (JavaScript), local "Site Wide Footer". Vers\u00e3o 3 (05/11/2026, respostas 566 e 568).
 * Padr\u00e3o do site: toda mensagem do WhatsApp diz que a pessoa veio pelo site e fala do assunto da p\u00e1gina
 * ("Ol\u00e1! Vim pelo site e quero agendar uma coleta em Cacup\u00e9."), para a equipe saber de onde veio o contato.
 * Os bot\u00f5es das p\u00e1ginas j\u00e1 trazem a mensagem pr\u00f3pria e ficam como est\u00e3o. Os bot\u00f5es que abrem o WhatsApp
 * sem mensagem (o verde flutuante do plugin WP WhatsApp Chat, o "Solicitar coleta" do rodap\u00e9, o telefone
 * e os da p\u00e1gina inicial) passam a mandar a mensagem principal da p\u00e1gina onde a pessoa est\u00e1; nas p\u00e1ginas
 * sem mensagem pr\u00f3pria, uma frase do mesmo padr\u00e3o; nos posts do blog, a mensagem padr\u00e3o do site.
 * Nenhum c\u00f3digo \u00e9 acrescentado. A p\u00e1gina de or\u00e7amento tem a pr\u00f3pria mensagem (bot\u00f5es dlo-whats) e fica de fora.
 * P\u00e1ginas novas: o bot\u00e3o principal da p\u00e1gina deve seguir o mesmo padr\u00e3o; o resto acompanha sozinho.
 * O servidor troca acentos por entidades dentro de <script>: o montar.mjs escapa este arquivo (s\u00f3 ASCII).
 */
(function () {
  'use strict';
  var NUMEROS = ['5548984280639', '554884280639'];
  var PADRAO = 'Ol\u00e1! Vim pelo site da Dedicada.';
  var FORA = 'header, footer, .page_header, .header_inner, .footer_top, .footer_bottom, .footer_inner, .qlwapp';

  // N\u00famero do WhatsApp do link, ou null se n\u00e3o for um WhatsApp da Dedicada.
  function daDedicada(u) {
    var host = u.hostname.replace(/^www\./, ''), numero = '';
    if (host === 'wa.me') numero = u.pathname.replace(/\D/g, '');
    else if (host === 'api.whatsapp.com' || host === 'web.whatsapp.com') numero = (u.searchParams.get('phone') || '').replace(/\D/g, '');
    else return false;
    return NUMEROS.indexOf(numero) !== -1;
  }

  function titulo() {
    var h = document.querySelector('h1');
    var t = h && h.textContent ? h.textContent : String(document.title || '').replace(/\s*[-|\u2013]\s*Dedicada.*$/i, '');
    t = t.split(/:|\s\(/)[0].replace(/\s+/g, ' ').trim();
    return t.length > 70 ? t.slice(0, 67) + '...' : t;
  }

  // Mensagem principal da p\u00e1gina: a do primeiro bot\u00e3o do WhatsApp com mensagem no conte\u00fado.
  var principal;
  function mensagemDaPagina() {
    if (principal !== undefined) return principal;
    principal = null;
    var c = document.body.classList, caminho = location.pathname;
    if (c.contains('single-post') || c.contains('blog') || c.contains('archive') || c.contains('search') || /^\/blog\//.test(caminho)) return (principal = PADRAO);
    if (caminho === '/' || caminho === '') return (principal = 'Ol\u00e1! Vim pelo site e quero agendar uma coleta.');
    var links = document.querySelectorAll('a[href*="wa.me/"], a[href*="whatsapp.com/send"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if ((a.className && String(a.className).indexOf('dlo-whats') !== -1) || (a.closest && a.closest(FORA))) continue;
      try {
        var u = new URL(a.href, location.href);
        var t = daDedicada(u) ? (u.searchParams.get('text') || '').replace(/\s+$/, '') : '';
        if (t) return (principal = t);
      } catch (e) { /* segue */ }
    }
    if (/^\/contato\/?$/.test(caminho)) return (principal = 'Ol\u00e1! Vim pelo site, pela p\u00e1gina de contato.');
    if (/^\/cuidados-/.test(caminho)) return (principal = 'Ol\u00e1! Vim pelo site, pelo guia "' + titulo() + '".');
    var t2 = titulo();
    return (principal = t2 ? 'Ol\u00e1! Vim pelo site, pela p\u00e1gina "' + t2 + '".' : PADRAO);
  }

  // Devolve o endere\u00e7o com a mensagem da p\u00e1gina, ou null se n\u00e3o for um WhatsApp da Dedicada.
  function comMensagem(href) {
    var u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    if (!daDedicada(u)) return null;
    if ((u.searchParams.get('text') || '').replace(/\s+/g, '')) return {href: u.href, novo: false};
    // Monta a consulta \u00e0 m\u00e3o, com %20 nos espa\u00e7os (o "+" aparece literal em alguns aplicativos).
    var partes = [];
    u.searchParams.forEach(function (v, k) { if (k !== 'text') partes.push(encodeURIComponent(k) + '=' + encodeURIComponent(v)); });
    partes.push('text=' + encodeURIComponent(mensagemDaPagina()));
    return {href: u.origin + u.pathname + '?' + partes.join('&') + u.hash, novo: true};
  }

  function contar(origem) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'whatsapp_click', { origem: origem, pagina: location.pathname });
    window.gtag('event', 'generate_lead', { lead_source: origem, pagina: location.pathname });
  }

  // Links <a> do WhatsApp (bot\u00f5es da p\u00e1gina, telefone, rodap\u00e9).
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="wa.me/"], a[href*="whatsapp.com/send"]') : null;
    if (!a || (a.className && String(a.className).indexOf('dlo-whats') !== -1)) return;
    var r = comMensagem(a.href);
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
        var r = typeof url === 'string' || url instanceof URL ? comMensagem(String(url)) : null;
        if (r) { if (r.novo) args[0] = r.href; contar('botao_flutuante'); }
      } catch (e) { /* segue como est\u00e1 */ }
      return abrir.apply(window, args);
    };
  }
})();