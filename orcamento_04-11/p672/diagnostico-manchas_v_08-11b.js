/*
 * Dedicada Lavanderia \u00b7 Diagn\u00f3stico de Manchas (vers\u00e3o 4)
 * Snippet WPCode 3164 (JavaScript). Vai DEPOIS de <div id="dm-app"> no conte\u00fado da p\u00e1gina 3165.
 * Vers\u00e3o 4, de 25/10/2026 (passo 7 da sequ\u00eancia): mancha fresca, seca ou j\u00e1 lavada; urg\u00eancia em 4 graus;
 * "quando trazer" com coleta e expresso; "mande a foto" com a mensagem das p\u00e1ginas de servi\u00e7o.
 * 25/10, \u00e0 tarde: na chegada por link (#pe\u00e7a, #m-mancha), a p\u00e1gina salta direto at\u00e9 a ferramenta.
 * Montado por fonte/diagnostico/v4/montar_v4.py sobre a vers\u00e3o 3 de 29/09/2026 (respostas do dono).
 * 08/11/2026: mensagem do WhatsApp do resultado no padr\u00e3o do site (passo 27) e o texto antes do resultado
 * com "pelo diagn\u00f3stico de manchas" (pergunta 672).
 *
 * DE ONDE VEM O CONTE\u00daDO
 *   Tudo foi tirado dos 17 guias de Cuidados por Tecido no ar em 28/09/2026: a tabela
 *   "problemas mais comuns" (problema, o que geralmente acontece e urg\u00eancia), os erros que
 *   estragam a pe\u00e7a, as perguntas frequentes, o processo da Dedicada, prazos, pre\u00e7os e falas.
 *   As tr\u00eas fam\u00edlias de manchas v\u00eam da tabela tira-manchas da Seitz (Base t\u00e9cnica do Plano)
 *   e do guia de cetim e organza. As notas de tecido citam a ANEL, como os guias.
 *   Nada do banco antigo foi reaproveitado.
 *
 * COMO O BANCO EST\u00c1 ORGANIZADO (tudo abaixo, antes do "funcionamento")
 *   PESSOAS  \u2192 quem assina (nome, papel, foto).
 *   NIVEIS   \u2192 n\u00edveis de urg\u00eancia dos guias, a ordem em que aparecem e o grau mostrado na tela (GRAUS:
 *              urgente, at\u00e9 24 horas; breve, at\u00e9 48 horas; sem pressa; avaliar, pode n\u00e3o sair).
 *   FAMILIAS \u2192 gordurosas e sint\u00e9ticas, org\u00e2nicas e proteicas, vegetais e de tanino, outras
 *              manchas e danos no tecido; "primeiro" \u00e9 o primeiro cuidado de cada fam\u00edlia.
 *   BLOG     \u2192 posts do blog que passaram pela confer\u00eancia das regras. BLOG_REVISADOS: os 18
 *              posts revisados, ligados s\u00f3 com POSTS_REVISADOS_NO_AR = true.
 *   MANCHAS  \u2192 44 manchas e danos, com sin\u00f4nimos para a busca, "dica" (cuidado pr\u00f3prio,
 *              tirado dos guias) e "leia" (post do blog).
 *   GRUPOS   \u2192 os 5 grupos da p\u00e1gina central, mais "Outras pe\u00e7as e tecidos".
 *   PECAS    \u2192 os 18 guias e 5 pe\u00e7as sem guia pr\u00f3prio (semGuia). Cada pe\u00e7a traz os fatos do
 *              guia e a lista de problemas:
 *     problema = { id, nome, manchas[], nivel, urgencia, acontece, fazer[], evitar[], dedicada }
 *       manchas:  ids de MANCHAS que caem neste problema (liga a busca ao problema certo)
 *       nivel:    chave de NIVEIS
 *       urgencia: texto da coluna "Urg\u00eancia" do guia, sem mudar nada
 *       acontece: texto da coluna "O que geralmente acontece" do guia
 *       dedicada: o que \u00e9 pr\u00f3prio deste problema no processo (opcional)
 *   Qualquer pe\u00e7a com qualquer mancha tem resultado: o problema do guia, quando existe, ou a
 *   orienta\u00e7\u00e3o pela fam\u00edlia da mancha.
 *
 * Regra: s\u00f3 fatos confirmados pela Dedicada. Nada de "\u00fanico", "o melhor", "exclusivo",
 * "100%", percentuais sem fonte ou "toda Florian\u00f3polis".
 */
