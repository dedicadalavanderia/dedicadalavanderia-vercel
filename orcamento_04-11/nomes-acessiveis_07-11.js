/* Dedicada - Nomes para leitores de tela e link de pular (07/11/2026, resposta 638 do dono).
   O tema Bridge deixa sem nome os links de icone (abrir e fechar o menu lateral, abrir a busca, buscar), o campo de busca
   sem rotulo (placeholder "Search") e as imagens-link da pagina inicial sem texto (com imagens de alt "initial image").
   Este trecho da nome a eles (aria-label e alt) e poe no comeco da pagina um link "Pular para o conteudo", que so aparece
   ao navegar pelo teclado. Nada visivel muda. Para voltar: desativar este snippet (nunca apagar). */
(function () {
  'use strict';
  function semTexto(el) {
    return !el.getAttribute('aria-label') && !(el.textContent || '').replace(/\s+/g, '');
  }
  function frase(t) {
    t = (t || '').replace(/\s+/g, ' ').trim().toLowerCase();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
  }
  function nomear(seletor, nome) {
    var els = document.querySelectorAll(seletor);
    for (var i = 0; i < els.length; i++) {
      if (semTexto(els[i])) { els[i].setAttribute('aria-label', nome); }
    }
  }
  function corrigir() {
    nomear('a.side_menu_button_link', 'Abrir o menu');
    nomear('a.close_side_menu', 'Fechar o menu');
    nomear('a.search_button', 'Abrir a busca');
    nomear('a.qode_search_submit', 'Buscar');
    var campos = document.querySelectorAll('input[name="s"]');
    for (var i = 0; i < campos.length; i++) {
      if (!campos[i].getAttribute('aria-label')) { campos[i].setAttribute('aria-label', 'Buscar no site'); }
      if (campos[i].getAttribute('placeholder') === 'Search') { campos[i].setAttribute('placeholder', 'Buscar'); }
    }
    var cfi = document.querySelectorAll('.qode-crossfade-images');
    for (var j = 0; j < cfi.length; j++) {
      var tit = cfi[j].querySelector('.qode-cfi-title-holder');
      var nome = frase(tit ? tit.textContent : '');
      if (!nome) { continue; }
      var link = cfi[j].querySelector('a.qode-cfi-link');
      if (link && semTexto(link)) { link.setAttribute('aria-label', nome); }
      var imgs = cfi[j].querySelectorAll('.qode-cfi-img-holder img');
      for (var k = 0; k < imgs.length; k++) {
        var alt = imgs[k].getAttribute('alt');
        if (alt === null || alt === 'initial image' || alt === 'hover image') { imgs[k].setAttribute('alt', nome); }
      }
    }
    if (!document.getElementById('ded-pular')) {
      var alvo = document.querySelector('.content');
      if (alvo && document.body) {
        if (!alvo.id) { alvo.id = 'conteudo'; }
        if (!document.querySelector('main, [role="main"]')) { alvo.setAttribute('role', 'main'); }
        if (!alvo.hasAttribute('tabindex')) { alvo.setAttribute('tabindex', '-1'); }
        var estilo = document.createElement('style');
        estilo.textContent = '#ded-pular{position:absolute;left:-9999px;top:0;z-index:100000;background:#1e4468;color:#fff;' +
          'padding:12px 18px;font-weight:600;text-decoration:none}#ded-pular:focus{left:12px;top:12px;outline:3px solid #fff}' +
          '#' + alvo.id + ':focus{outline:none}';
        document.head.appendChild(estilo);
        var pular = document.createElement('a');
        pular.id = 'ded-pular';
        pular.href = '#' + alvo.id;
        pular.textContent = 'Pular para o conte\u00fado';
        document.body.insertBefore(pular, document.body.firstChild);
      }
    }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', corrigir); } else { corrigir(); }
})();