(function () {
  'use strict';

  var CONFIG = window.DM_CONFIG || {};
  var WHATSAPP = '5548984280639';
  var SITE = 'https://dedicadalavanderia.com.br';
  // Miniaturas dos cart\u00f5es (pasta prototipo-img/). Suba os arquivos dm-*.webp na biblioteca
  // de m\u00eddia e ajuste este endere\u00e7o. Se a imagem n\u00e3o carregar, o cart\u00e3o fica s\u00f3 com o texto.
  var FOTOS = CONFIG.fotos || SITE + '/wp-content/uploads/2026/09/';
  var UPLOADS = SITE + '/wp-content/uploads/2026/09/';

  /* ---------- Quem assina ---------- */
  var PESSOAS = {
    liliane: { nome: 'Liliane Sella Mazza', papel: 's\u00f3cia fundadora', foto: CONFIG.fotoLiliane || UPLOADS + 'liliane-sella-mazza-dedicada-lavanderia.webp' },
    jorge: { nome: 'Jorge Isaac Mazza', papel: 's\u00f3cio fundador', foto: CONFIG.fotoJorge || UPLOADS + 'jorge-isaac-mazza-dedicada-lavanderia.webp' },
    alejandro: { nome: 'Alejandro David Mazza', papel: 's\u00f3cio administrador', foto: CONFIG.fotoAlejandro || UPLOADS + 'alejandro-david-mazza-dedicada-lavanderia.webp' }
  };

  /* ---------- N\u00edveis de urg\u00eancia (ordem da lista no passo 2) e os 4 graus mostrados na tela ----------
   * Os 8 n\u00edveis s\u00e3o os dos guias (a coluna "Urg\u00eancia" tinha 50 textos diferentes); na tela, cada n\u00edvel
   * vira um grau com prazo em horas. rotulo e prazo no n\u00edvel, quando existem, valem no lugar dos do grau. */
  var GRAUS = {
    urgente: { rotulo: 'Urgente', prazo: 'Leve em at\u00e9 24 horas', tom: 'forte' },
    breve: { rotulo: 'Leve logo', prazo: 'Leve em at\u00e9 48 horas', tom: 'medio' },
    sem_pressa: { rotulo: 'Sem urg\u00eancia', prazo: 'Leve quando puder', tom: 'leve' },
    avaliar: { rotulo: 'Pode n\u00e3o sair', prazo: 'Leve para a equipe avaliar', tom: 'aviso' }
  };
  var NIVEIS = {
    muito_urgente: { ordem: 1, grupo: 'urgente', rotulo: 'Muito urgente', prazo: 'Leve em menos de 24 horas' },
    urgente: { ordem: 2, grupo: 'urgente' },
    media: { ordem: 3, grupo: 'breve' },
    logo: { ordem: 3, grupo: 'breve' },
    atencao: { ordem: 4, grupo: 'sem_pressa' },
    sem_urgencia: { ordem: 5, grupo: 'sem_pressa' },
    dificil: { ordem: 6, grupo: 'avaliar' },
    sem_solucao: { ordem: 7, grupo: 'avaliar', rotulo: 'Sem solu\u00e7\u00e3o na lavagem', prazo: 'N\u00e3o se desfaz na lavagem' }
  };

  /* ---------- Fam\u00edlias de manchas (tira-manchas V1, V2 e V3 da Seitz) ----------
   * seitz: true quando a fam\u00edlia tem tira-manchas pr\u00f3prio. Qual V \u00e9 de qual fam\u00edlia n\u00e3o \u00e9 dito, a pedido do dono (pergunta 20). */
  var FAMILIAS = {
    gordura: {
      nome: 'Gordurosas e sint\u00e9ticas', singular: 'gordurosa ou sint\u00e9tica', seitz: true,
      exemplos: 'maquiagem, batom, caneta, tinta, esmalte, cola, \u00f3leo e graxa',
      primeiro: 'Tire o excesso sem esfregar e n\u00e3o use \u00e1lcool, acetona nem removedor: em couro e em detalhes sint\u00e9ticos, eles tiram a cor ou dissolvem o material.'
    },
    proteina: {
      nome: 'Org\u00e2nicas e proteicas', singular: 'org\u00e2nica ou proteica', seitz: true,
      exemplos: 'sangue, suor, comida, leite, ovo e urina',
      primeiro: 'Tire o excesso encostando um pano limpo, sem esfregar, e n\u00e3o use \u00e1gua quente: o calor fixa sangue, suor e comida.'
    },
    tanino: {
      nome: 'Vegetais e de tanino', singular: 'vegetal ou de tanino', seitz: true,
      exemplos: 'vinho, caf\u00e9, ch\u00e1, suco, refrigerante e perfume',
      primeiro: 'Tire o excesso encostando um pano limpo, sem esfregar, e n\u00e3o use \u00e1gua quente, que fixa manchas de caf\u00e9, ch\u00e1 e vinho.'
    },
    outras: { nome: 'Outras manchas', seitz: false, exemplos: '', primeiro: 'N\u00e3o esfregue, n\u00e3o use produto caseiro e n\u00e3o passe ferro antes de a mancha sair.' },
    dano: { nome: 'Danos no tecido', seitz: false, exemplos: '', primeiro: 'Mande a foto ou leve a pe\u00e7a para a equipe avaliar: alguns danos n\u00e3o se desfazem na lavagem.' }
  };

  /* Posts do blog que passaram pela confer\u00eancia das regras (28/09/2026): sem "o melhor",
   * "definitivo", percentuais ou receitas caseiras. Os outros ficaram de fora at\u00e9 serem revisados. */
  var BLOG = {
    sangue: ['/como-remover-manchas-de-sangue-de-roupas-de-forma-segura/', 'Como remover manchas de sangue das roupas'],
    gordura: ['/como-remover-manchas-de-gordura-das-roupas-descubra-a-solucao-definitiva/', 'Como remover manchas de gordura das roupas'],
    maquiagem: ['/remocao-de-manchas-de-maquiagem/', 'Remo\u00e7\u00e3o de manchas de maquiagem'],
    vomito: ['/servicos/remocao-de-manchas-dificeis-em-florianopolis/#odores', 'Manchas e odores dif\u00edceis, inclusive v\u00f4mito: como a Dedicada trata'],
    cupro: ['/lavagem-de-roupas-em-cupro-cuidados-para-pecas-delicadas/', 'Lavagem de roupas em cupro'],
    fitness: ['/lavagem-de-roupas-fitness-e-esportivas/', 'Lavagem de roupas fitness e esportivas']
  };

  /* Posts revisados em 29/09/2026 (pasta blog-revisado/). Entram em "Leia tamb\u00e9m" s\u00f3 depois de
   * publicados: troque POSTS_REVISADOS_NO_AR para true quando os 18 posts estiverem no ar.
   * LEIA_REVISADOS liga cada mancha (por id) e cada pe\u00e7a aos posts revisados. */
  var POSTS_REVISADOS_NO_AR = true;
  var BLOG_REVISADOS = {
    vinho: ['/removemos-manchas-de-vinho-dedicada-lavanderia/', 'Mancha de vinho na roupa: o que fazer e como a lavanderia tira?'],
    xixi: ['/como-lavar-roupa-com-xixi/', 'Roupa com xixi: como lavar e tirar o cheiro?'],
    cafe: ['/como-remover-mancha-de-cafe-de-suas-roupas-de-forma-segura/', 'Mancha de caf\u00e9 na roupa: o que fazer e como a lavanderia tira?'],
    graxa: ['/como-remover-manchas-de-graxa-das-roupas-de-forma-segura/', 'Mancha de graxa na roupa: o que fazer e como a lavanderia tira?'],
    terra: ['/lavagem-de-roupas-com-manchas-de-terra/', 'Roupa suja de terra ou barro: como lavar sem espalhar a sujeira?'],
    ferrugem: ['/como-tirar-manchas-de-ferrugem-das-roupas/', 'Mancha de ferrugem na roupa: o que fazer?'],
    remedio: ['/remocao-de-manchas-de-remedios-das-roupas/', 'Mancha de rem\u00e9dio na roupa: o que fazer?'],
    comida: ['/retirada-de-manchas-de-comida-molhos-bebidas-e-sucos/', 'Mancha de comida, molho ou suco na roupa: o que fazer?'],
    cheiroMofo: ['/como-tirar-cheiro-de-mofo-da-roupa-de-forma-definitiva/', 'Cheiro de mofo na roupa: de onde vem e como tirar?'],
    amarelado: ['/como-remover-manchas-amareladas-e-de-mofo-das-roupas/', 'Roupa amarelada ou com mancha de mofo: tem jeito?'],
    desbote: ['/por-que-suas-roupas-desbotam-e-como-evitar-isso/', 'Por que as roupas desbotam e como evitar?'],
    bolinhas: ['/remocao-manual-de-bolinhas-e-pelos-de-roupas/', 'Bolinhas e pelos na roupa: como tirar sem estragar?'],
    rayon: ['/como-lavar-vestidos-e-pecas-em-rayon-dedicada-lavanderia/', 'Como lavar roupa de rayon (raiom) sem estragar?'],
    toalhas: ['/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-mesa', 'Toalha de mesa, guardanapo e jogo americano: pre\u00e7o, prazo e como a Dedicada lava'],
    guardanapos: ['/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-mesa', 'Guardanapo e jogo americano: pre\u00e7o, prazo e como a Dedicada lava'],
    fardas: ['/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/', 'Lavagem de uniformes, fardas e jalecos: pre\u00e7o, prazo e como a Dedicada lava'],
    bebe: ['/cuidados-roupa-de-bebe/', 'Como lavar roupa de beb\u00ea em casa: primeira lavagem, sab\u00e3o, manchas e como guardar'],
    noiva: ['/servicos/lavagem-de-vestido-de-noiva-em-florianopolis/', 'Lavagem de vestido de noiva: pre\u00e7o, prazo e como a Dedicada lava'],
    festa: ['/servicos/lavagem-de-vestido-de-festa-em-florianopolis/', 'Lavagem de vestido de festa e formatura: pre\u00e7o, prazo e como a Dedicada lava'],
    casacos: ['/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/', 'Lavagem de casacos e jaquetas: pre\u00e7o, prazo e como a Dedicada lava'],
    cortinasServ: ['/servicos/limpeza-de-cortinas-em-florianopolis/', 'Lavagem de cortinas e capas de sof\u00e1: pre\u00e7o, prazo e como a Dedicada lava'],
    carrinhoServ: ['/servicos/higienizacao-de-carrinho-de-bebe-em-florianopolis/', 'Higieniza\u00e7\u00e3o de carrinho de beb\u00ea e beb\u00ea conforto: pre\u00e7o e prazo'],
    roupaBebe: ['/servicos/lavagem-de-roupa-de-bebe-em-florianopolis/', 'Lavagem de roupa de beb\u00ea e enxoval: pre\u00e7o, prazo e como a Dedicada lava'],
    peluciasServ: ['/servicos/lavagem-de-pelucias-e-fantasias-em-florianopolis/', 'Lavagem de pel\u00facias e fantasias: pre\u00e7o, prazo e como a Dedicada lava'],
    odores: ['/servicos/remocao-de-manchas-dificeis-em-florianopolis/#odores', 'Odores na roupa: xixi, mofo, suor e cheiro de guardado']
  };
  var LEIA_REVISADOS = {
    manchas: {
      vinho: ['vinho'], xixi: ['xixi', 'odores'], cafe: ['cafe'], graxa: ['graxa'], lama: ['terra'], ferrugem: ['ferrugem'],
      remedio: ['remedio'], comida: ['comida'], suco: ['comida'], bebida: ['comida'], refrigerante: ['comida'],
      cheiro: ['cheiroMofo', 'odores'], mofo: ['amarelado', 'cheiroMofo'], amarelado: ['amarelado'], desbotou: ['desbote'],
      bolinhas: ['bolinhas']
    },
    pecas: { viscose: ['rayon'], mesa: ['toalhas'], fardas: ['fardas'], bebe: ['roupaBebe', 'bebe'], 'festa-noiva': ['noiva', 'festa'], jaquetas: ['casacos'], cortinas: ['cortinasServ'], carrinho: ['carrinhoServ'], pelucias: ['peluciasServ'] }
  };
  if (POSTS_REVISADOS_NO_AR) Object.keys(BLOG_REVISADOS).forEach(function (k) { BLOG[k] = BLOG_REVISADOS[k]; });

  /* ---------- Vocabul\u00e1rio de manchas e danos ----------
   * familia: chave de FAMILIAS. sinonimos: palavras que a busca reconhece (escritas sem acento).
   * dica: primeiro cuidado pr\u00f3prio desta mancha, tirado dos guias. leia: chave de BLOG.
   * nao: pe\u00e7as em que o problema n\u00e3o faz sentido (bolinhas no couro): n\u00e3o aparece nos bot\u00f5es nem na busca. */
  var MANCHAS = [
    { id: 'vinho', nome: 'Vinho', familia: 'tanino', sinonimos: ['vinho', 'vinho tinto', 'tinto', 'vinho branco'] },
    { id: 'cafe', nome: 'Caf\u00e9', familia: 'tanino', sinonimos: ['cafe', 'cafezinho', 'capuccino', 'cappuccino', 'cafe com leite'] },
    { id: 'cha', nome: 'Ch\u00e1 ou mate', familia: 'tanino', sinonimos: ['cha', 'mate', 'erva mate', 'chimarrao', 'terere'] },
    { id: 'suco', nome: 'Suco ou fruta', familia: 'tanino', sinonimos: ['suco', 'fruta', 'acai', 'morango', 'uva', 'suco de uva', 'amora', 'jabuticaba', 'laranja', 'beterraba', 'banana', 'nodoa', 'nodoa de banana', 'manga', 'goiaba', 'jenipapo'] },
    { id: 'refrigerante', nome: 'Refrigerante', familia: 'tanino', sinonimos: ['refrigerante', 'refri', 'coca', 'guarana'] },
    { id: 'bebida', nome: 'Cerveja ou drinque', familia: 'tanino', sinonimos: ['cerveja', 'chopp', 'chope', 'drinque', 'drink', 'bebida', 'licor', 'caipirinha', 'alcool', 'espumante', 'champanhe'] },
    { id: 'perfume', nome: 'Perfume', familia: 'tanino', sinonimos: ['perfume', 'colonia', 'body splash'] },
    { id: 'grama', nome: 'Grama', familia: 'tanino', sinonimos: ['grama', 'clorofila', 'folha', 'gramado'] },
    { id: 'acafrao', nome: 'A\u00e7afr\u00e3o, urucum ou curry', familia: 'tanino', sinonimos: ['acafrao', 'curcuma', 'acafrao da terra', 'urucum', 'colorau', 'curry', 'mostarda'] },
    { id: 'sangue', nome: 'Sangue', familia: 'proteina', sinonimos: ['sangue', 'menstruacao', 'menstrual', 'sangramento'], leia: 'sangue' },
    { id: 'suor', nome: 'Suor', familia: 'proteina', sinonimos: ['suor', 'transpiracao', 'axila', 'sovaco', 'debaixo do braco', 'de baixo do braco', 'embaixo do braco', 'cheiro de suor'] },
    { id: 'comida', nome: 'Comida ou molho', familia: 'proteina', sinonimos: ['comida', 'molho', 'molho de tomate', 'tomate', 'carne', 'churrasco', 'ketchup', 'maionese', 'chocolate', 'nescau', 'achocolatado', 'sorvete', 'caldo', 'shoyu', 'feijao', 'pizza'] },
    { id: 'leite', nome: 'Leite', familia: 'proteina', sinonimos: ['leite', 'iogurte', 'mamadeira', 'golfada', 'papinha', 'leite materno'] },
    { id: 'ovo', nome: 'Ovo', familia: 'proteina', sinonimos: ['ovo', 'gema', 'clara de ovo'] },
    { id: 'xixi', nome: 'Xixi', familia: 'proteina', sinonimos: ['xixi', 'urina', 'pipi', 'fralda', 'fralda vazou'] },
    { id: 'vomito', nome: 'V\u00f4mito', familia: 'proteina', sinonimos: ['vomito', 'vomitou', 'golfou'], leia: 'vomito' },
    { id: 'fezes', nome: 'Fezes', familia: 'proteina', sinonimos: ['fezes', 'coco de cachorro', 'coco de gato', 'coco de bebe', 'coco do bebe', 'dejeto'] },
    { id: 'maquiagem', nome: 'Maquiagem', familia: 'gordura', sinonimos: ['maquiagem', 'base', 'corretivo', 'po compacto', 'rimel', 'delineador', 'blush', 'make', 'lapis de olho'], leia: 'maquiagem', dica: 'N\u00e3o use demaquilante: os \u00f3leos criam uma segunda mancha, geralmente maior que a original.' },
    { id: 'batom', nome: 'Batom', familia: 'gordura', sinonimos: ['batom', 'gloss', 'lip tint'], leia: 'maquiagem', dica: 'N\u00e3o use demaquilante: os \u00f3leos criam uma segunda mancha, geralmente maior que a original.' },
    { id: 'caneta', nome: 'Caneta', familia: 'gordura', sinonimos: ['caneta', 'esferografica', 'canetinha', 'marcador', 'tinta de caneta', 'hidrocor', 'pincel atomico', 'marca texto', 'lapis', 'lapis de cor'] },
    { id: 'tinta', nome: 'Tinta', familia: 'gordura', sinonimos: ['tinta', 'tinta de parede', 'guache', 'tinta acrilica', 'pintura', 'tinta seca', 'tinta a oleo'] },
    { id: 'esmalte', nome: 'Esmalte', familia: 'gordura', sinonimos: ['esmalte', 'unha'] },
    { id: 'cola', nome: 'Cola', familia: 'gordura', sinonimos: ['cola', 'adesivo', 'super bonder', 'cola quente'] },
    { id: 'gordura', nome: '\u00d3leo ou gordura', familia: 'gordura', sinonimos: ['gordura', 'oleo', 'azeite', 'manteiga', 'fritura', 'oleo de cozinha', 'engordurado', 'hidratante', 'creme', 'oleo corporal', 'oleo de massagem', 'dende', 'azeite de dende'], leia: 'gordura' },
    { id: 'graxa', nome: 'Graxa', familia: 'gordura', sinonimos: ['graxa', 'oleo de motor', 'oleo de carro', 'oleo de maquina', 'oleo diesel', 'corrente de bicicleta', 'bicicleta', 'moto', 'piche', 'graxa de sapato', 'nugget'], dica: 'N\u00e3o esfregue com detergente: a fric\u00e7\u00e3o tira o corante e deixa a \u00e1rea clara.' },
    { id: 'protetor', nome: 'Protetor solar', familia: 'gordura', sinonimos: ['protetor', 'protetor solar', 'filtro solar', 'bronzeador', 'mancha alaranjada', 'alaranjada'], dica: 'N\u00e3o use \u00e1gua sanit\u00e1ria, que fixa a mancha, e n\u00e3o passe a ferro antes de tratar.' },
    { id: 'mofo', nome: 'Mofo', familia: 'outras', sinonimos: ['mofo', 'mofado', 'mofada', 'bolor', 'fungo', 'cheiro de guardado', 'pintas pretas', 'mancha de guardado', 'roupa guardada'], dica: 'N\u00e3o escove nem esfregue a \u00e1rea, para n\u00e3o espalhar o mofo.' },
    { id: 'ferrugem', nome: 'Ferrugem', familia: 'outras', sinonimos: ['ferrugem', 'enferrujado', 'enferrujada'], dica: 'N\u00e3o use \u00e1gua sanit\u00e1ria: ela escurece a mancha de ferrugem.' },
    { id: 'cor', nome: 'Cor de outra pe\u00e7a', familia: 'outras', sinonimos: ['cor de outra peca', 'outra roupa', 'outra peca', 'manchada por outra', 'manchou de outra', 'soltou tinta', 'soltou cor', 'transferencia de cor', 'passou cor', 'tingiu', 'manchou na lavagem', 'manchou na maquina', 'jeans manchou', 'roupa tingida', 'manchou de vermelho', 'manchou de azul', 'desbotou em', 'uma roupa na outra', 'roupa na outra', 'colorida na branca', 'colorida em roupa branca', 'colorida na roupa branca', 'roupa de cor na branca'], dica: 'N\u00e3o seque a pe\u00e7a: o calor da secadora fixa o corante de vez.' },
    { id: 'desodorante', nome: 'Desodorante', familia: 'outras', sinonimos: ['desodorante', 'antitranspirante'], dica: 'N\u00e3o passe a ferro sobre a mancha: o calor fixa desodorante e suor.' },
    { id: 'lama', nome: 'Lama ou terra', familia: 'outras', sinonimos: ['lama', 'barro', 'terra', 'poeira', 'areia'], dica: 'N\u00e3o misture a pe\u00e7a com outras roupas: a terra espalha e encarde o resto.' },
    { id: 'amarelado', nome: 'Amarelado', familia: 'outras', sinonimos: ['amarelado', 'amarelada', 'amarelou', 'encardido', 'encardida', 'amarelamento', 'mancha amarela'], dica: 'N\u00e3o use \u00e1gua sanit\u00e1ria: o cloro deixa o amarelado mais forte e enfraquece a fibra.' },
    { id: 'agua-sanitaria', nome: '\u00c1gua sanit\u00e1ria ou cloro', familia: 'outras', sinonimos: ['agua sanitaria', 'qboa', 'quiboa', 'candida', 'cloro', 'alvejante com cloro', 'descoloriu'], dica: 'Em pe\u00e7a colorida, o cloro deixa manchas claras que n\u00e3o voltam, como no jeans e na sarja; em pe\u00e7a branca, enfraquece a fibra. Na Dedicada, o alvejamento \u00e9 \u00e0 base de oxig\u00eanio, sem cloro.' },
    { id: 'amaciante', nome: 'Amaciante', familia: 'outras', sinonimos: ['amaciante', 'mancha de amaciante'] },
    { id: 'tinta-cabelo', nome: 'Tinta de cabelo ou henna', familia: 'outras', sinonimos: ['tinta de cabelo', 'tintura', 'tintura de cabelo', 'henna', 'hena', 'descolorante'] },
    { id: 'remedio', nome: 'Rem\u00e9dio ou pomada', familia: 'outras', sinonimos: ['remedio', 'xarope', 'pomada', 'iodo', 'mertiolate', 'merthiolate', 'noripurum', 'sulfato ferroso', 'antibiotico', 'nebacetin', 'violeta genciana', 'medicamento', 'povidine', 'betadine', 'hipoglos'] },
    { id: 'cera', nome: 'Cera de vela', familia: 'outras', sinonimos: ['vela', 'cera', 'cera de vela', 'parafina'] },
    { id: 'chiclete', nome: 'Chiclete', familia: 'outras', sinonimos: ['chiclete', 'goma de mascar', 'chicle'] },
    { id: 'pasta', nome: 'Pasta de dente', familia: 'outras', sinonimos: ['pasta de dente', 'creme dental'] },
    { id: 'queimado', nome: 'Marca de ferro ou queimado', familia: 'dano', sinonimos: ['queimado', 'queimou', 'queimei', 'queimada', 'ferro quente', 'passei ferro', 'passei o ferro', 'marca de ferro', 'ferro de passar', 'brilho de ferro', 'chamuscado', 'brilho'], dica: 'O calor achata ou derrete a fibra, e em alguns materiais a marca n\u00e3o sai.', nao: ['tenis', 'carrinho', 'pelucias'] },
    { id: 'encolheu', nome: 'Encolheu', familia: 'dano', sinonimos: ['encolheu', 'encolhida', 'encolhido', 'encolhimento', 'diminuiu', 'feltrou', 'feltragem', 'ficou pequena', 'ficou pequeno'], dica: '\u00c1gua quente e secadora s\u00e3o as causas mais comuns, e em muitos tecidos o encolhimento n\u00e3o tem volta na lavagem.' },
    { id: 'desbotou', nome: 'Desbotou ou perdeu a cor', familia: 'dano', sinonimos: ['desbotou', 'desbotada', 'desbotado', 'desbote', 'perdeu a cor', 'clareou', 'mancha clara', 'manchas claras'], dica: '\u00c1lcool e \u00e1gua sanit\u00e1ria atacam o corante, e as manchas claras que eles deixam costumam n\u00e3o voltar.' },
    { id: 'bolinhas', nome: 'Bolinhas e pelos', familia: 'dano', sinonimos: ['bolinhas', 'bolinha', 'pelinhos', 'pilling'], dica: 'N\u00e3o puxe as bolinhas com a m\u00e3o nem com l\u00e2mina: pode furar ou abrir a malha.', nao: ['couro', 'peles', 'tenis'] },
    { id: 'cheiro', nome: 'Cheiro ruim', familia: 'dano', sinonimos: ['cheiro', 'fedor', 'odor', 'cheiro ruim', 'catinga', 'fedendo', 'cheirando mal'], dica: 'Deixe a pe\u00e7a arejar e n\u00e3o guarde \u00famida: cheiro de guardado costuma vir da umidade.' }
  ];

  /* ---------- Frases dos guias usadas em v\u00e1rios problemas ---------- */
  var F = {
    pano: 'Tire o excesso encostando um pano limpo, sem esfregar.',
    ateLevar: 'At\u00e9 levar, deixe a pe\u00e7a arejar, longe do calor e fora de saco pl\u00e1stico.',
    mofoNaoEscovar: 'N\u00e3o escove nem esfregue a \u00e1rea, para n\u00e3o espalhar o mofo.',
    mofoGuardar: 'Depois, guarde a pe\u00e7a limpa e seca, em local arejado e em capa de tecido, nunca de pl\u00e1stico.',
    levarMenos24: 'Leve a pe\u00e7a em menos de 24 horas.',
    levar24: 'Leve a pe\u00e7a em at\u00e9 24 horas.',
    levar48: 'Leve a pe\u00e7a em at\u00e9 48 horas.',
    levarLogo: 'Leve a pe\u00e7a quanto antes.',
    avaliar: 'Leve a pe\u00e7a para a equipe avaliar.',
    esfregar: 'Esfregar: o atrito espalha a mancha e pode tirar a cor.',
    quenteTanino: '\u00c1gua quente: ela fixa manchas de caf\u00e9, ch\u00e1 e vinho.',
    quenteProteina: '\u00c1gua quente: o calor fixa manchas de sangue, suor e comida.',
    calor: 'Ferro, secador de cabelo ou secadora antes de a mancha sair: o calor fixa a mancha.',
    plastico: 'Guardar a pe\u00e7a em capa pl\u00e1stica fechada.',
    umida: 'Guardar a pe\u00e7a ainda \u00famida.',
    sanitaria: '\u00c1gua sanit\u00e1ria ou alvejante com cloro.'
  };

  /* ---------- Grupos (mesma ordem da p\u00e1gina central) ---------- */
  var GRUPOS = [
    { id: 'finas', nome: 'Festa e pe\u00e7as finas' },
    { id: 'inverno', nome: 'Inverno, couro e alfaiataria' },
    { id: 'dia', nome: 'Dia a dia' },
    { id: 'casa', nome: 'Casa' },
    { id: 'criancas', nome: 'Crian\u00e7as' },
    { id: 'outras', nome: 'Outras pe\u00e7as e tecidos' }
  ];

  /* Processo das pe\u00e7as que ainda n\u00e3o t\u00eam guia pr\u00f3prio (s\u00f3 fatos gerais confirmados). */
  var PROCESSO_GERAL = [
    'Avalia\u00e7\u00e3o da pe\u00e7a e da etiqueta antes da lavagem.',
    'Mancha tratada antes da lavagem, com o tira-manchas da Seitz pr\u00f3prio da fam\u00edlia dela (V1, V2 ou V3).',
    'Lavagem a seco com percloroetileno, wet cleaning com produtos Seitz ou lavagem em \u00e1gua, conforme a etiqueta e o tecido.',
    'Alvejamento, quando a pe\u00e7a pede, \u00e0 base de oxig\u00eanio, sem cloro.'
  ];

  /* ---------- As 17 pe\u00e7as ----------
   * expresso: 'sim' | 'semVestido' | 'nao' | 'consultar' | texto pr\u00f3prio. Segundo o dono (29/09), tudo tem
   * expresso menos len\u00e7\u00f3is, vestidos, toalhas de mesa e guardanapos; couro e t\u00eanis n\u00e3o t\u00eam, pelos guias.
   * Em 06/10 o dono mudou os vestidos: o de festa tem urg\u00eancia de um dia para o outro, com o acr\u00e9scimo do expresso;
   * o de noiva n\u00e3o tem urg\u00eancia na lavagem, s\u00f3 na passadoria, na hora, de 1 hora a 1 hora e meia.
   * caseiro: o que o guia manda evitar em casa, usado quando a mancha n\u00e3o est\u00e1 na tabela.
   * sinonimos: palavras que levam a esta pe\u00e7a na busca.
   */
  var PECAS = [
    {
      id: 'seda', grupo: 'finas', nome: 'Seda', exemplos: 'Vestidos e blusas de seda',
      sinonimos: ['seda', 'blusa de seda', 'vestido de seda', 'camisa de seda', 'cambraia'],
      guia: SITE + '/cuidados-seda/', assina: 'liliane',
      fala: 'Muita seda chega com mancha de bebida. Primeiro tiramos as manchas das pe\u00e7as, lavamos a seco e depois em \u00e1gua, para sumir a sombra que a bebida, comida ou outras manchas deixam. Quando o tecido colorido fica com aqueles quebrados brancos, um amaciante concentrado da Seitz alinha de novo o brilho da fibra.',
      maquina: 'N\u00e3o. Mesmo um ciclo r\u00e1pido pode encolher ou deformar a pe\u00e7a de forma permanente.',
      maquinaNao: true,
      caseiro: ['Tira-manchas caseiro: produtos feitos para algod\u00e3o s\u00e3o agressivos demais para a seda.'],
      processo: [
        'Remo\u00e7\u00e3o do \u00e1lcool deixado por perfume ou bebida, antes de qualquer lavagem.',
        'Tira-manchas Seitz, escolhido conforme o tipo de mancha.',
        'Lavagem a seco com percloroetileno.',
        '\u00c1gua s\u00f3 no tira-manchas, para tirar bebida e comida e lavar a barra dos vestidos de seda; a pe\u00e7a inteira vai para a \u00e1gua, no programa da Seitz para seda (16 \u00b0C, 22 minutos e pouca a\u00e7\u00e3o mec\u00e2nica), s\u00f3 se estiver muito suja e voc\u00ea autorizar.',
        'Amaciante concentrado Seitz, quando a seda colorida tem quebrados brancos.',
        'Passadoria a vapor.'
      ],
      prazo: '2 dias \u00fateis; vestidos finos, 5 dias \u00fateis',
      preco: 'Blusa de seda a partir de {blusa_seda}; vestido de seda a partir de {vestido_festa}',
      expresso: 'semVestido',
      problemas: [
        {
          id: 'vinho-tinto', nome: 'Vinho tinto', manchas: ['vinho'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Alto risco de fixa\u00e7\u00e3o; nunca esfregar nem usar \u00e1gua quente.',
          fazer: ['Retire o excesso encostando um pano limpo, sem pressionar.', F.levarMenos24, F.ateLevar],
          evitar: ['Esfregar, mesmo de leve: tira parte da cor e deixa uma marca esbranqui\u00e7ada.', F.quenteTanino, F.calor],
          dedicada: 'O \u00e1lcool \u00e9 retirado primeiro; depois a seda \u00e9 lavada a seco, e a sombra que ficar \u00e9 tratada com \u00e1gua no tira-manchas.'
        },
        {
          id: 'bebida-alcool', nome: 'Bebida com \u00e1lcool', manchas: ['bebida'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Tira a cor e deixa sombra; sai com a remo\u00e7\u00e3o do \u00e1lcool, a lavagem a seco e a \u00e1gua no tira-manchas.',
          fazer: ['Retire o excesso encostando um pano limpo, sem pressionar.', F.levar24, F.ateLevar],
          evitar: ['Esfregar, mesmo de leve: tira parte da cor e deixa uma marca esbranqui\u00e7ada.', F.quenteTanino, F.calor],
          dedicada: 'Remo\u00e7\u00e3o do \u00e1lcool antes de qualquer lavagem; depois, lavagem a seco e em \u00e1gua.'
        },
        {
          id: 'suor', nome: 'Suor e amarelamento', manchas: ['suor', 'amarelado'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'O suor ataca e descolore a seda com o tempo, se n\u00e3o for tratado.',
          fazer: [F.levar24, F.ateLevar],
          evitar: ['Esperar para tratar: manchas de suor, sangue e comida se fixam com o tempo.', F.quenteProteina, F.calor]
        },
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Ataca a seda com mais for\u00e7a que outras fibras e pode enfraquecer o tecido.',
          fazer: [F.mofoNaoEscovar, F.levar24, F.mofoGuardar],
          evitar: [F.umida, F.plastico]
        },
        {
          id: 'quebrados-brancos', nome: 'Quebrados brancos', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; tem tratamento',
          acontece: '\u00c1reas esbranqui\u00e7adas em seda colorida, por desalinhamento da fibra.',
          fazer: ['Leve a pe\u00e7a para tratar: n\u00e3o \u00e9 mancha, \u00e9 a fibra desalinhada refletindo a luz em v\u00e1rias dire\u00e7\u00f5es.'],
          evitar: ['Esfregar ou lavar em casa: o atrito desalinha ainda mais a fibra.'],
          dedicada: 'Amaciante concentrado da Seitz, que alinha de novo as fibras e devolve o brilho uniforme.'
        },
        {
          id: 'encolhimento', nome: 'Encolheu', manchas: ['encolheu'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia, mas sem solu\u00e7\u00e3o caseira',
          acontece: 'Vem de lavagem em \u00e1gua quente ou de secadora.',
          fazer: [F.avaliar],
          evitar: ['\u00c1gua quente e secadora.']
        },
        {
          id: 'brilho-ferro', nome: 'Brilho de ferro', manchas: ['queimado'], nivel: 'dificil',
          urgencia: 'Sem urg\u00eancia; dif\u00edcil de reverter',
          acontece: 'O calor achata a fibra e cria um efeito espelhado.',
          fazer: ['Da pr\u00f3xima vez, passe a vapor ou com ferro morno e um pano por cima.'],
          evitar: ['Ferro direto no tecido.']
        }
      ]
    },
    {
      id: 'festa-noiva', grupo: 'finas', nome: 'Cetim e organza', exemplos: 'Vestidos de festa e de noiva',
      sinonimos: ['vestido de noiva', 'noiva', 'vestido de festa', 'festa', 'formatura', 'madrinha', 'cetim', 'organza', 'tule', 'zibeline', 'tafeta', 'vestido longo', 'casamento', 'renda', 'crepe', 'chiffon', 'musseline', 'shantung'],
      guia: SITE + '/cuidados-cetim-organza/', assina: 'liliane',
      fala: 'O vestido de noiva costuma chegar com a barra muito suja e manchas de comida e vinho. Fazemos a pr\u00e9-lavagem, deixamos de molho e tratamos cada tipo de mancha com um protocolo pr\u00f3prio antes de lavar no programa da Seitz para noivas. Por isso o prazo \u00e9 de 7 dias \u00fateis.',
      maquina: 'N\u00e3o. Zibeline e tafet\u00e1 perdem a estrutura, e a saia fica sem volume.',
      maquinaNao: true,
      caseiro: [],
      processo: [
        'Teste de solidez da cor e prote\u00e7\u00e3o manual das pedrarias.',
        'Pr\u00e9-lavagem manual, com as barras lavadas \u00e0 m\u00e3o.',
        'Molho e protocolos de manchas, com o tira-manchas certo para gordura, prote\u00edna e tanino.',
        'Duas ou tr\u00eas lavagens em wet cleaning, no programa da Seitz para vestidos de festa e de noiva.',
        'Lavagem a seco s\u00f3 quando o tecido pede ou h\u00e1 gordura, e secagem natural.',
        'Passadoria e um dia de descanso antes da embalagem, para dissipar a umidade e o calor do ferro.'
      ],
      prazo: 'Vestido de noiva, 7 dias \u00fateis; vestido de festa e de alta costura, 5 dias \u00fateis',
      preco: 'Vestido de festa a partir de {vestido_festa}; vestido de noiva a partir de {noiva}; vestido simples, de malha, linho ou algod\u00e3o, a partir de {vestido}',
      expresso: 'Vestido de festa: urg\u00eancia de um dia para o outro, com acr\u00e9scimo de {expresso_pct}. Vestido de noiva: a lavagem n\u00e3o tem urg\u00eancia. Se s\u00f3 precisa passar, \u00e9 na hora, na loja; \u00e9 bom avisar ao menos um dia antes. O de noiva leva de 1 hora a 1 hora e meia.',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo (guarda prolongada)', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Frequente em vestidos de noiva guardados em capa ou caixa fechada.',
          fazer: ['Tire o vestido da capa pl\u00e1stica e deixe arejar.', F.mofoNaoEscovar, F.levarMenos24],
          evitar: ['Guardar em capa pl\u00e1stica fechada: \u00e9 a principal causa de mofo em vestidos guardados.']
        },
        {
          id: 'suor', nome: 'Suor nas axilas', manchas: ['suor'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Ataca o corante e pode causar desbotamento irrevers\u00edvel na regi\u00e3o.',
          fazer: [F.levar24, F.ateLevar],
          evitar: ['Esfregar: o dano do atrito costuma ser pior que a mancha.', F.quenteProteina, F.calor]
        },
        {
          id: 'maquiagem', nome: 'Maquiagem no decote (base, batom)', manchas: ['maquiagem', 'batom'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'Comum em vestidos de festa; nunca usar demaquilante em casa.',
          fazer: ['Leve o vestido para tratamento em at\u00e9 48 horas.', F.ateLevar],
          evitar: ['Demaquilante l\u00edquido ou bif\u00e1sico: os \u00f3leos criam uma segunda mancha, geralmente maior que a original.', 'Esfregar: o dano do atrito costuma ser pior que a mancha.']
        },
        {
          id: 'barra-comida-vinho', nome: 'Barra suja e manchas de comida e vinho', manchas: ['vinho', 'comida', 'lama'], nivel: 'logo',
          urgencia: 'Leve logo depois da festa',
          acontece: '\u00c9 o estado em que a maioria dos vestidos de noiva chega depois da festa; sai com pr\u00e9-lavagem e protocolos de manchas.',
          fazer: [F.pano, 'Leve o vestido logo depois da festa.', F.ateLevar],
          evitar: ['Esfregar: o dano do atrito costuma ser pior que a mancha.', F.quenteTanino, 'Adiar a limpeza de bebidas e doces: o a\u00e7\u00facar de drinks, sucos e caldas se fixa nas tramas finas.'],
          dedicada: 'Pr\u00e9-lavagem \u00e0 m\u00e3o, molho e o tira-manchas certo para cada mancha, antes das lavagens no programa da Seitz para vestidos.'
        },
        {
          id: 'marcas-agua', nome: 'Marcas de \u00e1gua (aur\u00e9olas)', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia, mas n\u00e3o disfar\u00e7ar em casa',
          acontece: 'Pede lavagem da pe\u00e7a inteira para uniformizar o tecido.',
          fazer: ['Leve o vestido para lavar inteiro.'],
          evitar: ['Tentar disfar\u00e7ar a marca em casa.']
        },
        {
          id: 'pedrarias', nome: 'Pedrarias e paet\u00eas soltando cor', manchas: [], nivel: 'atencao',
          urgencia: 'Sem urg\u00eancia, mas avaliar antes de guardar',
          acontece: 'Pedem teste de solidez antes de qualquer lavagem.',
          fazer: ['Leve o vestido para avaliar antes de guardar.'],
          evitar: ['Borrifar perfume com o vestido j\u00e1 vestido: o \u00e1lcool pode tirar a cor das pedrarias.'],
          dedicada: 'Teste de solidez da cor e prote\u00e7\u00e3o manual das pedrarias antes de qualquer lavagem.'
        },
        {
          id: 'saia-sem-volume', nome: 'Saia sem volume', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; n\u00e3o tente engomar em casa',
          acontece: 'Lavagem caseira errada deixa a pe\u00e7a murcha, sem estrutura.',
          fazer: [F.avaliar],
          evitar: ['Engomar em casa.', 'Lavar em casa com \u00e1gua e sab\u00e3o.']
        }
      ]
    },
    {
      id: 'veludo', grupo: 'finas', nome: 'Veludo', exemplos: 'Blazers, cal\u00e7as e veludo cotel\u00ea',
      sinonimos: ['veludo', 'cotele', 'veludo cotele', 'veludo molhado'],
      guia: SITE + '/cuidados-veludo/', assina: 'liliane',
      fala: 'Veludo, lavamos com produtos Seitz e secamos ao natural. Se precisar passar, \u00e9 s\u00f3 com o ferro a dist\u00e2ncia e em temperatura baixa. No fim, alinhamos o pelo numa s\u00f3 dire\u00e7\u00e3o para o tecido n\u00e3o ficar rajado.',
      maquina: 'S\u00f3 se a etiqueta permitir \u00e1gua: do avesso, em saco de prote\u00e7\u00e3o, em ciclo curto e com centrifuga\u00e7\u00e3o breve.',
      maquinaNao: false,
      caseiro: [],
      processo: [
        'Avalia\u00e7\u00e3o da pe\u00e7a e da etiqueta antes da lavagem.',
        'Lavagem a seco, em percloroetileno, ou em \u00e1gua, com produtos Seitz, conforme a etiqueta.',
        'Secagem natural, sem secadora.',
        'Passadoria s\u00f3 quando necess\u00e1ria, com o ferro a dist\u00e2ncia e em temperatura baixa, sem encostar no pelo.',
        'Alinhamento do pelo numa s\u00f3 dire\u00e7\u00e3o, para o tecido n\u00e3o ficar rajado.'
      ],
      prazo: 'Conforme a pe\u00e7a; consulte pelo WhatsApp',
      preco: 'Sob consulta pelo WhatsApp',
      expresso: 'semVestido',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Pontos escuros e cheiro de guardado; na umidade de Florian\u00f3polis, aparece em pe\u00e7as guardadas sem ventila\u00e7\u00e3o.',
          fazer: [F.mofoNaoEscovar, F.levar24, F.mofoGuardar],
          evitar: [F.plastico, 'Escovar ou esfregar a \u00e1rea: espalha o mofo e marca o pelo.']
        },
        {
          id: 'marca-agua', nome: 'Marca de \u00e1gua', manchas: [], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: '\u201cMarca de pisada\u201d de uma gota que secou sozinha; molhar em volta piora.',
          fazer: ['Leve a pe\u00e7a em at\u00e9 24 horas para avalia\u00e7\u00e3o: quanto mais tempo o l\u00edquido seca sozinho, maior a chance de a marca ficar.'],
          evitar: ['Molhar em volta para disfar\u00e7ar: a marca aumenta.']
        },
        {
          id: 'bebida-comida', nome: 'Mancha de bebida ou comida', manchas: ['vinho', 'cafe', 'cha', 'suco', 'refrigerante', 'bebida', 'comida', 'leite'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Esfregar espalha a mancha e achata o pelo; retire o excesso encostando um pano, sem pressionar.',
          fazer: ['Retire o excesso encostando um pano limpo, sem pressionar.', F.levar24, F.ateLevar],
          evitar: ['Esfregar: o pelo deita em outra dire\u00e7\u00e3o e fica uma \u00e1rea brilhante.', F.calor]
        },
        {
          id: 'marca-ferro', nome: 'Marca de ferro', manchas: ['queimado'], nivel: 'sem_solucao',
          urgencia: 'Sem urg\u00eancia; o dano n\u00e3o tem volta',
          acontece: 'Pelo esmagado pelo ferro encostado, liso e brilhante no formato da base.',
          fazer: ['Da pr\u00f3xima vez, use vapor pelo avesso, sem encostar, e penteie o pelo numa s\u00f3 dire\u00e7\u00e3o com uma escova macia.'],
          evitar: ['Passar com o ferro encostado, mesmo com um pano por cima.']
        },
        {
          id: 'rajado', nome: 'Aspecto rajado', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; alinhar o pelo resolve',
          acontece: 'Luz refletindo no pelo desalinhado; n\u00e3o \u00e9 mancha nem desbote.',
          fazer: ['Leve a pe\u00e7a: depois da lavagem, o pelo \u00e9 alinhado numa s\u00f3 dire\u00e7\u00e3o.'],
          evitar: ['Escovar contra o pelo: para tirar poeira, escove de leve e sempre na dire\u00e7\u00e3o do pelo.']
        },
        {
          id: 'brilho-joelho', nome: 'Brilho no joelho e no assento', manchas: [], nivel: 'atencao',
          urgencia: 'Sem urg\u00eancia; avaliar a pe\u00e7a',
          acontece: 'Pelo achatado pelo uso e pelo atrito, comum nas cal\u00e7as.',
          fazer: [F.avaliar],
          evitar: ['Passar com o ferro encostado.']
        },
        {
          id: 'marcas-dobra', nome: 'Marcas de dobra', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; vapor e alinhamento do pelo',
          acontece: 'Pelo achatado por guardar a pe\u00e7a dobrada sob peso.',
          fazer: ['Use vapor pelo avesso, sem encostar, e penteie o pelo numa s\u00f3 dire\u00e7\u00e3o.'],
          evitar: ['Guardar dobrado sob peso.']
        }
      ]
    },
    {
      id: 'linho', grupo: 'finas', nome: 'Linho', exemplos: 'Camisas, blazers, cal\u00e7as e vestidos',
      sinonimos: ['linho', 'camisa de linho', 'calca de linho', 'blazer de linho', 'vestido de linho'],
      guia: SITE + '/cuidados-linho/', assina: 'liliane',
      fala: 'A maior parte do linho lavamos a seco, para n\u00e3o encolher. As camisas de linho v\u00e3o para a \u00e1gua e secam ao natural, e a engomadoria devolve a estrutura, na pe\u00e7a inteira ou s\u00f3 nas partes que precisam.',
      maquina: 'S\u00f3 se a etiqueta permitir \u00e1gua: do avesso, em \u00e1gua fria e ciclo delicado, com secagem \u00e0 sombra e sem secadora.',
      maquinaNao: false,
      caseiro: ['\u00c1gua sanit\u00e1ria: o cloro enfraquece a fibra do linho, e o tecido afina e pode furar.'],
      processo: [
        'Blazers, cal\u00e7as, vestidos e a maior parte das pe\u00e7as: lavagem a seco, em percloroetileno, para n\u00e3o encolher.',
        'Camisas de linho e pe\u00e7as muito sujas: lavagem em \u00e1gua, que ajuda a tirar as manchas.',
        'Tudo o que vai para a \u00e1gua seca ao natural, sem secadora.',
        'Pe\u00e7as brancas ou amareladas: alvejamento sem cloro.',
        'Camisas passadas no manequim e finalizadas \u00e0 m\u00e3o; blazers, cal\u00e7as e vestidos passados \u00e0 m\u00e3o, com ferro e banca profissional.'
      ],
      prazo: '2 dias \u00fateis; vestidos finos, 5 dias \u00fateis',
      preco: 'Camisa a partir de {camisa}; cal\u00e7a social, {calca_social}; blazer, {paleto}',
      expresso: 'semVestido',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Pe\u00e7a guardada \u00famida ou suada; na umidade de Florian\u00f3polis, aparece r\u00e1pido.',
          fazer: [F.mofoNaoEscovar, F.levarMenos24, F.mofoGuardar],
          evitar: [F.umida, F.plastico]
        },
        {
          id: 'vinho-cafe-cha', nome: 'Vinho, caf\u00e9 ou ch\u00e1', manchas: ['vinho', 'cafe', 'cha'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'O linho absorve r\u00e1pido; \u00e1gua quente fixa a mancha.',
          fazer: [F.pano, F.levar24, F.ateLevar],
          evitar: ['Esfregar: a mancha esfregada deixa uma \u00e1rea clara ou marcada, que n\u00e3o tem conserto na lavagem.', F.quenteTanino, F.calor]
        },
        {
          id: 'amarelado-suor', nome: 'Amarelado de suor', manchas: ['suor', 'amarelado'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; alvejamento sem cloro',
          acontece: 'Suor e tempo guardado; \u00e1gua sanit\u00e1ria piora e enfraquece a fibra.',
          fazer: ['Para clarear, use alvejante sem cloro, se a etiqueta permitir, ou leve a pe\u00e7a.'],
          evitar: ['\u00c1gua sanit\u00e1ria: o cloro enfraquece a fibra, e o tecido afina e pode furar.'],
          dedicada: 'Alvejamento sem cloro nas pe\u00e7as brancas ou amareladas.'
        },
        {
          id: 'encolhimento', nome: 'Encolheu', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem conserto na lavagem',
          acontece: '\u00c1gua quente ou secadora em linho n\u00e3o pr\u00e9-encolhido.',
          fazer: ['Da pr\u00f3xima vez, siga a etiqueta: se ela permitir \u00e1gua, lave em \u00e1gua fria e seque \u00e0 sombra.'],
          evitar: ['\u00c1gua quente e secadora.']
        },
        {
          id: 'mudanca-cor', nome: 'Mudan\u00e7a de cor', manchas: ['desbotou'], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem conserto na lavagem',
          acontece: 'Linho tingido lavado em \u00e1gua, segundo a ANEL.',
          fazer: ['Da pr\u00f3xima vez, se a etiqueta tiver a tina com X, leve a pe\u00e7a para lavar a seco.'],
          evitar: ['Lavar em \u00e1gua o linho tingido cuja etiqueta pro\u00edbe \u00e1gua.']
        },
        {
          id: 'area-clara', nome: '\u00c1rea clara ou marcada', manchas: ['desbotou'], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem conserto na lavagem',
          acontece: 'Mancha esfregada.',
          fazer: ['Na pr\u00f3xima mancha, s\u00f3 encoste um pano limpo, sem esfregar, e leve a pe\u00e7a.'],
          evitar: ['Esfregar a mancha.']
        },
        {
          id: 'amassado', nome: 'Amassado duro', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; a passadoria profissional resolve',
          acontece: 'Pe\u00e7a que secou embolada ou na secadora.',
          fazer: ['Leve para passar: a passadoria profissional resolve.'],
          evitar: ['Secadora.']
        }
      ]
    },
    {
      id: 'alfaiataria', grupo: 'inverno', nome: 'Ternos e alfaiataria', exemplos: 'Ternos, blazers, cal\u00e7as sociais e gravatas',
      sinonimos: ['terno', 'ternos', 'blazer', 'paleto', 'calca social', 'gravata', 'smoking', 'alfaiataria', 'costume'],
      guia: SITE + '/cuidados-alfaiataria/', assina: 'jorge',
      fala: 'O terno vai para a lavagem a seco. Quando tem cheiro nas axilas, fazemos um tratamento espec\u00edfico que tira o odor e preserva a entretela, sem deixar bolhas no palet\u00f3.',
      maquina: 'N\u00e3o. A \u00e1gua encolhe a l\u00e3 e pode soltar a cola da entretela, criando bolhas no peito.',
      maquinaNao: true,
      caseiro: ['Encharcar o palet\u00f3: a \u00e1gua pode soltar a cola da entretela.'],
      processo: [
        'Lavagem a seco com percloroetileno, na m\u00e1quina italiana Firbimatic.',
        'Quando h\u00e1 cheiro nas axilas, um tratamento espec\u00edfico que tira o odor e preserva a entretela, sem deixar bolhas no palet\u00f3.',
        'Passadoria \u00e0 m\u00e3o, com ferro e banca profissional.',
        'Gravatas s\u00f3 na lavagem a seco, porque em geral s\u00e3o de seda.'
      ],
      prazo: '2 dias \u00fateis',
      preco: 'Terno a partir de {terno}; palet\u00f3, {paleto}; cal\u00e7a social, {calca_social}; gravata, {gravata}',
      expresso: 'sim',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Terno guardado \u00famido ou em capa pl\u00e1stica; ataca a l\u00e3 e a cola da entretela.',
          fazer: [F.mofoNaoEscovar, F.levarMenos24, 'Depois, guarde o terno limpo, em cabide de madeira de ombro largo e capa de tecido, com espa\u00e7o no arm\u00e1rio.'],
          evitar: ['Capa pl\u00e1stica fina: n\u00e3o deixa o tecido respirar e favorece o mofo.', 'Guardar o terno com suor: ele amarela e mofa.']
        },
        {
          id: 'suor-axilas', nome: 'Suor e cheiro nas axilas', manchas: ['suor', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'O suor amarela e endurece o tecido com o tempo.',
          fazer: [F.levar24, 'Quem usa terno todo dia deve lav\u00e1-lo a seco a cada 15 a 20 dias.'],
          evitar: ['Encharcar o palet\u00f3.', F.calor],
          dedicada: 'Tratamento espec\u00edfico que tira o odor e preserva a entretela, sem deixar bolhas no palet\u00f3.'
        },
        {
          id: 'bolhas', nome: 'Bolhas no peito', manchas: [], nivel: 'dificil',
          urgencia: 'Muitas vezes n\u00e3o tem conserto',
          acontece: 'A cola da entretela soltou com \u00e1gua ou calor.',
          fazer: [F.avaliar],
          evitar: ['\u00c1gua e calor no palet\u00f3.']
        },
        {
          id: 'brilho', nome: 'Brilho no tecido', manchas: ['queimado'], nivel: 'dificil',
          urgencia: 'Dif\u00edcil de reverter',
          acontece: 'Ferro quente direto na l\u00e3 escura achata a fibra.',
          fazer: ['Da pr\u00f3xima vez, passe com um pano por cima.'],
          evitar: ['Ferro quente direto na l\u00e3 escura.']
        },
        {
          id: 'ombros', nome: 'Ombros deformados', manchas: [], nivel: 'atencao',
          urgencia: 'Sem urg\u00eancia; avaliar a pe\u00e7a',
          acontece: 'Cabide fino de arame ou de pl\u00e1stico estreito.',
          fazer: [F.avaliar, 'Use cabide de madeira de ombro largo, que segura a forma dos ombros.'],
          evitar: ['Cabide fino de arame ou de pl\u00e1stico estreito.']
        },
        {
          id: 'desgaste', nome: 'Desgaste e fios puxados', manchas: [], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem conserto na lavagem',
          acontece: 'Atrito entre as pernas da cal\u00e7a ou nos bra\u00e7os do palet\u00f3.',
          fazer: [F.avaliar],
          evitar: []
        }
      ]
    },
    {
      id: 'la', grupo: 'inverno', nome: 'L\u00e3', exemplos: 'Ternos, casacos e su\u00e9teres',
      sinonimos: ['la', 'casaco de la', 'la batida', 'sueter', 'pulover', 'cashmere', 'caxemira', 'trico', 'cardiga', 'cachecol', 'alpaca', 'merino', 'poncho'],
      guia: SITE + '/cuidados-la/', assina: 'jorge',
      fala: 'Casaco de l\u00e3 batida e su\u00e9ter v\u00e3o para a lavagem a seco. Depois, tiramos \u00e0 m\u00e3o os pelos e as bolinhas, pe\u00e7a por pe\u00e7a.',
      maquina: 'N\u00e3o, nem no ciclo delicado: a agita\u00e7\u00e3o com \u00e1gua morna ou quente feltra a fibra, e a pe\u00e7a encolhe sem volta.',
      maquinaNao: true,
      caseiro: ['Secadora: o calor acelera a feltragem.'],
      processo: [
        'Lavagem a seco com percloroetileno.',
        'Pe\u00e7as que pedem \u00e1gua v\u00e3o para o wet cleaning, no programa da Seitz para l\u00e3: 28 \u00b0C, 25 minutos e pouca a\u00e7\u00e3o mec\u00e2nica.',
        'Remo\u00e7\u00e3o de pelos e bolinhas \u00e0 m\u00e3o e com m\u00e1quina pr\u00f3pria.'
      ],
      prazo: '2 dias \u00fateis',
      preco: 'Agasalho de l\u00e3 a partir de {agasalho_la}; palet\u00f3, {paleto}',
      expresso: 'sim',
      problemas: [
        {
          id: 'vinho', nome: 'Vinho tinto', manchas: ['vinho'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Esfregar quebra a maciez do fio; nunca esfregar.',
          fazer: [F.pano, F.levar24, F.ateLevar],
          evitar: ['Esfregar: quebra a maciez do fio.', F.quenteTanino, F.calor]
        },
        {
          id: 'suor', nome: 'Suor nas axilas (casacos e blazers)', manchas: ['suor'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Sais e prote\u00ednas amarelam e endurecem o tecido.',
          fazer: [F.levar24, F.ateLevar],
          evitar: [F.quenteProteina, F.calor]
        },
        {
          id: 'bolinhas', nome: 'Bolinhas e pelos (pilling)', manchas: ['bolinhas'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'Desgaste natural do uso, mais comum em misturas com poli\u00e9ster e acr\u00edlico.',
          fazer: ['Leve a pe\u00e7a: os pelos e as bolinhas s\u00e3o tirados \u00e0 m\u00e3o e com m\u00e1quina pr\u00f3pria, depois da lavagem.'],
          evitar: ['Puxar as bolinhas com a m\u00e3o ou com l\u00e2mina: pode furar ou abrir a malha.']
        },
        {
          id: 'feltragem', nome: 'Encolheu e endureceu (feltragem)', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Sem solu\u00e7\u00e3o, apenas preven\u00e7\u00e3o',
          acontece: 'Dano f\u00edsico; nenhum processo recupera.',
          fazer: ['Da pr\u00f3xima vez, nada de m\u00e1quina de casa nem de secadora: leve a l\u00e3 para lavar a seco.'],
          evitar: ['M\u00e1quina de casa, mesmo no ciclo delicado.', 'Secadora: o calor acelera a feltragem.']
        },
        {
          id: 'traca', nome: 'Furos de tra\u00e7a', manchas: [], nivel: 'atencao',
          urgencia: 'Pede cerzido depois da limpeza',
          acontece: 'As larvas comem a fibra em pe\u00e7as guardadas sujas.',
          fazer: ['Leve a pe\u00e7a para limpar; depois, o furo pede cerzido.', 'Guarde a l\u00e3 sempre limpa e seca, em local ventilado.'],
          evitar: ['Guardar sem lavar na troca de esta\u00e7\u00e3o.']
        },
        {
          id: 'bolhas', nome: 'Bolhas na entretela', manchas: [], nivel: 'dificil',
          urgencia: 'Muitas vezes irrevers\u00edvel',
          acontece: 'Bolhas no peito de blazers, por \u00e1gua ou calor errados.',
          fazer: [F.avaliar],
          evitar: ['\u00c1gua e calor no blazer.']
        }
      ]
    },
    {
      id: 'jaquetas', grupo: 'inverno', nome: 'Jaquetas e sint\u00e9ticos', exemplos: 'Jaquetas de pena, nylon, poli\u00e9ster e PU, e roupa de neve',
      sinonimos: ['jaqueta de pena', 'jaqueta de nylon', 'jaqueta impermeavel', 'jaqueta sintetica', 'jaqueta corta vento', 'pena', 'puffer', 'corta vento', 'nylon', 'poliuretano', 'pu', 'couro sintetico', 'couro ecologico', 'roupa de neve', 'parka', 'impermeavel', 'capa de chuva', 'sintetico', 'fleece', 'polar'],
      guia: SITE + '/cuidados-sintetico/', assina: 'jorge',
      fala: 'Jaqueta de pena tem que sair daqui completamente seca. Secamos em temperatura baixa at\u00e9 as penas voltarem soltas para os gomos, porque pena que fica \u00famida pode mofar.',
      maquina: 'Nylon e poli\u00e9ster, se a etiqueta permitir: z\u00edperes fechados, do avesso, \u00e1gua fria, ciclo delicado e sem amaciante comum.',
      maquinaNao: false,
      caseiro: ['Removedor, querosene ou \u00e1lcool na mancha: derretem o nylon e ressecam o poliuretano.'],
      processo: [
        'Lavagem a seco ou em \u00e1gua, conforme a etiqueta; na \u00e1gua, em programa da Seitz.',
        'Jaqueta de pena: secagem completa em temperatura baixa, at\u00e9 as penas voltarem soltas para os gomos.',
        'Poliuretano: lavagem em \u00e1gua ou higieniza\u00e7\u00e3o s\u00f3 da superf\u00edcie, e secagem natural. Se a pe\u00e7a j\u00e1 estiver descascando, o cliente \u00e9 avisado antes.',
        'Confer\u00eancia final: a jaqueta s\u00f3 sai completamente seca, porque pena \u00famida pode mofar.'
      ],
      prazo: '2 dias \u00fateis; pena e imperme\u00e1vel, 3 dias \u00fateis',
      preco: 'Jaqueta sem enchimento a partir de {jaqueta}; com enchimento sint\u00e9tico ou imperme\u00e1vel, {jaqueta_poliester}; pena, {jaqueta_pena}',
      expresso: 'sim',
      problemas: [
        {
          id: 'mofo-pena', nome: 'Mofo no recheio de pena', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'A jaqueta foi guardada \u00famida e o recheio mofou por dentro dos gomos.',
          fazer: [F.levarMenos24, F.ateLevar],
          evitar: ['Guardar \u00famida em arm\u00e1rio fechado: o recheio mofa e a pe\u00e7a pega cheiro.', 'Deixar a jaqueta de pena secando sozinha no varal: o recheio demora a secar e mofa.']
        },
        {
          id: 'penas-empelotadas', nome: 'Penas empelotadas', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; a secagem completa solta as penas',
          acontece: 'A pena molhou e secou mal; a jaqueta fica fina e perde o calor.',
          fazer: ['Leve a jaqueta: a secagem completa, em temperatura baixa, solta as penas.'],
          evitar: ['Secadora quente: derrete fitas das costuras, z\u00edperes emborrachados e o nylon.']
        },
        {
          id: 'cheiro-suor', nome: 'Cheiro de suor preso', manchas: ['suor', 'cheiro'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia, mas acumula',
          acontece: 'Suor acumulado no recheio e na membrana; o amaciante comum piora.',
          fazer: ['Leve a jaqueta para lavar antes de guardar.'],
          evitar: ['Amaciante comum: entope os poros da membrana.']
        },
        {
          id: 'descascando', nome: 'Poliuretano descascando', manchas: [], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem conserto na lavagem',
          acontece: 'O revestimento envelheceu, ressecou e rachou.',
          fazer: ['Leve para avalia\u00e7\u00e3o: quando a pe\u00e7a j\u00e1 est\u00e1 descascando, a Dedicada avisa antes.'],
          evitar: ['Lavagem a seco em poliuretano: o solvente danifica o revestimento.']
        },
        {
          id: 'impermeabilidade', nome: 'Impermeabilidade perdida', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'A \u00e1gua para de escorrer e o tecido come\u00e7a a encharcar, pelo desgaste do uso.',
          fazer: [F.avaliar],
          evitar: ['Amaciante comum: entope os poros da membrana.']
        },
        {
          id: 'fitas-derretidas', nome: 'Fitas e z\u00edperes derretidos', manchas: ['queimado'], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem conserto na lavagem',
          acontece: 'Calor de secadora ou de ferro.',
          fazer: ['Da pr\u00f3xima vez, seque \u00e0 sombra, no cabide, sem secadora quente nem ferro.'],
          evitar: ['Secadora quente ou ferro.']
        },
        {
          id: 'nylon-amarelado', nome: 'Nylon claro amarelado', manchas: ['amarelado'], nivel: 'atencao',
          urgencia: 'Sem urg\u00eancia; avaliar a pe\u00e7a',
          acontece: 'Sol ou cloro, segundo a ANEL.',
          fazer: [F.avaliar],
          evitar: ['Secar nylon claro ao sol.', F.sanitaria]
        }
      ]
    },
    {
      id: 'couro', grupo: 'inverno', nome: 'Couro', exemplos: 'Jaquetas, cal\u00e7as e saias de couro, inclusive de moto',
      sinonimos: ['couro', 'jaqueta de couro', 'calca de couro', 'saia de couro', 'jaqueta de moto', 'couro liso'],
      guia: SITE + '/cuidados-couro/', assina: 'alejandro',
      fala: 'Das duas ou tr\u00eas pe\u00e7as de couro que chegam por dia, a maioria vem com mofo. Lavamos em wet cleaning, deixamos secar ao natural e s\u00f3 ent\u00e3o hidratamos. Por isso o couro leva 7 dias \u00fateis: pular a secagem estraga a pe\u00e7a.',
      maquina: 'N\u00e3o: a estrutura do couro se danifica de forma irrepar\u00e1vel.',
      maquinaNao: true,
      caseiro: ['\u00c1lcool ou \u00e1gua sanit\u00e1ria na mancha: os dois atacam o corante.'],
      processo: [
        'Lavagem e higieniza\u00e7\u00e3o em wet cleaning, com produtos Seitz, que removem o mofo e os cheiros fortes.',
        'Secagem natural, sem calor, at\u00e9 a pe\u00e7a secar por completo.',
        'Hidrata\u00e7\u00e3o, para devolver a maciez ao couro.'
      ],
      prazo: '7 dias \u00fateis',
      preco: 'Jaqueta de couro a partir de {jaqueta_hidratacao}; outras pe\u00e7as pela foto, no WhatsApp',
      expresso: 'nao',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'No couro escuro, geralmente sai; no couro claro, pode deixar marca avermelhada, violeta ou esverdeada.',
          fazer: [F.levarMenos24, 'Depois, guarde a pe\u00e7a pendurada, em cabide de ombro largo e em local ventilado.'],
          evitar: ['Secar no sol forte ou perto de fonte de calor: enrijece e deforma o couro.', 'Guardar sem ventila\u00e7\u00e3o.']
        },
        {
          id: 'sangue-leite', nome: 'Sangue, leite e res\u00edduos biol\u00f3gicos', manchas: ['sangue', 'leite', 'xixi', 'vomito'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'Penetram e endurecem o couro; a maciez original pode n\u00e3o voltar totalmente.',
          fazer: [F.pano, F.levarMenos24],
          evitar: ['\u00c1lcool ou \u00e1gua sanit\u00e1ria: atacam o corante.', 'Lavar na m\u00e1quina de casa.']
        },
        {
          id: 'vinho', nome: 'Vinho e bebidas alco\u00f3licas', manchas: ['vinho', 'bebida', 'perfume'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Dissolvem o corante; a recupera\u00e7\u00e3o costuma ser parcial e pode ficar marca.',
          fazer: [F.pano, F.levar24],
          evitar: ['\u00c1lcool ou \u00e1gua sanit\u00e1ria: atacam o corante.', 'Esfregar.']
        },
        {
          id: 'gordura', nome: 'Gordura e graxa', manchas: ['gordura', 'graxa'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'A oleosidade sai, mas a marca escura pode continuar levemente.',
          fazer: [F.levar48],
          evitar: ['\u00c1lcool ou \u00e1gua sanit\u00e1ria: atacam o corante.', 'Graxa de sapato para disfar\u00e7ar: costuma piorar o problema.']
        },
        {
          id: 'ferrugem', nome: 'Ferrugem (z\u00edperes e fivelas)', manchas: ['ferrugem'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia, mas n\u00e3o adiar muito',
          acontece: 'Melhora com tratamento t\u00e9cnico, mas pode n\u00e3o sair por completo.',
          fazer: ['Leve a pe\u00e7a sem adiar muito.'],
          evitar: ['\u00c1lcool ou \u00e1gua sanit\u00e1ria.']
        },
        {
          id: 'encolhimento-calor', nome: 'Encolhimento por calor', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Sem solu\u00e7\u00e3o, apenas preven\u00e7\u00e3o',
          acontece: 'Enrugamento por calor n\u00e3o tem corre\u00e7\u00e3o.',
          fazer: ['Da pr\u00f3xima vez, mantenha o couro longe do sol forte, do ferro e de fontes de calor.'],
          evitar: ['Secar no sol forte ou perto de fonte de calor.', 'Guardar dobrado ou amassado: com calor e press\u00e3o, o couro enruga de forma irrevers\u00edvel.']
        }
      ]
    },
    {
      id: 'peles', grupo: 'inverno', nome: 'Peles', exemplos: 'Casacos, coletes e golas de pele natural e sint\u00e9tica',
      sinonimos: ['pele', 'peles', 'casaco de pele', 'colete de pele', 'gola de pele', 'estola', 'pelo sintetico', 'pele sintetica', 'coelho', 'pele natural'],
      guia: SITE + '/cuidados-peles/', assina: 'jorge',
      fala: 'O que mais chega aqui \u00e9 colete de pele sint\u00e9tica. Lavamos a seco ou em \u00e1gua, conforme a etiqueta, e depois penteamos o pelo. Na pele natural, tamb\u00e9m hidratamos o couro; a de coelho vai sempre a seco, porque encolhe na \u00e1gua.',
      maquina: 'N\u00e3o, nem secadora: a agita\u00e7\u00e3o embara\u00e7a o pelo, e a secadora deforma a pelagem sint\u00e9tica e resseca o couro da pele natural.',
      maquinaNao: true,
      caseiro: [],
      processo: [
        'Avalia\u00e7\u00e3o da pe\u00e7a, principalmente das antigas: se o couro estiver ressecado, a Dedicada avisa os riscos antes de lavar.',
        'Lavagem a seco ou em wet cleaning, conforme a instru\u00e7\u00e3o de lavagem; pele de coelho, sempre a seco.',
        'Pelo penteado, para voltar ao volume.',
        'Hidrata\u00e7\u00e3o do couro, na pele natural.'
      ],
      prazo: '7 dias \u00fateis',
      preco: 'A partir de {pele}',
      expresso: 'consultar',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Pe\u00e7a guardada com umidade; aparece no couro, no forro e no pelo.',
          fazer: [F.levarLogo, F.mofoGuardar],
          evitar: [F.plastico, F.umida]
        },
        {
          id: 'cheiro-guardado', nome: 'Cheiro de guardado', manchas: ['cheiro'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; lave antes de usar',
          acontece: 'Meses no arm\u00e1rio, sem ventila\u00e7\u00e3o.',
          fazer: ['Leve para lavar antes de usar.', 'Da pr\u00f3xima vez, lave antes de guardar, no fim do inverno.'],
          evitar: ['Guardar sem ventila\u00e7\u00e3o.']
        },
        {
          id: 'pelo-embaracado', nome: 'Pelo embara\u00e7ado ou amassado', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; o pelo \u00e9 penteado depois da lavagem',
          acontece: 'Uso, atrito e armazenamento apertado.',
          fazer: ['Leve a pe\u00e7a: o pelo \u00e9 penteado depois da lavagem.'],
          evitar: ['M\u00e1quina de casa: a agita\u00e7\u00e3o embara\u00e7a o pelo.']
        },
        {
          id: 'couro-ressecado', nome: 'Couro ressecado ou duro', manchas: [], nivel: 'atencao',
          urgencia: 'Avaliar antes de lavar: pode rasgar',
          acontece: 'Tempo, calor e falta de hidrata\u00e7\u00e3o na pele natural.',
          fazer: ['Leve para avalia\u00e7\u00e3o: nas pe\u00e7as antigas, a Dedicada avisa os riscos antes de lavar.'],
          evitar: ['Secadora ou calor.']
        },
        {
          id: 'perfume', nome: 'Mancha de perfume', manchas: ['perfume'], nivel: 'atencao',
          urgencia: 'Preven\u00e7\u00e3o: perfume nunca direto na pe\u00e7a',
          acontece: 'O \u00e1lcool mancha ou endurece o material.',
          fazer: [F.avaliar],
          evitar: ['Perfume ou desodorante direto na pe\u00e7a.']
        }
      ]
    },
    {
      id: 'camisas', grupo: 'dia', nome: 'Camisas e algod\u00e3o', exemplos: 'Camisas, camisetas e polos',
      sinonimos: ['camisa', 'camisas', 'camiseta', 'polo', 'algodao', 'camisa social', 'colarinho', 'punho', 'blusa de algodao', 'regata', 'moletom'],
      guia: SITE + '/cuidados-algodao/', assina: 'alejandro',
      fala: 'Colarinho amarelado sai com branqueador \u00f3ptico, escova\u00e7\u00e3o \u00e0 m\u00e3o e o programa de alta sujidade da Seitz. Depois a camisa vai para um manequim italiano da Trevil, com vapor e ar quente, sem o ferro sobre o tecido; colarinho e punhos v\u00e3o para a prensa e, se precisar, ganham um retoque a ferro pelo lado de dentro.',
      maquina: 'Sim, conforme a etiqueta: desabotoada, sem torcer e sem \u00e1gua quente nas coloridas.',
      maquinaNao: false,
      caseiro: ['\u00c1gua sanit\u00e1ria: deixa o amarelado mais forte e enfraquece a fibra.', 'Secadora com a pe\u00e7a manchada: o calor fixa a mancha e o corante de vez.'],
      processo: [
        'Escova\u00e7\u00e3o \u00e0 m\u00e3o de colarinho e punhos, com branqueador \u00f3ptico.',
        'S\u00f3 nas camisas muito amareladas e com gordura no colarinho, nos punhos ou nas axilas: lavagem a seco antes e uma pasta pr\u00f3pria, que age de um dia para o outro.',
        'Lavagem em \u00e1gua no programa de alta sujidade da Seitz, com alvejamento \u00e0 base de oxig\u00eanio, sem cloro.',
        'Passadoria no manequim italiano Trevil, que passa a camisa com vapor e ar quente, sem o ferro sobre o tecido.',
        'Colarinho e punhos na prensa da Trevil e, se precisar, retoque a ferro pelo lado de dentro.'
      ],
      prazo: '2 dias \u00fateis',
      preco: 'Camisa a partir de {camisa}; camiseta, {camiseta}; alvejamento sem cloro inclu\u00eddo',
      expresso: 'sim',
      problemas: [
        {
          id: 'cor-outra-peca', nome: 'Cor de outra pe\u00e7a', manchas: ['cor'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'O algod\u00e3o absorve corante solto com facilidade; a secadora fixa.',
          fazer: [F.levarMenos24, 'N\u00e3o seque a pe\u00e7a: deixe como est\u00e1 at\u00e9 levar.'],
          evitar: ['Secadora: o calor fixa o corante de vez.', 'Misturar de novo pe\u00e7as de cor forte com as brancas.']
        },
        {
          id: 'colarinho', nome: 'Colarinho e punho amarelados', manchas: ['suor', 'amarelado'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'Suor e oleosidade oxidados; repassar a ferro sem lavar fixa a mancha.',
          fazer: ['Molhe a \u00e1rea, aplique detergente, esfregue com escova macia e lave com alvejante \u00e0 base de oxig\u00eanio, se a etiqueta permitir.', 'S\u00f3 passe a ferro depois de a mancha sair.', 'Se o amarelado for forte e com gordura, leve a camisa em at\u00e9 48 horas.'],
          evitar: ['\u00c1gua sanit\u00e1ria: deixa o amarelado mais forte e enfraquece a fibra.', 'Repassar a camisa usada: o ferro fixa o suor e o amarelado a cada vez.'],
          dedicada: 'Branqueador \u00f3ptico, escova\u00e7\u00e3o \u00e0 m\u00e3o e o programa de alta sujidade da Seitz. Nas camisas muito amareladas e com gordura: lavagem a seco antes da \u00e1gua e uma pasta que age de um dia para o outro.'
        },
        {
          id: 'desodorante', nome: 'Mancha de desodorante', manchas: ['desodorante'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'Sais de alum\u00ednio e suor deixam marca amarelada e endurecem o tecido das axilas.',
          fazer: ['Trate antes de passar a ferro: esfregue a axila com detergente e escova macia e lave com alvejante \u00e0 base de oxig\u00eanio, se a etiqueta permitir.', 'Marca antiga, que j\u00e1 endureceu o tecido, pede tratamento profissional.', 'Se n\u00e3o for tratar em casa, leve a camisa em at\u00e9 48 horas.'],
          evitar: ['Passar a ferro sobre a mancha: o calor fixa desodorante e suor.'],
          dedicada: 'Quando as axilas est\u00e3o muito amareladas e com gordura, a camisa vai antes para a lavagem a seco, e as axilas recebem a mesma pasta do colarinho.'
        },
        {
          id: 'alaranjada', nome: 'Mancha alaranjada', manchas: ['protetor'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'Protetor solar que reage com minerais da \u00e1gua; o cloro fixa a mancha.',
          fazer: [F.levar48],
          evitar: ['\u00c1gua sanit\u00e1ria: fixa a mancha.', 'Passar a ferro antes de tratar.']
        },
        {
          id: 'puidos', nome: 'Colarinho e punho pu\u00eddos', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem urg\u00eancia; n\u00e3o tem conserto na lavagem',
          acontece: 'Desgaste pelo atrito do uso e do ferro nas bordas do tecido.',
          fazer: ['Da pr\u00f3xima vez, n\u00e3o use \u00e1gua sanit\u00e1ria no colarinho: com o tempo, o cloro enfraquece a fibra, e o colarinho fica pu\u00eddo antes do resto da camisa.'],
          evitar: ['\u00c1gua sanit\u00e1ria: com o tempo, o cloro enfraquece a fibra, e o colarinho fica pu\u00eddo antes do resto da camisa.']
        },
        {
          id: 'encolhimento', nome: 'Encolheu', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Sem urg\u00eancia; n\u00e3o tem volta na lavagem',
          acontece: '\u00c1gua quente e secadora, principalmente na malha.',
          fazer: ['Da pr\u00f3xima vez, use a temperatura da etiqueta e seque no cabide ou no varal, \u00e0 sombra.'],
          evitar: ['\u00c1gua quente e secadora.']
        },
        {
          id: 'bolinhas', nome: 'Bolinhas', manchas: ['bolinhas'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'Desgaste do fio, comum em misturas com poli\u00e9ster.',
          fazer: [F.avaliar],
          evitar: []
        }
      ]
    },
    {
      id: 'jeans', grupo: 'dia', nome: 'Jeans', exemplos: 'Cal\u00e7as jeans e de sarja',
      sinonimos: ['jeans', 'calca jeans', 'sarja', 'calca de sarja', 'bermuda jeans', 'short jeans', 'jaqueta jeans', 'saia jeans'],
      guia: SITE + '/cuidados-jeans-sarja/', assina: 'alejandro',
      fala: 'A pergunta que mais ouvimos \u00e9 como lavar sem desbotar. Lavamos em \u00e1gua fria, no wet cleaning, e, quando a pe\u00e7a permite, a seco, sem \u00e1gua nenhuma.',
      maquina: 'Sim: do avesso, em \u00e1gua fria, longe das roupas claras e sem lotar a m\u00e1quina.',
      maquinaNao: false,
      caseiro: ['Alvejante com cloro em jeans ou sarja colorida: deixa manchas claras que n\u00e3o voltam.'],
      processo: [
        'Leitura da etiqueta e da composi\u00e7\u00e3o, que decide entre a \u00e1gua e a lavagem a seco.',
        'Manchas tratadas antes da lavagem, com o produto certo para cada fam\u00edlia: gordura e graxa, manchas org\u00e2nicas ou manchas vegetais, como a grama.',
        'Lavagem em \u00e1gua fria, no wet cleaning: no programa da Seitz para pe\u00e7as coloridas, a \u00e1gua n\u00e3o passa de 30 \u00b0C.',
        'Lavagem a seco, sem \u00e1gua, sempre que a etiqueta e a composi\u00e7\u00e3o permitem.'
      ],
      prazo: '2 dias \u00fateis',
      preco: 'Cal\u00e7a esporte ou jeans a partir de {calca_jeans}',
      expresso: 'sim',
      problemas: [
        {
          id: 'graxa', nome: 'Graxa de bicicleta ou moto', manchas: ['graxa'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Precisa de produto pr\u00f3prio antes da \u00e1gua; esfregar com detergente tira a cor.',
          fazer: [F.levar24, 'N\u00e3o molhe antes: a graxa precisa de um produto pr\u00f3prio antes de qualquer contato com \u00e1gua.'],
          evitar: ['Esfregar com detergente: a fric\u00e7\u00e3o tira o corante e deixa a \u00e1rea clara.']
        },
        {
          id: 'grama', nome: 'Grama nos joelhos e na barra', manchas: ['grama'], nivel: 'media',
          urgencia: 'M\u00e9dia (48h)',
          acontece: 'A clorofila age como corante; esfregar com for\u00e7a desbota o jeans em volta.',
          fazer: [F.levar48],
          evitar: ['Esfregar com for\u00e7a: desbota o jeans em volta.']
        },
        {
          id: 'barro', nome: 'Barro e lama', manchas: ['lama'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia, mas n\u00e3o misture na m\u00e1quina',
          acontece: 'Se a pe\u00e7a for direto para a m\u00e1quina, a terra espalha e encarde o resto.',
          fazer: ['Lave separada das outras pe\u00e7as, ou leve \u00e0 Dedicada.'],
          evitar: ['Colocar direto na m\u00e1quina com outras roupas.']
        },
        {
          id: 'desbote', nome: 'Desbote', manchas: ['desbotou'], nivel: 'atencao',
          urgencia: 'Preven\u00e7\u00e3o',
          acontece: 'O corante fica na superf\u00edcie do fio e sai a cada lavagem.',
          fazer: ['Lave do avesso, em \u00e1gua fria, longe das roupas claras e sem lotar a m\u00e1quina.'],
          evitar: ['Lavar jeans escuro novo com roupas claras: a cor passa para as outras pe\u00e7as.']
        },
        {
          id: 'riscos-brancos', nome: 'Riscos brancos', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem solu\u00e7\u00e3o, apenas preven\u00e7\u00e3o',
          acontece: 'Quebra do corante por lavar muitas cal\u00e7as com pouca \u00e1gua.',
          fazer: ['Da pr\u00f3xima vez, n\u00e3o lote a m\u00e1quina.'],
          evitar: ['Lotar a m\u00e1quina.']
        },
        {
          id: 'elastano', nome: 'Cal\u00e7a frouxa, sem elasticidade', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem solu\u00e7\u00e3o, apenas preven\u00e7\u00e3o',
          acontece: 'Elastano danificado por secadora ou ferro muito quentes.',
          fazer: ['Da pr\u00f3xima vez, passe pelo avesso, com o ferro em temperatura m\u00e9dia, e evite a secadora quente.'],
          evitar: ['Secadora quente ou ferro no m\u00e1ximo em cal\u00e7a com elastano.']
        },
        {
          id: 'rasgo', nome: 'Rasgo no entrepernas', manchas: [], nivel: 'atencao',
          urgencia: 'Costure antes de lavar, para n\u00e3o abrir mais',
          acontece: 'Desgaste do atrito, mais comum em jeans fino com elastano.',
          fazer: ['Costure antes de lavar, para n\u00e3o abrir mais.'],
          evitar: []
        }
      ]
    },
    {
      id: 'tenis', grupo: 'dia', nome: 'T\u00eanis e cal\u00e7ados', exemplos: 'T\u00eanis de tecido, lona, sint\u00e9tico e couro',
      sinonimos: ['tenis', 'calcado', 'calcados', 'sapato', 'sapatenis', 'all star', 'sola', 'palmilha'],
      guia: SITE + '/cuidados-tenis-calcados/', assina: 'alejandro',
      fala: 'O t\u00eanis \u00e9 lavado \u00e0 m\u00e3o, com uma pasta especial que tira a sujeira e o cheiro, e seca ao natural. Tamb\u00e9m higienizamos t\u00eanis de couro, que n\u00e3o podem ir na \u00e1gua.',
      maquina: 'N\u00e3o: a centrifuga\u00e7\u00e3o solta partes coladas e deforma o cal\u00e7ado.',
      maquinaNao: true,
      caseiro: ['Acetona em detalhes sint\u00e9ticos: dissolve o material e tira a cor na hora.', 'Mergulhar t\u00eanis de couro na \u00e1gua: o couro resseca e mancha.'],
      processo: [
        'Escova\u00e7\u00e3o \u00e0 m\u00e3o do corpo, da sola e dos cadar\u00e7os, para soltar a sujeira presa no tecido e no relevo da borracha.',
        'Molho de 24 horas numa solu\u00e7\u00e3o com uma pasta especial, que tira a sujeira e o cheiro.',
        'Lavagem em wet cleaning, com controle da a\u00e7\u00e3o mec\u00e2nica e branqueamento.',
        'Secagem natural, sem secadora. O t\u00eanis de couro, que n\u00e3o pode ir na \u00e1gua, \u00e9 higienizado \u00e0 m\u00e3o.'
      ],
      prazo: '3 dias \u00fateis',
      preco: 'A partir de {tenis}',
      expresso: 'nao',
      problemas: [
        {
          id: 'graxa-oleo', nome: 'Graxa e \u00f3leo', manchas: ['graxa', 'gordura'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Entram r\u00e1pido nos poros do tecido, do couro e da borracha.',
          fazer: [F.levar24],
          evitar: ['Esfregar com detergente.', 'Acetona em detalhes sint\u00e9ticos.']
        },
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'T\u00eanis guardado \u00famido, comum na umidade de Florian\u00f3polis.',
          fazer: [F.levar24, 'Depois, guarde o t\u00eanis seco por dentro.'],
          evitar: ['Guardar \u00famido: o t\u00eanis pega cheiro e mofa por dentro.']
        },
        {
          id: 'lama', nome: 'Lama e terra', manchas: ['lama'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'Terra que seca endurece no tecido e fica presa na trama.',
          fazer: ['Bata e escove a sujeira seca, antes de molhar.', F.levar48],
          evitar: ['M\u00e1quina de lavar: descola biqueiras e solados e deforma o cabedal.']
        },
        {
          id: 'cheiro', nome: 'Cheiro forte', manchas: ['suor', 'cheiro'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia, mas acumula',
          acontece: 'Bact\u00e9rias do suor na palmilha e no forro.',
          fazer: ['Lave a palmilha separada e deixe o t\u00eanis secar por completo por dentro.'],
          evitar: ['Guardar \u00famido.']
        },
        {
          id: 'sola-amarelada', nome: 'Sola amarelada', manchas: ['amarelado'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; o amarelado n\u00e3o sai na lavagem',
          acontece: 'A borracha branca oxida com o tempo e o uso.',
          fazer: ['A lavagem tira a sujeira da sola; o amarelado \u00e9 o pr\u00f3prio material mudando de cor e n\u00e3o sai. A Dedicada n\u00e3o faz clareamento de sola.'],
          evitar: ['Palha de a\u00e7o ou esponja abrasiva: riscam o relevo da borracha.']
        },
        {
          id: 'cola-solta', nome: 'Cola solta e t\u00eanis deformado', manchas: [], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem conserto na lavagem',
          acontece: 'M\u00e1quina de lavar, secadora ou calor.',
          fazer: ['Da pr\u00f3xima vez, seque em local ventilado, com papel dentro, sem secadora nem secador de cabelo.'],
          evitar: ['M\u00e1quina de lavar, secadora ou calor.']
        }
      ]
    },
    {
      id: 'roupa-de-cama', grupo: 'casa', nome: 'Roupa de cama e toalhas', exemplos: 'Len\u00e7\u00f3is, toalhas, mantas e capas de sof\u00e1',
      sinonimos: ['lencol', 'lencois', 'fronha', 'toalha de banho', 'toalha de rosto', 'roupao', 'roupa de cama', 'manta', 'manta de sofa', 'colcha de croche', 'capa de sofa', 'capa de almofada', 'almofada', 'protetor de colchao', 'capa de colchao', 'enxoval', 'airbnb'],
      guia: SITE + '/cuidados-roupa-de-cama/', assina: 'liliane',
      fala: 'Len\u00e7\u00f3is, fronhas e toalhas v\u00e3o sempre para a \u00e1gua, no ciclo de enxoval da Seitz; s\u00f3 o len\u00e7ol de seda vai a seco. As toalhas brancas e claras passam por duplo alvejamento, e os len\u00e7\u00f3is saem passados e embalados por jogo, prontos para usar ou guardar.',
      maquina: 'Sim, na temperatura da etiqueta; len\u00e7ol de seda, n\u00e3o.',
      maquinaNao: false,
      caseiro: ['\u00c1gua sanit\u00e1ria: prefira alvejante \u00e0 base de oxig\u00eanio nas pe\u00e7as brancas.'],
      processo: [
        'Len\u00e7\u00f3is, fronhas e toalhas: ciclo de enxoval da Seitz, sempre em \u00e1gua; len\u00e7ol de seda, s\u00f3 a seco.',
        'Toalhas brancas e claras: duplo alvejamento sem cloro; coloridas: lavagem a 40 \u00b0C, para manter a cor. Depois, secas, dobradas \u00e0 m\u00e3o e embaladas.',
        'Len\u00e7\u00f3is e fronhas: passados e embalados por jogo.',
        'Capas de sof\u00e1 e de almofada: lavagem, alvejamento e secagem natural, para n\u00e3o encolher.'
      ],
      prazo: 'Len\u00e7\u00f3is e fronhas, 3 dias \u00fateis; toalhas, 2 dias \u00fateis',
      preco: 'Len\u00e7\u00f3is a partir de {lencol_kg} o quilo; toalha de banho, {toalha_banho}; rosto, piso ou m\u00e3o, {toalha_rosto}',
      expresso: 'Len\u00e7\u00f3is, capas de sof\u00e1 e mantas de sof\u00e1 n\u00e3o t\u00eam servi\u00e7o expresso. Toalhas, roup\u00f5es, capas de travesseiro e protetores de colch\u00e3o t\u00eam: ficam prontos no mesmo dia, se chegarem \u00e0 loja do Santa M\u00f4nica at\u00e9 as 10h, ou no dia seguinte, com acr\u00e9scimo de {expresso_pct}. No s\u00e1bado depois das 10h n\u00e3o h\u00e1 expresso.',
      problemas: [
        {
          id: 'toalha-mofo', nome: 'Toalha com cheiro de mofo', manchas: ['mofo', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Guardada \u00famida; o fungo enfraquece a felpa.',
          fazer: [F.levar24, 'Depois, seque a toalha por completo antes de guardar.'],
          evitar: ['Guardar a toalha \u00famida.']
        },
        {
          id: 'lencol-amarelado', nome: 'Len\u00e7ol amarelado', manchas: ['amarelado', 'suor'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; alvejante \u00e0 base de oxig\u00eanio',
          acontece: 'Suor e oleosidade oxidados, ou tempo guardado.',
          fazer: ['Use alvejante \u00e0 base de oxig\u00eanio nas pe\u00e7as brancas, se a etiqueta permitir.', 'Lave toda semana e n\u00e3o guarde a roupa de cama \u00famida.'],
          evitar: ['\u00c1gua sanit\u00e1ria.']
        },
        {
          id: 'bambu-amarelado', nome: 'Len\u00e7ol de bambu amarelado', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; lavar sempre em temperatura baixa',
          acontece: 'Calor na lavagem ou na secagem.',
          fazer: ['Lave sempre em temperatura baixa, em ciclo delicado e sem secadora quente.'],
          evitar: ['\u00c1gua quente e secadora quente.']
        },
        {
          id: 'toalha-aspera', nome: 'Toalha \u00e1spera que n\u00e3o absorve', manchas: ['amaciante'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'Excesso de amaciante ou de sab\u00e3o nos fios.',
          fazer: ['Use pouco amaciante e seque a toalha por completo antes de guardar.'],
          evitar: ['Excesso de amaciante: deixa uma pel\u00edcula que impede a toalha de absorver.']
        },
        {
          id: 'capa-encolhida', nome: 'Capa de sof\u00e1 encolhida', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem volta na lavagem',
          acontece: 'Calor da secadora.',
          fazer: ['Da pr\u00f3xima vez, seque a capa ao natural.'],
          evitar: ['Secadora.']
        },
        {
          id: 'protetor-rachado', nome: 'Protetor imperme\u00e1vel rachado', manchas: [], nivel: 'sem_solucao',
          urgencia: 'N\u00e3o tem conserto na lavagem',
          acontece: 'Calor forte na secagem ou no ferro.',
          fazer: ['Da pr\u00f3xima vez, lave em \u00e1gua, seguindo a etiqueta, e seque sem calor forte.'],
          evitar: ['Calor forte na secagem ou no ferro.']
        },
        {
          id: 'ferrugem', nome: 'Mancha de ferrugem', manchas: ['ferrugem'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; nunca usar cloro',
          acontece: 'Contato com molas ou estrado de metal; \u00e1gua sanit\u00e1ria escurece a mancha.',
          fazer: [F.avaliar],
          evitar: ['\u00c1gua sanit\u00e1ria: escurece a mancha.']
        }
      ]
    },
    {
      id: 'edredom', grupo: 'casa', nome: 'Edredom', exemplos: 'Edredons, colchas e cobertores, inclusive de pena',
      sinonimos: ['edredom', 'edredon', 'edredons', 'colcha', 'cobertor', 'duvet', 'edredom de pena', 'coberta'],
      guia: SITE + '/cuidados-edredom/', assina: 'liliane',
      fala: 'Todo edredom passa por remo\u00e7\u00e3o manual de manchas, e os claros, por um ciclo de duplo alvejamento sem cloro. O de pena, quando vai para a \u00e1gua, fica de 2 a 3 horas na secadora, at\u00e9 as penas secarem por completo.',
      maquina: 'Casal e king n\u00e3o cabem direito: sem espa\u00e7o para girar, a manta interna rasga e o enchimento embola.',
      maquinaNao: false,
      caseiro: ['\u00c1gua sanit\u00e1ria: o cloro amarela o poli\u00e9ster e pode mudar a cor de bordados.'],
      processo: [
        'Remo\u00e7\u00e3o manual de manchas antes da lavagem.',
        'Lavagem em m\u00e1quinas industriais Girbau e Electrolux, nos programas da Seitz para edredom: 40 \u00b0C para os claros e 30 \u00b0C para os coloridos.',
        'Duplo alvejamento sem cloro nos edredons claros; os coloridos e estampados lavam sem alvejamento.',
        'Higieniza\u00e7\u00e3o com \u00e1cido perac\u00e9tico, desinfetante de uso hospitalar que age contra fungos, bact\u00e9rias e percevejos.',
        'Edredom de pena: a seco ou em \u00e1gua; na \u00e1gua, de 2 a 3 horas de secadora, em m\u00e9dia, at\u00e9 as penas secarem por completo.',
        'Edredom pet, o de quem dorme com o pet: numa m\u00e1quina s\u00f3 para edredom pet. O edredom ou o cobertor que s\u00f3 o pet usa n\u00e3o lavamos.'
      ],
      prazo: '2 dias \u00fateis',
      preco: 'Solteiro a partir de {edredom_solteiro}; casal, {edredom_casal}; king, {edredom_king}; pena, {edredom_pena_solteiro}',
      expresso: 'sim',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo e cheiro de guardado', manchas: ['mofo', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente: lave logo',
          acontece: 'Umidade presa no enchimento, comum no clima de Florian\u00f3polis.',
          fazer: [F.levarLogo, 'Depois, lave sempre antes de guardar.'],
          evitar: [F.plastico, F.umida]
        },
        {
          id: 'xixi', nome: 'Xixi de crian\u00e7a ou de pet', manchas: ['xixi'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'A urina entra no enchimento, e o cheiro volta com a umidade.',
          fazer: [F.pano, F.levar24],
          evitar: [F.quenteProteina],
          dedicada: 'O edredom de quem dorme com o pet vai numa m\u00e1quina s\u00f3 para edredom pet, sem misturar com a roupa de outros clientes.'
        },
        {
          id: 'percevejos', nome: 'Percevejos', manchas: [], nivel: 'urgente',
          urgencia: 'Urgente',
          acontece: 'Escondem-se nas costuras e voltam se a pe\u00e7a n\u00e3o for higienizada.',
          fazer: [F.levarLogo],
          evitar: [],
          dedicada: 'Higieniza\u00e7\u00e3o com \u00e1cido perac\u00e9tico, desinfetante de uso hospitalar que age contra fungos, bact\u00e9rias e percevejos.'
        },
        {
          id: 'amarelado', nome: 'Amarelado', manchas: ['amarelado', 'suor'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia; alvejante sem cloro',
          acontece: 'Suor e oleosidade oxidam com o tempo; o cloro piora no poli\u00e9ster.',
          fazer: ['Use alvejante \u00e0 base de oxig\u00eanio, se a etiqueta permitir, ou leve o edredom.'],
          evitar: ['\u00c1gua sanit\u00e1ria: o cloro amarela o poli\u00e9ster e pode mudar a cor de bordados.'],
          dedicada: 'Duplo alvejamento sem cloro nos edredons claros.'
        },
        {
          id: 'pelos', nome: 'Pelos de animais', manchas: [], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'Os pelos se prendem no tecido e entram no enchimento.',
          fazer: ['Lave o edredom pet, o de quem dorme com o pet, a cada 15 dias.'],
          evitar: []
        },
        {
          id: 'embolado', nome: 'Enchimento embolado', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem solu\u00e7\u00e3o, apenas preven\u00e7\u00e3o',
          acontece: 'Manta rasgada e costura rompida por lavagem em m\u00e1quina pequena.',
          fazer: ['Da pr\u00f3xima vez, edredom de casal ou king vai para m\u00e1quina industrial.'],
          evitar: ['Lavar edredom grande na m\u00e1quina de casa.']
        },
        {
          id: 'manta-bolinhas', nome: 'Manta sem volume, com bolinhas', manchas: ['bolinhas'], nivel: 'sem_solucao',
          urgencia: 'Sem solu\u00e7\u00e3o, apenas preven\u00e7\u00e3o',
          acontece: 'Desgaste natural da manta de poli\u00e9ster com o uso e as lavagens.',
          fazer: [F.avaliar],
          evitar: []
        }
      ]
    },
    {
      id: 'cortinas', grupo: 'casa', nome: 'Cortinas', exemplos: 'Voal, linho, algod\u00e3o e blackout lav\u00e1vel',
      sinonimos: ['cortina', 'cortinas', 'voal', 'blackout', 'blecaute'],
      guia: SITE + '/cuidados-cortinas/', assina: 'jorge',
      fala: 'Nas cortinas, esfregamos as barras \u00e0 m\u00e3o, lavamos em ciclo pr\u00f3prio e secamos ao natural. Blackout, s\u00f3 lavamos quando o tecido \u00e9 lav\u00e1vel: a maioria fica pegajosa ou quebradi\u00e7a.',
      maquina: 'Voal e poli\u00e9ster leves, se a etiqueta permitir: \u00e1gua fria, ciclo delicado, sem centrifuga\u00e7\u00e3o forte; linho, blackout e cortinas grandes, n\u00e3o.',
      maquinaNao: false,
      caseiro: [],
      processo: [
        'Avalia\u00e7\u00e3o do tecido: blackout s\u00f3 \u00e9 lavado quando o tecido \u00e9 lav\u00e1vel.',
        'Barras esfregadas \u00e0 m\u00e3o antes da lavagem.',
        'Ciclo pr\u00f3prio para cortinas, nos programas da Seitz: 30 \u00b0C para sujidade leve e 40 \u00b0C para barras muito sujas, amarelado e poeira.',
        'Cortinas de linho que n\u00e3o foram pr\u00e9-encolhidas v\u00e3o para a lavagem a seco.',
        'Remo\u00e7\u00e3o de mofo, quando poss\u00edvel.',
        'Secagem natural, sem secadora. A Dedicada n\u00e3o tira nem coloca a cortina no trilho.'
      ],
      prazo: '5 a 7 dias \u00fateis',
      preco: 'A partir de {cortina} por pe\u00e7a; capa de sof\u00e1 pela foto, no WhatsApp',
      expresso: 'nao',
      problemas: [
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Umidade na janela e cortina encostada no vidro.',
          fazer: [F.levarLogo, 'Deixe a cortina fora do trilho no dia da coleta.'],
          evitar: ['Deixar a cortina encostada no vidro \u00famido.'],
          dedicada: 'Remo\u00e7\u00e3o de mofo, quando poss\u00edvel, antes do ciclo pr\u00f3prio para cortinas.'
        },
        {
          id: 'barras', nome: 'Barras encardidas', manchas: ['lama'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'Poeira e sujeira do ch\u00e3o se acumulam na parte de baixo.',
          fazer: ['Leve a cortina: as barras s\u00e3o esfregadas \u00e0 m\u00e3o antes da lavagem.'],
          evitar: []
        },
        {
          id: 'amarelado', nome: 'Amarelado ou acinzentado', manchas: ['amarelado'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'Sol, poeira e fuma\u00e7a mudam a cor do tecido com o tempo.',
          fazer: ['Lave as cortinas uma vez por ano, ou antes, ao primeiro sinal de poeira ou de fungo.'],
          evitar: []
        },
        {
          id: 'cheiro', nome: 'Cheiro de cigarro ou de fritura', manchas: ['cheiro'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'O tecido absorve a fuma\u00e7a e a gordura do ar.',
          fazer: [F.avaliar],
          evitar: []
        },
        {
          id: 'blackout', nome: 'Revestimento do blackout soltando', manchas: [], nivel: 'sem_solucao',
          urgencia: 'Sem solu\u00e7\u00e3o',
          acontece: 'Sol, calor e lavagem inadequada quebram a camada do avesso.',
          fazer: ['Antes de lavar outro blackout, confirme se o tecido \u00e9 lav\u00e1vel.'],
          evitar: ['Lavar blackout que n\u00e3o \u00e9 lav\u00e1vel.']
        },
        {
          id: 'encolhimento', nome: 'Encolheu', manchas: ['encolheu'], nivel: 'sem_solucao',
          urgencia: 'Sem solu\u00e7\u00e3o, apenas preven\u00e7\u00e3o',
          acontece: 'Linho ou algod\u00e3o sem pr\u00e9-encolhimento lavado em \u00e1gua.',
          fazer: ['Da pr\u00f3xima vez, cortina de linho que n\u00e3o foi pr\u00e9-encolhida vai para a lavagem a seco.'],
          evitar: ['Lavar em \u00e1gua linho ou algod\u00e3o sem pr\u00e9-encolhimento.']
        }
      ]
    },
    {
      id: 'pelucias', grupo: 'criancas', nome: 'Pel\u00facias e fantasias', exemplos: 'Bichos de pel\u00facia e fantasias, inclusive de mascote',
      sinonimos: ['pelucia', 'pelucias', 'bicho de pelucia', 'ursinho', 'urso', 'boneco', 'fantasia', 'mascote', 'naninha'],
      guia: SITE + '/cuidados-pelucias-fantasias/', assina: 'liliane',
      fala: 'Escovamos a pel\u00facia \u00e0 m\u00e3o antes do wet cleaning e secamos ao natural, sem secadora. Nas fantasias de mascote, a cabe\u00e7a e o corpo com estrutura n\u00e3o v\u00e3o para a m\u00e1quina: higienizamos \u00e0 m\u00e3o e secamos ao natural.',
      maquina: 'Pel\u00facias pequenas e sem estrutura \u00e0s vezes aceitam ciclo delicado com \u00e1gua fria, se a etiqueta permitir; secadora, nunca.',
      maquinaNao: false,
      caseiro: [],
      processo: [
        'Confer\u00eancia do tamanho (at\u00e9 1 metro de altura por 40 a 50 cm de largura) e das pe\u00e7as eletr\u00f4nicas, que precisam ser retiradas.',
        'Escova\u00e7\u00e3o manual do pelo, para soltar a sujeira.',
        'Lavagem em wet cleaning.',
        'Secagem natural, sem secadora.',
        'Nas fantasias, as partes lav\u00e1veis v\u00e3o para o wet cleaning; cabe\u00e7as e corpos com estrutura recebem limpeza manual e higieniza\u00e7\u00e3o.'
      ],
      prazo: 'Pel\u00facia, 3 dias \u00fateis; fantasia, 7 dias \u00fateis',
      preco: 'Pel\u00facia a partir de {pelucia} (P), {pelucia_m} (M), {pelucia_g} (G) e {pelucia_gg} (GG); fantasia pela foto, no WhatsApp',
      expresso: 'nao',
      problemas: [
        {
          id: 'xixi-vomito-leite', nome: 'Xixi, v\u00f4mito ou leite', manchas: ['xixi', 'vomito', 'leite'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Entram no enchimento, e o cheiro volta com a umidade.',
          fazer: [F.pano, F.levar24],
          evitar: ['Secadora: o calor deforma o pelo sint\u00e9tico.', F.quenteProteina]
        },
        {
          id: 'mofo', nome: 'Mofo na pel\u00facia', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Pel\u00facia guardada com umidade; o enchimento segura a \u00e1gua.',
          fazer: [F.levarLogo, 'Depois de lavar, guarde a pel\u00facia seca, em lugar ventilado.'],
          evitar: ['Guardar em arm\u00e1rio ou caixa fechada.']
        },
        {
          id: 'amarelado', nome: 'Amarelado de tempo', manchas: ['amarelado'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'Poeira, m\u00e3os e tempo de guardado mudam a cor do pelo.',
          fazer: ['Leve a pel\u00facia para lavar.'],
          evitar: []
        },
        {
          id: 'suor-mascote', nome: 'Suor na fantasia de mascote', manchas: ['suor'], nivel: 'atencao',
          urgencia: 'Higienize depois de cada evento',
          acontece: 'Cabe\u00e7a e corpo acumulam o suor de quem veste.',
          fazer: ['Leve a fantasia para higienizar depois de cada evento.'],
          evitar: ['Colocar cabe\u00e7a e corpo com estrutura na m\u00e1quina.'],
          dedicada: 'Cabe\u00e7as e corpos com estrutura recebem limpeza manual e higieniza\u00e7\u00e3o, e secam ao natural.'
        },
        {
          id: 'pedrarias', nome: 'Pedrarias e lantejoulas soltando', manchas: [], nivel: 'atencao',
          urgencia: 'Preven\u00e7\u00e3o: nada de m\u00e1quina de casa',
          acontece: 'Agita\u00e7\u00e3o e calor em fantasias de festa lavadas em casa.',
          fazer: [F.avaliar],
          evitar: ['M\u00e1quina de casa.']
        }
      ]
    },
    {
      id: 'carrinho', grupo: 'criancas', nome: 'Carrinho de beb\u00ea', exemplos: 'Carrinho e beb\u00ea conforto, lavados \u00e0 m\u00e3o',
      sinonimos: ['carrinho', 'carrinho de bebe', 'bebe conforto', 'cadeirinha', 'moises', 'cadeira de carro'],
      guia: SITE + '/cuidados-carrinho-de-bebe/', assina: 'alejandro',
      fala: 'Desmontamos o carrinho inteiro e lavamos \u00e0 m\u00e3o a capa e a estrutura; os cintos s\u00e3o higienizados por fora, sem encharcar. A secagem \u00e9 natural, com ventilador profissional, e depois montamos de novo. Se for para guardar, entregamos desmontado.',
      maquina: 'Estrutura, n\u00e3o; capas, conforme a etiqueta e o manual.',
      maquinaNao: false,
      caseiro: [],
      processo: [
        'Desmontagem completa do carrinho ou do beb\u00ea conforto.',
        'Lavagem manual da capa e da estrutura.',
        'Higieniza\u00e7\u00e3o dos cintos de seguran\u00e7a por fora, sem encharcar.',
        'Secagem natural, com ajuda de ventilador profissional, at\u00e9 tudo secar por completo.',
        'Montagem de novo, ou entrega desmontado, que \u00e9 o ideal para guardar.'
      ],
      prazo: '7 dias \u00fateis',
      preco: 'Carrinho a partir de {carrinho_bebe}; beb\u00ea conforto, {bebe_conforto}',
      expresso: 'nao',
      problemas: [
        {
          id: 'vomito-leite', nome: 'V\u00f4mito e leite', manchas: ['vomito', 'leite'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Azedam e entram na espuma do assento.',
          fazer: [F.pano, F.levar24],
          evitar: [F.quenteProteina]
        },
        {
          id: 'xixi', nome: 'Xixi ou fralda vazada', manchas: ['xixi'], nivel: 'urgente',
          urgencia: 'Urgente (24h)',
          acontece: 'Entram no acolchoado e deixam cheiro.',
          fazer: [F.pano, F.levar24],
          evitar: [F.quenteProteina]
        },
        {
          id: 'mofo', nome: 'Mofo', manchas: ['mofo'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Carrinho guardado \u00famido ou em lugar fechado; aparece no tecido, nas espumas e nas costuras.',
          fazer: [F.levarLogo, 'Depois, guarde o carrinho seco, em lugar ventilado.'],
          evitar: ['Guardar \u00famido ou em lugar fechado.']
        },
        {
          id: 'comida', nome: 'Restos de comida', manchas: ['comida'], nivel: 'media',
          urgencia: 'M\u00e9dia',
          acontece: 'Acumulam nas costuras, no cesto e nos cantos da estrutura.',
          fazer: ['Leve o carrinho para lavar.'],
          evitar: []
        },
        {
          id: 'terra', nome: 'Terra e poeira da rua', manchas: ['lama'], nivel: 'sem_urgencia',
          urgencia: 'Sem urg\u00eancia',
          acontece: 'Rodas, cesto e barra da capa acumulam sujeira.',
          fazer: ['Na orienta\u00e7\u00e3o da Dedicada, o carrinho se lava a cada 1 a 2 meses com uso frequente, e o beb\u00ea conforto, quando sujar ou aparecer cheiro forte ou manchas amareladas.'],
          evitar: []
        },
        {
          id: 'cheiro-guardado', nome: 'Cheiro de guardado', manchas: ['cheiro'], nivel: 'atencao',
          urgencia: 'Lave antes de usar de novo',
          acontece: 'Umidade presa nas espumas depois de meses parado.',
          fazer: ['Lave antes de usar de novo.'],
          evitar: []
        }
      ]
    },

    /* ---------- Pe\u00e7as sem guia pr\u00f3prio (grupo "outras") ----------
     * semGuia: o bot\u00e3o leva \u00e0 p\u00e1gina central de Cuidados por Tecido e n\u00e3o h\u00e1 fala nem tabela de
     * problemas. Qualquer mancha \u00e9 resolvida pela fam\u00edlia dela. nota: fato do tecido com fonte.
     * leia: chaves de BLOG. Quando houver guia, troque guia, assina, fala, processo e problemas. */
    {
      id: 'viscose', grupo: 'outras', nome: 'Viscose e malha fria', exemplos: 'Viscose, raiom, cupro, modal e malha fria',
      sinonimos: ['viscose', 'viscolycra', 'malha fria', 'raiom', 'rayon', 'cupro', 'modal', 'liocel', 'tencel', 'viscolinho', 'crepe de viscose', 'vestido de viscose', 'blusa de viscose'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'Segundo a ANEL, a viscose perde boa parte da resist\u00eancia quando est\u00e1 molhada. Por isso, n\u00e3o esfregue nem tor\u00e7a a pe\u00e7a molhada.',
      leia: ['cupro'],
      maquina: 'Siga a etiqueta. Na d\u00favida, use \u00e1gua fria, n\u00e3o esfregue e n\u00e3o use secadora nem \u00e1gua sanit\u00e1ria.',
      maquinaNao: false,
      caseiro: ['Esfregar ou torcer a pe\u00e7a molhada: a viscose fica mais fr\u00e1gil quando est\u00e1 molhada.'],
      processo: PROCESSO_GERAL,
      prazo: 'A maioria das pe\u00e7as fica pronta em 2 dias \u00fateis; confirme pelo WhatsApp',
      preco: 'Conforme a pe\u00e7a; pe\u00e7a o or\u00e7amento pelo WhatsApp',
      expresso: 'semVestido',
      problemas: []
    },
    {
      id: 'sinteticos', grupo: 'outras', nome: 'Poli\u00e9ster e roupa de academia', exemplos: 'Legging, top, dry fit, poli\u00e9ster, poliamida e elastano',
      sinonimos: ['poliester', 'poliamida', 'elastano', 'lycra', 'legging', 'top', 'dry fit', 'dryfit', 'roupa de academia', 'roupa de ginastica', 'roupa fitness', 'fitness', 'roupa esportiva', 'roupa de treino', 'roupa de ciclismo', 'tactel', 'microfibra', 'oxford', 'tecido oxford', 'malha de academia', 'camisa de time', 'camisa de futebol'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'Segundo a ANEL, o poli\u00e9ster e a poliamida, que \u00e9 o nylon, amarelam com cloro, e secadora ou ferro muito quentes fazem o elastano perder a for\u00e7a.',
      leia: ['fitness'],
      maquina: 'Siga a etiqueta. Na d\u00favida, use \u00e1gua fria, n\u00e3o esfregue e n\u00e3o use secadora nem \u00e1gua sanit\u00e1ria.',
      maquinaNao: false,
      caseiro: ['\u00c1gua sanit\u00e1ria ou alvejante com cloro: segundo a ANEL, o poli\u00e9ster e a poliamida amarelam com cloro.'],
      processo: PROCESSO_GERAL,
      prazo: 'A maioria das pe\u00e7as fica pronta em 2 dias \u00fateis; confirme pelo WhatsApp',
      preco: 'Conforme a pe\u00e7a; pe\u00e7a o or\u00e7amento pelo WhatsApp',
      expresso: 'semVestido',
      problemas: []
    },
    // Roupa de beb\u00ea e infantil: processo, prazo e pre\u00e7o confirmados pelo dono em 29/09/2026; guia proprio
    // (/cuidados-roupa-de-bebe/, passo 9, 27/10/2026): fala da Liliane aprovada pelo dono (457) e tabela de problemas
    // com os conselhos de casa do guia.
    {
      id: 'bebe', grupo: 'criancas', nome: 'Roupa de beb\u00ea e enxoval', exemplos: 'Roupinhas, body, enxoval, ninho, manta e roupa de crian\u00e7a',
      sinonimos: ['roupa de bebe', 'roupinha', 'roupinha de bebe', 'body', 'body de bebe', 'macacao de bebe', 'enxoval de bebe', 'ninho', 'ninho de bebe', 'manta de bebe', 'roupa infantil', 'roupa de crianca', 'roupinha infantil', 'babador', 'cueiro', 'saida de maternidade', 'roupa de recem nascido'],
      guia: SITE + '/cuidados-roupa-de-bebe/', assina: 'liliane',
      fala: 'Roupa de beb\u00ea n\u00e3o precisa de produto forte: precisa de pouco sab\u00e3o, bastante \u00e1gua no enx\u00e1gue e secar por completo. O que mais estraga a roupinha \u00e9 a mancha de leite ou de xixi que ficou e a pe\u00e7a guardada \u00famida: em Florian\u00f3polis, mofa.',
      nota: 'Na Dedicada, a roupa de beb\u00ea e o enxoval s\u00e3o lavados em \u00e1gua, por unidade, em lote individual e com produtos da Seitz sem perfume e com enx\u00e1gue extra; s\u00f3 a manta de l\u00e3 vai a seco. Secam ao natural, e s\u00f3 no expresso v\u00e3o para a secadora. A roupa infantil tem o pre\u00e7o pela foto. A Dedicada tamb\u00e9m lava ninhos, carrinho e beb\u00ea conforto.',
      maquina: 'Siga a etiqueta. Na d\u00favida, use \u00e1gua fria, n\u00e3o esfregue e n\u00e3o use secadora nem \u00e1gua sanit\u00e1ria.',
      maquinaNao: false,
      caseiro: [F.sanitaria],
      processo: [
        'Manchas tratadas antes da lavagem, com o tira-manchas da Seitz pr\u00f3prio da fam\u00edlia de cada uma (V1, V2 ou V3).',
        'Lavagem em \u00e1gua, por unidade, em lote individual, separada das outras roupas; s\u00f3 a manta de l\u00e3 vai a seco.',
        'Produtos da Seitz sem perfume, com enx\u00e1gue extra.',
        'Secagem natural e passadoria; s\u00f3 no expresso a roupa vai para a secadora.',
        'Entrega dobrada e embalada por tamanho; vestidinhos, polos e camisas no cabide.'
      ],
      prazo: '4 dias \u00fateis',
      preco: 'Roupa de beb\u00ea e enxoval a partir de {roupa_bebe} a pe\u00e7a; roupa infantil pela foto, no WhatsApp',
      expresso: 'Tem expresso: pronta no mesmo dia, se a pe\u00e7a chegar \u00e0 loja do Santa M\u00f4nica at\u00e9 as 10h, ou no dia seguinte, com acr\u00e9scimo de {expresso_pct}. No s\u00e1bado depois das 10h n\u00e3o h\u00e1 expresso.',
      problemas: [
        {
          id: 'cor-outra-peca', nome: 'Cor de outra pe\u00e7a', manchas: ['cor'], nivel: 'muito_urgente',
          urgencia: 'Muito urgente (menos de 24h)',
          acontece: 'A roupinha escura ou de cor forte soltou cor nas claras, mesmo na m\u00e1quina s\u00f3 do beb\u00ea; a secadora fixa o corante de vez.',
          fazer: [F.levarMenos24, 'N\u00e3o seque a pe\u00e7a: deixe como est\u00e1 at\u00e9 levar.'],
          evitar: ['Secadora e ferro: o calor fixa o corante de vez.', 'Lavar de novo junto com as coloridas.']
        },
        {
          id: 'mofo', nome: 'Mofo e cheiro de guardado', manchas: ['mofo', 'cheiro'], nivel: 'urgente',
          urgencia: 'Urgente: quanto antes, maior a chance de sair',
          acontece: 'Roupinha guardada \u00famida, ou fechada em saco pl\u00e1stico, com a umidade de Florian\u00f3polis.',
          fazer: [F.mofoNaoEscovar, F.levarLogo, F.mofoGuardar],
          evitar: [F.plastico, F.umida]
        },
        {
          id: 'leite-vomito', nome: 'Leite, golfada e v\u00f4mito', manchas: ['leite', 'vomito'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'A prote\u00edna do leite fixa com o calor e amarela com o tempo.',
          fazer: [F.pano, 'Em casa, deixe de molho em \u00e1gua fria com um pouco de sab\u00e3o, sem esfregar.', F.levar48],
          evitar: [F.quenteProteina, F.calor]
        },
        {
          id: 'xixi', nome: 'Xixi e fralda vazada', manchas: ['xixi'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'Seca na pe\u00e7a e deixa cheiro; a roupinha \u00famida no cesto mofa.',
          fazer: ['Enx\u00e1gue em \u00e1gua fria logo e n\u00e3o guarde a pe\u00e7a \u00famida.', F.levar48],
          evitar: [F.quenteProteina, F.sanitaria, 'Am\u00f4nia ou vinagre "para o cheiro".']
        },
        {
          id: 'coco', nome: 'Coc\u00f4', manchas: ['fezes'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'Entra na trama do algod\u00e3o; esfregar com escova espalha e esgar\u00e7a.',
          fazer: ['Tire o excesso com papel e enx\u00e1gue pelo avesso em \u00e1gua fria corrente; mande a pe\u00e7a num saco separado.', F.levar48],
          evitar: [F.esfregar, F.quenteProteina, F.sanitaria]
        },
        {
          id: 'fruta-papinha', nome: 'Papinha, fruta e suco', manchas: ['suco', 'comida'], nivel: 'media',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: 'Cenoura, beterraba e manga deixam mancha forte; o calor fixa.',
          fazer: [F.pano, F.levar48],
          evitar: [F.quenteTanino, F.calor, 'Tentar tirar em casa com produto forte: \u00e9 o que mais chega manchado pelo pr\u00f3prio produto.']
        },
        {
          id: 'pomada', nome: 'Pomada de assadura e \u00f3leo', manchas: ['remedio', 'gordura'], nivel: 'logo',
          urgencia: 'M\u00e9dia urg\u00eancia (48h)',
          acontece: '\u00d3xido de zinco e \u00f3leo entram na fibra e costumam resistir \u00e0 lavagem comum.',
          fazer: ['Tire o excesso com papel, sem esfregar.', F.levar48],
          evitar: [F.calor, 'Produto caseiro na mancha.']
        },
        {
          id: 'amarelado', nome: 'Roupa guardada amarelada', manchas: ['amarelado'], nivel: 'dificil',
          urgencia: 'Sem urg\u00eancia; avaliar a pe\u00e7a',
          acontece: 'Mancha de leite ou suor que ningu\u00e9m viu oxidou com o tempo, o calor e a umidade.',
          fazer: ['Lave antes de usar; o alvejamento sem cloro est\u00e1 inclu\u00eddo.', F.avaliar],
          evitar: [F.sanitaria, F.calor]
        }
      ]
    },
    // Toalhas de mesa e guardanapos: processo, prazo, pre\u00e7o e expresso confirmados pelo dono em 29/09/2026.
    {
      id: 'mesa', grupo: 'outras', nome: 'Toalhas de mesa e guardanapos', exemplos: 'Toalhas de mesa, guardanapos e caminhos de mesa',
      sinonimos: ['toalha de mesa', 'guardanapo', 'guardanapo de pano', 'jogo americano', 'caminho de mesa', 'pano de prato', 'jacquard', 'toalha de natal', 'mesa posta'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'Na Dedicada, toalhas de mesa e guardanapos v\u00e3o primeiro para a lavagem a seco, que tira a gordura de comidas, e depois para a \u00e1gua, onde sai o restante das manchas.',
      maquina: 'Siga a etiqueta. Na d\u00favida, use \u00e1gua fria, n\u00e3o esfregue e n\u00e3o use secadora nem \u00e1gua sanit\u00e1ria.',
      maquinaNao: false,
      caseiro: [F.umida],
      processo: [
        'Lavagem a seco primeiro, para tirar a gordura de comidas.',
        'Lavagem em \u00e1gua, com a remo\u00e7\u00e3o do restante das manchas.',
        'Goma fraca, meia goma ou goma forte, sem custo, como o cliente preferir, e secagem natural, sem secadora: na secadora, a goma desaparece.',
        'Passadoria \u00e0 m\u00e3o: a toalha de mesa sai no cabide, para n\u00e3o amassar, e os guardanapos e jogos americanos saem passados, prontos para uso.'
      ],
      prazo: '5 dias \u00fateis: lavagem a seco, lavagem em \u00e1gua e goma com secagem natural, porque na secadora a goma desaparece',
      preco: 'Toalha de mesa a partir de {toalha_mesa}; guardanapo, {guardanapo}',
      expresso: 'nao',
      problemas: []
    },
    // Fardas e uniformes: processo, prazo, pre\u00e7o e expresso confirmados pelo dono em 29/09/2026.
    {
      id: 'fardas', grupo: 'outras', nome: 'Fardas e uniformes', exemplos: 'Fardas e uniformes de trabalho',
      sinonimos: ['farda', 'fardamento', 'uniforme', 'uniforme de trabalho', 'uniforme escolar', 'uniforme de empresa', 'jaleco', 'dolma'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'Na Dedicada, a farda estilo alfaiataria, com entretela, vai para a lavagem a seco; a que n\u00e3o tem entretela vai para a \u00e1gua. Depois, \u00e9 seca, passada e entregue em cabide, pronta para uso.',
      maquina: 'Siga a etiqueta. Na d\u00favida, use \u00e1gua fria, n\u00e3o esfregue e n\u00e3o use secadora nem \u00e1gua sanit\u00e1ria.',
      maquinaNao: false,
      caseiro: ['Encharcar a farda com entretela: a \u00e1gua pode soltar a cola da entretela.'],
      processo: [
        'Lavagem a seco, quando a farda \u00e9 estilo alfaiataria e tem entretela; em \u00e1gua, quando n\u00e3o tem.',
        'Manchas tratadas antes da lavagem, com o tira-manchas da Seitz pr\u00f3prio da fam\u00edlia de cada uma (V1, V2 ou V3).',
        'Secagem e passadoria.',
        'Entrega em cabide, pronta para uso.'
      ],
      prazo: '2 dias \u00fateis',
      preco: 'Farda ou uniforme a partir de {farda}; jaleco, {jaleco}; beca, {beca}',
      expresso: 'sim',
      problemas: []
    },
    {
      id: 'outra', grupo: 'outras', nome: 'Outra pe\u00e7a ou tecido', exemplos: 'Mochila, bon\u00e9, tapete pequeno e outras pe\u00e7as: a equipe avalia pela foto',
      sinonimos: ['outro tecido', 'nobuck', 'acrilico', 'kimono', 'quimono', 'tapete', 'tapete pequeno', 'tapetinho', 'tapete de banheiro', 'mochila', 'bone'],
      semGuia: true, guia: SITE + '/cuidados-por-tecido/', assina: null, fala: null,
      nota: 'A Dedicada lava mochilas, bon\u00e9s e tapetes pequenos e m\u00e9dios, que ainda n\u00e3o t\u00eam guia pr\u00f3prio. N\u00e3o lava bolsas, camur\u00e7a, sof\u00e1s, colch\u00f5es nem tapetes grandes. Mande a foto da pe\u00e7a e da etiqueta pelo WhatsApp: a equipe avalia pela foto e diz como lavar.',
      maquina: 'Siga a etiqueta. Na d\u00favida, use \u00e1gua fria, n\u00e3o esfregue e n\u00e3o use secadora nem \u00e1gua sanit\u00e1ria.',
      maquinaNao: false,
      caseiro: [],
      processo: PROCESSO_GERAL,
      prazo: 'Conforme a pe\u00e7a; confirme pelo WhatsApp',
      preco: 'Conforme a pe\u00e7a; pe\u00e7a o or\u00e7amento pelo WhatsApp',
      expresso: 'consultar',
      problemas: []
    }
  ];

  /* =====================================================================
   * Daqui para baixo \u00e9 o funcionamento da ferramenta. O conte\u00fado fica acima.
   * ===================================================================== */

  /* Precos: vem da tabela central (/wp-json/ded/v1/precos, a mesma dos shortcodes [preco]).
     Os valores abaixo so valem se a leitura falhar (tabela de 16/10/2026). Nos textos, {id} vira "R$ 0,00". */
  var DM_PRECOS_PADRAO = { agasalho_la: 49, bebe_conforto: 290, beca: 89, blusa: 29, blusa_seda: 45, calca_jeans: 29, calca_social: 42, camisa: 24.9, camiseta: 18.9, carrinho_bebe: 390, cortina: 120, edredom_casal: 94, edredom_king: 110, edredom_pena_solteiro: 160, edredom_solteiro: 69, farda: 49, gravata: 35, guardanapo: 13, jaleco: 45, jaqueta: 69, jaqueta_hidratacao: 160, jaqueta_pena: 120, jaqueta_poliester: 99, lencol_kg: 44, noiva: 600, paleto: 49, pele: 280, pelucia: 45, pelucia_g: 110, pelucia_gg: 200, pelucia_m: 65, roupa_bebe: 15, tenis: 85, terno: 91, toalha_banho: 14, toalha_mesa: 69, toalha_rosto: 8, vestido: 65, vestido_festa: 160, vestido_midi: 75 };
  var dmPrecosVivos = null;
  var DM_EXPRESSO_PADRAO = 50;   // acr\u00e9scimo do expresso, em %, se a tabela n\u00e3o abrir (o mesmo de [preco_expresso])
  var dmExpressoPct = null;
  function dmValorBR(v) {
    var p = (Math.round(v * 100) / 100).toFixed(2).split('.');
    return 'R$ ' + p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + p[1];
  }
  function dedPreco(t) {
    return String(t == null ? '' : t).replace(/\{([a-z0-9_]+)\}/g, function (m, id) {
      if (id === 'expresso_pct') return (typeof dmExpressoPct === 'number' ? dmExpressoPct : DM_EXPRESSO_PADRAO) + '%';
      var it = dmPrecosVivos && dmPrecosVivos[id];
      if (it && it.valor === null) return 'sob consulta';
      var v = it && typeof it.valor === 'number' ? it.valor : DM_PRECOS_PADRAO[id];
      return typeof v === 'number' ? dmValorBR(v) : m;
    });
  }
  function dmAtualizarPrecos() {
    if (typeof document === 'undefined' || !document.querySelectorAll) return;
    var els = document.querySelectorAll('[data-dm-preco]');
    for (var i = 0; i < els.length; i++) els[i].textContent = dedPreco(els[i].getAttribute('data-dm-preco'));
  }
  if (typeof fetch === 'function' && typeof document !== 'undefined') {
    try {
      fetch('/wp-json/ded/v1/precos', { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { if (j && j.itens) { dmPrecosVivos = j.itens; if (typeof j.expresso_pct === 'number') dmExpressoPct = j.expresso_pct; dmAtualizarPrecos(); } })
        .catch(function () {});
    } catch (e) { /* sem rede: ficam os valores padrao */ }
  }

  /* Expresso: o acr\u00e9scimo vem da tabela central ({expresso_pct}); as regras do s\u00e1bado s\u00e3o as respostas 407, 408 e 412 (22 a 24/10). */
  var EXPRESSO = {
    sim: 'Tem expresso, com acr\u00e9scimo de {expresso_pct}: a pe\u00e7a que chega \u00e0 loja do Santa M\u00f4nica at\u00e9 as 10h fica pronta no mesmo dia (\u00e0s 17h; no s\u00e1bado, antes das 13h); depois das 10h, no dia seguinte. No s\u00e1bado depois das 10h n\u00e3o h\u00e1 expresso.',
    semVestido: 'Tem expresso, com acr\u00e9scimo de {expresso_pct}: a pe\u00e7a que chega \u00e0 loja do Santa M\u00f4nica at\u00e9 as 10h fica pronta no mesmo dia (\u00e0s 17h; no s\u00e1bado, antes das 13h); depois das 10h, no dia seguinte. No s\u00e1bado depois das 10h n\u00e3o h\u00e1 expresso. Vestido de festa, de um dia para o outro; vestido de noiva n\u00e3o tem urg\u00eancia na lavagem.',
    nao: 'N\u00e3o tem servi\u00e7o expresso.',
    consultar: 'A maioria das pe\u00e7as tem expresso, com acr\u00e9scimo de {expresso_pct}: pronta no mesmo dia, se chegar \u00e0 loja do Santa M\u00f4nica at\u00e9 as 10h (\u00e0s 17h; no s\u00e1bado, antes das 13h), ou no dia seguinte. No s\u00e1bado depois das 10h n\u00e3o h\u00e1 expresso. Confirme pelo WhatsApp.'
  };
  var COLETA = 'Coleta e entrega gr\u00e1tis nos bairros atendidos, na Ilha e no Continente, em dias fixos da semana. De outros bairros, \u00e9 s\u00f3 levar a pe\u00e7a a uma das lojas, no Centro ou no Santa M\u00f4nica.';
  var HUB_COLETA = SITE + '/lavanderia-coleta-e-entrega-em-florianopolis/#dias-por-bairro';
  var PAGINA = SITE + '/diagnostico-de-manchas/';

  /* ---------- Os tr\u00eas tempos da mancha (vers\u00e3o 4, 25/10/2026) ----------
   * A resposta muda com o tempo: fresca (ainda \u00famida ou de hoje), seca (de ontem a semanas, sem mexer)
   * e j\u00e1 lavada ou passada a ferro (a chance de sair cai muito; a equipe avisa antes de come\u00e7ar: resposta 440). */
  var TEMPOS = [
    { id: 'fresca', nome: 'Mancha fresca', rotulo: 'Aconteceu agora ou hoje', det: 'A mancha ainda est\u00e1 \u00famida ou \u00e9 de hoje.', curto: 'fresca', whats: 'hoje (mancha fresca)' },
    { id: 'seca', nome: 'Mancha seca', rotulo: 'J\u00e1 secou, ou n\u00e3o sei quando foi', det: 'De ontem a algumas semanas, sem ningu\u00e9m mexer nela.', curto: 'seca', whats: 'j\u00e1 secou' },
    { id: 'fixada', nome: 'J\u00e1 lavada ou passada a ferro', rotulo: 'J\u00e1 lavei ou passei a ferro, e a mancha ficou', det: 'Lavada em casa ou na m\u00e1quina, ou com ferro por cima.', curto: 'j\u00e1 lavada ou passada', whats: 'j\u00e1 lavei ou passei a ferro e a mancha ficou' }
  ];
  var T = {
    fresca: 'Mancha fresca \u00e9 a que mais sai: siga os passos abaixo e leve a pe\u00e7a no prazo.',
    secaFazer: 'N\u00e3o molhe, n\u00e3o esfregue nem passe ferro na mancha: seca, ela pede o tira-manchas, e em casa o risco \u00e9 fixar de vez.',
    secaLevar: 'Leve a pe\u00e7a quanto antes: a mancha seca ainda pode sair, e a chance \u00e9 maior quanto menos tempo passar.',
    fixadaAcontece: 'Mancha que j\u00e1 foi lavada ou passada a ferro e ficou: a Dedicada ainda tenta, mas a chance de sair cai muito, e avisamos antes de come\u00e7ar.',
    fixadaFazer: ['N\u00e3o aplique mais nada em casa.', 'Mande a foto pelo WhatsApp: a equipe avalia e diz antes se vale tentar.', 'Leve a pe\u00e7a para a equipe avaliar.']
  };
  // Manchas que n\u00e3o s\u00e3o um l\u00edquido derramado: "tire o excesso com um pano" n\u00e3o se aplica.
  var SEM_PANO = ['suor', 'amarelado', 'desodorante', 'cor', 'ferrugem', 'mofo', 'lama', 'grama', 'protetor', 'agua-sanitaria', 'amaciante', 'cera', 'chiclete'];
  var CORES_PECA = ['Branca', 'Clara', 'Colorida', 'Escura'];
  // 08/11/2026 (pergunta 672): o texto antes do resultado tambem diz de qual pagina veio.
  var MSG_FOTO = 'Ol\u00e1! Vim pelo site, pelo diagn\u00f3stico de manchas. Vou mandar a foto da mancha para saber se sai, o prazo e o pre\u00e7o.';

  /* ---------- Utilidades ---------- */
  function normalizar(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function minuscula(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function acharPeca(id) {
    for (var i = 0; i < PECAS.length; i++) if (PECAS[i].id === id) return PECAS[i];
    return null;
  }
  function acharMancha(id) {
    for (var i = 0; i < MANCHAS.length; i++) if (MANCHAS[i].id === id) return MANCHAS[i];
    return null;
  }
  function acharProblema(peca, id) {
    if (!peca) return null;
    for (var i = 0; i < peca.problemas.length; i++) if (peca.problemas[i].id === id) return peca.problemas[i];
    return null;
  }
  function problemaDaMancha(peca, manchaId) {
    if (!peca) return null;
    var lista = problemasOrdenados(peca);
    for (var i = 0; i < lista.length; i++) if (lista[i].manchas.indexOf(manchaId) >= 0) return lista[i];
    return null;
  }
  function servePara(m, peca) { return !m.nao || m.nao.indexOf(peca.id) < 0; }
  function problemasOrdenados(peca) {
    return peca.problemas.map(function (p, i) { return { p: p, i: i }; })
      .sort(function (a, b) { return (NIVEIS[a.p.nivel].ordem - NIVEIS[b.p.nivel].ordem) || (a.i - b.i); })
      .map(function (x) { return x.p; });
  }
  function linkWhats(msg) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg); }
  function evento(nome, dados) {
    try { if (typeof window.gtag === 'function') window.gtag('event', nome, dados || {}); } catch (e) { /* sem medi\u00e7\u00e3o */ }
  }

  /* Cria elementos sem innerHTML: h('p', {class: 'x'}, 'texto', filho, ...) */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null || attrs[k] === false) continue;
        if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
        else if (k === 'class') el.className = attrs[k];
        else el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
      }
    }
    for (var i = 2; i < arguments.length; i++) anexar(el, arguments[i]);
    return el;
  }
  function anexar(el, filho) {
    if (filho == null || filho === false) return;
    if (Array.isArray(filho)) { filho.forEach(function (f) { anexar(el, f); }); return; }
    el.appendChild(typeof filho === 'string' ? document.createTextNode(filho) : filho);
  }

  /* ---------- Resultado: problema da tabela, mancha por fam\u00edlia ou mancha desconhecida ---------- */
  function resolver(peca, chave) {
    if (!peca || !chave) return null;
    var pr = acharProblema(peca, chave);
    if (pr) return { tipo: 'problema', chave: pr.id, peca: peca, titulo: pr.nome + ' em ' + minuscula(peca.nome), nome: pr.nome, pr: pr, familia: familiaDoProblema(pr) };
    if (chave === 'm-desconhecida') {
      return {
        tipo: 'desconhecida', chave: chave, peca: peca, nome: 'Mancha desconhecida', titulo: 'Mancha desconhecida em ' + minuscula(peca.nome),
        pr: {
          nivel: 'logo', urgencia: 'Quanto antes, melhor',
          acontece: 'Sem saber o que \u00e9 a mancha, qualquer produto caseiro pode fix\u00e1-la ou tirar a cor do tecido.',
          fazer: ['N\u00e3o aplique nenhum produto: s\u00f3 encoste um pano limpo, se a mancha ainda estiver \u00famida.', 'Mande a foto pelo WhatsApp e conte onde a pe\u00e7a esteve e o que pode ter ca\u00eddo.', F.levarLogo, F.ateLevar],
          evitar: [F.esfregar, '\u00c1gua quente.', F.calor].concat(peca.caseiro || [])
        }
      };
    }
    if (chave.indexOf('m-') === 0) {
      var m = acharMancha(chave.slice(2));
      if (!m) return null;
      var especifico = problemaDaMancha(peca, m.id);
      if (especifico) return resolver(peca, especifico.id);
      var titulo = m.familia === 'dano' ? peca.nome + ': ' + minuscula(m.nome) : m.nome + ' em ' + minuscula(peca.nome);
      return { tipo: 'mancha', chave: chave, peca: peca, nome: m.nome, titulo: titulo, pr: problemaGenerico(peca, m), familia: FAMILIAS[m.familia].seitz ? m.familia : null, mancha: m };
    }
    return null;
  }

  function familiaDoProblema(pr) {
    var conta = {};
    (pr.manchas || []).forEach(function (id) { var m = acharMancha(id); if (m && FAMILIAS[m.familia].seitz) conta[m.familia] = (conta[m.familia] || 0) + 1; });
    var fams = Object.keys(conta);
    return fams.length === 1 ? fams[0] : null;
  }

  /* Mancha que n\u00e3o est\u00e1 na tabela do guia: orienta\u00e7\u00e3o pela fam\u00edlia da mancha. */
  function problemaGenerico(peca, m) {
    // Dano no tecido, e a \u00e1gua sanit\u00e1ria, que tira a cor: n\u00e3o h\u00e1 o que correr, \u00e9 caso de avaliar.
    if (m.familia === 'dano' || m.id === 'agua-sanitaria') {
      return {
        nivel: 'dificil', urgencia: 'Leve para avalia\u00e7\u00e3o',
        acontece: m.dica || null,
        fazer: [F.avaliar, 'Se preferir, mande antes a foto da pe\u00e7a e da etiqueta pelo WhatsApp.'],
        evitar: []
      };
    }
    var evitar = [F.esfregar];
    if (m.familia === 'tanino') evitar.push(F.quenteTanino);
    if (m.familia === 'proteina') evitar.push(F.quenteProteina);
    evitar.push(F.calor);
    if (m.id === 'ferrugem' || m.id === 'protetor') evitar.push('\u00c1gua sanit\u00e1ria: escurece ou fixa a mancha.');
    if (m.id === 'maquiagem' || m.id === 'batom') evitar.push('Demaquilante: cria uma segunda mancha, de \u00f3leo.');
    // O que o guia da pe\u00e7a manda evitar, sem repetir a \u00e1gua quente que a fam\u00edlia j\u00e1 trouxe.
    var temQuente = m.familia === 'tanino' || m.familia === 'proteina';
    (peca.caseiro || []).forEach(function (t) {
      if (evitar.indexOf(t) < 0 && !(temQuente && t.indexOf('\u00c1gua quente') === 0)) evitar.push(t);
    });
    if (peca.maquinaNao) evitar.push('Lavar na m\u00e1quina de casa.');

    if (m.id === 'mofo') {
      return {
        nivel: 'urgente', urgencia: 'Quanto antes, de prefer\u00eancia em at\u00e9 24 horas',
        acontece: 'Mofo \u00e9 o problema que mais chega \u00e0 Dedicada em veludo, couro, peles e pel\u00facias; quanto antes a pe\u00e7a for lavada, maior a chance de sair.',
        fazer: [F.mofoNaoEscovar, F.levar24, F.mofoGuardar],
        evitar: [F.plastico, F.umida]
      };
    }
    var fam = FAMILIAS[m.familia];
    return {
      nivel: 'logo', urgencia: 'Quanto antes, melhor',
      acontece: m.dica || (fam && fam.seitz
        ? '\u00c9 uma mancha ' + fam.singular + ': pede um tira-manchas pr\u00f3prio, diferente do usado nas outras fam\u00edlias de manchas.'
        : null),
      fazer: (SEM_PANO.indexOf(m.id) >= 0 ? [] : [F.pano]).concat([F.levarLogo, F.ateLevar]),
      evitar: evitar
    };
  }

  /* ---------- Busca em linguagem natural ----------
   * "vinho na camisa branca": acha a mancha (vinho), a pe\u00e7a (camisa) e a cor (branca).
   * Entende plural, falta de acento e um erro de digita\u00e7\u00e3o em palavras de 5 letras ou mais.
   * GENERICAS: palavras que n\u00e3o dizem o tecido; a busca oferece as pe\u00e7as poss\u00edveis.
   * CORES: a cor da pe\u00e7a vai junto na mensagem do WhatsApp. */
  var GENERICAS = {
    blusa: ['camisas', 'seda', 'linho', 'viscose', 'sinteticos', 'la'],
    blusinha: ['camisas', 'seda', 'linho', 'viscose', 'sinteticos', 'la'],
    vestido: ['festa-noiva', 'seda', 'linho', 'viscose'],
    calca: ['jeans', 'alfaiataria', 'linho', 'veludo', 'couro', 'sinteticos'],
    saia: ['linho', 'seda', 'couro', 'viscose', 'festa-noiva'],
    casaco: ['la', 'couro', 'jaquetas', 'peles'],
    jaqueta: ['jaquetas', 'couro', 'jeans'],
    short: ['jeans', 'linho', 'sinteticos'],
    bermuda: ['jeans', 'linho', 'sinteticos'],
    macacao: ['jeans', 'linho', 'viscose', 'jaquetas'],
    pijama: ['camisas', 'seda', 'viscose'],
    malha: ['camisas', 'viscose', 'sinteticos'],
    toalha: ['roupa-de-cama', 'mesa'],
    roupa: [], peca: [], tecido: []
  };
  var CORES = {
    branca: 'Branca', branco: 'Branca', clara: 'Clara', claro: 'Clara', bege: 'Clara', creme: 'Clara', 'off white': 'Clara',
    colorida: 'Colorida', colorido: 'Colorida', estampada: 'Colorida', estampado: 'Colorida',
    preta: 'Escura', preto: 'Escura', escura: 'Escura', escuro: 'Escura', 'azul marinho': 'Escura'
  };
  var LIGA = ['de', 'da', 'do', 'em', 'na', 'no', 'com'];
  /* O que a Dedicada n\u00e3o lava (resposta do dono, 29/09/2026): a busca avisa em vez de sugerir.
   * peca: onde fica o que a Dedicada lava do mesmo tipo (a capa do sof\u00e1, o protetor do colch\u00e3o). */
  var NAO_LAVA = [
    { termos: ['camurca', 'suede'], texto: 'A Dedicada n\u00e3o lava pe\u00e7as de camur\u00e7a.' },
    { termos: ['bolsa'], texto: 'A Dedicada n\u00e3o lava bolsas.' },
    { termos: ['sofa', 'estofado'], texto: 'A Dedicada n\u00e3o lava sof\u00e1s nem estofados. Capas e mantas de sof\u00e1, sim.', peca: 'roupa-de-cama' },
    { termos: ['colchao'], texto: 'A Dedicada n\u00e3o lava colch\u00f5es. Protetor de colch\u00e3o, sim.', peca: 'roupa-de-cama' },
    { termos: ['tapete grande', 'tapete medio', 'tapetao'], texto: 'A Dedicada lava tapetes pequenos e m\u00e9dios, de sala ou passadeira. Tapete grande, n\u00e3o.' }
  ];

  function singular(w) { return w.length > 3 && /s$/.test(w) && !/(is|us|ss)$/.test(w) ? w.slice(0, -1) : w; }
  function palavras(texto) { return normalizar(texto).split(' ').filter(Boolean).map(singular); }
  // Dist\u00e2ncia de no m\u00e1ximo uma letra: troca, falta, sobra ou duas letras invertidas ("vihno").
  function quaseIgual(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    if (a.length === b.length) {
      return a.slice(i + 1) === b.slice(i + 1) ||
        (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
    }
    return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
  }
  // 3: palavra igual \u00b7 2: um erro de digita\u00e7\u00e3o \u00b7 1: come\u00e7o da \u00faltima palavra, ainda sendo digitada
  function compara(qw, tw, digitando) {
    if (qw === tw) return 3;
    if (qw.length >= 5 && tw.length >= 5 && quaseIgual(qw, tw)) return 2;
    if (digitando && qw.length >= 3 && tw.indexOf(qw) === 0) return 1;
    return 0;
  }
  // Onde o termo (lista de palavras) aparece na frase: { n, ini, fim } do melhor encaixe.
  function encaixe(q, termo, aberta) {
    var melhor = null;
    for (var i = 0; i + termo.length <= q.length; i++) {
      var n = 3;
      for (var k = 0; k < termo.length && n; k++) {
        var digitando = aberta && i + k === q.length - 1 && k === termo.length - 1;
        n = Math.min(n, compara(q[i + k], termo[k], digitando));
      }
      if (!n) continue;
      // "l\u00e3" e "PU" s\u00f3 valem sozinhos ou depois de "de", "na"...: "fui l\u00e1" n\u00e3o \u00e9 l\u00e3.
      if (termo.length === 1 && termo[0].length <= 2 && q.length > 1 && LIGA.indexOf(q[i - 1]) < 0) continue;
      if (!melhor || n > melhor.n) melhor = { n: n, ini: i, fim: i + termo.length };
    }
    return melhor;
  }

  var INDICE = null;
  function montarIndice() {
    INDICE = { manchas: [], pecas: [], problemas: [] };
    function termos(nome, sinonimos) {
      return [nome].concat(sinonimos || []).map(palavras).filter(function (t) { return t.length; });
    }
    MANCHAS.forEach(function (m) { INDICE.manchas.push({ alvo: m, termos: termos(m.nome, m.sinonimos) }); });
    PECAS.forEach(function (p) {
      INDICE.pecas.push({ alvo: p, termos: termos(p.nome, p.sinonimos) });
      p.problemas.forEach(function (pr) { INDICE.problemas.push({ alvo: { p: p, pr: pr }, termos: termos(pr.nome), nome: normalizar(pr.nome) }); });
    });
  }

  /* L\u00ea a frase e devolve o que entendeu: { manchas, pecas, candidatas, generica, problemas, cor }. */
  function analisar(texto) {
    if (!INDICE) montarIndice();
    var bruto = String(texto || '');
    var q = palavras(bruto);
    var aberta = !/\s$/.test(bruto);
    var achados = [];
    function testa(tipo, x) {
      var melhor = null;
      x.termos.forEach(function (t) {
        var e = encaixe(q, t, aberta);
        if (e && (!melhor || e.n > melhor.n || (e.n === melhor.n && e.fim - e.ini > melhor.fim - melhor.ini))) melhor = e;
      });
      // O que n\u00e3o lava s\u00f3 vale com a palavra exata ("bolso" n\u00e3o \u00e9 "bolsa").
      if (melhor && (tipo !== 'naoLava' || melhor.n === 3)) achados.push({ tipo: tipo, alvo: x.alvo, n: melhor.n, ini: melhor.ini, fim: melhor.fim });
    }
    if (q.length) {
      INDICE.manchas.forEach(function (x) { testa('mancha', x); });
      INDICE.pecas.forEach(function (x) { testa('peca', x); });
      INDICE.problemas.forEach(function (x) { testa('problema', x); });
      Object.keys(GENERICAS).forEach(function (g) { testa('generica', { alvo: g, termos: [palavras(g)] }); });
      Object.keys(CORES).forEach(function (c) { testa('cor', { alvo: CORES[c], termos: [palavras(c)] }); });
      NAO_LAVA.forEach(function (x) { testa('naoLava', { alvo: x, termos: x.termos.map(palavras) }); });
    }
    // Fica de fora o que est\u00e1 dentro de um termo maior ("cal\u00e7a" em "cal\u00e7a jeans", "clara" em
    // "clara de ovo") e o encaixe aproximado onde h\u00e1 um exato. Problema s\u00f3 tira a cor.
    achados = achados.filter(function (a) {
      return !achados.some(function (b) {
        if (b === a || (b.tipo === 'problema' && a.tipo !== 'cor')) return false;
        var contem = b.ini <= a.ini && b.fim >= a.fim && (b.fim - b.ini) > (a.fim - a.ini) && b.n >= a.n;
        var cruza = b.ini < a.fim && a.ini < b.fim;
        return contem || (cruza && b.n > a.n);
      });
    });
    // "mancha branca na camisa preta": a cor logo depois de "mancha" \u00e9 a da mancha, n\u00e3o a da pe\u00e7a.
    achados = achados.filter(function (a) { return a.tipo !== 'cor' || q[a.ini - 1] !== 'mancha'; });
    achados.sort(function (a, b) { return (b.n - a.n) || ((b.fim - b.ini) - (a.fim - a.ini)) || (a.ini - b.ini); });
    function doTipo(t) { return achados.filter(function (a) { return a.tipo === t; }).map(function (a) { return a.alvo; }); }
    var genericas = doTipo('generica');
    var candidatas = [];
    genericas.forEach(function (g) {
      GENERICAS[g].forEach(function (id) { var p = acharPeca(id); if (p && candidatas.indexOf(p) < 0) candidatas.push(p); });
    });
    var problemas = doTipo('problema');
    // Sem nada inteiro, ainda acha o problema pelo nome enquanto a pessoa digita ("riscos").
    if (!achados.length) {
      var ws = normalizar(bruto).split(' ').filter(function (w) { return w.length >= 4; });
      if (ws.length) {
        INDICE.problemas.forEach(function (x) {
          if (ws.every(function (w) { return x.nome.indexOf(w) >= 0; })) problemas.push(x.alvo);
        });
      }
    }
    return {
      manchas: doTipo('mancha'), pecas: doTipo('peca'), generica: genericas[0] || null,
      candidatas: candidatas, problemas: problemas, cor: doTipo('cor')[0] || null, naoLava: doTipo('naoLava')[0] || null
    };
  }

  /* Sugest\u00f5es a partir do que a busca entendeu, da mais prov\u00e1vel para a menos. */
  function sugestoes(a) {
    var itens = [];
    // Item que a Dedicada n\u00e3o lava ("bolsa de couro", "sof\u00e1"): s\u00f3 o aviso. "Capa de sof\u00e1" n\u00e3o cai
    // aqui, porque o termo maior da roupa de cama engole a palavra "sof\u00e1".
    if (a.naoLava) return itens;
    function add(item) { if (item && !itens.some(function (i) { return i.hash === item.hash; })) itens.push(item); }
    function doResultado(p, m) {
      if (!servePara(m, p)) return null;
      var r = resolver(p, 'm-' + m.id);
      return r && { rotulo: r.nome, detalhe: p.nome, hash: '#' + p.id + '/' + r.chave, nivel: r.pr.nivel };
    }
    var pecas = a.pecas.length ? a.pecas.slice(0, 3) : a.candidatas;
    var daPeca = a.problemas.filter(function (x) { return pecas.indexOf(x.p) >= 0; });
    daPeca.forEach(function (x) { add({ rotulo: x.pr.nome, detalhe: x.p.nome, hash: '#' + x.p.id + '/' + x.pr.id, nivel: x.pr.nivel }); });

    if (a.manchas.length && pecas.length) {
      pecas.forEach(function (p) {
        a.manchas.slice(0, a.pecas.length ? 2 : 1).forEach(function (m) { add(doResultado(p, m)); });
      });
      if (!a.pecas.length) add({ rotulo: a.manchas[0].nome, detalhe: 'Em outra pe\u00e7a', hash: '#m-' + a.manchas[0].id, nivel: null });
      // Problema que n\u00e3o faz sentido na pe\u00e7a (bolinhas no couro): oferece a pe\u00e7a.
      if (!itens.length) pecas.forEach(function (p) { add({ rotulo: p.nome, detalhe: 'Ver os problemas mais comuns', hash: '#' + p.id, nivel: null }); });
    } else if (a.manchas.length) {
      a.manchas.slice(0, 2).forEach(function (m) {
        add({ rotulo: m.nome, detalhe: 'Escolha a pe\u00e7a manchada', hash: '#m-' + m.id, nivel: null });
      });
      a.manchas.slice(0, 2).forEach(function (m) {
        PECAS.forEach(function (p) {
          var pr = problemaDaMancha(p, m.id);
          if (pr && NIVEIS[pr.nivel].ordem <= 3) add({ rotulo: pr.nome, detalhe: p.nome, hash: '#' + p.id + '/' + pr.id, nivel: pr.nivel });
        });
      });
    } else if (pecas.length) {
      pecas.forEach(function (p) {
        add({ rotulo: p.nome, detalhe: p.problemas.length ? 'Ver os problemas mais comuns' : 'Escolher a mancha', hash: '#' + p.id, nivel: null });
      });
    }
    if (!pecas.length) a.problemas.forEach(function (x) { add({ rotulo: x.pr.nome, detalhe: x.p.nome, hash: '#' + x.p.id + '/' + x.pr.id, nivel: x.pr.nivel }); });
    return itens.slice(0, 8);
  }
  function buscar(texto) { return sugestoes(analisar(texto)); }

  /* ---------- Grau de urg\u00eancia e tempo da mancha ---------- */
  function grau(nivel) {
    var n = NIVEIS[nivel], g = GRAUS[n.grupo];
    return { grupo: n.grupo, rotulo: n.rotulo || g.rotulo, prazo: n.prazo || g.prazo, tom: g.tom };
  }
  function acharTempo(id) {
    for (var i = 0; i < TEMPOS.length; i++) if (TEMPOS[i].id === id) return TEMPOS[i];
    return null;
  }
  // O tempo s\u00f3 muda a resposta em mancha. Em dano (encolheu, bolhas, brilho de ferro), no que n\u00e3o sai na
  // lavagem e nos problemas que n\u00e3o s\u00e3o mancha (pedrarias, saia sem volume), n\u00e3o h\u00e1 o que correr.
  // Tamb\u00e9m n\u00e3o se pergunta "quando aconteceu" no que se acumula com o uso, e n\u00e3o cai de uma vez: suor, amarelado,
  // desodorante e cheiro (o guia j\u00e1 manda o que fazer; "j\u00e1 tentou tirar em casa?" fica nos chips do resultado).
  var CONDICOES = ['suor', 'amarelado', 'desodorante', 'cheiro'];
  function manchaDeIncidente(id) { var m = acharMancha(id); return !!m && m.familia !== 'dano' && CONDICOES.indexOf(m.id) < 0; }
  function pedeTempo(r) {
    if (!r) return false;
    if (r.tipo === 'desconhecida') return true;
    if (r.mancha) return manchaDeIncidente(r.mancha.id);
    if (NIVEIS[r.pr.nivel].grupo === 'avaliar') return false;
    return (r.pr.manchas || []).some(manchaDeIncidente);
  }
  // A resposta do resultado, j\u00e1 ajustada ao tempo da mancha (null = sem o passo do tempo).
  function aplicarTempo(r, tempo) {
    var pr = r.pr, g = grau(pr.nivel);
    var v = { nivel: pr.nivel, grupo: g.grupo, rotulo: g.rotulo, prazo: g.prazo, tom: g.tom, acontece: pr.acontece,
      fazer: (pr.fazer || []).slice(), evitar: (pr.evitar || []).slice(), dedicada: pr.dedicada, nota: null,
      prevencao: g.grupo === 'avaliar' && (pr.fazer || []).some(function (t) { return /^(Da pr\u00f3xima vez|Na pr\u00f3xima|Antes de lavar outro)/.test(t); }) };
    if (!tempo) return v;
    if (tempo.id === 'fresca') { v.nota = T.fresca; return v; }
    if (tempo.id === 'seca') {
      var tinhaPrazo = false;
      // Quando o guia manda lavar em casa (barro, len\u00e7ol amarelado), os passos ficam; s\u00f3 o "tire o excesso" e o prazo mudam.
      var lavaEmCasa = v.fazer.some(function (t) { return /\b(lave|lavar|molhe|detergente|alvejante|escova)/i.test(t); });
      v.fazer = v.fazer.filter(function (t) { return !/excesso|ainda estiver \u00famida/i.test(t); }).map(function (t) {
        if (/em (menos de|at\u00e9) (24|48) horas/.test(t) || t === F.levarLogo) { tinhaPrazo = true; return T.secaLevar; }
        return t;
      });
      if (!tinhaPrazo) v.fazer.push(T.secaLevar);
      if (!lavaEmCasa) v.fazer.unshift(T.secaFazer);
      v.prazo = 'Leve quanto antes';
      return v;
    }
    // J\u00e1 lavada ou passada a ferro: a chance cai muito; \u00e9 caso de avaliar.
    v.grupo = 'avaliar'; v.rotulo = GRAUS.avaliar.rotulo; v.prazo = GRAUS.avaliar.prazo; v.tom = GRAUS.avaliar.tom;
    v.acontece = T.fixadaAcontece; v.fazer = T.fixadaFazer.slice(); v.nota = null; v.prevencao = false;
    return v;
  }

  /* ---------- Estado na URL ----------
   * #seda \u00b7 #seda/vinho-tinto (passo 3, quando aconteceu) \u00b7 #seda/vinho-tinto/fresca (resultado)
   * #seda/m-caneta/seca \u00b7 #la/feltragem (dano: sem o passo do tempo) \u00b7 #m-caneta (mancha, falta a pe\u00e7a) */
  function lerEstado(hash) {
    var bruto = hash === undefined ? location.hash : hash;
    var partes = decodeURIComponent((bruto || '').replace(/^#\/?/, '')).split('/');
    var e = { peca: null, resultado: null, mancha: null, tempo: null };
    if (partes[0].indexOf('m-') === 0) { e.mancha = acharMancha(partes[0].slice(2)); return e; }
    e.peca = acharPeca(partes[0]);
    if (e.peca && partes[1]) e.resultado = resolver(e.peca, partes[1]);
    if (e.resultado && partes[2] && pedeTempo(e.resultado)) e.tempo = acharTempo(partes[2]);
    return e;
  }
  function hashDe(e) {
    if (!e.peca) return e.mancha ? '#m-' + e.mancha.id : '';
    var h = '#' + e.peca.id;
    if (e.resultado) h += '/' + e.resultado.chave;
    if (e.tempo) h += '/' + e.tempo.id;
    return h;
  }
  // \u00c2ncora de uma se\u00e7\u00e3o da p\u00e1gina (ex.: #onde-levar), e n\u00e3o um passo da ferramenta.
  function ehAncoraDaPagina(hash) {
    if (!hash || hash.length < 2) return false;
    var e = lerEstado(hash);
    if (e.peca || e.mancha) return false;
    try { return !!document.getElementById(decodeURIComponent(hash.slice(1))); } catch (err) { return false; }
  }
  // Troca o endere\u00e7o sem recarregar. Onde o navegador n\u00e3o deixa (algumas pr\u00e9-visualiza\u00e7\u00f5es),
  // usa o pr\u00f3prio #, que tamb\u00e9m funciona com o bot\u00e3o voltar.
  function mudarUrl(hash, substituir) {
    try {
      var url = hash || (location.pathname + location.search);
      if (substituir) history.replaceState(null, '', url); else history.pushState(null, '', url);
    } catch (e) {
      try { if (substituir) location.replace(hash || '#'); else location.hash = hash; } catch (e2) { /* segue sem mudar o endere\u00e7o */ }
    }
  }
  function irPara(hash, substituir) {
    var atual = location.hash || '';
    if (hash === atual) { desenhar(true); return; }
    mudarUrl(hash, substituir);
    desenhar(true);
  }

  /* ---------- Desenho ---------- */
  var raiz, avisoLeitor, ultimoHash = null, corDaBusca = null, primeiroDesenho = true;
  var contexto = { tentou: null, cor: null };

  // Rola at\u00e9 a ferramenta. Na chegada por link (primeiro desenho, como vindo de uma p\u00e1gina de servi\u00e7o ou de um post), salto
  // direto, como o navegador faz com uma \u00e2ncora; nos passos seguintes, rolagem suave. Se a suave n\u00e3o andar (h\u00e1 navegadores
  // que a ignoram), salto direto depois de 600 ms.
  function rolarAte(el) {
    var suave = !primeiroDesenho && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var antes = window.pageYOffset;
    el.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' });
    if (!suave) return;
    setTimeout(function () {
      var t = el.getBoundingClientRect().top;
      if (window.pageYOffset === antes && (t < 0 || t > window.innerHeight * 0.6)) el.scrollIntoView({ block: 'start' });
    }, 600);
  }

  function desenhar(mudouPasso) {
    var e = lerEstado();
    // Mancha que tem problema pr\u00f3prio na pe\u00e7a, ou tempo que n\u00e3o se aplica: usa o endere\u00e7o certo.
    var certo = hashDe(e);
    if ((e.peca || e.mancha) && certo !== location.hash) mudarUrl(certo, true);
    ultimoHash = location.hash;
    var comTempo = pedeTempo(e.resultado);
    var total = e.resultado && !comTempo ? 3 : 4;
    var passo = !e.peca ? 1 : !e.resultado ? 2 : (comTempo && !e.tempo) ? 3 : total;
    // Respostas do "Mande a foto" valem s\u00f3 para este resultado; a cor pode vir da busca.
    if (passo === total) { contexto = { tentou: null, cor: corDaBusca }; corDaBusca = null; }
    var tela = passo === 1 ? telaPeca(e.mancha) : passo === 2 ? telaProblema(e.peca) : passo === 3 && comTempo ? telaTempo(e.resultado) : telaResultado(e.resultado, e.tempo);

    raiz.textContent = '';
    raiz.appendChild(etapas(passo, total, e));
    raiz.appendChild(tela);
    raiz.setAttribute('data-passo', String(passo));

    if (passo === 2) evento('dm_peca', { peca: e.peca.id });
    if (passo === 3 && comTempo) evento('dm_tempo_pergunta', { peca: e.peca.id, problema: e.resultado.chave });
    if (passo === total) evento('dm_resultado', { peca: e.peca.id, problema: e.resultado.chave, tipo: e.resultado.tipo, tempo: e.tempo ? e.tempo.id : 'nao_se_aplica' });

    if (mudouPasso) {
      var titulo = raiz.querySelector('.dm-titulo');
      avisoLeitor.textContent = 'Passo ' + passo + ' de ' + total + '. ' + (titulo ? titulo.textContent : '');
      var topo = raiz.getBoundingClientRect().top;
      if (topo < 0 || topo > window.innerHeight * 0.6) rolarAte(raiz);
      if (titulo) titulo.focus({ preventScroll: true });
    }
    primeiroDesenho = false;
  }

  function etapas(passo, total, e) {
    var valorProblema = e.resultado ? e.resultado.nome : e.mancha ? e.mancha.nome : null;
    var itens = [
      { n: 1, rotulo: 'Pe\u00e7a', valor: e.peca && e.peca.nome, ir: function () { irPara(''); } },
      { n: 2, rotulo: 'Problema', valor: valorProblema, ir: function () { irPara(e.peca ? '#' + e.peca.id : ''); } }
    ];
    if (total === 4) itens.push({ n: 3, rotulo: 'Quando', valor: e.tempo && e.tempo.curto, ir: function () { irPara('#' + e.peca.id + '/' + e.resultado.chave); } });
    itens.push({ n: total, rotulo: 'O que fazer', valor: null, ir: null });
    return h('ol', { class: 'dm-etapas dm-etapas--' + total, 'aria-label': 'Passos do diagn\u00f3stico' },
      itens.map(function (it) {
        var st = it.n < passo ? 'feito' : it.n === passo ? 'atual' : 'depois';
        var mostraValor = it.valor && (st === 'feito' || (it.n === 2 && e.mancha));
        var miolo = [
          h('span', { class: 'dm-etapa-num', 'aria-hidden': 'true' }, String(it.n)),
          h('span', { class: 'dm-etapa-txt' },
            h('span', { class: 'dm-etapa-rotulo' }, it.rotulo),
            mostraValor ? h('span', { class: 'dm-etapa-valor' }, it.valor) : null)
        ];
        return h('li', { class: 'dm-etapa dm-etapa--' + st, 'aria-current': st === 'atual' ? 'step' : null },
          st === 'feito' && it.ir
            ? h('button', { type: 'button', class: 'dm-etapa-btn', onclick: it.ir, 'aria-label': 'Voltar ao passo ' + it.n + ': ' + it.rotulo + (it.valor ? ' (' + it.valor + ')' : '') }, miolo)
            : h('span', { class: 'dm-etapa-btn' }, miolo));
      }));
  }

  function botaoFoto(msg, classe, texto, aoClicar) {
    return h('a', { class: 'dm-btn dm-btn--primario dm-btn--whats' + (classe ? ' ' + classe : ''), href: linkWhats(msg), target: '_blank', rel: 'noopener', onclick: aoClicar || null }, texto || 'Mande a foto pelo WhatsApp');
  }

  /* Passo 1: a pe\u00e7a (com busca em linguagem natural) */
  function telaPeca(mancha) {
    var lista = h('ul', { class: 'dm-sugestoes', role: 'list', id: 'dm-sugestoes', 'aria-live': 'polite' });
    var campo = h('input', {
      id: 'dm-q', class: 'dm-campo', type: 'search', autocomplete: 'off', enterkeyhint: 'search',
      placeholder: 'Ex.: vinho na camisa branca', 'aria-describedby': 'dm-q-dica', 'aria-controls': 'dm-sugestoes'
    });
    var itens = [], analise = null;
    function ir(it) {
      evento('dm_busca', { termo: campo.value.slice(0, 40) });
      corDaBusca = analise && analise.cor;
      irPara(it.hash);
    }
    function entendi(a) {
      var partes = [];
      if (a.manchas.length) partes.push((a.manchas[0].familia === 'dano' ? 'problema: ' : 'mancha: ') + minuscula(a.manchas[0].nome));
      if (a.pecas.length) partes.push('pe\u00e7a: ' + minuscula(a.pecas[0].nome));
      else if (a.generica) partes.push('pe\u00e7a: ' + a.generica + (a.candidatas.length ? ' (escolha o tecido)' : ''));
      if (a.cor) partes.push('cor: ' + minuscula(a.cor));
      return partes.length > 1 ? h('li', { class: 'dm-entendi' }, 'Entendi ' + partes.join(' \u00b7 ')) : null;
    }
    function atualizar() {
      analise = analisar(campo.value);
      itens = sugestoes(analise);
      lista.textContent = '';
      if (!campo.value.trim()) return;
      if (analise.naoLava) {
        var alt = analise.naoLava.peca && acharPeca(analise.naoLava.peca);
        lista.appendChild(h('li', { class: 'dm-nao-lava' }, h('strong', null, analise.naoLava.texto), ' ',
          alt ? h('a', { href: '#' + alt.id, onclick: function (ev) { ev.preventDefault(); irPara('#' + alt.id); } }, 'Ver ' + minuscula(alt.nome)) : null,
          alt ? '. ' : '',
          h('a', { href: linkWhats('Ol\u00e1! Vim pelo site, pelo diagn\u00f3stico de manchas. Tenho uma d\u00favida: ' + campo.value), target: '_blank', rel: 'noopener' }, 'D\u00favidas? Fale pelo WhatsApp'), '.'));
      }
      if (!itens.length) {
        if (analise.naoLava) return;
        var soPeca = analise.generica || analise.cor;
        lista.appendChild(h('li', { class: 'dm-sugestao-vazia' },
          soPeca ? 'Conte tamb\u00e9m o que manchou e a pe\u00e7a, por exemplo: caf\u00e9 na camisa branca. Ou escolha a pe\u00e7a abaixo, ou ' : 'Nada encontrado. Escolha a pe\u00e7a abaixo ou ',
          h('a', { href: linkWhats('Ol\u00e1! Vim pelo site, pelo diagn\u00f3stico de manchas. N\u00e3o achei o meu caso: ' + campo.value + '. Vou mandar a foto.'), target: '_blank', rel: 'noopener' }, 'mande a foto pelo WhatsApp'), '.'));
        return;
      }
      anexar(lista, entendi(analise));
      itens.forEach(function (it) {
        lista.appendChild(h('li', null, h('a', {
          class: 'dm-sugestao', href: it.hash,
          onclick: function (ev) { ev.preventDefault(); ir(it); }
        }, h('span', { class: 'dm-sugestao-nome' }, it.rotulo), h('span', { class: 'dm-sugestao-det' }, it.detalhe),
          it.nivel ? selo(it.nivel) : null)));
      });
    }
    campo.addEventListener('input', atualizar);
    campo.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter') return;
      ev.preventDefault();
      atualizar();
      if (itens.length) ir(itens[0]);
    });

    return h('section', { class: 'dm-tela', 'aria-labelledby': 'dm-t1' },
      h('h2', { class: 'dm-titulo', id: 'dm-t1', tabindex: '-1' }, 'Qual \u00e9 a pe\u00e7a?'),
      mancha
        ? h('div', { class: 'dm-contexto' },
          h('p', null, h('strong', null, (mancha.familia === 'dano' ? 'Problema: ' : 'Mancha: ') + mancha.nome + '. '), 'Agora escolha a pe\u00e7a.'),
          h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(''); } }, 'Trocar'))
        : h('div', { class: 'dm-busca', role: 'search' },
          h('label', { for: 'dm-q', class: 'dm-busca-rotulo' }, 'O que aconteceu? Escreva a mancha e a pe\u00e7a'),
          campo,
          h('p', { id: 'dm-q-dica', class: 'dm-so-leitor' }, 'As sugest\u00f5es aparecem abaixo do campo enquanto voc\u00ea digita. Enter abre a primeira.'),
          lista),
      h('p', { class: 'dm-dica' }, mancha ? 'Toque na pe\u00e7a manchada.' : 'Ou escolha a pe\u00e7a. N\u00e3o sabe o tecido? Veja a etiqueta.'),
      GRUPOS.map(function (g) {
        var pecas = PECAS.filter(function (p) { return p.grupo === g.id; });
        return h('div', { class: 'dm-grupo' },
          h('h3', { class: 'dm-grupo-nome' }, g.nome),
          h('ul', { class: 'dm-grade', role: 'list' }, pecas.map(function (p) {
            var img = null;
            if (p.foto !== false) {
              img = h('img', { class: 'dm-cartao-img', src: FOTOS + 'dm-' + p.id + '.webp', alt: '', width: '320', height: '200', loading: 'lazy', decoding: 'async' });
              img.addEventListener('error', function () { img.remove(); });
            }
            return h('li', null, h('button', {
              type: 'button', class: 'dm-cartao' + (img ? '' : ' dm-cartao--sem-foto'),
              onclick: function () { irPara('#' + p.id + (mancha ? '/m-' + mancha.id : '')); }
            }, img, h('span', { class: 'dm-cartao-txt' },
              h('span', { class: 'dm-cartao-nome' }, p.nome),
              h('span', { class: 'dm-cartao-sub' }, p.exemplos))));
          })));
      }),
      h('p', { class: 'dm-rodape-tela' }, 'N\u00e3o encontrou a pe\u00e7a? ',
        h('a', { href: linkWhats('Ol\u00e1! Vim pelo site, pelo diagn\u00f3stico de manchas. N\u00e3o encontrei a minha pe\u00e7a. Vou mandar a foto para saber se a mancha sai, o prazo e o pre\u00e7o.'), target: '_blank', rel: 'noopener' }, 'Mande a foto pelo WhatsApp'), '.')
    );
  }

  function selo(nivel) {
    var g = grau(nivel);
    return h('span', { class: 'dm-selo dm-selo--' + g.tom }, g.rotulo);
  }
  function seloDe(v) { return h('span', { class: 'dm-selo dm-selo--' + v.tom }, v.rotulo); }

  function nomeDoGuia(peca) { return peca.semGuia ? 'Cuidados por Tecido' : 'Guia de ' + minuscula(peca.nome); }

  /* Passo 2: o problema */
  function telaProblema(peca) {
    var familias = ['gordura', 'proteina', 'tanino', 'outras', 'dano'];
    var temTabela = peca.problemas.length > 0;
    var escolha = h(temTabela ? 'details' : 'div', { class: 'dm-outra' + (temTabela ? '' : ' dm-outra--aberta') },
      temTabela ? h('summary', null, 'Outra mancha ou dano? Escolha pelo tipo') : null,
      h('p', { class: 'dm-outra-dica' }, 'Cada fam\u00edlia de mancha pede um tira-manchas diferente.'),
      familias.map(function (fid) {
        var fam = FAMILIAS[fid];
        var ms = MANCHAS.filter(function (m) { return m.familia === fid && servePara(m, peca); });
        return h('div', { class: 'dm-familia' },
          h('h3', { class: 'dm-familia-nome' }, fam.nome),
          h('ul', { class: 'dm-chips', role: 'list' }, ms.map(function (m) {
            return h('li', null, h('button', { type: 'button', class: 'dm-chip', onclick: function () { irPara('#' + peca.id + '/m-' + m.id); } }, m.nome));
          })));
      }));
    return h('section', { class: 'dm-tela', 'aria-labelledby': 'dm-t2' },
      h('h2', { class: 'dm-titulo', id: 'dm-t2', tabindex: '-1' }, 'Qual \u00e9 o problema?'),
      temTabela
        ? [h('p', { class: 'dm-dica' }, 'Os problemas que mais chegam \u00e0 Dedicada em ' + minuscula(peca.nome) + ', do mais urgente ao menos urgente.'),
          h('ul', { class: 'dm-lista', role: 'list' }, problemasOrdenados(peca).map(function (pr) {
            return h('li', null, h('button', { type: 'button', class: 'dm-opcao', onclick: function () { irPara('#' + peca.id + '/' + pr.id); } },
              h('span', { class: 'dm-opcao-nome' }, pr.nome), selo(pr.nivel)));
          }))]
        : h('p', { class: 'dm-dica' }, 'Escolha a mancha ou o dano pelo tipo.'),
      escolha,
      h('ul', { class: 'dm-lista dm-lista--extra', role: 'list' },
        h('li', null, h('button', { type: 'button', class: 'dm-opcao dm-opcao--leve', onclick: function () { irPara('#' + peca.id + '/m-desconhecida'); } },
          h('span', { class: 'dm-opcao-nome' }, 'N\u00e3o sei o que \u00e9 a mancha'), h('span', { class: 'dm-seta', 'aria-hidden': 'true' }, '\u2192')))),
      h('div', { class: 'dm-nao-achei' },
        h('p', null, h('strong', null, 'Prefere mostrar? '), 'Mande a foto da pe\u00e7a pelo WhatsApp: a equipe diz se sai, o prazo e o pre\u00e7o' + (peca.semGuia ? '.' : '. Ou leia o guia completo.')),
        h('div', { class: 'dm-acoes' },
          botaoFoto('Ol\u00e1! Vim pelo site, pelo diagn\u00f3stico de manchas. Vou mandar a foto de uma mancha em ' + minuscula(peca.nome) + ' para saber se sai, o prazo e o pre\u00e7o.'),
          h('a', { class: 'dm-btn', href: peca.guia }, nomeDoGuia(peca)))),
      h('p', { class: 'dm-voltar' }, h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(''); } }, '\u2190 Escolher outra pe\u00e7a'))
    );
  }

  /* Passo 3: quando aconteceu (s\u00f3 em mancha) */
  function telaTempo(r) {
    var peca = r.peca;
    return h('section', { class: 'dm-tela dm-tempo', 'aria-labelledby': 'dm-t3' },
      h('h2', { class: 'dm-titulo', id: 'dm-t3', tabindex: '-1' }, 'Quando aconteceu?'),
      h('p', { class: 'dm-dica' }, r.titulo + '. A resposta muda com o tempo: mancha fresca sai mais; seca ainda pode sair; j\u00e1 lavada ou passada a ferro, a chance cai muito.'),
      h('ul', { class: 'dm-lista', role: 'list' }, TEMPOS.map(function (t) {
        return h('li', null, h('button', { type: 'button', class: 'dm-opcao dm-opcao--tempo', onclick: function () {
          evento('dm_tempo', { peca: peca.id, problema: r.chave, tempo: t.id });
          irPara('#' + peca.id + '/' + r.chave + '/' + t.id);
        } },
          h('span', { class: 'dm-opcao-nome' }, t.rotulo), h('span', { class: 'dm-opcao-det' }, t.det)));
      })),
      h('p', { class: 'dm-voltar' }, h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara('#' + peca.id); } }, '\u2190 Outro problema'))
    );
  }

  function lista(tag, itens, classe) {
    if (!itens || !itens.length) return null;
    return h(tag, { class: classe }, itens.map(function (t) { return h('li', null, t); }));
  }

  // Mensagem pronta, uma informa\u00e7\u00e3o por linha, com o link do resultado que a pessoa viu (o mesmo padr\u00e3o das p\u00e1ginas de servi\u00e7o).
  // 08/11/2026 (passo 27): abre dizendo de onde veio, leva o grau que a pessoa viu e termina com o bairro em branco.
  function mensagemWhats(r, tempo) {
    // Mancha de verdade (nao dano como encolheu, desbotou ou feltrou): "se a mancha sai"; senao, "se tem solucao".
    var ids = r.tipo === 'desconhecida' ? null : (r.tipo === 'mancha' ? [r.chave.slice(2)] : (r.mancha ? [r.mancha.id] : ((r.pr && r.pr.manchas) || [])));
    var mancha = ids === null || ids.some(function (id) { var m = acharMancha(id); return m && m.familia !== 'dano'; });
    var linhas = ['Ol\u00e1! Vim pelo site, pelo diagn\u00f3stico de manchas, e quero saber ' + (mancha ? 'se a mancha sai' : 'se tem solu\u00e7\u00e3o') + ', o prazo e o pre\u00e7o. Vou mandar a foto.', '', 'Pe\u00e7a: ' + r.peca.nome, 'Problema: ' + r.nome];
    if (tempo) linhas.push('Quando aconteceu: ' + tempo.whats);
    if (contexto.cor) linhas.push('Cor da pe\u00e7a: ' + minuscula(contexto.cor));
    if (contexto.tentou) linhas.push(contexto.tentou === 'Sim' ? 'J\u00e1 tentei tirar em casa.' : 'Ainda n\u00e3o tentei nada em casa.');
    var v = null;
    try { v = aplicarTempo(r, tempo); } catch (e) { v = null; }
    if (v && !v.prevencao && v.rotulo) linhas.push('Diagn\u00f3stico do site: ' + v.rotulo + (v.prazo ? ' (' + minuscula(v.prazo) + ')' : ''));
    linhas.push('Resultado que vi: ' + PAGINA + '#' + r.peca.id + '/' + r.chave + (tempo ? '/' + tempo.id : ''));
    linhas.push('Bairro:');
    return linhas.join('\n');
  }

  // Posts do blog e p\u00e1ginas de servi\u00e7o ligados \u00e0 mancha do resultado e ao tecido.
  function leituras(r) {
    var chaves = [];
    var ids = r.mancha ? [r.mancha.id] : (r.pr.manchas || []);
    ids.forEach(function (id) {
      var m = acharMancha(id);
      if (m && m.leia) chaves.push(m.leia);
      if (POSTS_REVISADOS_NO_AR) chaves = chaves.concat(LEIA_REVISADOS.manchas[id] || []);
    });
    chaves = chaves.concat(r.peca.leia || [], POSTS_REVISADOS_NO_AR ? (LEIA_REVISADOS.pecas[r.peca.id] || []) : []);
    return chaves.filter(function (k, i) { return BLOG[k] && chaves.indexOf(k) === i; }).map(function (k) { return BLOG[k]; });
  }

  /* \u00daltimo passo: o que fazer */
  function telaResultado(r, tempo) {
    var peca = r.peca, v = aplicarTempo(r, tempo);
    var pessoa = PESSOAS[peca.assina];
    var fam = r.familia && FAMILIAS[r.familia];
    var leia = leituras(r);
    var expresso = EXPRESSO[peca.expresso] || peca.expresso;
    var botaoWhats = botaoFoto(mensagemWhats(r, tempo), 'dm-btn--final', null, function () { evento('dm_whatsapp', { peca: peca.id, problema: r.chave, tempo: tempo ? tempo.id : 'nao_se_aplica' }); });
    function atualizarWhats() { botaoWhats.setAttribute('href', linkWhats(mensagemWhats(r, tempo))); }
    function grupoChips(rotulo, opcoes, chaveCtx) {
      return h('div', { class: 'dm-pergunta', role: 'group', 'aria-label': rotulo },
        h('p', { class: 'dm-pergunta-rotulo' }, rotulo),
        h('div', { class: 'dm-chips' }, opcoes.map(function (op) {
          var b = h('button', { type: 'button', class: 'dm-chip', 'aria-pressed': contexto[chaveCtx] === op ? 'true' : 'false' }, op);
          b.addEventListener('click', function () {
            var ativo = contexto[chaveCtx] === op;
            contexto[chaveCtx] = ativo ? null : op;
            Array.prototype.forEach.call(b.parentNode.children, function (x) { x.setAttribute('aria-pressed', 'false'); });
            if (!ativo) b.setAttribute('aria-pressed', 'true');
            atualizarWhats();
          });
          return b;
        })));
    }
    var compartilhar = null;
    if (navigator.share || (navigator.clipboard && navigator.clipboard.writeText)) {
      compartilhar = h('button', { type: 'button', class: 'dm-link', onclick: function (ev) {
        var url = location.href, botao = ev.currentTarget;
        function copiar() {
          if (!navigator.clipboard) return;
          navigator.clipboard.writeText(url).then(function () { botao.textContent = 'Link copiado'; }, function () {});
        }
        if (navigator.share) { navigator.share({ title: r.titulo + ' | Dedicada Lavanderia', url: url }).catch(copiar); return; }
        copiar();
      } }, navigator.share ? 'Compartilhar' : 'Copiar link');
    }
    var hubLink = h('a', { href: HUB_COLETA }, 'Veja o dia do seu bairro');

    return h('section', { class: 'dm-tela dm-resultado', 'aria-labelledby': 'dm-t3' },
      h('h2', { class: 'dm-titulo', id: 'dm-t3', tabindex: '-1' }, r.titulo),
      tempo ? h('p', { class: 'dm-subtitulo' }, tempo.nome + ': ' + minuscula(tempo.rotulo) + '.') : null,

      h('div', { class: 'dm-alerta dm-alerta--' + v.tom },
        h('div', { class: 'dm-alerta-topo' }, seloDe(v), h('strong', { class: 'dm-alerta-urg' }, v.prazo)),
        v.acontece ? h('p', { class: 'dm-alerta-txt' }, v.acontece) : null,
        v.nota ? h('p', { class: 'dm-alerta-txt' }, v.nota) : null),

      h('div', { class: 'dm-bloco' },
        h('h3', null, v.prevencao ? 'Como evitar da pr\u00f3xima vez' : 'O que fazer agora'),
        lista('ol', v.fazer, 'dm-passos')),

      v.evitar.length ? h('div', { class: 'dm-bloco' },
        h('h3', null, 'O que n\u00e3o fazer'),
        lista('ul', v.evitar, 'dm-evitar')) : null,

      v.prevencao ? null : h('div', { class: 'dm-bloco dm-quando' },
        h('h3', null, 'Quando trazer'),
        h('p', null, h('strong', null, v.prazo + '.'), ' ', COLETA, ' ', hubLink, '.'),
        h('p', { 'data-dm-preco': 'Expresso: ' + expresso }, dedPreco('Expresso: ' + expresso))),

      peca.nota ? h('p', { class: 'dm-nota-tecido' }, h('strong', null, 'Sobre a pe\u00e7a: '), peca.nota) : null,

      h('p', { class: 'dm-maquina' }, h('strong', null, 'Pode ir na m\u00e1quina de casa? '), peca.maquina),

      h('div', { class: 'dm-bloco dm-dedicada' },
        h('h3', null, 'Como a Dedicada trata'),
        v.dedicada ? h('p', null, v.dedicada) : null,
        fam ? h('p', { class: 'dm-familia-nota' }, '\u00c9 uma mancha ' + fam.singular + ', como ' + fam.exemplos + '. Na Dedicada, cada fam\u00edlia de mancha tem o seu tira-manchas da Seitz (V1, V2 ou V3), e cada mancha \u00e9 tratada na sua vez, antes da lavagem.') : null,
        h('details', { class: 'dm-processo' },
          h('summary', null, 'Ver as ' + peca.processo.length + ' etapas do processo'),
          lista('ol', peca.processo, 'dm-passos')),
        h('dl', { class: 'dm-fatos' },
          h('div', null, h('dt', null, 'Prazo'), h('dd', null, peca.prazo)),
          h('div', null, h('dt', null, 'Pre\u00e7o'), h('dd', { 'data-dm-preco': peca.preco }, dedPreco(peca.preco))))),

      pessoa && peca.fala ? h('figure', { class: 'dm-fala' },
        h('img', { class: 'dm-fala-foto', src: pessoa.foto, alt: pessoa.nome, width: '56', height: '56', loading: 'lazy' }),
        h('div', null,
          h('blockquote', null, h('p', null, '\u201c' + peca.fala + '\u201d')),
          h('figcaption', null, pessoa.nome + ', ' + pessoa.papel))) : null,

      h('div', { class: 'dm-contato' },
        h('h3', null, 'Mande a foto'),
        h('p', { class: 'dm-contato-dica' }, 'A equipe olha a foto e responde se a mancha sai, o prazo e o pre\u00e7o. Se quiser, conte mais; as respostas v\u00e3o junto na mensagem.'),
        grupoChips('J\u00e1 tentou tirar em casa?', ['N\u00e3o', 'Sim'], 'tentou'),
        grupoChips('Cor da pe\u00e7a?', CORES_PECA, 'cor'),
        h('div', { class: 'dm-acoes dm-acoes--final' },
          botaoWhats,
          h('a', { class: 'dm-btn', href: peca.guia }, nomeDoGuia(peca)))),

      leia.length ? h('div', { class: 'dm-leia' },
        h('h3', null, 'Leia tamb\u00e9m'),
        h('ul', null, leia.map(function (b) { return h('li', null, h('a', { href: SITE + b[0] }, b[1])); }))) : null,

      h('div', { class: 'dm-navegar' },
        h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara('#' + peca.id); } }, '\u2190 Outro problema'),
        tempo ? h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara('#' + peca.id + '/' + r.chave); } }, 'Mudar quando aconteceu') : null,
        compartilhar,
        h('button', { type: 'button', class: 'dm-link', onclick: function () { irPara(''); } }, 'Come\u00e7ar de novo'))
    );
  }

  /* ---------- Textos da p\u00e1gina (se\u00e7\u00e3o "Mancha por mancha"), gerados do mesmo banco da ferramenta ----------
   * Usado s\u00f3 pelo gerador da p\u00e1gina (build_diagnostico.py, via Node); n\u00e3o roda no navegador. */
  function textosMancha(m) {
    var fam = FAMILIAS[m.familia];
    var casos = [];
    PECAS.forEach(function (p) {
      if (p.semGuia || !servePara(m, p)) return;
      var pr = problemaDaMancha(p, m.id);
      if (pr) casos.push({ peca: p.id, nome: p.nome, guia: p.guia, chave: pr.id, problema: pr.nome, nivel: pr.nivel, grupo: NIVEIS[pr.nivel].grupo, ordem: NIVEIS[pr.nivel].ordem, prazo: grau(pr.nivel).prazo });
    });
    casos.sort(function (a, b) { return a.ordem - b.ordem; });
    var dano = m.familia === 'dano';
    var semPano = SEM_PANO.indexOf(m.id) >= 0;
    var primeiro = fam.primeiro;
    if (semPano && m.familia === 'proteina') primeiro = 'N\u00e3o use \u00e1gua quente: o calor fixa sangue, suor e comida.';
    if (semPano && m.familia === 'tanino') primeiro = 'N\u00e3o use \u00e1gua quente, que fixa manchas de caf\u00e9, ch\u00e1 e vinho.';
    if (semPano && m.familia === 'gordura') primeiro = 'N\u00e3o use \u00e1lcool, acetona nem removedor: em couro e em detalhes sint\u00e9ticos, eles tiram a cor ou dissolvem o material.';
    // Sem caso nos guias, vale o que a ferramenta responde: dano e \u00e1gua sanit\u00e1ria, avaliar; o resto, em at\u00e9 48 horas.
    var quando = casos.length ? grau(casos[0].nivel).prazo : (dano || m.id === 'agua-sanitaria' ? GRAUS.avaliar.prazo : GRAUS.breve.prazo);
    return {
      id: m.id, nome: m.nome, familia: m.familia, familiaNome: fam.nome, dano: dano, dica: m.dica || null, leia: m.leia ? BLOG[m.leia] : null,
      leiaRevisados: (LEIA_REVISADOS.manchas[m.id] || []).map(function (k) { return BLOG[k]; }).filter(Boolean),
      fresca: dano ? null : primeiro + (m.dica && m.dica !== primeiro ? ' ' + m.dica : ''),
      seca: dano ? null : T.secaFazer + ' ' + T.secaLevar,
      fixada: dano ? null : T.fixadaAcontece + ' ' + T.fixadaFazer[1],
      quando: quando,
      casos: casos
    };
  }

  /* ---------- Confer\u00eancia do banco (usada no teste e pelo gerador da p\u00e1gina) ---------- */
  function validar() {
    var erros = [], avisos = [], ids = {};
    MANCHAS.forEach(function (m) {
      if (ids['m-' + m.id]) erros.push('Mancha repetida: ' + m.id);
      ids['m-' + m.id] = true;
      if (!FAMILIAS[m.familia]) erros.push('Mancha ' + m.id + ': fam\u00edlia inv\u00e1lida');
      if (m.leia && !BLOG[m.leia]) erros.push('Mancha ' + m.id + ': post do blog inexistente ' + m.leia);
      (LEIA_REVISADOS.manchas[m.id] || []).forEach(function (k) { if (!BLOG_REVISADOS[k]) erros.push('Mancha ' + m.id + ': post revisado inexistente ' + k); });
    });
    Object.keys(NIVEIS).forEach(function (k) { if (!GRAUS[NIVEIS[k].grupo]) erros.push('N\u00edvel ' + k + ': grau inexistente'); });
    PECAS.forEach(function (p) {
      if (ids[p.id]) erros.push('Pe\u00e7a repetida: ' + p.id);
      ids[p.id] = true;
      ['nome', 'grupo', 'exemplos', 'guia', 'maquina', 'prazo', 'preco', 'expresso'].forEach(function (c) { if (!p[c]) erros.push(p.id + ': falta ' + c); });
      if (!GRUPOS.some(function (g) { return g.id === p.grupo; })) erros.push(p.id + ': grupo inexistente');
      if (!p.semGuia) {
        if (!PESSOAS[p.assina]) erros.push(p.id + ': quem assina n\u00e3o existe');
        if (!p.fala) avisos.push(p.id + ': sem fala');
        if (!p.problemas.length) erros.push(p.id + ': pe\u00e7a com guia sem tabela de problemas');
      }
      (p.leia || []).forEach(function (k) { if (!BLOG[k]) erros.push(p.id + ': post do blog inexistente ' + k); });
      (LEIA_REVISADOS.pecas[p.id] || []).forEach(function (k) { if (!BLOG_REVISADOS[k]) erros.push(p.id + ': post revisado inexistente ' + k); });
      if (!p.processo || p.processo.length < 2) erros.push(p.id + ': processo incompleto');
      if (/50%/.test(p.expresso) || /50%/.test(p.preco)) erros.push(p.id + ': percentual escrito \u00e0 m\u00e3o; use {expresso_pct}');
      var idsPr = {};
      p.problemas.forEach(function (pr) {
        var k = p.id + '/' + pr.id;
        if (idsPr[pr.id]) erros.push(k + ': problema repetido');
        idsPr[pr.id] = true;
        if (pr.id.indexOf('m-') === 0) erros.push(k + ': id n\u00e3o pode come\u00e7ar com m-');
        if (!pr.nome || !pr.urgencia || !pr.acontece) erros.push(k + ': falta nome, urg\u00eancia ou "o que acontece"');
        if (!NIVEIS[pr.nivel]) erros.push(k + ': n\u00edvel inv\u00e1lido');
        if (!pr.fazer || !pr.fazer.length) erros.push(k + ': falta o que fazer');
        if (!Array.isArray(pr.manchas)) erros.push(k + ': manchas deve ser uma lista');
        var f = (pr.fazer || []).join(' '), u = pr.urgencia || '';
        var uMenos = /menos de 24/.test(u), u24 = !uMenos && /\(24h\)|24 horas/.test(u), u48 = /48/.test(u);
        if (uMenos !== /menos de 24 horas/.test(f) || u24 !== /at\u00e9 24 horas/.test(f) || u48 !== /48 horas/.test(f)) {
          erros.push(k + ': o prazo em "o que fazer" n\u00e3o bate com a urg\u00eancia do guia');
        }
        (pr.manchas || []).forEach(function (m) { if (!acharMancha(m)) erros.push(k + ': mancha desconhecida ' + m); });
      });
    });
    Object.keys(EXPRESSO).forEach(function (k) { if (/50%/.test(EXPRESSO[k])) erros.push('EXPRESSO.' + k + ': percentual escrito \u00e0 m\u00e3o; use {expresso_pct}'); });
    return { erros: erros, avisos: avisos };
  }

  /* Exposto para o teste, para o gerador da p\u00e1gina e para confer\u00eancia no console. */
  window.DM_DIAGNOSTICO = {
    PECAS: PECAS, GRUPOS: GRUPOS, MANCHAS: MANCHAS, FAMILIAS: FAMILIAS, NIVEIS: NIVEIS, GRAUS: GRAUS, TEMPOS: TEMPOS, T: T, F: F, PESSOAS: PESSOAS,
    BLOG: BLOG, BLOG_REVISADOS: BLOG_REVISADOS, LEIA_REVISADOS: LEIA_REVISADOS, SITE: SITE, EXPRESSO: EXPRESSO, COLETA: COLETA, HUB_COLETA: HUB_COLETA, MSG_FOTO: MSG_FOTO, DM_PRECOS_PADRAO: DM_PRECOS_PADRAO,
    validar: validar, buscar: buscar, analisar: analisar, resolver: resolver, problemasOrdenados: problemasOrdenados,
    problemaDaMancha: problemaDaMancha, grau: grau, pedeTempo: pedeTempo, aplicarTempo: aplicarTempo, textosMancha: textosMancha, dedPreco: dedPreco, mensagemWhats: mensagemWhats
  };

  function iniciar() {
    raiz = document.getElementById('dm-app');
    if (!raiz) return;
    raiz.classList.add('dm-app');
    raiz.setAttribute('data-js', 'ok');
    var semJs = raiz.querySelector('.dm-sem-js');
    if (semJs) semJs.remove();
    avisoLeitor = h('p', { class: 'dm-so-leitor', 'aria-live': 'polite' });
    raiz.parentNode.insertBefore(avisoLeitor, raiz.nextSibling);
    function aoMudarUrl() {
      if (location.hash === ultimoHash) return;
      if (ehAncoraDaPagina(location.hash)) { ultimoHash = location.hash; return; } // como #onde-levar
      desenhar(true);
    }
    window.addEventListener('popstate', aoMudarUrl);
    window.addEventListener('hashchange', aoMudarUrl);
    var inicial = !!location.hash && !ehAncoraDaPagina(location.hash);
    desenhar(inicial);
  }

  if (typeof document === 'undefined' || !document.getElementById) return;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
