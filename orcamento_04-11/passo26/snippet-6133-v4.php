/*
 * Dedicada Lavanderia · Orçamento (motor e página /orcamento/; versão sem o agente A2A, resposta 543 de 04/11/2026)
 * Montado em 2026-11-08 por agente-ia/ferramentas/montar.mjs (versão 1.2.0-orcamento; tabela de preços lida em 2026-11-01).
 *
 * O QUE FAZ
 *   Mostra a simulação de orçamento da página /orcamento/ (shortcode [dedicada_orcamento]): a
 *   pessoa marca as peças e vê a estimativa "a partir de", o prazo, o pacote e o dia da coleta
 *   grátis do bairro; o botão monta a mensagem do WhatsApp com as peças, o bairro e um código de
 *   origem (SITE-), sem dados pessoais. Nada de IA, banco de dados próprio, CRM ou integração com
 *   o WhatsApp. Nesta versão o agente A2A (endereço /a2a/v1) NÃO é ligado: as funções dele seguem
 *   no arquivo, mas nenhuma é chamada (dla_iniciar não liga dla_rotear).
 *
 * REGRAS FIXAS
 *   - Preço sempre "a partir de"; o valor final sai na vistoria da peça.
 *   - Pedido, agendamento e qualquer negociação são com a equipe, no WhatsApp.
 *   - Nenhum preço, prazo, bairro, desconto ou garantia que não esteja no site.
 *   - Não pede nome, telefone nem endereço.
 *
 * PREÇOS SEMPRE IGUAIS AOS DO SITE
 *   Duas vezes por dia o código lê a tabela publicada em /servicos/ (a mesma que as pessoas veem,
 *   que sai do Painel > Preços) e passa a usar os valores de lá. Se a leitura falhar, usa a tabela
 *   embutida, com a data dela. Ferramentas > Orçamento mostra a situação e as diferenças.
 *
 * INSTALAÇÃO: agente-ia/PASSAGEM-PARA-O-DESKTOP.md. Não edite este arquivo à mão: ele é montado por
 * agente-ia/ferramentas/montar.mjs a partir de agente-ia/fonte/agente.php e de agente-ia/dados/.
 */

if ( ! function_exists( 'dla_rotear' ) ) {

	/* ---------- Ajustes ---------- */
	define( 'DLA_VERSAO', '1.2.0-orcamento' );
	define( 'DLA_CAMINHO', '/a2a/v1' );           // endereço do agente (não ligado nesta versão)
	define( 'DLA_LIMITE_BYTES', 16384 );          // tamanho máximo de um pedido (16 KB)
	define( 'DLA_LIMITE_TEXTO', 4000 );           // caracteres de texto lidos por pedido
	define( 'DLA_LIMITE_PEDIDOS', 30 );           // pedidos por origem...
	define( 'DLA_JANELA', 600 );                  // ...a cada 10 minutos
	define( 'DLA_REGISTRO_MAX', 2000 );           // linhas guardadas no registro
	define( 'DLA_FUSO', 'America/Sao_Paulo' );

	/** Dados embutidos: tabela de /servicos/ lida em 2026-11-01 e textos de dados/atendimento.json. */
	function dla_dados_base() {
		static $d = null;
		if ( null === $d ) {
			$d = json_decode( <<<'DLAJSON'
{"tabelaEm":"2026-11-01","empresa":{"nome":"Dedicada Lavanderia","cidade":"Florianópolis (SC)","desde":2003,"site":"https://dedicadalavanderia.com.br","whatsapp":"5548984280639","whatsappExibicao":"(48) 98428-0639","email":"contato@dedicadalavanderia.com.br","logo":"https://dedicadalavanderia.com.br/wp-content/uploads/2026/06/lavanderia-florianopolis-dedicada.png"},"paginas":{"precos":"https://dedicadalavanderia.com.br/servicos/","coleta":"https://dedicadalavanderia.com.br/lavanderia-coleta-e-entrega-em-florianopolis/","orcamento":"https://dedicadalavanderia.com.br/orcamento/","pacotes":"https://dedicadalavanderia.com.br/pacotes/","expresso":"https://dedicadalavanderia.com.br/servicos/lavanderia-expressa-em-florianopolis/","empresas":"https://dedicadalavanderia.com.br/para-empresas/","airbnb":"https://dedicadalavanderia.com.br/servicos/lavanderia-para-airbnb-em-florianopolis/","manchas":"https://dedicadalavanderia.com.br/diagnostico-de-manchas/","pagamento":"https://dedicadalavanderia.com.br/como-funciona/","garantia":"https://dedicadalavanderia.com.br/garantia/","desconto":"https://dedicadalavanderia.com.br/convenios/","faq":"https://dedicadalavanderia.com.br/faq-perguntas-frequentes/","assistentes":"https://dedicadalavanderia.com.br/para-assistentes-de-ia/","passar":"https://dedicadalavanderia.com.br/servicos/passadoria-de-roupas-em-florianopolis/"},"lojas":[{"id":"centro","nome":"Loja do Centro","endereco":"Rua Germano Wendhausen, 286, Centro, Florianópolis (SC), CEP 88015-460","referencia":"ao lado do Beiramar Shopping","mapa":"https://www.google.com/maps?cid=12049800564194816433","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-centro-de-florianopolis/"},{"id":"santa-monica","nome":"Loja do Santa Mônica","endereco":"Rua Dr. Agostinho Sielski, 44, Santa Mônica, Florianópolis (SC), CEP 88035-320","referencia":"junto à Madre Benvenuta","mapa":"https://www.google.com/maps?cid=13063940176413908687","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-santa-monica/"}],"horario":"de segunda a sexta, das 8h às 18h, sem fechar para o almoço; aos sábados, das 8h às 13h","rotas":{"centro":{"nome":"Centro","dias":"de segunda a sexta, de manhã e à tarde, e aos sábados, de manhã","pedidoAte":"10h","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-centro-de-florianopolis/"},"santa-monica":{"nome":"Santa Mônica","dias":"segunda, quarta e sexta, de manhã e à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-santa-monica/"},"lagoa":{"nome":"Lagoa da Conceição","dias":"segunda, quarta e sexta, à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-na-lagoa-da-conceicao/"},"trindade":{"nome":"Trindade","dias":"segunda, quarta e sexta, à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-na-trindade/"},"itacorubi":{"nome":"Itacorubi","dias":"segunda, quarta e sexta, à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-itacorubi/"},"corrego-grande":{"nome":"Córrego Grande","dias":"segunda, quarta e sexta, à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-corrego-grande/"},"parque-sao-jorge":{"nome":"Parque São Jorge","dias":"segunda, quarta e sexta, à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-parque-sao-jorge/"},"jardim-anchieta":{"nome":"Jardim Anchieta","dias":"segunda, quarta e sexta, de manhã e à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-parque-sao-jorge/#jardim-anchieta"},"carvoeira":{"nome":"Carvoeira","dias":"segunda, quarta e sexta, à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-na-carvoeira/"},"pantanal":{"nome":"Pantanal","dias":"segunda, quarta e sexta, à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-pantanal/"},"agronomica":{"nome":"Agronômica e Beira-Mar Norte","dias":"segunda, quarta e sexta, de manhã e à tarde","pedidoAte":"10h","pagina":"https://dedicadalavanderia.com.br/lavanderia-na-agronomica/"},"jurere":{"nome":"Jurerê, Jurerê Internacional, Canajurê, Praia do Forte e Daniela","dias":"segunda, quarta, sexta e sábado, de manhã","pedidoAte":"10h","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-jurere/"},"canasvieiras":{"nome":"Canasvieiras","dias":"quarta, de manhã","pedidoAte":"10h","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-canasvieiras/"},"ratones":{"nome":"Ratones","dias":"quarta, de manhã","pedidoAte":"9h","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-ratones/"},"terca":{"nome":"João Paulo, Monte Verde, Saco Grande, Cacupé, Santo Antônio de Lisboa e Sambaqui","dias":"terça, à tarde","pedidoAte":"13h","pagina":"https://dedicadalavanderia.com.br/lavanderia-coleta-e-entrega-em-florianopolis/"},"continente":{"nome":"Estreito, Coqueiros e Campinas","dias":"quinta, de manhã","pedidoAte":"10h","pagina":"https://dedicadalavanderia.com.br/lavanderia-coleta-e-entrega-em-florianopolis/"}},"bairros":{"centro":{"nome":"Centro","onde":"no Centro","tipo":"rota","rota":"centro"},"santa-monica":{"nome":"Santa Mônica","onde":"no Santa Mônica","tipo":"rota","rota":"santa-monica"},"lagoa-da-conceicao":{"nome":"Lagoa da Conceição","onde":"na Lagoa da Conceição","tipo":"rota","rota":"lagoa"},"canto-da-lagoa":{"nome":"Canto da Lagoa","onde":"no Canto da Lagoa","tipo":"rota","rota":"lagoa"},"porto-da-lagoa":{"nome":"Porto da Lagoa","onde":"no Porto da Lagoa","tipo":"rota","rota":"lagoa"},"canto-dos-aracas":{"nome":"Canto dos Araçás","onde":"no Canto dos Araçás","tipo":"rota","rota":"lagoa"},"saulo-ramos":{"nome":"Saulo Ramos","onde":"no Saulo Ramos","tipo":"rota","rota":"lagoa","observacao":"O Saulo Ramos entra na rota da Lagoa da Conceição."},"trindade":{"nome":"Trindade","onde":"na Trindade","tipo":"rota","rota":"trindade"},"itacorubi":{"nome":"Itacorubi","onde":"no Itacorubi","tipo":"rota","rota":"itacorubi"},"corrego-grande":{"nome":"Córrego Grande","onde":"no Córrego Grande","tipo":"rota","rota":"corrego-grande"},"pocao":{"nome":"Poção","onde":"no Poção","tipo":"rota","rota":"corrego-grande","observacao":"O Poção entra na rota do Córrego Grande."},"parque-sao-jorge":{"nome":"Parque São Jorge","onde":"no Parque São Jorge","tipo":"rota","rota":"parque-sao-jorge"},"jardim-anchieta":{"nome":"Jardim Anchieta","onde":"no Jardim Anchieta","tipo":"rota","rota":"jardim-anchieta"},"carvoeira":{"nome":"Carvoeira","onde":"na Carvoeira","tipo":"rota","rota":"carvoeira"},"pantanal":{"nome":"Pantanal","onde":"no Pantanal","tipo":"rota","rota":"pantanal"},"agronomica":{"nome":"Agronômica","onde":"na Agronômica","tipo":"rota","rota":"agronomica"},"beira-mar-norte":{"nome":"Beira-Mar Norte","onde":"na Beira-Mar Norte","tipo":"rota","rota":"agronomica"},"jurere":{"nome":"Jurerê","onde":"em Jurerê","tipo":"rota","rota":"jurere"},"jurere-internacional":{"nome":"Jurerê Internacional","onde":"em Jurerê Internacional","tipo":"rota","rota":"jurere"},"canajure":{"nome":"Canajurê","onde":"em Canajurê","tipo":"rota","rota":"jurere"},"praia-do-forte":{"nome":"Praia do Forte","onde":"na Praia do Forte","tipo":"rota","rota":"jurere"},"daniela":{"nome":"Daniela","onde":"na Daniela","tipo":"rota","rota":"jurere"},"canasvieiras":{"nome":"Canasvieiras","onde":"em Canasvieiras","tipo":"rota","rota":"canasvieiras","observacao":"Em Canasvieiras, a rota atende o centro do bairro, até o trapiche."},"ratones":{"nome":"Ratones","onde":"em Ratones","tipo":"rota","rota":"ratones","observacao":"Em Ratones, a rota vai até o Villa Ratones, no começo do bairro."},"joao-paulo":{"nome":"João Paulo","onde":"no João Paulo","tipo":"rota","rota":"terca","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-joao-paulo/"},"monte-verde":{"nome":"Monte Verde","onde":"no Monte Verde","tipo":"rota","rota":"terca","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-monte-verde/"},"saco-grande":{"nome":"Saco Grande","onde":"no Saco Grande","tipo":"rota","rota":"terca","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-saco-grande/"},"cacupe":{"nome":"Cacupé","onde":"em Cacupé","tipo":"rota","rota":"terca","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-cacupe/"},"santo-antonio":{"nome":"Santo Antônio de Lisboa","onde":"em Santo Antônio de Lisboa","tipo":"rota","rota":"terca","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-santo-antonio-de-lisboa/"},"sambaqui":{"nome":"Sambaqui","onde":"em Sambaqui","tipo":"rota","rota":"terca","observacao":"Em Sambaqui, a rota atende só o começo do bairro, logo depois de Santo Antônio de Lisboa.","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-santo-antonio-de-lisboa/"},"estreito":{"nome":"Estreito","onde":"no Estreito","tipo":"rota","rota":"continente","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-estreito/"},"coloninha":{"nome":"Coloninha","onde":"na Coloninha","tipo":"rota","rota":"continente","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-estreito/"},"jardim-atlantico":{"nome":"Jardim Atlântico","onde":"no Jardim Atlântico","tipo":"rota","rota":"continente","pagina":"https://dedicadalavanderia.com.br/lavanderia-no-estreito/"},"coqueiros":{"nome":"Coqueiros","onde":"em Coqueiros","tipo":"rota","rota":"continente","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-coqueiros/"},"itaguacu":{"nome":"Itaguaçu","onde":"em Itaguaçu","tipo":"rota","rota":"continente","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-coqueiros/"},"bom-abrigo":{"nome":"Bom Abrigo","onde":"no Bom Abrigo","tipo":"rota","rota":"continente","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-coqueiros/"},"abraao":{"nome":"Abraão","onde":"no Abraão","tipo":"rota","rota":"continente","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-coqueiros/"},"campinas":{"nome":"Campinas (São José)","onde":"em Campinas (São José)","tipo":"rota","rota":"continente","observacao":"Em São José, a rota vai só até Campinas.","pagina":"https://dedicadalavanderia.com.br/lavanderia-em-campinas-sao-jose/"},"barra-da-lagoa":{"nome":"Barra da Lagoa","onde":"na Barra da Lagoa","tipo":"fora"},"joaquina":{"nome":"Joaquina","onde":"na Joaquina","tipo":"fora"},"praia-mole":{"nome":"Praia Mole","onde":"na Praia Mole","tipo":"fora"},"costa-da-lagoa":{"nome":"Costa da Lagoa","onde":"na Costa da Lagoa","tipo":"fora"},"vargem-pequena":{"nome":"Vargem Pequena","onde":"na Vargem Pequena","tipo":"fora"},"vargem-grande":{"nome":"Vargem Grande","onde":"na Vargem Grande","tipo":"fora"},"ingleses":{"nome":"Ingleses","onde":"nos Ingleses","tipo":"fora"},"santinho":{"nome":"Santinho","onde":"no Santinho","tipo":"fora"},"rio-vermelho":{"nome":"Rio Vermelho","onde":"no Rio Vermelho","tipo":"fora"},"campeche":{"nome":"Campeche","onde":"no Campeche","tipo":"fora"},"armacao":{"nome":"Armação","onde":"na Armação","tipo":"fora"},"pantano-do-sul":{"nome":"Pântano do Sul","onde":"no Pântano do Sul","tipo":"fora"},"ribeirao-da-ilha":{"nome":"Ribeirão da Ilha","onde":"no Ribeirão da Ilha","tipo":"fora"}},"pacotes":{"opcoes":[{"pecas":10,"preco":219},{"pecas":25,"preco":479},{"pecas":50,"preco":879}],"validadeDias":60,"itens":"camisa social, camiseta, polo, calça jeans, sarja e esporte, bermuda e shorts, blusa simples, pijama, moletom e roupa de ginástica"},"exemplosPreco":["camisa-social","terno","edredom-solteiro","edredom-casal","tenis","vestido-festa","lencois"],"regras":["Resposta automática, só com informações publicadas no site da Dedicada Lavanderia.","Preços “a partir de”; o valor final é confirmado na vistoria da peça, antes de começar.","Pedido, coleta, agendamento e qualquer combinação são feitos com a equipe, pelo WhatsApp.","Este agente não pede nem guarda dados pessoais."],"textos":{"abertura":"Resposta automática da Dedicada Lavanderia, em Florianópolis (SC).","avisoIngles":"Automated reply from Dedicada Lavanderia, a laundry and dry cleaner in Florianópolis, Brazil. The answer below is in Portuguese; the team also answers on WhatsApp in English, Spanish and French.","avisoEspanhol":"Respuesta automática de Dedicada Lavanderia, lavandería y tintorería en Florianópolis, Brasil. La respuesta está en portugués; el equipo también responde por WhatsApp en español, inglés y francés.","orcamentoTitulo":"Orçamento preliminar:","generico":"Para %s, usei o menor valor da tabela (%s). Outras opções: %s.","total":"Total estimado: a partir de %s.","totalSemFoto":"As peças com preço pela foto não entram nesse total.","totalSemQuilo":"As peças cobradas por quilo não entram nesse total, porque o peso é conferido na loja.","totalExpresso":"No expresso, o total fica a partir de %s.","prazoMaior":"O maior prazo é de %d dias úteis.","prazoNota":"Os prazos são em dias úteis (o sábado conta), contados do dia em que a peça entra na loja; com a coleta, a roupa volta na primeira rota do bairro depois de pronta.","pacoteSugestao":"Com %s%s, as peças do dia a dia saem por %s, %s a menos que avulsas; o crédito dos pacotes vale por %d dias.","naoLavamosEstes":"A Dedicada não lava %s.","naoLavamosLista":"A Dedicada não lava colchão, travesseiro, saco de dormir, cobertor elétrico, tapete grande nem o enchimento de almofadas (as capas, sim); bolsas, cintos, carteiras, botas, sapato social, peças de camurça, nobuck ou chamois, nem luvas (as de moto e as de neve, sim); persianas e blackout revestido de plástico; e peças que só o animal usa, como cama e roupinha de pet (o edredom de quem dorme com o pet, sim). Também não faz tingimento, retoque de cor, consertos além do botão e dos pequenos reparos antes de lavar, nem limpeza de cortina no local.","naoLavamosDuvida":"Na dúvida, mande a foto pelo WhatsApp: a equipe diz antes de buscar.","coletaBairro":"Coleta e entrega grátis %s: %s. Pedidos pelo WhatsApp até as %s entram na coleta do mesmo dia.","coletaFora":"No momento, as rotas de coleta não passam %s. Dá para deixar e retirar a roupa numa das duas lojas, pelos mesmos preços; na dúvida, mande o endereço pelo WhatsApp e a equipe confirma.","coletaGeral":"A coleta e a entrega não têm taxa nem quantidade mínima, os preços são os da loja e o pagamento pode ser na coleta ou na entrega. Os dias podem mudar em feriados; confirme pelo WhatsApp.","coletaResumo":"Coleta e entrega grátis, sem quantidade mínima, em dias fixos por bairro: Centro, de segunda a sábado; Santa Mônica, Lagoa da Conceição, Trindade, Itacorubi, Córrego Grande, Parque São Jorge, Jardim Anchieta, Carvoeira, Pantanal e Agronômica, às segundas, quartas e sextas; Jurerê, Jurerê Internacional, Canajurê, Praia do Forte e Daniela, às segundas, quartas, sextas e sábados; Canasvieiras e o começo de Ratones, às quartas; João Paulo, Monte Verde, Saco Grande, Cacupé, Santo Antônio de Lisboa e o começo de Sambaqui, às terças; Estreito, Coqueiros e Campinas (São José), às quintas. Diga o bairro para saber o dia e até que horas o pedido entra na coleta do mesmo dia.","prazos":"Os prazos são em dias úteis, e o sábado conta. Em 2 dias úteis: camisas, ternos, roupa do dia a dia, roupas finas, jaquetas e casacos de lã, edredons, cobertores e colchas, toalhas, uniformes e jalecos. Em 3: lençóis e fronhas, tênis, roupão, jaqueta de pena e impermeável, trench coat, pelúcia e kimono. Em 3 a 4: peças de festa e com bordado ou pedraria. Em 4: roupa de bebê e enxoval, robe, jogo de cama de seda, mochila e boné. Em 5: roupa de mesa, vestidos de festa, de formatura e simples, beca, rede, capas de sofá e de almofada, manta de sofá, tapete e vestes sacerdotais. Em 5 a 7: cortinas. Em 7: vestido de noiva, couro, peles, carrinho de bebê e bebê conforto, e fantasias. O prazo conta do dia em que a peça entra na loja.","expresso":"Expresso: com 50% a mais sobre a tabela, a peça que chega à loja do Santa Mônica até as 10h fica pronta no mesmo dia, às 17h (no sábado, antes das 13h); depois das 10h, no dia seguinte (no sábado, depois das 10h não há expresso). Deixada no balcão do Centro, fica pronta no dia seguinte, ou sob consulta. Não têm expresso: lençóis e fronhas, jogo de cama de seda, roupa de mesa, tênis, mochila e boné, couro e peles, vestido de noiva, cortinas, capas e mantas de sofá, tapete, rede, carrinho de bebê e bebê conforto, pelúcias, fantasias, kimono e vestes sacerdotais. Combine pelo WhatsApp antes de mandar.","pacotes":"Pacotes de peças do dia a dia, lavadas e passadas: %s, com %d dias para usar. Entram camisa social, camiseta, polo, calça jeans, sarja e esporte, bermuda e shorts, blusa simples, pijama, moletom e roupa de ginástica, misturadas como quiser; terno, edredom, vestidos, tênis, lençóis e as outras peças são cobrados pela tabela. O pacote vale também na coleta e entrega grátis.","lojas":"Lojas: Centro, na Rua Germano Wendhausen, 286, ao lado do Beiramar Shopping; e Santa Mônica, na Rua Dr. Agostinho Sielski, 44, junto à Madre Benvenuta. As duas têm estacionamento, os mesmos preços e o mesmo horário: de segunda a sexta, das 8h às 18h, sem fechar para o almoço, e aos sábados, das 8h às 13h. A roupa pode ser deixada e retirada em qualquer uma delas.","empresas":"Para empresas: uniformes, fardas e jalecos com coleta e entrega grátis nos bairros atendidos, sem quantidade mínima. A farda ou o uniforme sai a partir de %s por peça e o jaleco, a partir de %s, prontos em 2 dias úteis, passados e no cabide. Toda cobrança sai com nota fiscal, com fatura mensal ou por entrega, por Pix ou cartão.","airbnb":"Para anfitriões de Airbnb e Booking: lençóis e fronhas a partir de %s o quilo, passados e embalados por jogo, em 3 dias úteis, com fatura mensal e nota fiscal; a coleta é grátis nos bairros atendidos.","manchas":"Manchas são tratadas antes da lavagem, com o tira-manchas próprio para cada uma, sem custo a mais; o que pode não sair, a equipe avisa antes de lavar. Para saber o que fazer agora com a peça manchada, use o Diagnóstico de Manchas: https://dedicadalavanderia.com.br/diagnostico-de-manchas/","pagamento":"Não há quantidade mínima. O pagamento pode ser feito na coleta, ao deixar a roupa na loja ou quando a roupa pronta chega, por cartão de crédito ou de débito, Pix ou dinheiro.","garantia":"Garantia: se algo der errado por falha da Dedicada, a peça é relavada ou recuperada sem custo; se não houver como recuperar, a Dedicada repõe a peça (uma igual ou similar, o valor por depósito ou crédito na loja, como o cliente preferir). É preciso avisar em até 30 dias depois da entrega. Detalhes: https://dedicadalavanderia.com.br/garantia/","desconto":"Descontos publicados no site: conveniados de ACM, AMC, Apufsc (professores da UFSC), CAASC (advogados da OAB/SC), CRA-SC, CREA-SC, CRECI-SC e CRO-SC têm 10% nas lavagens a seco, informando a entidade e mostrando a carteirinha; e peça limpa que só precisa passar tem 10% de desconto sobre a tabela. Detalhes: https://dedicadalavanderia.com.br/convenios/","foto":"Fotos não são analisadas aqui: mande a foto da peça pelo WhatsApp, e a equipe diz o preço e o prazo.","precosExemplos":"Alguns preços “a partir de”: %s. A tabela completa, com o prazo e o expresso de cada peça, está em https://dedicadalavanderia.com.br/servicos/","pedirDetalhes":"Para um orçamento preliminar, diga a peça, o tecido, a quantidade, se tem mancha e o bairro, ou use a simulação do site: https://dedicadalavanderia.com.br/orcamento/","servicos":"A Dedicada Lavanderia lava, passa e lava a seco desde 2003, com lojas no Centro e no Santa Mônica, em Florianópolis, e coleta e entrega grátis nos bairros atendidos. Lava camisas e ternos, roupa do dia a dia, vestidos de festa e de noiva, roupas finas, edredons e cobertores, roupa de cama, mesa e banho, casacos e jaquetas, couro, tênis, cortinas, uniformes e jalecos, roupa de bebê, carrinho de bebê, pelúcias e fantasias. O preço é por peça, com a vistoria, o tratamento das manchas e a passadoria incluídos; só lençóis e fronhas são por quilo.","vistoria":"Os preços são “a partir de”; o valor final é confirmado na vistoria da peça, antes de começar.","fecho":"Pedido, coleta e qualquer combinação são com a equipe, pelo WhatsApp (resposta em cerca de 5 minutos, no horário das lojas): %s","dataTabela":"Preços conferidos com a tabela do site em %s.","whatsOrcamento":"Olá! Quero um orçamento (código %s): %s.","whatsGeral":"Olá! Quero falar com a Dedicada (código %s).","passar":"Só passar: peça limpa que só precisa de passadoria tem 10% de desconto sobre a tabela, em qualquer peça (no vestido de noiva, sob consulta). As lojas do Centro e do Santa Mônica também passam na hora, pelo mesmo valor com o desconto: de cerca de 8 minutos numa camisa a 1 hora ou mais num vestido de noiva; com goma, a peça não sai na hora. Para roupa de evento, avise pelo menos um dia antes.","linkOrcamento":"Para conferir as peças, ajustar e mandar pelo site: %s"},"naoLavamos":{"colchao":{"nome":"colchão"},"travesseiro":{"nome":"travesseiro"},"saco-dormir":{"nome":"saco de dormir"},"cobertor-eletrico":{"nome":"cobertor elétrico"},"tapete-grande":{"nome":"tapete grande"},"almofada":{"nome":"almofada com enchimento (a capa, sim)"},"bolsa":{"nome":"bolsa"},"cinto":{"nome":"cinto"},"carteira":{"nome":"carteira"},"botas":{"nome":"botas"},"sapato-social":{"nome":"sapato social"},"camurca":{"nome":"peças de camurça, nobuck ou chamois"},"luvas":{"nome":"luvas (as de moto e as de neve, sim)"},"persiana":{"nome":"persianas e blackout revestido de plástico"},"pet":{"nome":"peças que só o animal usa, como cama e roupinha de pet (o edredom de quem dorme com o pet, sim)"},"tingimento":{"nome":"tingimento nem retoque de cor"},"conserto":{"nome":"consertos além do botão e dos pequenos reparos antes de lavar"},"no-local":{"nome":"limpeza no local, como cortina instalada ou sofá (as capas do sofá, sim, depois de tiradas)"}},"assuntos":{"precos":["quanto custa","quanto custam","quanto sai","quanto fica","quanto cobram","quanto voces cobram","preco","precos","valor","valores","custa","custam","tabela precos","how much","price","prices","pricing","cost","costs","cuanto cuesta","cuanto cuestan","cuanto sale","precio","precios","tarifa","tarifas"],"orcamento":["orcamento","orcar","cotacao","estimativa","quote","estimate","presupuesto","cotizacion"],"coleta":["coleta","coletar","coletam","buscar","buscam","busca","buscam casa","entrega","entregam","entregar","delivery","leva traz","retirada","retiram","pickup","pick up","collect","recogida","recoger","retiro","a domicilio","domicilio","bairro","bairros","atendem","neighborhood","barrio"],"prazo":["prazo","prazos","quanto tempo","demora","demoram","quando fica pronto","quando fica pronta","fica pronto","fica pronta","ficam prontos","dias uteis","how long","turnaround","ready","cuanto tarda","cuanto demora","plazo","cuando esta listo"],"expresso":["expresso","expressa","express","urgente","urgencia","pressa","rapido","rapida","hoje","hoje mesmo","amanha","mesmo dia","same day","today","tomorrow","urgent","rush","hoy","manana","mismo dia"],"lojas":["endereco","enderecos","onde fica","onde ficam","onde voces ficam","loja","lojas","horario","horarios","abre","abrem","fecha","fecham","aberto","aberta","funcionamento","sabado","domingo","estacionamento","address","where are you","location","opening hours","open","hours","direccion","donde","abierto","ubicacion","store","tienda"],"pacotes":["pacote","pacotes","combo","combos","plano mensal","mensalidade","assinatura","toda semana","semanal","package","packages","subscription","weekly","paquete","paquetes"],"empresas":["empresa","empresas","nota fiscal","fatura","cnpj","restaurante","clinica","consultorio","business","company","factura"],"airbnb":["airbnb","booking","anfitriao","anfitrioes","aluguel temporada","pousada","hostel","vacation rental","anfitrion","imovel temporada","casa temporada"],"manchas":["mancha","manchas","manchado","manchada","manchou","tirar mancha","stain","stains"],"pagamento":["pagamento","pagar","pix","cartao","credito","debito","dinheiro","payment","pay","card","cash","tarjeta","efectivo","forma pago"],"garantia":["garantia","garante","estragou","estragar","estragaram","danificou","danificada","danificado","perderam","reclamacao","reclamar","guarantee","warranty","damaged"],"desconto":["desconto","descontos","convenio","convenios","conveniado","promocao","cupom","discount","coupon","descuento","promocion"],"servicos":["servico","servicos","o que voces lavam","o que lavam","o que voces fazem","lavagem a seco","lava a seco","lavam a seco","wet cleaning","dry cleaning","dry cleaner","services","servicios","tintoreria"],"naoLavamos":["o que nao lavam","o que voces nao lavam","nao lavam","o que voces nao fazem","nao aceitam","what you dont wash","que lavan"],"passar":["so passar","passar roupa","passar roupas","passadoria","passar hora","passam hora","engomar","engomadoria","ironing","planchar","planchado"]},"idiomas":{"pt":["quanto","custa","voces","voce","lavagem","roupa","roupas","coleta","bairro","onde","fica","preco","precos","quero","preciso","tem","fazem","lavam","edredom","obrigado","ola","oi","bom","nao","meu","minha","amanha","hoje","busca","entrega","e","de","para","com","uma","um"],"en":["the","how","much","price","prices","laundry","wash","washing","dry","cleaning","pickup","pick","delivery","where","open","hours","do","you","can","is","are","my","shirt","shirts","suit","duvet","comforter","dress","cost","what","when","near","store","please","hello","hi","and","to","for","of","a"],"es":["cuanto","cuesta","precio","precios","ropa","donde","esta","estan","recogida","domicilio","hola","favor","cuando","tintoreria","edredon","sabanas","zapatillas","abierto","quiero","necesito","tienen","hacen","barrio","manana","hoy","planchar","planchado","usted","ustedes","gracias","y","el","la","los","las","lavar","una","un"]},"numeros":{"um":1,"uma":1,"dois":2,"duas":2,"tres":3,"quatro":4,"cinco":5,"seis":6,"sete":7,"oito":8,"nove":9,"dez":10,"onze":11,"doze":12,"treze":13,"quatorze":14,"catorze":14,"quinze":15,"dezesseis":16,"dezessete":17,"dezoito":18,"dezenove":19,"vinte":20,"trinta":30,"quarenta":40,"cinquenta":50,"one":1,"two":2,"three":3,"four":4,"five":5,"six":6,"seven":7,"eight":8,"nine":9,"ten":10,"eleven":11,"twelve":12,"fifteen":15,"twenty":20,"thirty":30,"forty":40,"fifty":50,"uno":1,"una":1,"un":1,"cuatro":4,"siete":7,"ocho":8,"nueve":9,"diez":10,"once":11,"doce":12,"quince":15,"veinte":20,"treinta":30,"cuarenta":40,"cincuenta":50},"ligacao":["de","do","da","dos","das","e","em","no","na","nos","nas","para","pra","pro","com","of","the","and","for","del","y","el","los","las"],"enchimento":["par","pares","peca","pecas","unidade","unidades","kg","kgs","quilo","quilos","kilo","kilos","jogo","jogos","pieces","piece","pairs","pair","prendas","prenda","piezas","pieza","itens","item","items"],"programas":["ChatGPT-User","OAI-SearchBot","GPTBot","Claude-User","Claude-SearchBot","ClaudeBot","Perplexity-User","PerplexityBot","Google-Agent","GoogleOther","Googlebot","bingbot","Applebot","Amazonbot","meta-externalagent","DuckAssistBot","MistralAI-User","a2a-python","python-httpx","python-requests","Go-http-client","node-fetch","undici","axios","okhttp","curl","Java"],"itens":{"camisa-social":{"id":"camisa-social","curto":"Camisa social","linha":"Camisa social ou de linho, lavada e passada, no cabide ou dobrada","preco":24.9,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":37.35,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavar-e-passar-camisa-social-em-florianopolis/","pacote":true,"busca":"camisa social camisa de linho camisa camisa manga longa camisa manga curta camisa de botao dress shirt shirt camisa formal"},"camisa-polo":{"id":"camisa-polo","curto":"Camisa polo","linha":"Camisa polo, lavada e passada","preco":22.9,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":34.35,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavar-e-passar-camisa-social-em-florianopolis/","pacote":true,"busca":"camisa polo polo polo shirt chomba"},"camiseta":{"id":"camiseta","curto":"Camiseta","linha":"Camiseta ou camisa de time, lavada e passada","preco":18.9,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":28.35,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavar-e-passar-camisa-social-em-florianopolis/","pacote":true,"busca":"camiseta camisa de time camisa de futebol t shirt tshirt remera playera"},"camisa-seda":{"id":"camisa-seda","curto":"Camisa de seda","linha":"Camisa de seda, a seco","preco":45,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":67.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavar-e-passar-camisa-social-em-florianopolis/","pacote":false,"busca":"camisa de seda silk shirt"},"camisa-smoking-veludo":{"id":"camisa-smoking-veludo","curto":"Camisa de smoking ou de veludo","linha":"Camisa de smoking e camisa de veludo (o veludo, em água ou a seco, conforme a etiqueta)","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"2 dias úteis; a de veludo, conforme a peça","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"camisa de smoking camisa smoking camisa de veludo"},"terno":{"id":"terno","curto":"Terno completo","linha":"Terno completo (paletó e calça), a seco; o traje de noivo sai pelo mesmo valor","preco":91,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":136.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-terno-a-seco-em-florianopolis/","pacote":false,"busca":"terno terno completo traje de noivo suit traje"},"paleto":{"id":"paleto","curto":"Paletó ou blazer","linha":"Paletó ou blazer avulso, inclusive de linho","preco":49,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":73.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-terno-a-seco-em-florianopolis/","pacote":false,"busca":"paleto blazer blazer de linho casaco do terno"},"calca-social":{"id":"calca-social","curto":"Calça social","linha":"Calça social","preco":42,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":63,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-terno-a-seco-em-florianopolis/","pacote":false,"busca":"calca social calca de terno calca de alfaiataria dress pants pantalon de vestir"},"gravata":{"id":"gravata","curto":"Gravata","linha":"Gravata, a seco","preco":35,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":52.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-terno-a-seco-em-florianopolis/","pacote":false,"busca":"gravata tie corbata"},"colete-smoking":{"id":"colete-smoking","curto":"Colete, smoking, fraque ou tailleur","linha":"Colete social, smoking (paletó e calça) e fraque; saia de terno e tailleur","preco":null,"unidade":"peça","consulta":true,"expresso":"sim","expressoPreco":null,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-terno-a-seco-em-florianopolis/","pacote":false,"busca":"colete social colete smoking fraque tailleur saia de terno tuxedo"},"edredom-solteiro":{"id":"edredom-solteiro","curto":"Edredom solteiro","linha":"Edredom solteiro, fibra sintética","preco":69,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":103.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom solteiro edredom de solteiro single duvet twin duvet edredon individual edredon de una plaza"},"edredom-casal":{"id":"edredom-casal","curto":"Edredom casal","linha":"Edredom casal, fibra sintética","preco":94,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":141,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom casal edredom de casal double duvet edredon matrimonial edredon doble"},"edredom-queen":{"id":"edredom-queen","curto":"Edredom queen","linha":"Edredom queen, fibra sintética","preco":94,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":141,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom queen edredom queen size queen duvet edredon queen"},"edredom-king":{"id":"edredom-king","curto":"Edredom king","linha":"Edredom king, fibra sintética","preco":110,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":165,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom king edredom king size king duvet edredon king"},"edredom-pena-solteiro":{"id":"edredom-pena-solteiro","curto":"Edredom de pena solteiro","linha":"Edredom de pena solteiro","preco":160,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":240,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom de pena solteiro edredom pena solteiro edredom de plumas solteiro edredom de pluma solteiro"},"edredom-pena-casal":{"id":"edredom-pena-casal","curto":"Edredom de pena casal","linha":"Edredom de pena casal","preco":190,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":285,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom de pena casal edredom pena casal edredom de plumas casal edredom de pluma casal"},"edredom-pena-queen":{"id":"edredom-pena-queen","curto":"Edredom de pena queen","linha":"Edredom de pena queen","preco":190,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":285,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom de pena queen edredom pena queen edredom de plumas queen edredom de pluma queen"},"edredom-pena-king":{"id":"edredom-pena-king","curto":"Edredom de pena king","linha":"Edredom de pena king","preco":220,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":330,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom de pena king edredom pena king edredom de plumas king edredom de pluma king"},"edredom-la":{"id":"edredom-la","curto":"Edredom ou coberta de lã","linha":"Edredom ou coberta de lã, a seco","preco":169,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":253.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom de la coberta de la cobertor de la manta de la"},"edredom-seda":{"id":"edredom-seda","curto":"Edredom ou colcha de seda","linha":"Edredom ou colcha de seda, a seco","preco":169,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":253.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"edredom de seda colcha de seda"},"colcha-pesada":{"id":"colcha-pesada","curto":"Colcha pesada","linha":"Colcha pesada","preco":220,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":330,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"colcha pesada"},"capa-edredom":{"id":"capa-edredom","curto":"Capa de edredom","linha":"Capa de edredom","preco":69,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":103.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"busca":"capa de edredom duvet cover funda de edredon"},"edredom-pet":{"id":"edredom-pet","curto":"Edredom pet","linha":"Edredom pet: edredom, colcha, cobertor ou manta de quem dorme com o pet; pelos tirados antes, numa máquina só para edredom pet","preco":110,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":165,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-pet-em-florianopolis/","pacote":false,"busca":"edredom pet edredom do pet edredom com pelo de cachorro edredom com pelo de gato"},"edredom-pet-la-pena":{"id":"edredom-pet-la-pena","curto":"Edredom pet de lã ou de pena","linha":"Edredom pet de lã ou de pena","preco":null,"unidade":"peça","consulta":true,"expresso":"consulta","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-pet-em-florianopolis/","pacote":false,"busca":"edredom pet de la edredom pet de pena"},"capa-edredom-pet":{"id":"capa-edredom-pet","curto":"Capa de edredom usada com o pet","linha":"Capa de edredom usada com o pet, na máquina de pet","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-pet-em-florianopolis/","pacote":false,"busca":"capa de edredom pet capa de edredom do pet"},"lencois":{"id":"lencois","curto":"Lençóis e fronhas","linha":"Lençóis e fronhas (liso ou de elástico, do solteiro ao king), lavados, passados e embalados por jogo","preco":44,"unidade":"quilo","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-cama","pacote":false,"busca":"lencol fronha jogo de cama jogo de lencol roupa de cama lencol de elastico sheets bed sheets pillowcase sabana funda de almohada"},"jogo-cama-seda":{"id":"jogo-cama-seda","curto":"Jogo de cama de seda","linha":"Jogo de cama de seda, a seco, passado à mão","preco":88,"unidade":"quilo","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"4 dias úteis","prazoDias":4,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-cama","pacote":false,"busca":"jogo de cama de seda lencol de seda"},"capa-travesseiro":{"id":"capa-travesseiro","curto":"Capa de travesseiro","linha":"Capa de travesseiro ou de almofada do jogo de colcha","preco":10,"unidade":"unidade","consulta":false,"expresso":"sim","expressoPreco":15,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-cama","pacote":false,"busca":"capa de travesseiro capa de almofada do jogo de colcha"},"protetor-solteiro":{"id":"protetor-solteiro","curto":"Protetor de colchão solteiro","linha":"Protetor de colchão solteiro, inclusive impermeável","preco":69,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":103.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-cama","pacote":false,"busca":"protetor de colchao solteiro"},"protetor-casal":{"id":"protetor-casal","curto":"Protetor de colchão casal ou queen","linha":"Protetor de colchão casal ou queen","preco":89,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":133.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-cama","pacote":false,"busca":"protetor de colchao casal protetor de colchao queen"},"protetor-king":{"id":"protetor-king","curto":"Protetor de colchão king","linha":"Protetor de colchão king","preco":95,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":142.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-cama","pacote":false,"busca":"protetor de colchao king"},"saia-cama":{"id":"saia-cama","curto":"Saia de cama","linha":"Saia de cama","preco":null,"unidade":"peça","consulta":true,"expresso":"consulta","expressoPreco":null,"prazo":"pela foto","prazoDias":null,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-cama","pacote":false,"busca":"saia de cama"},"toalha-banho":{"id":"toalha-banho","curto":"Toalha de banho","linha":"Toalha de banho","preco":14,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":21,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-banho","pacote":false,"busca":"toalha de banho toalhao bath towel toalla de bano"},"toalha-rosto":{"id":"toalha-rosto","curto":"Toalha de rosto, de piso ou de mão","linha":"Toalha de rosto, de piso ou de mão (o tapete de banheiro sai pelo mesmo valor, em 3 dias úteis)","preco":8,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":12,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-banho","pacote":false,"busca":"toalha de rosto toalha de piso toalha de mao toalha de lavabo hand towel toalla de mano"},"roupao":{"id":"roupao","curto":"Roupão","linha":"Roupão","preco":35,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":52.5,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-banho","pacote":false,"busca":"roupao bathrobe"},"robe":{"id":"robe","curto":"Robe","linha":"Robe, lavado a seco","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"4 dias úteis","prazoDias":4,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"robe"},"toalha-mesa":{"id":"toalha-mesa","curto":"Toalha de mesa simples","linha":"Toalha de mesa simples e lisa, para mesa de até 6 lugares, com goma fraca, meia goma ou goma forte, a pedido, e passada à mão","preco":69,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-mesa","pacote":false,"busca":"toalha de mesa simples toalha de mesa pequena toalha de mesa lisa"},"toalha-mesa-media":{"id":"toalha-mesa-media","curto":"Toalha de mesa média","linha":"Toalha de mesa média, para 8 a 10 lugares","preco":80,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-mesa","pacote":false,"busca":"toalha de mesa media"},"toalha-mesa-grande":{"id":"toalha-mesa-grande","curto":"Toalha de mesa grande ou de banquete","linha":"Toalha de mesa grande ou de banquete","preco":110,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-mesa","pacote":false,"busca":"toalha de mesa grande toalha de banquete toalha de mesa de banquete"},"guardanapo":{"id":"guardanapo","curto":"Guardanapo ou jogo americano","linha":"Guardanapo ou jogo americano","preco":13,"unidade":"unidade","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-mesa","pacote":false,"busca":"guardanapo jogo americano napkin servilleta"},"caminho-mesa":{"id":"caminho-mesa","curto":"Caminho de mesa, toalha de bandeja ou bordada","linha":"Caminho de mesa, toalha de bandeja, toalha bordada e guardanapo de copo","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-mesa","pacote":false,"busca":"caminho de mesa toalha de bandeja toalha bordada guardanapo de copo"},"vestido-festa":{"id":"vestido-festa","curto":"Vestido de festa","linha":"Vestido de festa, de formatura ou de madrinha: tule, cetim, zibeline, seda ou com pedraria; alta costura","preco":160,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":240,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-vestido-de-festa-em-florianopolis/","pacote":false,"busca":"vestido de festa vestido de formatura vestido de madrinha vestido longo vestido de gala vestido com pedraria vestido de tule vestido de cetim vestido de seda alta costura evening dress gown vestido de fiesta"},"vestido-simples":{"id":"vestido-simples","curto":"Vestido simples","linha":"Vestido simples, de malha, linho ou algodão","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-vestido-de-festa-em-florianopolis/","pacote":false,"busca":"vestido simples vestido de malha vestido de linho vestido de algodao"},"vestido-midi":{"id":"vestido-midi","curto":"Vestido midi simples","linha":"Vestido midi simples","preco":75,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":112.5,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-vestido-de-festa-em-florianopolis/","pacote":false,"busca":"vestido midi"},"vestido-infantil":{"id":"vestido-infantil","curto":"Vestido infantil ou de daminha","linha":"Vestido de daminha, de festa infantil, de formatura do ABC, de batizado ou de primeira comunhão","preco":null,"unidade":"peça","consulta":true,"expresso":"consulta","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-vestido-de-festa-em-florianopolis/","pacote":false,"busca":"vestido de daminha vestido de festa infantil vestido infantil vestido de batizado vestido de primeira comunhao vestido de formatura do abc"},"vestido-noiva":{"id":"vestido-noiva","curto":"Vestido de noiva","linha":"Vestido de noiva, com manchas tratadas e passadoria","preco":600,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-vestido-de-noiva-em-florianopolis/","pacote":false,"busca":"vestido de noiva wedding dress bridal gown vestido de novia"},"blusa-simples":{"id":"blusa-simples","curto":"Blusa simples","linha":"Blusa simples","preco":29,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":43.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":true,"busca":"blusa simples blusa blouse"},"blusa-seda":{"id":"blusa-seda","curto":"Blusa ou regata de seda","linha":"Blusa ou regata de seda, ou blusa com detalhes","preco":45,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":67.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"blusa de seda regata de seda blusa com detalhes silk blouse"},"saia":{"id":"saia","curto":"Saia simples, de seda ou de linho","linha":"Saia simples, com pregas ou longa, de seda ou de linho","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"2 dias úteis; saia longa de festa, 3 a 4 dias úteis","prazoDias":4,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"saia saia de seda saia de linho saia longa saia plissada saia com pregas skirt falda"},"macacao":{"id":"macacao","curto":"Top, macacão ou conjunto de festa","linha":"Top, macacão, macaquinho social e conjunto de festa","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"2 dias úteis; top e conjunto de festa, 3 a 4 dias úteis","prazoDias":4,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"macacao macaquinho conjunto de festa top de seda top de festa jumpsuit"},"calca-fina":{"id":"calca-fina","curto":"Calça de seda ou de linho","linha":"Calça de seda ou de linho, calça com bordado ou pedraria e bermuda de linho ou de seda","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"2 dias úteis; com bordado ou pedraria, 3 a 4 dias úteis","prazoDias":4,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"calca de seda calca de linho calca com bordado calca com pedraria bermuda de linho bermuda de seda"},"blazer-seda":{"id":"blazer-seda","curto":"Blazer de seda ou especial","linha":"Blazer de seda e blazer especial","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"blazer de seda blazer especial"},"veludo":{"id":"veludo","curto":"Peça de veludo","linha":"Peças de veludo: blazer, calça, saia e camisa","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"conforme a peça","prazoDias":null,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"veludo peca de veludo blazer de veludo calca de veludo saia de veludo"},"cashmere":{"id":"cashmere","curto":"Pashmina, cachecol ou cashmere","linha":"Pashmina e cachecol; suéter e cardigã de cashmere","preco":69,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":103.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"pashmina cachecol cashmere caxemira sueter de cashmere cardiga de cashmere scarf bufanda"},"pijama-seda":{"id":"pijama-seda","curto":"Camisola ou pijama de seda","linha":"Camisola e pijama de seda","preco":65,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":97.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"camisola de seda pijama de seda"},"lenco-seda":{"id":"lenco-seda","curto":"Lenço ou echarpe de seda","linha":"Lenço e echarpe de seda","preco":null,"unidade":"peça","consulta":true,"expresso":"sim","expressoPreco":null,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupas-finas-em-florianopolis/","pacote":false,"busca":"lenco de seda echarpe de seda lenco echarpe foulard"},"tenis":{"id":"tenis","curto":"Tênis","linha":"Tênis, com palmilha e cadarço; tênis infantil, sapatilha, sapatênis e pantufa pelo mesmo valor; mochila e boné sob consulta","preco":85,"unidade":"par","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-tenis-em-florianopolis/","pacote":false,"busca":"tenis sapatilha sapatenis pantufa tenis infantil sneakers sneaker zapatillas zapatilla"},"jaqueta-sem-enchimento":{"id":"jaqueta-sem-enchimento","curto":"Jaqueta sem enchimento","linha":"Jaqueta sem enchimento: jeans, de moletom, de nylon ou de poliéster, corta-vento e bomber; a infantil pelo mesmo valor","preco":69,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":103.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"jaqueta sem enchimento jaqueta jeans jaqueta de moletom jaqueta de nylon jaqueta de poliester corta vento bomber jaqueta infantil windbreaker"},"jaqueta-sintetica":{"id":"jaqueta-sintetica","curto":"Jaqueta com enchimento sintético (puffer)","linha":"Jaqueta com enchimento sintético: puffer sintético e colete puffer","preco":99,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":148.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"jaqueta com enchimento puffer jaqueta puffer colete puffer jaqueta acolchoada puffer jacket"},"jaqueta-impermeavel":{"id":"jaqueta-impermeavel","curto":"Jaqueta impermeável","linha":"Jaqueta impermeável, em programa da Seitz, com secagem completa","preco":99,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":148.5,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"jaqueta impermeavel capa de chuva raincoat anorak"},"jaqueta-pena":{"id":"jaqueta-pena","curto":"Jaqueta de pena ou pluma","linha":"Jaqueta de pena ou pluma, com secagem completa","preco":120,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":180,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"jaqueta de pena jaqueta de pluma jaqueta de plumas down jacket campera de plumas"},"jaqueta-couro":{"id":"jaqueta-couro","curto":"Jaqueta de couro liso","linha":"Jaqueta de couro liso, lavada e hidratada","preco":160,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-couro-em-florianopolis/","pacote":false,"busca":"jaqueta de couro leather jacket campera de cuero"},"trench-coat":{"id":"trench-coat","curto":"Trench coat","linha":"Trench coat, a seco ou em água, conforme a etiqueta; cinto e forro removível no preço","preco":110,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":165,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"trench coat trenchcoat"},"casaco-curto":{"id":"casaco-curto","curto":"Casaco curto de lã","linha":"Casaco curto de lã batida, a seco; o de lã fria, tweed ou cashmere, pelo mesmo valor","preco":69,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":103.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"casaco curto casaco de la casaco curto de la casaco de la batida casaco de tweed casaco de cashmere"},"casaco-34":{"id":"casaco-34","curto":"Casaco 3/4 de lã","linha":"Casaco 3/4 de lã batida, a seco; o de lã fria, tweed ou cashmere, pelo mesmo valor","preco":89,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":133.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"casaco 3 4 casaco tres quartos casaco 3 quartos"},"sobretudo":{"id":"sobretudo","curto":"Sobretudo de lã","linha":"Sobretudo de lã batida, a seco; o de lã fria, tweed ou cashmere, pelo mesmo valor","preco":110,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":165,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"sobretudo overcoat sobretodo"},"agasalho-la":{"id":"agasalho-la","curto":"Agasalho de lã","linha":"Agasalho de lã","preco":49,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":73.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/cuidados-la/","pacote":false,"busca":"agasalho de la agasalho sueter sueter de la blusa de la blusao cardiga trico tricot sweater pulover"},"roupa-neve":{"id":"roupa-neve","curto":"Roupa de neve","linha":"Roupa de neve: jaqueta, calça, macacão e luvas","preco":null,"unidade":"peça","consulta":true,"expresso":"consulta","expressoPreco":null,"prazo":"pela foto; em geral, 7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/","pacote":false,"busca":"roupa de neve jaqueta de neve calca de neve macacao de neve luva de neve roupa de ski roupa de esqui ski jacket"},"cortina":{"id":"cortina","curto":"Cortina","linha":"Cortina: com ilhoses, pregas ou argolas, bordada ou com chumbinhos (tiramos e recolocamos ganchos e chumbinhos); volta passada, no cabide","preco":120,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"5 a 7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/limpeza-de-cortinas-em-florianopolis/","pacote":false,"busca":"cortina voal cortina de voal cortina blackout curtain curtains"},"capa-sofa":{"id":"capa-sofa","curto":"Capa de sofá","linha":"Capa de sofá, em água ou a seco, conforme a instrução de lavagem","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/limpeza-de-cortinas-em-florianopolis/","pacote":false,"busca":"capa de sofa capa do sofa sofa cover funda de sofa"},"capa-almofada":{"id":"capa-almofada","curto":"Capa de almofada","linha":"Capa de almofada, avulsa ou do sofá: só a capa (o enchimento não lavamos)","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/limpeza-de-cortinas-em-florianopolis/","pacote":false,"busca":"capa de almofada capa da almofada cushion cover"},"manta-sofa":{"id":"manta-sofa","curto":"Manta de sofá","linha":"Manta de sofá, inclusive com franja, pelo valor do edredom de fibra do mesmo tamanho","preco":69,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/limpeza-de-cortinas-em-florianopolis/","pacote":false,"busca":"manta de sofa manta do sofa manta com franja"},"tapete-pequeno":{"id":"tapete-pequeno","curto":"Tapete pequeno, de sala ou passadeira","linha":"Tapete pequeno, de sala ou passadeira (o médio tem o preço pela foto; tapete grande não lavamos)","preco":45,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/limpeza-de-cortinas-em-florianopolis/","pacote":false,"nota":"O tapete médio tem o preço pela foto, e tapete grande a Dedicada não lava.","busca":"tapete pequeno tapete de sala passadeira tapete rug"},"rede":{"id":"rede","curto":"Rede de dormir","linha":"Rede de dormir","preco":120,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/limpeza-de-cortinas-em-florianopolis/","pacote":false,"busca":"rede de dormir rede hammock hamaca"},"carrinho":{"id":"carrinho","curto":"Carrinho de bebê","linha":"Carrinho de bebê, modelo padrão: lavado desmontado, à mão, com os cintos só higienizados; volta montado ou desmontado","preco":390,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/higienizacao-de-carrinho-de-bebe-em-florianopolis/","pacote":false,"busca":"carrinho de bebe carrinho carrinho de passeio stroller pram cochecito"},"bebe-conforto":{"id":"bebe-conforto","curto":"Bebê conforto ou cadeirinha","linha":"Bebê conforto ou cadeirinha de carro","preco":290,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/higienizacao-de-carrinho-de-bebe-em-florianopolis/","pacote":false,"busca":"bebe conforto cadeirinha cadeirinha de carro cadeira de carro car seat silla de auto"},"carrinho-outros":{"id":"carrinho-outros","curto":"Outros modelos de carrinho","linha":"Outros modelos de carrinho (duplo ou de gêmeos, guarda-chuva, de três rodas, travel system) e a base do bebê conforto","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"sob consulta","prazoDias":null,"pagina":"https://dedicadalavanderia.com.br/servicos/higienizacao-de-carrinho-de-bebe-em-florianopolis/","pacote":false,"busca":"carrinho duplo carrinho de gemeos carrinho guarda chuva carrinho de tres rodas travel system base do bebe conforto"},"roupa-bebe":{"id":"roupa-bebe","curto":"Roupa de bebê e enxoval","linha":"Roupa de bebê e enxoval: body, manta, cueiro, kit berço, toalha com capuz, fralda de pano e as outras peças; em água, numa máquina só com as peças do bebê (a manta de lã vai a seco)","preco":15,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":22.5,"prazo":"4 dias úteis","prazoDias":4,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-bebe-em-florianopolis/","pacote":false,"busca":"roupa de bebe roupinha de bebe roupinha enxoval de bebe body cueiro manta de bebe kit berco toalha com capuz fralda de pano baby clothes ropa de bebe enxoval do bebe"},"roupa-infantil":{"id":"roupa-infantil","curto":"Ninho, edredom de berço ou roupa infantil","linha":"Ninho de bebê, edredom de berço e roupa infantil (as roupas maiores, de criança)","preco":null,"unidade":"peça","consulta":true,"expresso":"consulta","expressoPreco":null,"prazo":"pela foto","prazoDias":null,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-bebe-em-florianopolis/","pacote":false,"busca":"ninho de bebe edredom de berco roupa infantil roupa de crianca"},"calca-jeans":{"id":"calca-jeans","curto":"Calça jeans, sarja ou esporte","linha":"Calça jeans, sarja ou esporte","preco":29,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":43.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/cuidados-jeans-sarja/","pacote":true,"busca":"calca jeans jeans calca de sarja calca sarja calca esporte calca de moletom"},"bermuda":{"id":"bermuda","curto":"Bermuda ou shorts","linha":"Bermuda ou shorts","preco":25,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":37.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/cuidados-jeans-sarja/","pacote":true,"busca":"bermuda shorts short"},"moletom":{"id":"moletom","curto":"Moletom ou roupa esportiva","linha":"Moletom ou roupa esportiva","preco":25,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":37.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/cuidados-algodao/","pacote":true,"busca":"moletom roupa esportiva roupa de academia roupa de ginastica legging agasalho esportivo hoodie sweatshirt buzo"},"pijama":{"id":"pijama","curto":"Pijama","linha":"Pijama","preco":19.9,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":29.85,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/cuidados-algodao/","pacote":true,"busca":"pijama pyjama pajamas"},"farda":{"id":"farda","curto":"Farda ou uniforme","linha":"Farda ou uniforme, de trabalho ou escolar, lavado e passado","preco":49,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":73.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/","pacote":false,"busca":"farda uniforme uniforme de trabalho uniforme escolar uniform"},"jaleco":{"id":"jaleco","curto":"Jaleco ou dólmã","linha":"Jaleco, inclusive o de cozinha (dólmã)","preco":45,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":67.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/","pacote":false,"busca":"jaleco dolma jaleco de cozinha lab coat chef jacket"},"beca":{"id":"beca","curto":"Beca de formatura","linha":"Beca de formatura","preco":89,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":133.5,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/","pacote":false,"busca":"beca beca de formatura toga"},"kimono-calca":{"id":"kimono-calca","curto":"Calça de kimono","linha":"Kimono: calça","preco":45,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/","pacote":false,"busca":"calca de kimono calca do kimono"},"kimono-cima":{"id":"kimono-cima","curto":"Parte de cima do kimono","linha":"Kimono: parte de cima","preco":55,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/","pacote":false,"busca":"parte de cima do kimono casaco do kimono"},"uniforme-tripulacao":{"id":"uniforme-tripulacao","curto":"Uniforme de tripulação","linha":"Uniforme de tripulação","preco":null,"unidade":"peça","consulta":true,"expresso":"sim","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/","pacote":false,"busca":"uniforme de tripulacao"},"vestes-sacerdotais":{"id":"vestes-sacerdotais","curto":"Vestes sacerdotais","linha":"Vestes sacerdotais: casula, manto, batina e as outras","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/","pacote":false,"busca":"vestes sacerdotais casula batina"},"toalha-salao":{"id":"toalha-salao","curto":"Toalhas de salão e de barbearia","linha":"Toalhas de salão de beleza e de barbearia","preco":null,"unidade":"peça","consulta":true,"expresso":"consulta","expressoPreco":null,"prazo":"pela foto","prazoDias":null,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-uniformes-e-jalecos-em-florianopolis/","pacote":false,"busca":"toalha de salao toalha de barbearia toalha de salao de beleza"},"pelucia-p":{"id":"pelucia-p","curto":"Pelúcia pequena (P)","linha":"Pelúcia pequena (P)","preco":45,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-pelucias-e-fantasias-em-florianopolis/","pacote":false,"busca":"pelucia pequena pelucia p"},"pelucia-m":{"id":"pelucia-m","curto":"Pelúcia média (M)","linha":"Pelúcia média (M)","preco":65,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-pelucias-e-fantasias-em-florianopolis/","pacote":false,"busca":"pelucia media pelucia m"},"pelucia-g":{"id":"pelucia-g","curto":"Pelúcia grande (G)","linha":"Pelúcia grande (G)","preco":110,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-pelucias-e-fantasias-em-florianopolis/","pacote":false,"busca":"pelucia grande pelucia g"},"pelucia-gg":{"id":"pelucia-gg","curto":"Pelúcia extragrande (GG)","linha":"Pelúcia extragrande (GG), inclusive a de mais de 1 metro","preco":200,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-pelucias-e-fantasias-em-florianopolis/","pacote":false,"busca":"pelucia extragrande pelucia gg pelucia gigante"},"boneca-pano":{"id":"boneca-pano","curto":"Boneca de pano ou pelúcia de isopor ou mohair","linha":"Boneca de pano e pelúcia de isopor ou de mohair","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"pela foto","prazoDias":null,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-pelucias-e-fantasias-em-florianopolis/","pacote":false,"busca":"boneca de pano pelucia de isopor pelucia de mohair"},"fantasia":{"id":"fantasia","curto":"Fantasia simples","linha":"Fantasia simples, sem armação nem enchimento: infantil, de carnaval ou de festa","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-pelucias-e-fantasias-em-florianopolis/","pacote":false,"busca":"fantasia fantasia simples fantasia infantil fantasia de carnaval costume disfraz"},"fantasia-estruturada":{"id":"fantasia-estruturada","curto":"Fantasia estruturada (mascote)","linha":"Fantasia estruturada, com armação e enchimento, como a de mascote","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-pelucias-e-fantasias-em-florianopolis/","pacote":false,"busca":"fantasia estruturada fantasia de mascote mascote"},"pele":{"id":"pele","curto":"Peça de pele","linha":"Peça de pele","preco":280,"unidade":"peça","consulta":false,"expresso":"nao","expressoPreco":null,"prazo":"7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/cuidados-peles/","pacote":false,"busca":"peca de pele casaco de pele colete de pele estola de pele fur coat"},"cobertor-solteiro":{"id":"cobertor-solteiro","curto":"Cobertor ou colcha solteiro","linha":"Edredom solteiro, fibra sintética","preco":69,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":103.5,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"apelido":true,"nota":"Cobertor e colcha custam o mesmo que o edredom de fibra do mesmo tamanho; a colcha pesada tem valor próprio."},"cobertor-casal":{"id":"cobertor-casal","curto":"Cobertor ou colcha casal","linha":"Edredom casal, fibra sintética","preco":94,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":141,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"apelido":true,"nota":"Cobertor e colcha custam o mesmo que o edredom de fibra do mesmo tamanho; a colcha pesada tem valor próprio."},"cobertor-queen":{"id":"cobertor-queen","curto":"Cobertor ou colcha queen","linha":"Edredom queen, fibra sintética","preco":94,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":141,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"apelido":true,"nota":"Cobertor e colcha custam o mesmo que o edredom de fibra do mesmo tamanho; a colcha pesada tem valor próprio."},"cobertor-king":{"id":"cobertor-king","curto":"Cobertor ou colcha king","linha":"Edredom king, fibra sintética","preco":110,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":165,"prazo":"2 dias úteis","prazoDias":2,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-edredom-em-florianopolis/","pacote":false,"apelido":true,"nota":"Cobertor e colcha custam o mesmo que o edredom de fibra do mesmo tamanho; a colcha pesada tem valor próprio."},"tapete-banheiro":{"id":"tapete-banheiro","curto":"Tapete de banheiro","linha":"Toalha de rosto, de piso ou de mão (o tapete de banheiro sai pelo mesmo valor, em 3 dias úteis)","preco":8,"unidade":"peça","consulta":false,"expresso":"sim","expressoPreco":12,"prazo":"3 dias úteis","prazoDias":3,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/#roupa-de-banho","pacote":false,"apelido":true,"nota":"O tapete de banheiro sai pelo valor da toalha de rosto, em 3 dias úteis.","prazoProprio":"3 dias úteis","prazoDiasProprio":3},"mochila-bone":{"id":"mochila-bone","curto":"Mochila ou boné","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"4 dias úteis","prazoDias":4,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-tenis-em-florianopolis/","pacote":false},"couro-outros":{"id":"couro-outros","curto":"Outra peça de couro (calça, saia, vestido, sobretudo ou roupa de moto)","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"7 dias úteis","prazoDias":7,"pagina":"https://dedicadalavanderia.com.br/servicos/lavagem-de-couro-em-florianopolis/","pacote":false},"tapete-medio":{"id":"tapete-medio","curto":"Tapete médio","preco":null,"unidade":"peça","consulta":true,"expresso":"nao","expressoPreco":null,"prazo":"5 dias úteis","prazoDias":5,"pagina":"https://dedicadalavanderia.com.br/servicos/limpeza-de-cortinas-em-florianopolis/","pacote":false},"edredom":{"id":"edredom","curto":"Edredom","opcoes":["edredom-solteiro","edredom-casal","edredom-queen","edredom-king","edredom-pena-solteiro","edredom-pena-casal","edredom-pena-queen","edredom-pena-king"]},"edredom-pena":{"id":"edredom-pena","curto":"Edredom de pena","opcoes":["edredom-pena-solteiro","edredom-pena-casal","edredom-pena-queen","edredom-pena-king"]},"cobertor":{"id":"cobertor","curto":"Cobertor ou colcha","opcoes":["cobertor-solteiro","cobertor-casal","cobertor-queen","cobertor-king"],"nota":"Cobertor e colcha custam o mesmo que o edredom de fibra do mesmo tamanho; a colcha pesada tem valor próprio."},"protetor":{"id":"protetor","curto":"Protetor de colchão","opcoes":["protetor-solteiro","protetor-casal","protetor-king"]},"toalha":{"id":"toalha","curto":"Toalha","opcoes":["toalha-banho","toalha-rosto"]},"toalha-de-mesa":{"id":"toalha-de-mesa","curto":"Toalha de mesa","opcoes":["toalha-mesa","toalha-mesa-media","toalha-mesa-grande"]},"vestido":{"id":"vestido","curto":"Vestido","opcoes":["vestido-simples","vestido-midi","vestido-festa","vestido-noiva"]},"calca":{"id":"calca","curto":"Calça","opcoes":["calca-jeans","calca-social","calca-fina"]},"jaqueta":{"id":"jaqueta","curto":"Jaqueta","opcoes":["jaqueta-sem-enchimento","jaqueta-sintetica","jaqueta-impermeavel","jaqueta-pena","jaqueta-couro"]},"casaco":{"id":"casaco","curto":"Casaco","opcoes":["casaco-curto","casaco-34","sobretudo","trench-coat"]},"kimono":{"id":"kimono","curto":"Kimono","opcoes":["kimono-calca","kimono-cima"]},"pelucia":{"id":"pelucia","curto":"Pelúcia","opcoes":["pelucia-p","pelucia-m","pelucia-g","pelucia-gg"]}},"indicePecas":{"camisa":[[3,"camisa manga curta","camisa-social"],[3,"camisa manga longa","camisa-social"],[2,"camisa botao","camisa-social"],[2,"camisa formal","camisa-social"],[2,"camisa futebol","camiseta"],[2,"camisa linho","camisa-social"],[2,"camisa polo","camisa-polo"],[2,"camisa seda","camisa-seda"],[2,"camisa smoking","camisa-smoking-veludo"],[2,"camisa social","camisa-social"],[2,"camisa time","camiseta"],[2,"camisa veludo","camisa-smoking-veludo"],[1,"camisa","camisa-social"]],"dress":[[2,"dress pants","calca-social"],[2,"dress shirt","camisa-social"],[2,"dress shoes","x:sapato-social"],[1,"dress","vestido"]],"shirt":[[1,"shirt","camisa-social"]],"polo":[[2,"polo shirt","camisa-polo"],[1,"polo","camisa-polo"]],"chomba":[[1,"chomba","camisa-polo"]],"camiseta":[[1,"camiseta","camiseta"]],"t":[[2,"t shirt","camiseta"],[2,"t shirts","camiseta"]],"tshirt":[[1,"tshirt","camiseta"]],"remera":[[1,"remera","camiseta"]],"playera":[[1,"playera","camiseta"]],"silk":[[2,"silk blouse","blusa-seda"],[2,"silk shirt","camisa-seda"]],"terno":[[2,"terno completo","terno"],[1,"terno","terno"]],"traje":[[2,"traje noivo","terno"],[1,"traje","terno"]],"suit":[[1,"suit","terno"]],"paleto":[[1,"paleto","paleto"]],"blazer":[[2,"blazer especial","blazer-seda"],[2,"blazer linho","paleto"],[2,"blazer seda","blazer-seda"],[2,"blazer veludo","veludo"],[1,"blazer","paleto"]],"casaco":[[3,"casaco 3 4","casaco-34"],[3,"casaco 3 quartos","casaco-34"],[3,"casaco curto la","casaco-curto"],[3,"casaco la batida","casaco-curto"],[2,"casaco cashmere","casaco-curto"],[2,"casaco curto","casaco-curto"],[2,"casaco kimono","kimono-cima"],[2,"casaco la","casaco-curto"],[2,"casaco pele","pele"],[2,"casaco terno","paleto"],[2,"casaco tweed","casaco-curto"],[1,"casaco","casaco"]],"calca":[[2,"calca alfaiataria","calca-social"],[2,"calca bordado","calca-fina"],[2,"calca couro","couro-outros"],[2,"calca esporte","calca-jeans"],[2,"calca jeans","calca-jeans"],[2,"calca kimono","kimono-calca"],[2,"calca linho","calca-fina"],[2,"calca moletom","calca-jeans"],[2,"calca neve","roupa-neve"],[2,"calca pedraria","calca-fina"],[2,"calca sarja","calca-jeans"],[2,"calca seda","calca-fina"],[2,"calca social","calca-social"],[2,"calca terno","calca-social"],[2,"calca veludo","veludo"],[1,"calca","calca"]],"pantalon":[[2,"pantalon vestir","calca-social"],[1,"pantalon","calca"]],"gravata":[[1,"gravata","gravata"]],"tie":[[1,"tie","gravata"]],"corbata":[[1,"corbata","gravata"]],"colete":[[2,"colete pele","pele"],[2,"colete puffer","jaqueta-sintetica"],[2,"colete social","colete-smoking"],[1,"colete","colete-smoking"]],"smoking":[[1,"smoking","colete-smoking"]],"fraque":[[1,"fraque","colete-smoking"]],"tailleur":[[1,"tailleur","colete-smoking"]],"saia":[[2,"saia cama","saia-cama"],[2,"saia couro","couro-outros"],[2,"saia linho","saia"],[2,"saia longa","saia"],[2,"saia plissada","saia"],[2,"saia pregas","saia"],[2,"saia seda","saia"],[2,"saia terno","colete-smoking"],[2,"saia veludo","veludo"],[1,"saia","saia"]],"tuxedo":[[1,"tuxedo","colete-smoking"]],"edredom":[[3,"edredom king size","edredom-king"],[3,"edredom pelo cachorro","edredom-pet"],[3,"edredom pelo gato","edredom-pet"],[3,"edredom pena casal","edredom-pena-casal"],[3,"edredom pena king","edredom-pena-king"],[3,"edredom pena queen","edredom-pena-queen"],[3,"edredom pena solteiro","edredom-pena-solteiro"],[3,"edredom pet la","edredom-pet-la-pena"],[3,"edredom pet pena","edredom-pet-la-pena"],[3,"edredom pluma casal","edredom-pena-casal"],[3,"edredom pluma king","edredom-pena-king"],[3,"edredom pluma queen","edredom-pena-queen"],[3,"edredom pluma solteiro","edredom-pena-solteiro"],[3,"edredom plumas casal","edredom-pena-casal"],[3,"edredom plumas king","edredom-pena-king"],[3,"edredom plumas queen","edredom-pena-queen"],[3,"edredom plumas solteiro","edredom-pena-solteiro"],[3,"edredom queen size","edredom-queen"],[2,"edredom berco","roupa-infantil"],[2,"edredom casal","edredom-casal"],[2,"edredom ganso","edredom-pena"],[2,"edredom king","edredom-king"],[2,"edredom la","edredom-la"],[2,"edredom pena","edredom-pena"],[2,"edredom pet","edredom-pet"],[2,"edredom pluma","edredom-pena"],[2,"edredom plumas","edredom-pena"],[2,"edredom queen","edredom-queen"],[2,"edredom seda","edredom-seda"],[2,"edredom solteiro","edredom-solteiro"],[1,"edredom","edredom"]],"single":[[2,"single duvet","edredom-solteiro"]],"twin":[[2,"twin duvet","edredom-solteiro"]],"edredon":[[3,"edredon 1 plaza","edredom-solteiro"],[2,"edredon doble","edredom-casal"],[2,"edredon individual","edredom-solteiro"],[2,"edredon king","edredom-king"],[2,"edredon matrimonial","edredom-casal"],[2,"edredon queen","edredom-queen"],[1,"edredon","edredom"]],"double":[[2,"double duvet","edredom-casal"]],"queen":[[2,"queen duvet","edredom-queen"]],"king":[[2,"king duvet","edredom-king"]],"coberta":[[2,"coberta la","edredom-la"]],"cobertor":[[2,"cobertor casal","cobertor-casal"],[2,"cobertor eletrico","x:cobertor-eletrico"],[2,"cobertor king","cobertor-king"],[2,"cobertor la","edredom-la"],[2,"cobertor queen","cobertor-queen"],[2,"cobertor solteiro","cobertor-solteiro"],[1,"cobertor","cobertor"]],"manta":[[2,"manta bebe","roupa-bebe"],[2,"manta cama","cobertor"],[2,"manta eletrica","x:cobertor-eletrico"],[2,"manta franja","manta-sofa"],[2,"manta la","edredom-la"],[2,"manta sofa","manta-sofa"]],"colcha":[[2,"colcha casal","cobertor-casal"],[2,"colcha king","cobertor-king"],[2,"colcha pesada","colcha-pesada"],[2,"colcha queen","cobertor-queen"],[2,"colcha seda","edredom-seda"],[2,"colcha solteiro","cobertor-solteiro"],[1,"colcha","cobertor"]],"capa":[[4,"capa almofada jogo colcha","capa-travesseiro"],[3,"capa edredom pet","capa-edredom-pet"],[2,"capa almofada","capa-almofada"],[2,"capa chuva","jaqueta-impermeavel"],[2,"capa edredom","capa-edredom"],[2,"capa sofa","capa-sofa"],[2,"capa travesseiro","capa-travesseiro"]],"duvet":[[2,"duvet cover","capa-edredom"],[1,"duvet","edredom"]],"funda":[[2,"funda almohada","lencois"],[2,"funda edredon","capa-edredom"],[2,"funda sofa","capa-sofa"]],"lencol":[[2,"lencol elastico","lencois"],[2,"lencol seda","jogo-cama-seda"],[1,"lencol","lencois"]],"fronha":[[1,"fronha","lencois"]],"jogo":[[3,"jogo cama seda","jogo-cama-seda"],[2,"jogo americano","guardanapo"],[2,"jogo cama","lencois"],[2,"jogo lencol","lencois"]],"roupa":[[4,"roupa dia a dia","a:pacotes"],[3,"roupa uso diario","a:pacotes"],[2,"roupa academia","moletom"],[2,"roupa bebe","roupa-bebe"],[2,"roupa cama","lencois"],[2,"roupa crianca","roupa-infantil"],[2,"roupa esportiva","moletom"],[2,"roupa esqui","roupa-neve"],[2,"roupa ginastica","moletom"],[2,"roupa infantil","roupa-infantil"],[2,"roupa moto","couro-outros"],[2,"roupa neve","roupa-neve"],[2,"roupa pet","x:pet"],[2,"roupa ski","roupa-neve"]],"sheets":[[1,"sheets","lencois"]],"bed":[[2,"bed sheets","lencois"]],"pillowcase":[[1,"pillowcase","lencois"]],"sabana":[[1,"sabana","lencois"]],"protetor":[[3,"protetor colchao casal","protetor-casal"],[3,"protetor colchao king","protetor-king"],[3,"protetor colchao queen","protetor-casal"],[3,"protetor colchao solteiro","protetor-solteiro"],[2,"protetor colchao","protetor"]],"toalha":[[3,"toalha mesa banquete","toalha-mesa-grande"],[3,"toalha mesa grande","toalha-mesa-grande"],[3,"toalha mesa lisa","toalha-mesa"],[3,"toalha mesa media","toalha-mesa-media"],[3,"toalha mesa pequena","toalha-mesa"],[3,"toalha mesa simples","toalha-mesa"],[3,"toalha salao beleza","toalha-salao"],[2,"toalha bandeja","caminho-mesa"],[2,"toalha banho","toalha-banho"],[2,"toalha banquete","toalha-mesa-grande"],[2,"toalha barbearia","toalha-salao"],[2,"toalha bordada","caminho-mesa"],[2,"toalha capuz","roupa-bebe"],[2,"toalha lavabo","toalha-rosto"],[2,"toalha mao","toalha-rosto"],[2,"toalha mesa","toalha-de-mesa"],[2,"toalha piso","toalha-rosto"],[2,"toalha rosto","toalha-rosto"],[2,"toalha salao","toalha-salao"],[1,"toalha","toalha"]],"toalhao":[[1,"toalhao","toalha-banho"]],"bath":[[2,"bath towel","toalha-banho"]],"toalla":[[2,"toalla bano","toalha-banho"],[2,"toalla mano","toalha-rosto"],[1,"toalla","toalha"]],"hand":[[2,"hand towel","toalha-rosto"]],"roupao":[[1,"roupao","roupao"]],"bathrobe":[[1,"bathrobe","roupao"]],"robe":[[1,"robe","robe"]],"guardanapo":[[2,"guardanapo copo","caminho-mesa"],[1,"guardanapo","guardanapo"]],"napkin":[[1,"napkin","guardanapo"]],"servilleta":[[1,"servilleta","guardanapo"]],"caminho":[[2,"caminho mesa","caminho-mesa"]],"vestido":[[3,"vestido festa infantil","vestido-infantil"],[3,"vestido formatura abc","vestido-infantil"],[3,"vestido primeira comunhao","vestido-infantil"],[2,"vestido algodao","vestido-simples"],[2,"vestido batizado","vestido-infantil"],[2,"vestido cetim","vestido-festa"],[2,"vestido couro","couro-outros"],[2,"vestido daminha","vestido-infantil"],[2,"vestido festa","vestido-festa"],[2,"vestido fiesta","vestido-festa"],[2,"vestido formatura","vestido-festa"],[2,"vestido gala","vestido-festa"],[2,"vestido infantil","vestido-infantil"],[2,"vestido linho","vestido-simples"],[2,"vestido longo","vestido-festa"],[2,"vestido madrinha","vestido-festa"],[2,"vestido malha","vestido-simples"],[2,"vestido midi","vestido-midi"],[2,"vestido noiva","vestido-noiva"],[2,"vestido novia","vestido-noiva"],[2,"vestido pedraria","vestido-festa"],[2,"vestido seda","vestido-festa"],[2,"vestido simples","vestido-simples"],[2,"vestido tule","vestido-festa"],[1,"vestido","vestido"]],"alta":[[2,"alta costura","vestido-festa"]],"evening":[[2,"evening dress","vestido-festa"]],"gown":[[1,"gown","vestido-festa"]],"wedding":[[2,"wedding dress","vestido-noiva"]],"bridal":[[2,"bridal gown","vestido-noiva"]],"blusa":[[2,"blusa detalhes","blusa-seda"],[2,"blusa la","agasalho-la"],[2,"blusa seda","blusa-seda"],[2,"blusa simples","blusa-simples"],[1,"blusa","blusa-simples"]],"blouse":[[1,"blouse","blusa-simples"]],"regata":[[2,"regata seda","blusa-seda"]],"skirt":[[1,"skirt","saia"]],"falda":[[1,"falda","saia"]],"macacao":[[2,"macacao couro","couro-outros"],[2,"macacao neve","roupa-neve"],[1,"macacao","macacao"]],"macaquinho":[[1,"macaquinho","macacao"]],"conjunto":[[2,"conjunto festa","macacao"]],"top":[[2,"top festa","macacao"],[2,"top seda","macacao"]],"jumpsuit":[[1,"jumpsuit","macacao"]],"bermuda":[[2,"bermuda linho","calca-fina"],[2,"bermuda seda","calca-fina"],[1,"bermuda","bermuda"]],"veludo":[[1,"veludo","veludo"]],"peca":[[4,"peca dia a dia","a:pacotes"],[2,"peca couro","couro-outros"],[2,"peca pele","pele"],[2,"peca veludo","veludo"]],"pashmina":[[1,"pashmina","cashmere"]],"cachecol":[[1,"cachecol","cashmere"]],"cashmere":[[1,"cashmere","cashmere"]],"caxemira":[[1,"caxemira","cashmere"]],"sueter":[[2,"sueter cashmere","cashmere"],[2,"sueter la","agasalho-la"],[1,"sueter","agasalho-la"]],"cardiga":[[2,"cardiga cashmere","cashmere"],[1,"cardiga","agasalho-la"]],"scarf":[[1,"scarf","cashmere"]],"bufanda":[[1,"bufanda","cashmere"]],"camisola":[[2,"camisola seda","pijama-seda"]],"pijama":[[2,"pijama seda","pijama-seda"],[1,"pijama","pijama"]],"lenco":[[2,"lenco seda","lenco-seda"],[1,"lenco","lenco-seda"]],"echarpe":[[2,"echarpe seda","lenco-seda"],[1,"echarpe","lenco-seda"]],"foulard":[[1,"foulard","lenco-seda"]],"tenis":[[2,"tenis infantil","tenis"],[2,"tenis infantis","tenis"],[1,"tenis","tenis"]],"sapatilha":[[1,"sapatilha","tenis"]],"sapatenis":[[1,"sapatenis","tenis"]],"pantufa":[[1,"pantufa","tenis"]],"sneakers":[[1,"sneakers","tenis"]],"sneaker":[[1,"sneaker","tenis"]],"zapatillas":[[1,"zapatillas","tenis"]],"zapatilla":[[1,"zapatilla","tenis"]],"jaqueta":[[3,"jaqueta sem enchimento","jaqueta-sem-enchimento"],[2,"jaqueta acolchoada","jaqueta-sintetica"],[2,"jaqueta couro","jaqueta-couro"],[2,"jaqueta enchimento","jaqueta-sintetica"],[2,"jaqueta impermeavel","jaqueta-impermeavel"],[2,"jaqueta infantil","jaqueta-sem-enchimento"],[2,"jaqueta jeans","jaqueta-sem-enchimento"],[2,"jaqueta moletom","jaqueta-sem-enchimento"],[2,"jaqueta neve","roupa-neve"],[2,"jaqueta nylon","jaqueta-sem-enchimento"],[2,"jaqueta pena","jaqueta-pena"],[2,"jaqueta pluma","jaqueta-pena"],[2,"jaqueta plumas","jaqueta-pena"],[2,"jaqueta poliester","jaqueta-sem-enchimento"],[2,"jaqueta puffer","jaqueta-sintetica"],[1,"jaqueta","jaqueta"]],"corta":[[2,"corta vento","jaqueta-sem-enchimento"]],"bomber":[[1,"bomber","jaqueta-sem-enchimento"]],"windbreaker":[[1,"windbreaker","jaqueta-sem-enchimento"]],"puffer":[[2,"puffer jacket","jaqueta-sintetica"],[1,"puffer","jaqueta-sintetica"]],"raincoat":[[1,"raincoat","jaqueta-impermeavel"]],"anorak":[[1,"anorak","jaqueta-impermeavel"]],"down":[[2,"down duvet","edredom-pena"],[2,"down jacket","jaqueta-pena"]],"campera":[[2,"campera cuero","jaqueta-couro"],[2,"campera plumas","jaqueta-pena"],[1,"campera","jaqueta"]],"leather":[[2,"leather jacket","jaqueta-couro"],[1,"leather","couro-outros"]],"trench":[[2,"trench coat","trench-coat"]],"trenchcoat":[[1,"trenchcoat","trench-coat"]],"sobretudo":[[2,"sobretudo couro","couro-outros"],[1,"sobretudo","sobretudo"]],"overcoat":[[1,"overcoat","sobretudo"]],"sobretodo":[[1,"sobretodo","sobretudo"]],"agasalho":[[2,"agasalho esportivo","moletom"],[2,"agasalho la","agasalho-la"],[1,"agasalho","agasalho-la"]],"blusao":[[1,"blusao","agasalho-la"]],"trico":[[1,"trico","agasalho-la"]],"tricot":[[1,"tricot","agasalho-la"]],"sweater":[[1,"sweater","agasalho-la"]],"pulover":[[1,"pulover","agasalho-la"]],"luva":[[2,"luva moto","couro-outros"],[2,"luva neve","roupa-neve"],[1,"luva","x:luvas"]],"ski":[[2,"ski jacket","roupa-neve"]],"cortina":[[2,"cortina blackout","cortina"],[2,"cortina local","x:no-local"],[2,"cortina voal","cortina"],[1,"cortina","cortina"]],"voal":[[1,"voal","cortina"]],"curtain":[[1,"curtain","cortina"]],"curtains":[[1,"curtains","cortina"]],"sofa":[[2,"sofa cover","capa-sofa"]],"cushion":[[2,"cushion cover","capa-almofada"],[1,"cushion","x:almofada"]],"tapete":[[2,"tapete banheiro","tapete-banheiro"],[2,"tapete gigante","x:tapete-grande"],[2,"tapete grande","x:tapete-grande"],[2,"tapete local","x:no-local"],[2,"tapete medio","tapete-medio"],[2,"tapete pequeno","tapete-pequeno"],[2,"tapete sala","tapete-pequeno"],[1,"tapete","tapete-pequeno"]],"passadeira":[[1,"passadeira","tapete-pequeno"]],"rug":[[1,"rug","tapete-pequeno"]],"rede":[[2,"rede dormir","rede"],[1,"rede","rede"]],"hammock":[[1,"hammock","rede"]],"hamaca":[[1,"hamaca","rede"]],"carrinho":[[3,"carrinho 3 rodas","carrinho-outros"],[3,"carrinho guarda chuva","carrinho-outros"],[2,"carrinho bebe","carrinho"],[2,"carrinho duplo","carrinho-outros"],[2,"carrinho gemeos","carrinho-outros"],[2,"carrinho passeio","carrinho"],[1,"carrinho","carrinho"]],"stroller":[[1,"stroller","carrinho"]],"pram":[[1,"pram","carrinho"]],"cochecito":[[1,"cochecito","carrinho"]],"bebe":[[2,"bebe conforto","bebe-conforto"]],"cadeirinha":[[2,"cadeirinha carro","bebe-conforto"],[1,"cadeirinha","bebe-conforto"]],"cadeira":[[2,"cadeira carro","bebe-conforto"]],"car":[[2,"car seat","bebe-conforto"]],"silla":[[2,"silla auto","bebe-conforto"]],"travel":[[2,"travel system","carrinho-outros"]],"base":[[3,"base bebe conforto","carrinho-outros"]],"roupinha":[[2,"roupinha bebe","roupa-bebe"],[2,"roupinha cachorro","x:pet"],[2,"roupinha pet","x:pet"],[1,"roupinha","roupa-bebe"]],"enxoval":[[2,"enxoval bebe","roupa-bebe"]],"body":[[1,"body","roupa-bebe"]],"cueiro":[[1,"cueiro","roupa-bebe"]],"kit":[[2,"kit berco","roupa-bebe"]],"fralda":[[2,"fralda pano","roupa-bebe"]],"baby":[[2,"baby clothes","roupa-bebe"]],"ropa":[[2,"ropa bebe","roupa-bebe"]],"ninho":[[2,"ninho bebe","roupa-infantil"]],"jeans":[[1,"jeans","calca-jeans"]],"shorts":[[1,"shorts","bermuda"]],"short":[[1,"short","bermuda"]],"moletom":[[1,"moletom","moletom"]],"legging":[[1,"legging","moletom"]],"hoodie":[[1,"hoodie","moletom"]],"sweatshirt":[[1,"sweatshirt","moletom"]],"buzo":[[1,"buzo","moletom"]],"pyjama":[[1,"pyjama","pijama"]],"pajamas":[[1,"pajamas","pijama"]],"farda":[[1,"farda","farda"]],"uniforme":[[2,"uniforme escolar","farda"],[2,"uniforme trabalho","farda"],[2,"uniforme tripulacao","uniforme-tripulacao"],[1,"uniforme","farda"]],"uniform":[[1,"uniform","farda"]],"jaleco":[[2,"jaleco cozinha","jaleco"],[1,"jaleco","jaleco"]],"dolma":[[1,"dolma","jaleco"]],"lab":[[2,"lab coat","jaleco"]],"chef":[[2,"chef jacket","jaleco"]],"beca":[[2,"beca formatura","beca"],[1,"beca","beca"]],"toga":[[1,"toga","beca"]],"parte":[[3,"parte cima kimono","kimono-cima"]],"vestes":[[2,"vestes sacerdotais","vestes-sacerdotais"]],"casula":[[1,"casula","vestes-sacerdotais"]],"batina":[[1,"batina","vestes-sacerdotais"]],"pelucia":[[2,"pelucia extragrande","pelucia-gg"],[2,"pelucia g","pelucia-g"],[2,"pelucia gg","pelucia-gg"],[2,"pelucia gigante","pelucia-gg"],[2,"pelucia grande","pelucia-g"],[2,"pelucia isopor","boneca-pano"],[2,"pelucia m","pelucia-m"],[2,"pelucia media","pelucia-m"],[2,"pelucia mohair","boneca-pano"],[2,"pelucia p","pelucia-p"],[2,"pelucia pequena","pelucia-p"],[1,"pelucia","pelucia"]],"boneca":[[2,"boneca pano","boneca-pano"]],"fantasia":[[2,"fantasia carnaval","fantasia"],[2,"fantasia estruturada","fantasia-estruturada"],[2,"fantasia infantil","fantasia"],[2,"fantasia mascote","fantasia-estruturada"],[2,"fantasia simples","fantasia"],[1,"fantasia","fantasia"]],"costume":[[1,"costume","fantasia"]],"disfraz":[[1,"disfraz","fantasia"]],"mascote":[[1,"mascote","fantasia-estruturada"]],"estola":[[2,"estola pele","pele"]],"fur":[[2,"fur coat","pele"]],"comforter":[[1,"comforter","edredom"]],"acolchado":[[1,"acolchado","edredom"]],"plumon":[[1,"plumon","edredom"]],"blanket":[[1,"blanket","cobertor"]],"frazada":[[1,"frazada","cobertor"]],"cobija":[[1,"cobija","cobertor"]],"mattress":[[2,"mattress protector","protetor"],[1,"mattress","x:colchao"]],"towel":[[1,"towel","toalha"]],"tablecloth":[[1,"tablecloth","toalha-de-mesa"]],"mantel":[[1,"mantel","toalha-de-mesa"]],"pants":[[1,"pants","calca"]],"trousers":[[1,"trousers","calca"]],"jacket":[[1,"jacket","jaqueta"]],"chaqueta":[[1,"chaqueta","jaqueta"]],"coat":[[1,"coat","casaco"]],"abrigo":[[1,"abrigo","casaco"]],"kimono":[[1,"kimono","kimono"]],"quimono":[[1,"quimono","kimono"]],"bicho":[[2,"bicho pelucia","pelucia"]],"urso":[[2,"urso pelucia","pelucia"]],"ursinho":[[2,"ursinho pelucia","pelucia"]],"stuffed":[[2,"stuffed animal","pelucia"]],"teddy":[[2,"teddy bear","pelucia"]],"peluche":[[1,"peluche","pelucia"]],"mochila":[[1,"mochila","mochila-bone"]],"bone":[[1,"bone","mochila-bone"]],"backpack":[[1,"backpack","mochila-bone"]],"gorra":[[1,"gorra","mochila-bone"]],"couro":[[1,"couro","couro-outros"]],"colchao":[[1,"colchao","x:colchao"]],"colchon":[[1,"colchon","x:colchao"]],"travesseiro":[[1,"travesseiro","x:travesseiro"]],"pillow":[[1,"pillow","x:travesseiro"]],"almohada":[[1,"almohada","x:travesseiro"]],"saco":[[2,"saco dormir","x:saco-dormir"]],"sleeping":[[2,"sleeping bag","x:saco-dormir"]],"bolsa":[[2,"bolsa dormir","x:saco-dormir"],[1,"bolsa","x:bolsa"]],"electric":[[2,"electric blanket","x:cobertor-eletrico"]],"carpete":[[1,"carpete","x:tapete-grande"]],"carpet":[[1,"carpet","x:tapete-grande"]],"alfombra":[[1,"alfombra","x:tapete-grande"]],"almofada":[[1,"almofada","x:almofada"]],"enchimento":[[2,"enchimento almofada","x:almofada"]],"almohadon":[[1,"almohadon","x:almofada"]],"handbag":[[1,"handbag","x:bolsa"]],"purse":[[1,"purse","x:bolsa"]],"cartera":[[1,"cartera","x:bolsa"]],"cinto":[[1,"cinto","x:cinto"]],"belt":[[1,"belt","x:cinto"]],"cinturon":[[1,"cinturon","x:cinto"]],"carteira":[[1,"carteira","x:carteira"]],"wallet":[[1,"wallet","x:carteira"]],"billetera":[[1,"billetera","x:carteira"]],"bota":[[1,"bota","x:botas"]],"boots":[[1,"boots","x:botas"]],"botas":[[2,"botas couro","x:botas"],[2,"botas couros","x:botas"],[1,"botas","x:botas"]],"sapato":[[2,"sapato couro","x:sapato-social"],[2,"sapato social","x:sapato-social"],[1,"sapato","x:sapato-social"]],"zapato":[[1,"zapato","x:sapato-social"]],"camurca":[[1,"camurca","x:camurca"]],"nobuck":[[1,"nobuck","x:camurca"]],"chamois":[[1,"chamois","x:camurca"]],"suede":[[1,"suede","x:camurca"]],"gamuza":[[1,"gamuza","x:camurca"]],"gloves":[[1,"gloves","x:luvas"]],"guante":[[1,"guante","x:luvas"]],"persiana":[[1,"persiana","x:persiana"]],"blackout":[[2,"blackout plastico","x:persiana"],[2,"blackout revestido","x:persiana"]],"blinds":[[1,"blinds","x:persiana"]],"cama":[[2,"cama cachorro","x:pet"],[2,"cama gato","x:pet"],[2,"cama pet","x:pet"]],"caminha":[[2,"caminha cachorro","x:pet"],[2,"caminha gato","x:pet"],[2,"caminha pet","x:pet"],[1,"caminha","x:pet"]],"dog":[[2,"dog bed","x:pet"]],"pet":[[2,"pet bed","x:pet"]],"tingimento":[[1,"tingimento","x:tingimento"]],"tingir":[[1,"tingir","x:tingimento"]],"retoque":[[2,"retoque cor","x:tingimento"]],"dye":[[1,"dye","x:tingimento"]],"tenir":[[1,"tenir","x:tingimento"]],"conserto":[[1,"conserto","x:conserto"]],"consertar":[[1,"consertar","x:conserto"]],"barra":[[2,"barra calca","x:conserto"]],"fazer":[[2,"fazer barra","x:conserto"]],"bainha":[[1,"bainha","x:conserto"]],"trocar":[[3,"trocar o ziper","x:conserto"],[2,"trocar ziper","x:conserto"]],"ajuste":[[2,"ajuste roupa","x:conserto"]],"ajustar":[[2,"ajustar roupa","x:conserto"]],"arreglo":[[1,"arreglo","x:conserto"]],"alteration":[[1,"alteration","x:conserto"]],"alterations":[[1,"alterations","x:conserto"]],"limpeza":[[2,"limpeza local","x:no-local"],[2,"limpeza sofa","x:no-local"]],"lavar":[[2,"lavar local","x:no-local"],[2,"lavar sofa","x:no-local"]],"higienizacao":[[2,"higienizacao local","x:no-local"]],"limpar":[[2,"limpar sofa","x:no-local"]],"higienizar":[[2,"higienizar sofa","x:no-local"]],"estofado":[[1,"estofado","x:no-local"]],"roupas":[[4,"roupas dia a dia","a:pacotes"],[4,"roupas dias a dias","a:pacotes"],[3,"roupas uso diario","a:pacotes"],[3,"roupas usos diarios","a:pacotes"],[2,"roupas academia","moletom"],[2,"roupas academias","moletom"],[2,"roupas bebe","roupa-bebe"],[2,"roupas bebes","roupa-bebe"],[2,"roupas cama","lencois"],[2,"roupas camas","lencois"],[2,"roupas crianca","roupa-infantil"],[2,"roupas criancas","roupa-infantil"],[2,"roupas esportiva","moletom"],[2,"roupas esportivas","moletom"],[2,"roupas esqui","roupa-neve"],[2,"roupas esquis","roupa-neve"],[2,"roupas ginastica","moletom"],[2,"roupas ginasticas","moletom"],[2,"roupas infantil","roupa-infantil"],[2,"roupas infantis","roupa-infantil"],[2,"roupas moto","couro-outros"],[2,"roupas motos","couro-outros"],[2,"roupas neve","roupa-neve"],[2,"roupas neves","roupa-neve"],[2,"roupas pet","x:pet"],[2,"roupas pets","x:pet"],[2,"roupas ski","roupa-neve"],[2,"roupas skis","roupa-neve"]],"pecas":[[4,"pecas dia a dia","a:pacotes"],[4,"pecas dias a dias","a:pacotes"],[2,"pecas couro","couro-outros"],[2,"pecas couros","couro-outros"],[2,"pecas pele","pele"],[2,"pecas peles","pele"],[2,"pecas veludo","veludo"],[2,"pecas veludos","veludo"]],"camisas":[[3,"camisas manga curta","camisa-social"],[3,"camisas manga longa","camisa-social"],[3,"camisas mangas curtas","camisa-social"],[3,"camisas mangas longas","camisa-social"],[2,"camisas botao","camisa-social"],[2,"camisas botoes","camisa-social"],[2,"camisas formais","camisa-social"],[2,"camisas formal","camisa-social"],[2,"camisas futebois","camiseta"],[2,"camisas futebol","camiseta"],[2,"camisas linho","camisa-social"],[2,"camisas linhos","camisa-social"],[2,"camisas polo","camisa-polo"],[2,"camisas polos","camisa-polo"],[2,"camisas seda","camisa-seda"],[2,"camisas sedas","camisa-seda"],[2,"camisas smoking","camisa-smoking-veludo"],[2,"camisas smokings","camisa-smoking-veludo"],[2,"camisas sociais","camisa-social"],[2,"camisas social","camisa-social"],[2,"camisas time","camiseta"],[2,"camisas times","camiseta"],[2,"camisas veludo","camisa-smoking-veludo"],[2,"camisas veludos","camisa-smoking-veludo"],[1,"camisas","camisa-social"]],"dresses":[[2,"dresses pants","calca-social"],[2,"dresses shirt","camisa-social"],[2,"dresses shirts","camisa-social"],[2,"dresses shoes","x:sapato-social"],[1,"dresses","vestido"]],"shirts":[[1,"shirts","camisa-social"]],"polos":[[2,"polos shirt","camisa-polo"],[2,"polos shirts","camisa-polo"],[1,"polos","camisa-polo"]],"chombas":[[1,"chombas","camisa-polo"]],"camisetas":[[1,"camisetas","camiseta"]],"ts":[[2,"ts shirt","camiseta"]],"tshirts":[[1,"tshirts","camiseta"]],"remeras":[[1,"remeras","camiseta"]],"playeras":[[1,"playeras","camiseta"]],"silks":[[2,"silks blouse","blusa-seda"],[2,"silks blouses","blusa-seda"],[2,"silks shirt","camisa-seda"],[2,"silks shirts","camisa-seda"]],"ternos":[[2,"ternos completo","terno"],[2,"ternos completos","terno"],[1,"ternos","terno"]],"trajes":[[2,"trajes noivo","terno"],[2,"trajes noivos","terno"],[1,"trajes","terno"]],"suits":[[1,"suits","terno"]],"paletos":[[1,"paletos","paleto"]],"blazeres":[[2,"blazeres especiais","blazer-seda"],[2,"blazeres especial","blazer-seda"],[2,"blazeres linho","paleto"],[2,"blazeres linhos","paleto"],[2,"blazeres seda","blazer-seda"],[2,"blazeres sedas","blazer-seda"],[2,"blazeres veludo","veludo"],[2,"blazeres veludos","veludo"],[1,"blazeres","paleto"]],"blazers":[[2,"blazers especial","blazer-seda"],[2,"blazers linho","paleto"],[2,"blazers seda","blazer-seda"],[2,"blazers veludo","veludo"],[1,"blazers","paleto"]],"casacos":[[3,"casacos 3 4","casaco-34"],[3,"casacos 3 quartos","casaco-34"],[3,"casacos curto la","casaco-curto"],[3,"casacos curtos la","casaco-curto"],[3,"casacos la batida","casaco-curto"],[3,"casacos la batidas","casaco-curto"],[2,"casacos cashmere","casaco-curto"],[2,"casacos cashmeres","casaco-curto"],[2,"casacos curto","casaco-curto"],[2,"casacos curtos","casaco-curto"],[2,"casacos kimono","kimono-cima"],[2,"casacos kimonos","kimono-cima"],[2,"casacos la","casaco-curto"],[2,"casacos pele","pele"],[2,"casacos peles","pele"],[2,"casacos terno","paleto"],[2,"casacos ternos","paleto"],[2,"casacos tweed","casaco-curto"],[2,"casacos tweeds","casaco-curto"],[1,"casacos","casaco"]],"calcas":[[2,"calcas alfaiataria","calca-social"],[2,"calcas alfaiatarias","calca-social"],[2,"calcas bordado","calca-fina"],[2,"calcas bordados","calca-fina"],[2,"calcas couro","couro-outros"],[2,"calcas couros","couro-outros"],[2,"calcas esporte","calca-jeans"],[2,"calcas esportes","calca-jeans"],[2,"calcas jeans","calca-jeans"],[2,"calcas kimono","kimono-calca"],[2,"calcas kimonos","kimono-calca"],[2,"calcas linho","calca-fina"],[2,"calcas linhos","calca-fina"],[2,"calcas moletom","calca-jeans"],[2,"calcas moletons","calca-jeans"],[2,"calcas neve","roupa-neve"],[2,"calcas neves","roupa-neve"],[2,"calcas pedraria","calca-fina"],[2,"calcas pedrarias","calca-fina"],[2,"calcas sarja","calca-jeans"],[2,"calcas sarjas","calca-jeans"],[2,"calcas seda","calca-fina"],[2,"calcas sedas","calca-fina"],[2,"calcas sociais","calca-social"],[2,"calcas social","calca-social"],[2,"calcas terno","calca-social"],[2,"calcas ternos","calca-social"],[2,"calcas veludo","veludo"],[2,"calcas veludos","veludo"],[1,"calcas","calca"]],"pantalones":[[2,"pantalones vestir","calca-social"],[2,"pantalones vestires","calca-social"],[1,"pantalones","calca"]],"pantalons":[[2,"pantalons vestir","calca-social"],[1,"pantalons","calca"]],"gravatas":[[1,"gravatas","gravata"]],"ties":[[1,"ties","gravata"]],"corbatas":[[1,"corbatas","gravata"]],"coletes":[[2,"coletes pele","pele"],[2,"coletes peles","pele"],[2,"coletes puffer","jaqueta-sintetica"],[2,"coletes pufferes","jaqueta-sintetica"],[2,"coletes sociais","colete-smoking"],[2,"coletes social","colete-smoking"],[1,"coletes","colete-smoking"]],"smokings":[[1,"smokings","colete-smoking"]],"fraques":[[1,"fraques","colete-smoking"]],"tailleures":[[1,"tailleures","colete-smoking"]],"tailleurs":[[1,"tailleurs","colete-smoking"]],"saias":[[2,"saias cama","saia-cama"],[2,"saias camas","saia-cama"],[2,"saias couro","couro-outros"],[2,"saias couros","couro-outros"],[2,"saias linho","saia"],[2,"saias linhos","saia"],[2,"saias longa","saia"],[2,"saias longas","saia"],[2,"saias plissada","saia"],[2,"saias plissadas","saia"],[2,"saias pregas","saia"],[2,"saias seda","saia"],[2,"saias sedas","saia"],[2,"saias terno","colete-smoking"],[2,"saias ternos","colete-smoking"],[2,"saias veludo","veludo"],[2,"saias veludos","veludo"],[1,"saias","saia"]],"tuxedos":[[1,"tuxedos","colete-smoking"]],"edredons":[[3,"edredons 1 plaza","edredom-solteiro"],[3,"edredons king size","edredom-king"],[3,"edredons kings sizes","edredom-king"],[3,"edredons pelo cachorro","edredom-pet"],[3,"edredons pelo gato","edredom-pet"],[3,"edredons pelos cachorros","edredom-pet"],[3,"edredons pelos gatos","edredom-pet"],[3,"edredons pena casal","edredom-pena-casal"],[3,"edredons pena king","edredom-pena-king"],[3,"edredons pena queen","edredom-pena-queen"],[3,"edredons pena solteiro","edredom-pena-solteiro"],[3,"edredons penas casais","edredom-pena-casal"],[3,"edredons penas kings","edredom-pena-king"],[3,"edredons penas queenes","edredom-pena-queen"],[3,"edredons penas solteiros","edredom-pena-solteiro"],[3,"edredons pet la","edredom-pet-la-pena"],[3,"edredons pet pena","edredom-pet-la-pena"],[3,"edredons pets la","edredom-pet-la-pena"],[3,"edredons pets penas","edredom-pet-la-pena"],[3,"edredons pluma casal","edredom-pena-casal"],[3,"edredons pluma king","edredom-pena-king"],[3,"edredons pluma queen","edredom-pena-queen"],[3,"edredons pluma solteiro","edredom-pena-solteiro"],[3,"edredons plumas casais","edredom-pena-casal"],[3,"edredons plumas casal","edredom-pena-casal"],[3,"edredons plumas king","edredom-pena-king"],[3,"edredons plumas kings","edredom-pena-king"],[3,"edredons plumas queen","edredom-pena-queen"],[3,"edredons plumas queenes","edredom-pena-queen"],[3,"edredons plumas solteiro","edredom-pena-solteiro"],[3,"edredons plumas solteiros","edredom-pena-solteiro"],[3,"edredons queen size","edredom-queen"],[3,"edredons queenes sizes","edredom-queen"],[2,"edredons berco","roupa-infantil"],[2,"edredons bercos","roupa-infantil"],[2,"edredons casais","edredom-casal"],[2,"edredons casal","edredom-casal"],[2,"edredons doble","edredom-casal"],[2,"edredons ganso","edredom-pena"],[2,"edredons gansos","edredom-pena"],[2,"edredons individual","edredom-solteiro"],[2,"edredons king","edredom-king"],[2,"edredons kings","edredom-king"],[2,"edredons la","edredom-la"],[2,"edredons matrimonial","edredom-casal"],[2,"edredons pena","edredom-pena"],[2,"edredons penas","edredom-pena"],[2,"edredons pet","edredom-pet"],[2,"edredons pets","edredom-pet"],[2,"edredons pluma","edredom-pena"],[2,"edredons plumas","edredom-pena"],[2,"edredons queen","edredom-queen"],[2,"edredons queenes","edredom-queen"],[2,"edredons seda","edredom-seda"],[2,"edredons sedas","edredom-seda"],[2,"edredons solteiro","edredom-solteiro"],[2,"edredons solteiros","edredom-solteiro"],[1,"edredons","edredom"]],"edredoms":[[3,"edredoms king size","edredom-king"],[3,"edredoms pelo cachorro","edredom-pet"],[3,"edredoms pelo gato","edredom-pet"],[3,"edredoms pena casal","edredom-pena-casal"],[3,"edredoms pena king","edredom-pena-king"],[3,"edredoms pena queen","edredom-pena-queen"],[3,"edredoms pena solteiro","edredom-pena-solteiro"],[3,"edredoms pet la","edredom-pet-la-pena"],[3,"edredoms pet pena","edredom-pet-la-pena"],[3,"edredoms pluma casal","edredom-pena-casal"],[3,"edredoms pluma king","edredom-pena-king"],[3,"edredoms pluma queen","edredom-pena-queen"],[3,"edredoms pluma solteiro","edredom-pena-solteiro"],[3,"edredoms plumas casal","edredom-pena-casal"],[3,"edredoms plumas king","edredom-pena-king"],[3,"edredoms plumas queen","edredom-pena-queen"],[3,"edredoms plumas solteiro","edredom-pena-solteiro"],[3,"edredoms queen size","edredom-queen"],[2,"edredoms berco","roupa-infantil"],[2,"edredoms casal","edredom-casal"],[2,"edredoms ganso","edredom-pena"],[2,"edredoms king","edredom-king"],[2,"edredoms la","edredom-la"],[2,"edredoms pena","edredom-pena"],[2,"edredoms pet","edredom-pet"],[2,"edredoms pluma","edredom-pena"],[2,"edredoms plumas","edredom-pena"],[2,"edredoms queen","edredom-queen"],[2,"edredoms seda","edredom-seda"],[2,"edredoms solteiro","edredom-solteiro"],[1,"edredoms","edredom"]],"singles":[[2,"singles duvet","edredom-solteiro"],[2,"singles duvets","edredom-solteiro"]],"twines":[[2,"twines duvet","edredom-solteiro"],[2,"twines duvets","edredom-solteiro"]],"twins":[[2,"twins duvet","edredom-solteiro"]],"edredones":[[3,"edredones 1 plaza","edredom-solteiro"],[3,"edredones 1 plazas","edredom-solteiro"],[2,"edredones doble","edredom-casal"],[2,"edredones dobles","edredom-casal"],[2,"edredones individuais","edredom-solteiro"],[2,"edredones individual","edredom-solteiro"],[2,"edredones king","edredom-king"],[2,"edredones kings","edredom-king"],[2,"edredones matrimoniais","edredom-casal"],[2,"edredones matrimonial","edredom-casal"],[2,"edredones queen","edredom-queen"],[2,"edredones queenes","edredom-queen"],[1,"edredones","edredom"]],"doubles":[[2,"doubles duvet","edredom-casal"],[2,"doubles duvets","edredom-casal"]],"queenes":[[2,"queenes duvet","edredom-queen"],[2,"queenes duvets","edredom-queen"]],"queens":[[2,"queens duvet","edredom-queen"]],"kings":[[2,"kings duvet","edredom-king"],[2,"kings duvets","edredom-king"]],"cobertas":[[2,"cobertas la","edredom-la"]],"cobertores":[[2,"cobertores casais","cobertor-casal"],[2,"cobertores casal","cobertor-casal"],[2,"cobertores eletrico","x:cobertor-eletrico"],[2,"cobertores eletricos","x:cobertor-eletrico"],[2,"cobertores king","cobertor-king"],[2,"cobertores kings","cobertor-king"],[2,"cobertores la","edredom-la"],[2,"cobertores queen","cobertor-queen"],[2,"cobertores queenes","cobertor-queen"],[2,"cobertores solteiro","cobertor-solteiro"],[2,"cobertores solteiros","cobertor-solteiro"],[1,"cobertores","cobertor"]],"cobertors":[[2,"cobertors casal","cobertor-casal"],[2,"cobertors eletrico","x:cobertor-eletrico"],[2,"cobertors king","cobertor-king"],[2,"cobertors la","edredom-la"],[2,"cobertors queen","cobertor-queen"],[2,"cobertors solteiro","cobertor-solteiro"],[1,"cobertors","cobertor"]],"mantas":[[2,"mantas bebe","roupa-bebe"],[2,"mantas bebes","roupa-bebe"],[2,"mantas cama","cobertor"],[2,"mantas camas","cobertor"],[2,"mantas eletrica","x:cobertor-eletrico"],[2,"mantas eletricas","x:cobertor-eletrico"],[2,"mantas franja","manta-sofa"],[2,"mantas franjas","manta-sofa"],[2,"mantas la","edredom-la"],[2,"mantas sofa","manta-sofa"],[2,"mantas sofas","manta-sofa"]],"colchas":[[2,"colchas casais","cobertor-casal"],[2,"colchas casal","cobertor-casal"],[2,"colchas king","cobertor-king"],[2,"colchas kings","cobertor-king"],[2,"colchas pesada","colcha-pesada"],[2,"colchas pesadas","colcha-pesada"],[2,"colchas queen","cobertor-queen"],[2,"colchas queenes","cobertor-queen"],[2,"colchas seda","edredom-seda"],[2,"colchas sedas","edredom-seda"],[2,"colchas solteiro","cobertor-solteiro"],[2,"colchas solteiros","cobertor-solteiro"],[1,"colchas","cobertor"]],"capas":[[4,"capas almofada jogo colcha","capa-travesseiro"],[4,"capas almofadas jogos colchas","capa-travesseiro"],[3,"capas edredom pet","capa-edredom-pet"],[3,"capas edredons pets","capa-edredom-pet"],[2,"capas almofada","capa-almofada"],[2,"capas almofadas","capa-almofada"],[2,"capas chuva","jaqueta-impermeavel"],[2,"capas chuvas","jaqueta-impermeavel"],[2,"capas edredom","capa-edredom"],[2,"capas edredons","capa-edredom"],[2,"capas sofa","capa-sofa"],[2,"capas sofas","capa-sofa"],[2,"capas travesseiro","capa-travesseiro"],[2,"capas travesseiros","capa-travesseiro"]],"duvets":[[2,"duvets cover","capa-edredom"],[2,"duvets coveres","capa-edredom"],[1,"duvets","edredom"]],"fundas":[[2,"fundas almohada","lencois"],[2,"fundas almohadas","lencois"],[2,"fundas edredon","capa-edredom"],[2,"fundas edredones","capa-edredom"],[2,"fundas sofa","capa-sofa"],[2,"fundas sofas","capa-sofa"]],"lencois":[[2,"lencois elastico","lencois"],[2,"lencois elasticos","lencois"],[2,"lencois seda","jogo-cama-seda"],[2,"lencois sedas","jogo-cama-seda"],[1,"lencois","lencois"]],"lencols":[[2,"lencols elastico","lencois"],[2,"lencols seda","jogo-cama-seda"],[1,"lencols","lencois"]],"fronhas":[[1,"fronhas","lencois"]],"jogos":[[3,"jogos cama seda","jogo-cama-seda"],[3,"jogos camas sedas","jogo-cama-seda"],[2,"jogos americano","guardanapo"],[2,"jogos americanos","guardanapo"],[2,"jogos cama","lencois"],[2,"jogos camas","lencois"],[2,"jogos lencois","lencois"],[2,"jogos lencol","lencois"]],"beds":[[2,"beds sheets","lencois"]],"pillowcases":[[1,"pillowcases","lencois"]],"sabanas":[[1,"sabanas","lencois"]],"protetores":[[3,"protetores colchao casal","protetor-casal"],[3,"protetores colchao king","protetor-king"],[3,"protetores colchao queen","protetor-casal"],[3,"protetores colchao solteiro","protetor-solteiro"],[3,"protetores colchoes casais","protetor-casal"],[3,"protetores colchoes kings","protetor-king"],[3,"protetores colchoes queenes","protetor-casal"],[3,"protetores colchoes solteiros","protetor-solteiro"],[2,"protetores colchao","protetor"],[2,"protetores colchoes","protetor"]],"protetors":[[3,"protetors colchao casal","protetor-casal"],[3,"protetors colchao king","protetor-king"],[3,"protetors colchao queen","protetor-casal"],[3,"protetors colchao solteiro","protetor-solteiro"],[2,"protetors colchao","protetor"]],"toalhas":[[3,"toalhas mesa banquete","toalha-mesa-grande"],[3,"toalhas mesa grande","toalha-mesa-grande"],[3,"toalhas mesa lisa","toalha-mesa"],[3,"toalhas mesa media","toalha-mesa-media"],[3,"toalhas mesa pequena","toalha-mesa"],[3,"toalhas mesa simples","toalha-mesa"],[3,"toalhas mesas banquetes","toalha-mesa-grande"],[3,"toalhas mesas grandes","toalha-mesa-grande"],[3,"toalhas mesas lisas","toalha-mesa"],[3,"toalhas mesas medias","toalha-mesa-media"],[3,"toalhas mesas pequenas","toalha-mesa"],[3,"toalhas mesas simples","toalha-mesa"],[3,"toalhas salao beleza","toalha-salao"],[3,"toalhas saloes belezas","toalha-salao"],[2,"toalhas bandeja","caminho-mesa"],[2,"toalhas bandejas","caminho-mesa"],[2,"toalhas banho","toalha-banho"],[2,"toalhas banhos","toalha-banho"],[2,"toalhas banquete","toalha-mesa-grande"],[2,"toalhas banquetes","toalha-mesa-grande"],[2,"toalhas barbearia","toalha-salao"],[2,"toalhas barbearias","toalha-salao"],[2,"toalhas bordada","caminho-mesa"],[2,"toalhas bordadas","caminho-mesa"],[2,"toalhas capuz","roupa-bebe"],[2,"toalhas capuzes","roupa-bebe"],[2,"toalhas lavabo","toalha-rosto"],[2,"toalhas lavabos","toalha-rosto"],[2,"toalhas mao","toalha-rosto"],[2,"toalhas mesa","toalha-de-mesa"],[2,"toalhas mesas","toalha-de-mesa"],[2,"toalhas moes","toalha-rosto"],[2,"toalhas piso","toalha-rosto"],[2,"toalhas pisos","toalha-rosto"],[2,"toalhas rosto","toalha-rosto"],[2,"toalhas rostos","toalha-rosto"],[2,"toalhas salao","toalha-salao"],[2,"toalhas saloes","toalha-salao"],[1,"toalhas","toalha"]],"toalhoes":[[1,"toalhoes","toalha-banho"]],"toalhaos":[[1,"toalhaos","toalha-banho"]],"baths":[[2,"baths toweis","toalha-banho"],[2,"baths towel","toalha-banho"]],"toallas":[[2,"toallas bano","toalha-banho"],[2,"toallas banos","toalha-banho"],[2,"toallas mano","toalha-rosto"],[2,"toallas manos","toalha-rosto"],[1,"toallas","toalha"]],"hands":[[2,"hands toweis","toalha-rosto"],[2,"hands towel","toalha-rosto"]],"roupoes":[[1,"roupoes","roupao"]],"roupaos":[[1,"roupaos","roupao"]],"bathrobes":[[1,"bathrobes","roupao"]],"robes":[[1,"robes","robe"]],"guardanapos":[[2,"guardanapos copo","caminho-mesa"],[2,"guardanapos copos","caminho-mesa"],[1,"guardanapos","guardanapo"]],"napkines":[[1,"napkines","guardanapo"]],"napkins":[[1,"napkins","guardanapo"]],"servilletas":[[1,"servilletas","guardanapo"]],"caminhos":[[2,"caminhos mesa","caminho-mesa"],[2,"caminhos mesas","caminho-mesa"]],"vestidos":[[3,"vestidos festa infantil","vestido-infantil"],[3,"vestidos festas infantis","vestido-infantil"],[3,"vestidos formatura abc","vestido-infantil"],[3,"vestidos formaturas abcs","vestido-infantil"],[3,"vestidos primeira comunhao","vestido-infantil"],[3,"vestidos primeiras comunhoes","vestido-infantil"],[2,"vestidos algodao","vestido-simples"],[2,"vestidos algodoes","vestido-simples"],[2,"vestidos batizado","vestido-infantil"],[2,"vestidos batizados","vestido-infantil"],[2,"vestidos cetim","vestido-festa"],[2,"vestidos cetins","vestido-festa"],[2,"vestidos couro","couro-outros"],[2,"vestidos couros","couro-outros"],[2,"vestidos daminha","vestido-infantil"],[2,"vestidos daminhas","vestido-infantil"],[2,"vestidos festa","vestido-festa"],[2,"vestidos festas","vestido-festa"],[2,"vestidos fiesta","vestido-festa"],[2,"vestidos fiestas","vestido-festa"],[2,"vestidos formatura","vestido-festa"],[2,"vestidos formaturas","vestido-festa"],[2,"vestidos gala","vestido-festa"],[2,"vestidos galas","vestido-festa"],[2,"vestidos infantil","vestido-infantil"],[2,"vestidos infantis","vestido-infantil"],[2,"vestidos linho","vestido-simples"],[2,"vestidos linhos","vestido-simples"],[2,"vestidos longo","vestido-festa"],[2,"vestidos longos","vestido-festa"],[2,"vestidos madrinha","vestido-festa"],[2,"vestidos madrinhas","vestido-festa"],[2,"vestidos malha","vestido-simples"],[2,"vestidos malhas","vestido-simples"],[2,"vestidos midi","vestido-midi"],[2,"vestidos midis","vestido-midi"],[2,"vestidos noiva","vestido-noiva"],[2,"vestidos noivas","vestido-noiva"],[2,"vestidos novia","vestido-noiva"],[2,"vestidos novias","vestido-noiva"],[2,"vestidos pedraria","vestido-festa"],[2,"vestidos pedrarias","vestido-festa"],[2,"vestidos seda","vestido-festa"],[2,"vestidos sedas","vestido-festa"],[2,"vestidos simples","vestido-simples"],[2,"vestidos tule","vestido-festa"],[2,"vestidos tules","vestido-festa"],[1,"vestidos","vestido"]],"altas":[[2,"altas costura","vestido-festa"],[2,"altas costuras","vestido-festa"]],"evenings":[[2,"evenings dress","vestido-festa"],[2,"evenings dresses","vestido-festa"]],"gownes":[[1,"gownes","vestido-festa"]],"gowns":[[1,"gowns","vestido-festa"]],"weddings":[[2,"weddings dress","vestido-noiva"],[2,"weddings dresses","vestido-noiva"]],"bridais":[[2,"bridais gown","vestido-noiva"],[2,"bridais gownes","vestido-noiva"]],"bridals":[[2,"bridals gown","vestido-noiva"]],"blusas":[[2,"blusas detalhes","blusa-seda"],[2,"blusas la","agasalho-la"],[2,"blusas seda","blusa-seda"],[2,"blusas sedas","blusa-seda"],[2,"blusas simples","blusa-simples"],[1,"blusas","blusa-simples"]],"blouses":[[1,"blouses","blusa-simples"]],"regatas":[[2,"regatas seda","blusa-seda"],[2,"regatas sedas","blusa-seda"]],"skirts":[[1,"skirts","saia"]],"faldas":[[1,"faldas","saia"]],"macacoes":[[2,"macacoes couro","couro-outros"],[2,"macacoes couros","couro-outros"],[2,"macacoes neve","roupa-neve"],[2,"macacoes neves","roupa-neve"],[1,"macacoes","macacao"]],"macacaos":[[2,"macacaos couro","couro-outros"],[2,"macacaos neve","roupa-neve"],[1,"macacaos","macacao"]],"macaquinhos":[[1,"macaquinhos","macacao"]],"conjuntos":[[2,"conjuntos festa","macacao"],[2,"conjuntos festas","macacao"]],"tops":[[2,"tops festa","macacao"],[2,"tops festas","macacao"],[2,"tops seda","macacao"],[2,"tops sedas","macacao"]],"jumpsuits":[[1,"jumpsuits","macacao"]],"bermudas":[[2,"bermudas linho","calca-fina"],[2,"bermudas linhos","calca-fina"],[2,"bermudas seda","calca-fina"],[2,"bermudas sedas","calca-fina"],[1,"bermudas","bermuda"]],"veludos":[[1,"veludos","veludo"]],"pashminas":[[1,"pashminas","cashmere"]],"cachecois":[[1,"cachecois","cashmere"]],"cachecols":[[1,"cachecols","cashmere"]],"cashmeres":[[1,"cashmeres","cashmere"]],"caxemiras":[[1,"caxemiras","cashmere"]],"sueteres":[[2,"sueteres cashmere","cashmere"],[2,"sueteres cashmeres","cashmere"],[2,"sueteres la","agasalho-la"],[1,"sueteres","agasalho-la"]],"sueters":[[2,"sueters cashmere","cashmere"],[2,"sueters la","agasalho-la"],[1,"sueters","agasalho-la"]],"cardigas":[[2,"cardigas cashmere","cashmere"],[2,"cardigas cashmeres","cashmere"],[1,"cardigas","agasalho-la"]],"scarfs":[[1,"scarfs","cashmere"]],"bufandas":[[1,"bufandas","cashmere"]],"camisolas":[[2,"camisolas seda","pijama-seda"],[2,"camisolas sedas","pijama-seda"]],"pijamas":[[2,"pijamas seda","pijama-seda"],[2,"pijamas sedas","pijama-seda"],[1,"pijamas","pijama"]],"lencos":[[2,"lencos seda","lenco-seda"],[2,"lencos sedas","lenco-seda"],[1,"lencos","lenco-seda"]],"echarpes":[[2,"echarpes seda","lenco-seda"],[2,"echarpes sedas","lenco-seda"],[1,"echarpes","lenco-seda"]],"foulards":[[1,"foulards","lenco-seda"]],"sapatilhas":[[1,"sapatilhas","tenis"]],"pantufas":[[1,"pantufas","tenis"]],"sneakeres":[[1,"sneakeres","tenis"]],"jaquetas":[[3,"jaquetas sem enchimento","jaqueta-sem-enchimento"],[3,"jaquetas sens enchimentos","jaqueta-sem-enchimento"],[2,"jaquetas acolchoada","jaqueta-sintetica"],[2,"jaquetas acolchoadas","jaqueta-sintetica"],[2,"jaquetas couro","jaqueta-couro"],[2,"jaquetas couros","jaqueta-couro"],[2,"jaquetas enchimento","jaqueta-sintetica"],[2,"jaquetas enchimentos","jaqueta-sintetica"],[2,"jaquetas impermeaveis","jaqueta-impermeavel"],[2,"jaquetas impermeavel","jaqueta-impermeavel"],[2,"jaquetas infantil","jaqueta-sem-enchimento"],[2,"jaquetas infantis","jaqueta-sem-enchimento"],[2,"jaquetas jeans","jaqueta-sem-enchimento"],[2,"jaquetas moletom","jaqueta-sem-enchimento"],[2,"jaquetas moletons","jaqueta-sem-enchimento"],[2,"jaquetas neve","roupa-neve"],[2,"jaquetas neves","roupa-neve"],[2,"jaquetas nylon","jaqueta-sem-enchimento"],[2,"jaquetas nylones","jaqueta-sem-enchimento"],[2,"jaquetas pena","jaqueta-pena"],[2,"jaquetas penas","jaqueta-pena"],[2,"jaquetas pluma","jaqueta-pena"],[2,"jaquetas plumas","jaqueta-pena"],[2,"jaquetas poliester","jaqueta-sem-enchimento"],[2,"jaquetas poliesteres","jaqueta-sem-enchimento"],[2,"jaquetas puffer","jaqueta-sintetica"],[2,"jaquetas pufferes","jaqueta-sintetica"],[1,"jaquetas","jaqueta"]],"cortas":[[2,"cortas vento","jaqueta-sem-enchimento"],[2,"cortas ventos","jaqueta-sem-enchimento"]],"bomberes":[[1,"bomberes","jaqueta-sem-enchimento"]],"bombers":[[1,"bombers","jaqueta-sem-enchimento"]],"windbreakeres":[[1,"windbreakeres","jaqueta-sem-enchimento"]],"windbreakers":[[1,"windbreakers","jaqueta-sem-enchimento"]],"pufferes":[[2,"pufferes jacket","jaqueta-sintetica"],[2,"pufferes jackets","jaqueta-sintetica"],[1,"pufferes","jaqueta-sintetica"]],"puffers":[[2,"puffers jacket","jaqueta-sintetica"],[1,"puffers","jaqueta-sintetica"]],"raincoats":[[1,"raincoats","jaqueta-impermeavel"]],"anoraks":[[1,"anoraks","jaqueta-impermeavel"]],"downes":[[2,"downes duvet","edredom-pena"],[2,"downes duvets","edredom-pena"],[2,"downes jacket","jaqueta-pena"],[2,"downes jackets","jaqueta-pena"]],"downs":[[2,"downs duvet","edredom-pena"],[2,"downs jacket","jaqueta-pena"]],"camperas":[[2,"camperas cuero","jaqueta-couro"],[2,"camperas cueros","jaqueta-couro"],[2,"camperas plumas","jaqueta-pena"],[1,"camperas","jaqueta"]],"leatheres":[[2,"leatheres jacket","jaqueta-couro"],[2,"leatheres jackets","jaqueta-couro"],[1,"leatheres","couro-outros"]],"leathers":[[2,"leathers jacket","jaqueta-couro"],[1,"leathers","couro-outros"]],"trenchs":[[2,"trenchs coat","trench-coat"],[2,"trenchs coats","trench-coat"]],"trenchcoats":[[1,"trenchcoats","trench-coat"]],"sobretudos":[[2,"sobretudos couro","couro-outros"],[2,"sobretudos couros","couro-outros"],[1,"sobretudos","sobretudo"]],"overcoats":[[1,"overcoats","sobretudo"]],"sobretodos":[[1,"sobretodos","sobretudo"]],"agasalhos":[[2,"agasalhos esportivo","moletom"],[2,"agasalhos esportivos","moletom"],[2,"agasalhos la","agasalho-la"],[1,"agasalhos","agasalho-la"]],"blusoes":[[1,"blusoes","agasalho-la"]],"blusaos":[[1,"blusaos","agasalho-la"]],"tricos":[[1,"tricos","agasalho-la"]],"tricots":[[1,"tricots","agasalho-la"]],"sweateres":[[1,"sweateres","agasalho-la"]],"sweaters":[[1,"sweaters","agasalho-la"]],"puloveres":[[1,"puloveres","agasalho-la"]],"pulovers":[[1,"pulovers","agasalho-la"]],"luvas":[[2,"luvas moto","couro-outros"],[2,"luvas motos","couro-outros"],[2,"luvas neve","roupa-neve"],[2,"luvas neves","roupa-neve"],[1,"luvas","x:luvas"]],"skis":[[2,"skis jacket","roupa-neve"],[2,"skis jackets","roupa-neve"]],"cortinas":[[2,"cortinas blackout","cortina"],[2,"cortinas blackouts","cortina"],[2,"cortinas locais","x:no-local"],[2,"cortinas local","x:no-local"],[2,"cortinas voais","cortina"],[2,"cortinas voal","cortina"],[1,"cortinas","cortina"]],"voais":[[1,"voais","cortina"]],"voals":[[1,"voals","cortina"]],"curtaines":[[1,"curtaines","cortina"]],"sofas":[[2,"sofas cover","capa-sofa"],[2,"sofas coveres","capa-sofa"]],"cushiones":[[2,"cushiones cover","capa-almofada"],[2,"cushiones coveres","capa-almofada"],[1,"cushiones","x:almofada"]],"cushions":[[2,"cushions cover","capa-almofada"],[1,"cushions","x:almofada"]],"tapetes":[[2,"tapetes banheiro","tapete-banheiro"],[2,"tapetes banheiros","tapete-banheiro"],[2,"tapetes gigante","x:tapete-grande"],[2,"tapetes gigantes","x:tapete-grande"],[2,"tapetes grande","x:tapete-grande"],[2,"tapetes grandes","x:tapete-grande"],[2,"tapetes locais","x:no-local"],[2,"tapetes local","x:no-local"],[2,"tapetes medio","tapete-medio"],[2,"tapetes medios","tapete-medio"],[2,"tapetes pequeno","tapete-pequeno"],[2,"tapetes pequenos","tapete-pequeno"],[2,"tapetes sala","tapete-pequeno"],[2,"tapetes salas","tapete-pequeno"],[1,"tapetes","tapete-pequeno"]],"passadeiras":[[1,"passadeiras","tapete-pequeno"]],"rugs":[[1,"rugs","tapete-pequeno"]],"redes":[[2,"redes dormir","rede"],[2,"redes dormires","rede"],[1,"redes","rede"]],"hammocks":[[1,"hammocks","rede"]],"hamacas":[[1,"hamacas","rede"]],"carrinhos":[[3,"carrinhos 3 rodas","carrinho-outros"],[3,"carrinhos guarda chuva","carrinho-outros"],[3,"carrinhos guardas chuvas","carrinho-outros"],[2,"carrinhos bebe","carrinho"],[2,"carrinhos bebes","carrinho"],[2,"carrinhos duplo","carrinho-outros"],[2,"carrinhos duplos","carrinho-outros"],[2,"carrinhos gemeos","carrinho-outros"],[2,"carrinhos passeio","carrinho"],[2,"carrinhos passeios","carrinho"],[1,"carrinhos","carrinho"]],"strolleres":[[1,"strolleres","carrinho"]],"strollers":[[1,"strollers","carrinho"]],"prans":[[1,"prans","carrinho"]],"prams":[[1,"prams","carrinho"]],"cochecitos":[[1,"cochecitos","carrinho"]],"bebes":[[2,"bebes conforto","bebe-conforto"],[2,"bebes confortos","bebe-conforto"]],"cadeirinhas":[[2,"cadeirinhas carro","bebe-conforto"],[2,"cadeirinhas carros","bebe-conforto"],[1,"cadeirinhas","bebe-conforto"]],"cadeiras":[[2,"cadeiras carro","bebe-conforto"],[2,"cadeiras carros","bebe-conforto"]],"cares":[[2,"cares seat","bebe-conforto"],[2,"cares seats","bebe-conforto"]],"cars":[[2,"cars seat","bebe-conforto"]],"sillas":[[2,"sillas auto","bebe-conforto"],[2,"sillas autos","bebe-conforto"]],"traveis":[[2,"traveis system","carrinho-outros"],[2,"traveis systens","carrinho-outros"]],"travels":[[2,"travels system","carrinho-outros"]],"bases":[[3,"bases bebe conforto","carrinho-outros"],[3,"bases bebes confortos","carrinho-outros"]],"roupinhas":[[2,"roupinhas bebe","roupa-bebe"],[2,"roupinhas bebes","roupa-bebe"],[2,"roupinhas cachorro","x:pet"],[2,"roupinhas cachorros","x:pet"],[2,"roupinhas pet","x:pet"],[2,"roupinhas pets","x:pet"],[1,"roupinhas","roupa-bebe"]],"enxovais":[[2,"enxovais bebe","roupa-bebe"],[2,"enxovais bebes","roupa-bebe"]],"enxovals":[[2,"enxovals bebe","roupa-bebe"]],"bodies":[[1,"bodies","roupa-bebe"]],"bodys":[[1,"bodys","roupa-bebe"]],"cueiros":[[1,"cueiros","roupa-bebe"]],"kits":[[2,"kits berco","roupa-bebe"],[2,"kits bercos","roupa-bebe"]],"fraldas":[[2,"fraldas pano","roupa-bebe"],[2,"fraldas panos","roupa-bebe"]],"babies":[[2,"babies clothes","roupa-bebe"]],"babys":[[2,"babys clothes","roupa-bebe"]],"ropas":[[2,"ropas bebe","roupa-bebe"],[2,"ropas bebes","roupa-bebe"]],"ninhos":[[2,"ninhos bebe","roupa-infantil"],[2,"ninhos bebes","roupa-infantil"]],"moletons":[[1,"moletons","moletom"]],"moletoms":[[1,"moletoms","moletom"]],"leggings":[[1,"leggings","moletom"]],"hoodies":[[1,"hoodies","moletom"]],"sweatshirts":[[1,"sweatshirts","moletom"]],"buzos":[[1,"buzos","moletom"]],"pyjamas":[[1,"pyjamas","pijama"]],"fardas":[[1,"fardas","farda"]],"uniformes":[[2,"uniformes escolar","farda"],[2,"uniformes escolares","farda"],[2,"uniformes trabalho","farda"],[2,"uniformes trabalhos","farda"],[2,"uniformes tripulacao","uniforme-tripulacao"],[2,"uniformes tripulacoes","uniforme-tripulacao"],[1,"uniformes","farda"]],"uniforns":[[1,"uniforns","farda"]],"uniforms":[[1,"uniforms","farda"]],"jalecos":[[2,"jalecos cozinha","jaleco"],[2,"jalecos cozinhas","jaleco"],[1,"jalecos","jaleco"]],"dolmas":[[1,"dolmas","jaleco"]],"labs":[[2,"labs coat","jaleco"],[2,"labs coats","jaleco"]],"chefs":[[2,"chefs jacket","jaleco"],[2,"chefs jackets","jaleco"]],"becas":[[2,"becas formatura","beca"],[2,"becas formaturas","beca"],[1,"becas","beca"]],"togas":[[1,"togas","beca"]],"partes":[[3,"partes cima kimono","kimono-cima"],[3,"partes cimas kimonos","kimono-cima"]],"casulas":[[1,"casulas","vestes-sacerdotais"]],"batinas":[[1,"batinas","vestes-sacerdotais"]],"pelucias":[[2,"pelucias extragrande","pelucia-gg"],[2,"pelucias extragrandes","pelucia-gg"],[2,"pelucias g","pelucia-g"],[2,"pelucias gg","pelucia-gg"],[2,"pelucias gigante","pelucia-gg"],[2,"pelucias gigantes","pelucia-gg"],[2,"pelucias grande","pelucia-g"],[2,"pelucias grandes","pelucia-g"],[2,"pelucias isopor","boneca-pano"],[2,"pelucias isopores","boneca-pano"],[2,"pelucias m","pelucia-m"],[2,"pelucias media","pelucia-m"],[2,"pelucias medias","pelucia-m"],[2,"pelucias mohair","boneca-pano"],[2,"pelucias mohaires","boneca-pano"],[2,"pelucias p","pelucia-p"],[2,"pelucias pequena","pelucia-p"],[2,"pelucias pequenas","pelucia-p"],[1,"pelucias","pelucia"]],"bonecas":[[2,"bonecas pano","boneca-pano"],[2,"bonecas panos","boneca-pano"]],"fantasias":[[2,"fantasias carnavais","fantasia"],[2,"fantasias carnaval","fantasia"],[2,"fantasias estruturada","fantasia-estruturada"],[2,"fantasias estruturadas","fantasia-estruturada"],[2,"fantasias infantil","fantasia"],[2,"fantasias infantis","fantasia"],[2,"fantasias mascote","fantasia-estruturada"],[2,"fantasias mascotes","fantasia-estruturada"],[2,"fantasias simples","fantasia"],[1,"fantasias","fantasia"]],"costumes":[[1,"costumes","fantasia"]],"disfrazes":[[1,"disfrazes","fantasia"]],"disfrazs":[[1,"disfrazs","fantasia"]],"mascotes":[[1,"mascotes","fantasia-estruturada"]],"estolas":[[2,"estolas pele","pele"],[2,"estolas peles","pele"]],"fures":[[2,"fures coat","pele"],[2,"fures coats","pele"]],"furs":[[2,"furs coat","pele"]],"comforteres":[[1,"comforteres","edredom"]],"comforters":[[1,"comforters","edredom"]],"acolchados":[[1,"acolchados","edredom"]],"plumones":[[1,"plumones","edredom"]],"plumons":[[1,"plumons","edredom"]],"blankets":[[1,"blankets","cobertor"]],"frazadas":[[1,"frazadas","cobertor"]],"cobijas":[[1,"cobijas","cobertor"]],"mattresses":[[2,"mattresses protector","protetor"],[2,"mattresses protectores","protetor"],[1,"mattresses","x:colchao"]],"toweis":[[1,"toweis","toalha"]],"towels":[[1,"towels","toalha"]],"tablecloths":[[1,"tablecloths","toalha-de-mesa"]],"manteis":[[1,"manteis","toalha-de-mesa"]],"mantels":[[1,"mantels","toalha-de-mesa"]],"jackets":[[1,"jackets","jaqueta"]],"chaquetas":[[1,"chaquetas","jaqueta"]],"coats":[[1,"coats","casaco"]],"abrigos":[[1,"abrigos","casaco"]],"kimonos":[[1,"kimonos","kimono"]],"quimonos":[[1,"quimonos","kimono"]],"bichos":[[2,"bichos pelucia","pelucia"],[2,"bichos pelucias","pelucia"]],"ursos":[[2,"ursos pelucia","pelucia"],[2,"ursos pelucias","pelucia"]],"ursinhos":[[2,"ursinhos pelucia","pelucia"],[2,"ursinhos pelucias","pelucia"]],"stuffeds":[[2,"stuffeds animais","pelucia"],[2,"stuffeds animal","pelucia"]],"teddies":[[2,"teddies bear","pelucia"],[2,"teddies beares","pelucia"]],"teddys":[[2,"teddys bear","pelucia"]],"peluches":[[1,"peluches","pelucia"]],"mochilas":[[1,"mochilas","mochila-bone"]],"bones":[[1,"bones","mochila-bone"]],"backpacks":[[1,"backpacks","mochila-bone"]],"gorras":[[1,"gorras","mochila-bone"]],"couros":[[1,"couros","couro-outros"]],"colchoes":[[1,"colchoes","x:colchao"]],"colchaos":[[1,"colchaos","x:colchao"]],"colchones":[[1,"colchones","x:colchao"]],"colchons":[[1,"colchons","x:colchao"]],"travesseiros":[[1,"travesseiros","x:travesseiro"]],"pillows":[[1,"pillows","x:travesseiro"]],"almohadas":[[1,"almohadas","x:travesseiro"]],"sacos":[[2,"sacos dormir","x:saco-dormir"],[2,"sacos dormires","x:saco-dormir"]],"sleepings":[[2,"sleepings bag","x:saco-dormir"],[2,"sleepings bags","x:saco-dormir"]],"bolsas":[[2,"bolsas dormir","x:saco-dormir"],[2,"bolsas dormires","x:saco-dormir"],[1,"bolsas","x:bolsa"]],"electrics":[[2,"electrics blanket","x:cobertor-eletrico"],[2,"electrics blankets","x:cobertor-eletrico"]],"carpetes":[[1,"carpetes","x:tapete-grande"]],"carpets":[[1,"carpets","x:tapete-grande"]],"alfombras":[[1,"alfombras","x:tapete-grande"]],"almofadas":[[1,"almofadas","x:almofada"]],"enchimentos":[[2,"enchimentos almofada","x:almofada"],[2,"enchimentos almofadas","x:almofada"]],"almohadones":[[1,"almohadones","x:almofada"]],"almohadons":[[1,"almohadons","x:almofada"]],"handbags":[[1,"handbags","x:bolsa"]],"purses":[[1,"purses","x:bolsa"]],"carteras":[[1,"carteras","x:bolsa"]],"cintos":[[1,"cintos","x:cinto"]],"belts":[[1,"belts","x:cinto"]],"cinturones":[[1,"cinturones","x:cinto"]],"cinturons":[[1,"cinturons","x:cinto"]],"carteiras":[[1,"carteiras","x:carteira"]],"wallets":[[1,"wallets","x:carteira"]],"billeteras":[[1,"billeteras","x:carteira"]],"sapatos":[[2,"sapatos couro","x:sapato-social"],[2,"sapatos couros","x:sapato-social"],[2,"sapatos sociais","x:sapato-social"],[2,"sapatos social","x:sapato-social"],[1,"sapatos","x:sapato-social"]],"zapatos":[[1,"zapatos","x:sapato-social"]],"camurcas":[[1,"camurcas","x:camurca"]],"nobucks":[[1,"nobucks","x:camurca"]],"suedes":[[1,"suedes","x:camurca"]],"gamuzas":[[1,"gamuzas","x:camurca"]],"guantes":[[1,"guantes","x:luvas"]],"persianas":[[1,"persianas","x:persiana"]],"blackouts":[[2,"blackouts plastico","x:persiana"],[2,"blackouts plasticos","x:persiana"],[2,"blackouts revestido","x:persiana"],[2,"blackouts revestidos","x:persiana"]],"camas":[[2,"camas cachorro","x:pet"],[2,"camas cachorros","x:pet"],[2,"camas gato","x:pet"],[2,"camas gatos","x:pet"],[2,"camas pet","x:pet"],[2,"camas pets","x:pet"]],"caminhas":[[2,"caminhas cachorro","x:pet"],[2,"caminhas cachorros","x:pet"],[2,"caminhas gato","x:pet"],[2,"caminhas gatos","x:pet"],[2,"caminhas pet","x:pet"],[2,"caminhas pets","x:pet"],[1,"caminhas","x:pet"]],"dogs":[[2,"dogs bed","x:pet"],[2,"dogs beds","x:pet"]],"pets":[[2,"pets bed","x:pet"],[2,"pets beds","x:pet"]],"tingimentos":[[1,"tingimentos","x:tingimento"]],"tingires":[[1,"tingires","x:tingimento"]],"tingirs":[[1,"tingirs","x:tingimento"]],"retoques":[[2,"retoques cor","x:tingimento"],[2,"retoques cores","x:tingimento"]],"dyes":[[1,"dyes","x:tingimento"]],"tenires":[[1,"tenires","x:tingimento"]],"tenirs":[[1,"tenirs","x:tingimento"]],"consertos":[[1,"consertos","x:conserto"]],"consertares":[[1,"consertares","x:conserto"]],"consertars":[[1,"consertars","x:conserto"]],"barras":[[2,"barras calca","x:conserto"],[2,"barras calcas","x:conserto"]],"fazeres":[[2,"fazeres barra","x:conserto"],[2,"fazeres barras","x:conserto"]],"fazers":[[2,"fazers barra","x:conserto"]],"bainhas":[[1,"bainhas","x:conserto"]],"trocares":[[3,"trocares o ziper","x:conserto"],[3,"trocares o ziperes","x:conserto"],[2,"trocares ziper","x:conserto"],[2,"trocares ziperes","x:conserto"]],"trocars":[[3,"trocars o ziper","x:conserto"],[2,"trocars ziper","x:conserto"]],"ajustes":[[2,"ajustes roupa","x:conserto"],[2,"ajustes roupas","x:conserto"]],"ajustares":[[2,"ajustares roupa","x:conserto"],[2,"ajustares roupas","x:conserto"]],"ajustars":[[2,"ajustars roupa","x:conserto"]],"arreglos":[[1,"arreglos","x:conserto"]],"alterationes":[[1,"alterationes","x:conserto"]],"limpezas":[[2,"limpezas locais","x:no-local"],[2,"limpezas local","x:no-local"],[2,"limpezas sofa","x:no-local"],[2,"limpezas sofas","x:no-local"]],"lavares":[[2,"lavares locais","x:no-local"],[2,"lavares local","x:no-local"],[2,"lavares sofa","x:no-local"],[2,"lavares sofas","x:no-local"]],"lavars":[[2,"lavars local","x:no-local"],[2,"lavars sofa","x:no-local"]],"higienizacoes":[[2,"higienizacoes locais","x:no-local"],[2,"higienizacoes local","x:no-local"]],"higienizacaos":[[2,"higienizacaos local","x:no-local"]],"limpares":[[2,"limpares sofa","x:no-local"],[2,"limpares sofas","x:no-local"]],"limpars":[[2,"limpars sofa","x:no-local"]],"higienizares":[[2,"higienizares sofa","x:no-local"],[2,"higienizares sofas","x:no-local"]],"higienizars":[[2,"higienizars sofa","x:no-local"]],"estofados":[[1,"estofados","x:no-local"]]},"indiceBairros":{"centro":[[2,"centro florianopolis","centro"],[2,"centro floripa","centro"],[1,"centro","centro"]],"santa":[[2,"santa monica","santa-monica"]],"lagoa":[[2,"lagoa conceicao","lagoa-da-conceicao"],[1,"lagoa","lagoa-da-conceicao"]],"canto":[[2,"canto aracas","canto-dos-aracas"],[2,"canto lagoa","canto-da-lagoa"]],"porto":[[2,"porto lagoa","porto-da-lagoa"]],"saulo":[[2,"saulo ramos","saulo-ramos"]],"trindade":[[1,"trindade","trindade"]],"ufsc":[[1,"ufsc","trindade"]],"itacorubi":[[1,"itacorubi","itacorubi"]],"udesc":[[1,"udesc","itacorubi"]],"corrego":[[2,"corrego grande","corrego-grande"]],"pocao":[[1,"pocao","pocao"]],"parque":[[3,"parque sao jorge","parque-sao-jorge"]],"jardim":[[2,"jardim anchieta","jardim-anchieta"],[2,"jardim atlantico","jardim-atlantico"]],"carvoeira":[[1,"carvoeira","carvoeira"]],"pantanal":[[1,"pantanal","pantanal"]],"agronomica":[[1,"agronomica","agronomica"]],"beira":[[3,"beira mar norte","beira-mar-norte"]],"beiramar":[[2,"beiramar norte","beira-mar-norte"]],"avenida":[[4,"avenida beira mar norte","beira-mar-norte"]],"jurere":[[2,"jurere internacional","jurere-internacional"],[1,"jurere","jurere"]],"canajure":[[1,"canajure","canajure"]],"praia":[[2,"praia daniela","daniela"],[2,"praia forte","praia-do-forte"],[2,"praia ingleses","ingleses"],[2,"praia mole","praia-mole"]],"daniela":[[1,"daniela","daniela"]],"canasvieiras":[[1,"canasvieiras","canasvieiras"]],"canas":[[1,"canas","canasvieiras"]],"ratones":[[1,"ratones","ratones"]],"joao":[[2,"joao paulo","joao-paulo"]],"monte":[[2,"monte verde","monte-verde"]],"saco":[[2,"saco grande","saco-grande"]],"cacupe":[[1,"cacupe","cacupe"]],"santo":[[3,"santo antonio lisboa","santo-antonio"],[2,"santo antonio","santo-antonio"]],"sambaqui":[[1,"sambaqui","sambaqui"]],"estreito":[[1,"estreito","estreito"]],"coloninha":[[1,"coloninha","coloninha"]],"coqueiros":[[1,"coqueiros","coqueiros"]],"itaguacu":[[1,"itaguacu","itaguacu"]],"bom":[[2,"bom abrigo","bom-abrigo"]],"abraao":[[1,"abraao","abraao"]],"campinas":[[3,"campinas sao jose","campinas"],[3,"campinas soes joses","campinas"],[1,"campinas","campinas"]],"barra":[[2,"barra lagoa","barra-da-lagoa"]],"joaquina":[[1,"joaquina","joaquina"]],"costa":[[2,"costa lagoa","costa-da-lagoa"]],"vargem":[[2,"vargem grande","vargem-grande"],[2,"vargem pequena","vargem-pequena"]],"ingleses":[[1,"ingleses","ingleses"]],"santinho":[[1,"santinho","santinho"]],"rio":[[2,"rio vermelho","rio-vermelho"]],"campeche":[[1,"campeche","campeche"]],"armacao":[[1,"armacao","armacao"]],"pantano":[[2,"pantano sul","pantano-do-sul"]],"ribeirao":[[2,"ribeirao ilha","ribeirao-da-ilha"]],"centros":[[2,"centros florianopolis","centro"],[2,"centros floripa","centro"],[2,"centros floripas","centro"],[1,"centros","centro"]],"santas":[[2,"santas monica","santa-monica"],[2,"santas monicas","santa-monica"]],"lagoas":[[2,"lagoas conceicao","lagoa-da-conceicao"],[2,"lagoas conceicoes","lagoa-da-conceicao"],[1,"lagoas","lagoa-da-conceicao"]],"cantos":[[2,"cantos aracas","canto-dos-aracas"],[2,"cantos lagoa","canto-da-lagoa"],[2,"cantos lagoas","canto-da-lagoa"]],"portos":[[2,"portos lagoa","porto-da-lagoa"],[2,"portos lagoas","porto-da-lagoa"]],"saulos":[[2,"saulos ramos","saulo-ramos"]],"trindades":[[1,"trindades","trindade"]],"ufscs":[[1,"ufscs","trindade"]],"itacorubis":[[1,"itacorubis","itacorubi"]],"udescs":[[1,"udescs","itacorubi"]],"corregos":[[2,"corregos grande","corrego-grande"],[2,"corregos grandes","corrego-grande"]],"pocoes":[[1,"pocoes","pocao"]],"pocaos":[[1,"pocaos","pocao"]],"parques":[[3,"parques sao jorge","parque-sao-jorge"],[3,"parques soes jorges","parque-sao-jorge"]],"jardins":[[2,"jardins anchieta","jardim-anchieta"],[2,"jardins anchietas","jardim-anchieta"],[2,"jardins atlantico","jardim-atlantico"],[2,"jardins atlanticos","jardim-atlantico"]],"jardims":[[2,"jardims anchieta","jardim-anchieta"],[2,"jardims atlantico","jardim-atlantico"]],"carvoeiras":[[1,"carvoeiras","carvoeira"]],"pantanais":[[1,"pantanais","pantanal"]],"pantanals":[[1,"pantanals","pantanal"]],"agronomicas":[[1,"agronomicas","agronomica"]],"beiras":[[3,"beiras mar norte","beira-mar-norte"],[3,"beiras mares nortes","beira-mar-norte"]],"beiramares":[[2,"beiramares norte","beira-mar-norte"],[2,"beiramares nortes","beira-mar-norte"]],"beiramars":[[2,"beiramars norte","beira-mar-norte"]],"avenidas":[[4,"avenidas beira mar norte","beira-mar-norte"],[4,"avenidas beiras mares nortes","beira-mar-norte"]],"jureres":[[2,"jureres internacionais","jurere-internacional"],[2,"jureres internacional","jurere-internacional"],[1,"jureres","jurere"]],"canajures":[[1,"canajures","canajure"]],"praias":[[2,"praias daniela","daniela"],[2,"praias danielas","daniela"],[2,"praias forte","praia-do-forte"],[2,"praias fortes","praia-do-forte"],[2,"praias ingleses","ingleses"],[2,"praias mole","praia-mole"],[2,"praias moles","praia-mole"]],"danielas":[[1,"danielas","daniela"]],"jooes":[[2,"jooes paulo","joao-paulo"],[2,"jooes paulos","joao-paulo"]],"joaos":[[2,"joaos paulo","joao-paulo"]],"montes":[[2,"montes verde","monte-verde"],[2,"montes verdes","monte-verde"]],"sacos":[[2,"sacos grande","saco-grande"],[2,"sacos grandes","saco-grande"]],"cacupes":[[1,"cacupes","cacupe"]],"santos":[[3,"santos antonio lisboa","santo-antonio"],[3,"santos antonios lisboas","santo-antonio"],[2,"santos antonio","santo-antonio"],[2,"santos antonios","santo-antonio"]],"sambaquis":[[1,"sambaquis","sambaqui"]],"estreitos":[[1,"estreitos","estreito"]],"coloninhas":[[1,"coloninhas","coloninha"]],"itaguacus":[[1,"itaguacus","itaguacu"]],"bons":[[2,"bons abrigo","bom-abrigo"],[2,"bons abrigos","bom-abrigo"]],"boms":[[2,"boms abrigo","bom-abrigo"]],"abraoes":[[1,"abraoes","abraao"]],"abraaos":[[1,"abraaos","abraao"]],"barras":[[2,"barras lagoa","barra-da-lagoa"],[2,"barras lagoas","barra-da-lagoa"]],"joaquinas":[[1,"joaquinas","joaquina"]],"costas":[[2,"costas lagoa","costa-da-lagoa"],[2,"costas lagoas","costa-da-lagoa"]],"vargens":[[2,"vargens grande","vargem-grande"],[2,"vargens grandes","vargem-grande"],[2,"vargens pequena","vargem-pequena"],[2,"vargens pequenas","vargem-pequena"]],"vargems":[[2,"vargems grande","vargem-grande"],[2,"vargems pequena","vargem-pequena"]],"santinhos":[[1,"santinhos","santinho"]],"rios":[[2,"rios vermelho","rio-vermelho"],[2,"rios vermelhos","rio-vermelho"]],"campeches":[[1,"campeches","campeche"]],"armacoes":[[1,"armacoes","armacao"]],"armacaos":[[1,"armacaos","armacao"]],"pantanos":[[2,"pantanos suis","pantano-do-sul"],[2,"pantanos sul","pantano-do-sul"]],"ribeiroes":[[2,"ribeiroes ilha","ribeirao-da-ilha"],[2,"ribeiroes ilhas","ribeirao-da-ilha"]],"ribeiraos":[[2,"ribeiraos ilha","ribeirao-da-ilha"]]},"orcamento":{"grupos":[{"nome":"Camisas e roupa do dia a dia","nota":"Entram nos pacotes de 10, 25 e 50 peças.","itens":["camisa-social","camisa-polo","camiseta","calca-jeans","bermuda","moletom","pijama","blusa-simples"]},{"nome":"Ternos e alfaiataria","itens":["terno","paleto","calca-social","gravata"]},{"nome":"Edredons, cobertores e colchas","nota":"Cobertor e colcha custam o mesmo que o edredom de fibra do mesmo tamanho.","itens":["edredom-solteiro","edredom-casal","edredom-queen","edredom-king","edredom-pena-solteiro","edredom-pena-casal","edredom-pena-queen","edredom-pena-king","edredom-la","edredom-seda","colcha-pesada","capa-edredom","edredom-pet"]},{"nome":"Cama e banho","itens":["lencois","jogo-cama-seda","toalha-banho","toalha-rosto","roupao","robe","protetor-solteiro","protetor-casal","protetor-king","capa-travesseiro"]},{"nome":"Roupa de mesa","itens":["toalha-mesa","toalha-mesa-media","toalha-mesa-grande","guardanapo"]},{"nome":"Vestidos","itens":["vestido-simples","vestido-midi","vestido-festa","vestido-noiva"]},{"nome":"Roupas finas: seda, linho, veludo e cashmere","itens":["camisa-seda","blusa-seda","saia","macacao","calca-fina","blazer-seda","veludo","cashmere","pijama-seda","camisa-smoking-veludo"]},{"nome":"Jaquetas e casacos","itens":["jaqueta-sem-enchimento","jaqueta-sintetica","jaqueta-impermeavel","jaqueta-pena","jaqueta-couro","trench-coat","casaco-curto","casaco-34","sobretudo","agasalho-la"]},{"nome":"Tênis","itens":["tenis"]},{"nome":"Casa","itens":["cortina","manta-sofa","tapete-pequeno","rede"]},{"nome":"Bebê","itens":["roupa-bebe","carrinho","bebe-conforto"]},{"nome":"Uniformes","itens":["farda","jaleco","beca","kimono-calca","kimono-cima"]},{"nome":"Pelúcias e peles","itens":["pelucia-p","pelucia-m","pelucia-g","pelucia-gg","pele"]}],"pelaFoto":"Capa de sofá e de almofada, vestido de daminha, colete e smoking, fantasias, roupa de neve, peças de couro além da jaqueta, mochila, boné e as outras peças fora desta lista têm o preço pela foto, pelo WhatsApp.","destaques":["camisa-social","terno","edredom-solteiro","edredom-casal","edredom-king","vestido-festa","tenis","lencois","cortina","roupa-bebe"]}}
DLAJSON
			, true );
		}
		return $d;
	}

	/* =====================================================================================
	 * Texto
	 * ===================================================================================== */

	/** Minúsculas, sem acento, só letras e números separados por um espaço. */
	function dla_normalizar( $s ) {
		static $mapa = null;
		if ( null === $mapa ) {
			$mapa   = array();
			$grupos = array(
				'a' => 'áàâãäåÁÀÂÃÄÅ',
				'e' => 'éèêëÉÈÊË',
				'i' => 'íìîïÍÌÎÏ',
				'o' => 'óòôõöÓÒÔÕÖ',
				'u' => 'úùûüÚÙÛÜ',
				'c' => 'çÇ',
				'n' => 'ñÑ',
			);
			foreach ( $grupos as $base => $letras ) {
				foreach ( preg_split( '//u', $letras, -1, PREG_SPLIT_NO_EMPTY ) as $letra ) {
					$mapa[ $letra ] = $base;
				}
			}
		}
		$s = strtr( (string) $s, $mapa );
		$s = function_exists( 'mb_strtolower' ) ? mb_strtolower( $s, 'UTF-8' ) : strtolower( $s );
		$s = preg_replace( '/[^a-z0-9]+/', ' ', $s );
		return trim( preg_replace( '/ +/', ' ', $s ) );
	}

	function dla_minusculas( $s ) {
		return function_exists( 'mb_strtolower' ) ? mb_strtolower( (string) $s, 'UTF-8' ) : strtolower( (string) $s );
	}

	/** Primeira letra minúscula (para nomes no meio da frase). */
	function dla_meio_frase( $s ) {
		$s = (string) $s;
		if ( '' === $s ) {
			return $s;
		}
		$primeira = function_exists( 'mb_substr' ) ? mb_substr( $s, 0, 1, 'UTF-8' ) : substr( $s, 0, 1 );
		$resto    = function_exists( 'mb_substr' ) ? mb_substr( $s, 1, null, 'UTF-8' ) : substr( $s, 1 );
		// Siglas e nomes próprios ficam como estão ("ARD", "Airbnb").
		if ( preg_match( '/^\p{Lu}{2}/u', $s ) ) {
			return $s;
		}
		return dla_minusculas( $primeira ) . $resto;
	}

	/** Texto puro de um trecho de HTML. */
	function dla_texto_html( $html ) {
		$t = preg_replace( '/<(br|\/p|\/li|\/td|\/th|\/h[1-6])[^>]*>/i', ' ', (string) $html );
		$t = strip_tags( $t );
		$t = html_entity_decode( $t, ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		$t = str_replace( "\xC2\xA0", ' ', $t );
		return trim( preg_replace( '/\s+/u', ' ', $t ) );
	}

	/** "R$ 1.234,56" → 1234.56; null quando não há valor. */
	function dla_valor( $texto ) {
		if ( ! preg_match( '/R\$\s*([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2}|[0-9]+)/u', (string) $texto, $m ) ) {
			return null;
		}
		return (float) str_replace( array( '.', ',' ), array( '', '.' ), $m[1] );
	}

	/** 1234.5 → "R$ 1.234,50". */
	function dla_reais( $v ) {
		return 'R$ ' . number_format( (float) $v, 2, ',', '.' );
	}

	function dla_agora() {
		return new DateTime( 'now', new DateTimeZone( DLA_FUSO ) );
	}

	function dla_data_br( $iso ) {
		return preg_match( '/^(\d{4})-(\d{2})-(\d{2})/', (string) $iso, $m ) ? $m[3] . '/' . $m[2] . '/' . $m[1] : (string) $iso;
	}

	function dla_uuid() {
		$b    = random_bytes( 16 );
		$b[6] = chr( ( ord( $b[6] ) & 0x0f ) | 0x40 );
		$b[8] = chr( ( ord( $b[8] ) & 0x3f ) | 0x80 );
		return vsprintf( '%s%s-%s-%s-%s-%s%s%s', str_split( bin2hex( $b ), 4 ) );
	}

	/** Código de origem: IA-DDMM-XX (dia, mês e duas letras). */
	function dla_codigo( $prefixo ) {
		$letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		$fim    = $letras[ random_int( 0, strlen( $letras ) - 1 ) ] . $letras[ random_int( 0, strlen( $letras ) - 1 ) ];
		return $prefixo . '-' . dla_agora()->format( 'dm' ) . '-' . $fim;
	}

	/** Junta itens: "a, b e c" (ou "a; b; e c" quando os itens já têm vírgula). */
	function dla_lista( $itens, $e = 'e', $sep = ', ' ) {
		$itens = array_values( array_filter( $itens, 'strlen' ) );
		$n     = count( $itens );
		if ( $n < 2 ) {
			return $n ? $itens[0] : '';
		}
		return implode( $sep, array_slice( $itens, 0, -1 ) ) . ( '; ' === $sep ? '; ' : ' ' ) . $e . ' ' . $itens[ $n - 1 ];
	}

	/* =====================================================================================
	 * Tabela de preços publicada em /servicos/ (o mesmo leitor serve ao montador e ao site)
	 * ===================================================================================== */

	/**
	 * Lê as tabelas "ded-sv-preco" da página de preços.
	 * Devolve array( 'linhas' => [ ... ], 'pacotes' => [ 10 => 219.0, ... ] ).
	 */
	function dla_extrair_tabela_html( $html ) {
		$res = array(
			'linhas'  => array(),
			'pacotes' => array(),
		);
		if ( ! is_string( $html ) || '' === $html ) {
			return $res;
		}
		$titulos = array();
		if ( preg_match_all( '/<h3[^>]*class="[^"]*ded-ct-h3[^"]*"[^>]*>(.*?)<\/h3>/is', $html, $hm, PREG_OFFSET_CAPTURE ) ) {
			foreach ( $hm[1] as $k => $h ) {
				$titulos[] = array( $hm[0][ $k ][1], dla_texto_html( $h[0] ) );
			}
		}
		if ( preg_match_all( '/<table[^>]*class="[^"]*ded-sv-preco[^"]*"[^>]*>(.*?)<\/table>/is', $html, $tm, PREG_OFFSET_CAPTURE ) ) {
			foreach ( $tm[1] as $k => $tab ) {
				$pos   = $tm[0][ $k ][1];
				$grupo = '';
				foreach ( $titulos as $t ) {
					if ( $t[0] < $pos ) {
						$grupo = $t[1];
					}
				}
				if ( ! preg_match_all( '/<tr[^>]*>(.*?)<\/tr>/is', $tab[0], $rm ) ) {
					continue;
				}
				foreach ( $rm[1] as $linha ) {
					if ( ! preg_match_all( '/<td[^>]*>(.*?)<\/td>/is', $linha, $cm ) || count( $cm[1] ) < 4 ) {
						continue;
					}
					$c      = $cm[1];
					$pagina = '';
					if ( isset( $c[4] ) && preg_match( '/href="([^"]+)"/i', $c[4], $am ) ) {
						$pagina = html_entity_decode( $am[1], ENT_QUOTES, 'UTF-8' );
					}
					$res['linhas'][] = dla_linha_tabela( $grupo, dla_texto_html( $c[0] ), dla_texto_html( $c[1] ), dla_texto_html( $c[2] ), dla_texto_html( $c[3] ), $pagina );
				}
			}
		}
		$texto = dla_texto_html( $html );
		if ( preg_match_all( '/(\d+) peças por R\$\s*([0-9.]+,[0-9]{2})/u', $texto, $pm, PREG_SET_ORDER ) ) {
			foreach ( $pm as $p ) {
				$res['pacotes'][ (int) $p[1] ] = dla_valor( 'R$ ' . $p[2] );
			}
		}
		return $res;
	}

	/** Uma linha da tabela, já com os valores interpretados. */
	function dla_linha_tabela( $grupo, $nome, $preco_txt, $exp_txt, $prazo, $pagina ) {
		$preco   = dla_valor( $preco_txt );
		$np      = dla_normalizar( $preco_txt );
		$unidade = 'peça';
		if ( false !== strpos( $np, 'quilo' ) ) {
			$unidade = 'quilo';
		} elseif ( preg_match( '/\bpar\b/', $np ) ) {
			$unidade = 'par';
		} elseif ( false !== strpos( $np, 'unidade' ) ) {
			$unidade = 'unidade';
		}
		$ne        = dla_normalizar( $exp_txt );
		$exp_preco = dla_valor( $exp_txt );
		if ( false !== strpos( $ne, 'nao tem' ) ) {
			$exp       = 'nao';
			$exp_preco = null;
		} elseif ( false !== strpos( $ne, 'consulta' ) ) {
			$exp       = 'consulta';
			$exp_preco = null;
		} elseif ( null !== $exp_preco || preg_match( '/\btem\b/', $ne ) ) {
			$exp = 'sim';
		} else {
			$exp = 'consulta';
		}
		$dias = null;
		if ( false !== strpos( dla_normalizar( $prazo ), 'dia' ) && preg_match_all( '/(\d+)/', $prazo, $dm ) ) {
			$dias = max( array_map( 'intval', $dm[1] ) );
		}
		return array(
			'grupo'         => $grupo,
			'nome'          => $nome,
			'preco'         => $preco,
			'unidade'       => $unidade,
			'consulta'      => null === $preco,
			'precoTexto'    => $preco_txt,
			'expresso'      => $exp,
			'expressoPreco' => $exp_preco,
			'expressoTexto' => $exp_txt,
			'prazo'         => $prazo,
			'prazoDias'     => $dias,
			'pagina'        => $pagina,
		);
	}

	/* =====================================================================================
	 * Dados: tabela embutida + valores lidos do site
	 * ===================================================================================== */

	function dla_dados() {
		static $d = null;
		if ( null !== $d ) {
			return $d;
		}
		$d                = dla_dados_base();
		$d['conferidoEm'] = $d['tabelaEm'];
		$d['origemPrecos'] = 'embutida';
		$viva             = function_exists( 'get_option' ) ? get_option( 'dla_tabela_viva' ) : false;
		if ( is_array( $viva ) && ! empty( $viva['linhas'] ) ) {
			$por_nome = array();
			foreach ( $viva['linhas'] as $l ) {
				$por_nome[ dla_normalizar( $l['nome'] ) ] = $l;
			}
			foreach ( $d['itens'] as $id => $it ) {
				if ( empty( $it['linha'] ) ) {
					continue;
				}
				$chave = dla_normalizar( $it['linha'] );
				if ( ! isset( $por_nome[ $chave ] ) ) {
					continue;
				}
				foreach ( array( 'preco', 'unidade', 'consulta', 'expresso', 'expressoPreco', 'prazo', 'prazoDias', 'pagina' ) as $campo ) {
					if ( array_key_exists( $campo, $por_nome[ $chave ] ) && ( 'pagina' !== $campo || '' !== $por_nome[ $chave ]['pagina'] ) ) {
						$d['itens'][ $id ][ $campo ] = $por_nome[ $chave ][ $campo ];
					}
				}
				foreach ( array( 'prazoProprio' => 'prazo', 'prazoDiasProprio' => 'prazoDias' ) as $proprio => $campo ) {
					if ( isset( $it[ $proprio ] ) ) {
						$d['itens'][ $id ][ $campo ] = $it[ $proprio ];
					}
				}
			}
			if ( ! empty( $viva['pacotes'] ) ) {
				foreach ( $d['pacotes']['opcoes'] as $k => $op ) {
					if ( ! empty( $viva['pacotes'][ $op['pecas'] ] ) ) {
						$d['pacotes']['opcoes'][ $k ]['preco'] = (float) $viva['pacotes'][ $op['pecas'] ];
					}
				}
			}
			$d['conferidoEm']  = isset( $viva['data'] ) ? $viva['data'] : $d['tabelaEm'];
			$d['origemPrecos'] = 'site';
		}
		// Peças genéricas ("edredom" sem tamanho): valem pela opção mais simples.
		foreach ( $d['itens'] as $id => $it ) {
			if ( empty( $it['opcoes'] ) ) {
				continue;
			}
			$base = null;
			foreach ( $it['opcoes'] as $op_id ) {
				if ( empty( $d['itens'][ $op_id ] ) || null === $d['itens'][ $op_id ]['preco'] ) {
					continue;
				}
				if ( null === $base || $d['itens'][ $op_id ]['preco'] < $d['itens'][ $base ]['preco'] ) {
					$base = $op_id;
				}
			}
			$d['itens'][ $id ]['base'] = $base;
		}
		return $d;
	}

	/* =====================================================================================
	 * Entender o pedido
	 * ===================================================================================== */

	function dla_idioma( $norm ) {
		$pontos = array(
			'pt' => 0,
			'en' => 0,
			'es' => 0,
		);
		$d      = dla_dados_base();
		$t      = ' ' . $norm . ' ';
		foreach ( $d['idiomas'] as $idioma => $palavras ) {
			foreach ( $palavras as $p ) {
				if ( false !== strpos( $t, ' ' . $p . ' ' ) ) {
					++$pontos[ $idioma ];
				}
			}
		}
		arsort( $pontos );
		$primeiro = key( $pontos );
		return ( 'pt' !== $primeiro && $pontos[ $primeiro ] > $pontos['pt'] ) ? $primeiro : 'pt';
	}

	/** Palavras do pedido, com números por extenso convertidos e sem palavras de ligação. */
	function dla_palavras( $norm, $idioma ) {
		$d        = dla_dados_base();
		$numeros  = $d['numeros'];
		$ligacao  = array_flip( $d['ligacao'] );
		$norm     = preg_replace( '/\b(\d+)x\b/', '$1', $norm );
		$norm     = preg_replace( '/\bx(\d+)\b/', '$1', $norm );
		$norm     = preg_replace( '/\b(meia duzia|media docena|half dozen)\b/', '6', $norm );
		$norm     = preg_replace( '/\b(uma duzia|1 duzia|una docena|a dozen|one dozen)\b/', '12', $norm );
		$saida    = array();
		foreach ( explode( ' ', $norm ) as $p ) {
			if ( '' === $p ) {
				continue;
			}
			if ( 'dos' === $p && 'es' === $idioma ) {
				$saida[] = '2';
				continue;
			}
			if ( isset( $ligacao[ $p ] ) ) {
				continue;
			}
			if ( isset( $numeros[ $p ] ) && ( 'doce' !== $p || 'es' === $idioma ) ) {
				$saida[] = (string) $numeros[ $p ];
				continue;
			}
			$saida[] = $p;
		}
		return $saida;
	}

	/** Procura, em cada posição, a expressão mais longa do índice. */
	function dla_casar( $palavras, $indice, $i ) {
		if ( ! isset( $indice[ $palavras[ $i ] ] ) ) {
			return null;
		}
		$n = count( $palavras );
		foreach ( $indice[ $palavras[ $i ] ] as $ent ) {
			$len = (int) $ent[0];
			if ( $i + $len > $n ) {
				continue;
			}
			if ( implode( ' ', array_slice( $palavras, $i, $len ) ) === $ent[1] ) {
				return array( $ent[2], $len );
			}
		}
		return null;
	}

	/**
	 * Reconhece peças (com quantidade), peças que não lavamos e bairros.
	 */
	function dla_reconhecer( $palavras, $d ) {
		$r = array(
			'itens'      => array(),
			'naoLavamos' => array(),
			'bairros'    => array(),
			'assuntos'   => array(),
		);
		$n          = count( $palavras );
		$enchimento = array_flip( $d['enchimento'] );
		$i          = 0;
		while ( $i < $n ) {
			$achou = dla_casar( $palavras, $d['indicePecas'], $i );
			if ( ! $achou ) {
				++$i;
				continue;
			}
			list( $ref, $len ) = $achou;
			if ( 0 === strpos( $ref, 'x:' ) ) {
				$r['naoLavamos'][ substr( $ref, 2 ) ] = true;
				$i                                   += $len;
				continue;
			}
			if ( 0 === strpos( $ref, 'a:' ) ) {
				$r['assuntos'][ substr( $ref, 2 ) ] = true;
				$i                                 += $len;
				continue;
			}
			$qtd   = null;
			$quilo = false;
			$j     = $i - 1;
			if ( $j >= 0 && isset( $enchimento[ $palavras[ $j ] ] ) ) {
				$quilo = in_array( $palavras[ $j ], array( 'kg', 'kgs', 'quilo', 'quilos', 'kilo', 'kilos' ), true );
				--$j;
			}
			if ( $j >= 0 && ctype_digit( $palavras[ $j ] ) ) {
				$v = (int) $palavras[ $j ];
				if ( $v >= 1 && $v <= 500 ) {
					$qtd = $v;
				}
			}
			if ( ! isset( $r['itens'][ $ref ] ) ) {
				$r['itens'][ $ref ] = array(
					'quantidade' => 0,
					'informada'  => false,
					'quilos'     => false,
				);
			}
			$r['itens'][ $ref ]['quantidade'] += ( null === $qtd ? 1 : $qtd );
			$r['itens'][ $ref ]['informada']   = $r['itens'][ $ref ]['informada'] || null !== $qtd;
			$r['itens'][ $ref ]['quilos']      = $r['itens'][ $ref ]['quilos'] || ( $quilo && null !== $qtd );
			$i                                += $len;
		}
		$i = 0;
		while ( $i < $n ) {
			$achou = dla_casar( $palavras, $d['indiceBairros'], $i );
			if ( ! $achou ) {
				++$i;
				continue;
			}
			// "loja do Centro" fala da loja, não do bairro.
			if ( $i > 0 && in_array( $palavras[ $i - 1 ], array( 'loja', 'lojas', 'unidade', 'store', 'tienda' ), true ) ) {
				$i += $achou[1];
				continue;
			}
			$r['bairros'][ $achou[0] ] = true;
			$i                        += $achou[1];
		}
		$r['naoLavamos'] = array_keys( $r['naoLavamos'] );
		$r['bairros']    = array_keys( $r['bairros'] );
		$r['assuntos']   = array_keys( $r['assuntos'] );
		return $r;
	}

	/** Peças e bairro mandados como dados JSON: { "itens": [ { "peca": "...", "quantidade": 2 } ], "bairro": "...", "expresso": true }. */
	function dla_ler_dados_entrada( $entrada, &$r, $d, $idioma, &$extra ) {
		if ( ! is_array( $entrada ) ) {
			return;
		}
		if ( isset( $entrada['itens'] ) && is_array( $entrada['itens'] ) ) {
			foreach ( array_slice( $entrada['itens'], 0, 50 ) as $it ) {
				if ( ! is_array( $it ) || ! isset( $it['peca'] ) || ! is_string( $it['peca'] ) ) {
					continue;
				}
				$qtd = isset( $it['quantidade'] ) && is_numeric( $it['quantidade'] ) ? (int) $it['quantidade'] : 1;
				$qtd = max( 1, min( 500, $qtd ) );
				$sub = dla_reconhecer( dla_palavras( dla_normalizar( substr( $it['peca'], 0, 200 ) ), $idioma ), $d );
				foreach ( $sub['itens'] as $ref => $info ) {
					if ( ! isset( $r['itens'][ $ref ] ) ) {
						$r['itens'][ $ref ] = array(
							'quantidade' => 0,
							'informada'  => true,
							'quilos'     => false,
						);
					}
					$r['itens'][ $ref ]['quantidade'] += $qtd;
					$r['itens'][ $ref ]['informada']   = true;
					$r['itens'][ $ref ]['quilos']      = $r['itens'][ $ref ]['quilos'] || ( isset( $it['unidade'] ) && in_array( dla_normalizar( (string) $it['unidade'] ), array( 'kg', 'quilo', 'quilos' ), true ) );
					break;
				}
				$r['naoLavamos'] = array_values( array_unique( array_merge( $r['naoLavamos'], $sub['naoLavamos'] ) ) );
			}
		}
		if ( isset( $entrada['bairro'] ) && is_string( $entrada['bairro'] ) ) {
			$sub          = dla_reconhecer( dla_palavras( dla_normalizar( substr( $entrada['bairro'], 0, 120 ) ), $idioma ), $d );
			$r['bairros'] = array_values( array_unique( array_merge( $sub['bairros'], $r['bairros'] ) ) );
		}
		if ( ! empty( $entrada['expresso'] ) ) {
			$extra[] = 'expresso';
		}
	}

	/** Assuntos do pedido, pelas palavras-chave aprovadas. */
	function dla_assuntos( $palavras, $d, $r ) {
		$t = ' ' . implode( ' ', $palavras ) . ' ';
		$a = array();
		foreach ( $d['assuntos'] as $assunto => $frases ) {
			foreach ( $frases as $f ) {
				if ( false !== strpos( $t, ' ' . $f . ' ' ) ) {
					$a[ $assunto ] = true;
					break;
				}
			}
		}
		if ( $r['itens'] ) {
			$a['orcamento'] = true;
		}
		if ( $r['bairros'] ) {
			$a['coleta'] = true;
		}
		if ( $r['naoLavamos'] ) {
			$a['naoLavamos'] = true;
		}
		foreach ( $r['assuntos'] as $extra ) {
			$a[ $extra ] = true;
		}
		return array_keys( $a );
	}

	/* =====================================================================================
	 * Orçamento preliminar
	 * ===================================================================================== */

	function dla_orcamento( $r, $d ) {
		$o = array(
			'itens'              => array(),
			'total'              => 0.0,
			'totalExpresso'      => 0.0,
			'expressoParaTodos'  => true,
			'itensSemPreco'      => array(),
			'itensPorQuilo'      => array(),
			'prazoMaximoDias'    => null,
			'observacoes'        => array(),
			'precosPacote'       => array(),
		);
		foreach ( $r['itens'] as $ref => $info ) {
			if ( empty( $d['itens'][ $ref ] ) ) {
				continue;
			}
			$item  = $d['itens'][ $ref ];
			$uso   = $item;
			$nome  = $item['curto'];
			if ( ! empty( $item['opcoes'] ) ) {
				if ( empty( $item['base'] ) ) {
					continue;
				}
				$uso    = $d['itens'][ $item['base'] ];
				$nome   = $uso['curto'];
				$outras = array();
				foreach ( $item['opcoes'] as $op_id ) {
					if ( $op_id === $item['base'] || empty( $d['itens'][ $op_id ] ) ) {
						continue;
					}
					$op       = $d['itens'][ $op_id ];
					$outras[] = dla_meio_frase( $op['curto'] ) . ( null === $op['preco'] ? ', pela foto' : ', ' . dla_reais( $op['preco'] ) );
				}
				$o['observacoes'][] = sprintf( $d['textos']['generico'], dla_meio_frase( $item['curto'] ), dla_meio_frase( $uso['curto'] ), implode( '; ', $outras ) );
			}
			if ( ! empty( $item['nota'] ) ) {
				$o['observacoes'][] = $item['nota'];
			}
			if ( ! empty( $item['opcoes'] ) && ! empty( $uso['nota'] ) ) {
				$o['observacoes'][] = $uso['nota'];
			}
			$qtd      = (int) $info['quantidade'];
			$quilo    = 'quilo' === $uso['unidade'];
			$somar    = null !== $uso['preco'] && ( ! $quilo || $info['quilos'] );
			$subtotal = $somar ? round( $qtd * $uso['preco'], 2 ) : null;
			$o['itens'][] = array(
				'id'                    => $ref,
				'peca'                  => $nome,
				'linhaDaTabela'         => isset( $uso['linha'] ) ? $uso['linha'] : $uso['curto'],
				'quantidade'            => $qtd,
				'quantidadeInformada'   => (bool) $info['informada'],
				'unidade'               => $uso['unidade'],
				'quilosInformados'      => $quilo && $info['quilos'],
				'precoUnitario'         => $uso['preco'],
				'subtotal'              => $subtotal,
				'precoPelaFoto'         => null === $uso['preco'],
				'prazo'                 => $uso['prazo'],
				'prazoDiasUteis'        => $uso['prazoDias'],
				'expresso'              => $uso['expresso'],
				'expressoPrecoUnitario' => $uso['expressoPreco'],
				'pacote'                => ! empty( $uso['pacote'] ),
				'pagina'                => $uso['pagina'],
			);
			if ( null !== $subtotal ) {
				$o['total'] += $subtotal;
			} elseif ( null === $uso['preco'] ) {
				$o['itensSemPreco'][] = $nome;
			} else {
				$o['itensPorQuilo'][] = $nome;
			}
			if ( null !== $subtotal && 'sim' === $uso['expresso'] && null !== $uso['expressoPreco'] ) {
				$o['totalExpresso'] += round( $qtd * $uso['expressoPreco'], 2 );
			} else {
				$o['expressoParaTodos'] = false;
			}
			if ( null !== $uso['prazoDias'] && ( null === $o['prazoMaximoDias'] || $uso['prazoDias'] > $o['prazoMaximoDias'] ) ) {
				$o['prazoMaximoDias'] = $uso['prazoDias'];
			}
			if ( ! empty( $uso['pacote'] ) && null !== $uso['preco'] ) {
				for ( $k = 0; $k < $qtd; $k++ ) {
					$o['precosPacote'][] = (float) $uso['preco'];
				}
			}
		}
		$o['total']         = round( $o['total'], 2 );
		$o['totalExpresso'] = round( $o['totalExpresso'], 2 );
		$o['observacoes']   = array_values( array_unique( $o['observacoes'] ) );
		$o['pacote']        = dla_melhor_pacote( $o['precosPacote'], $d );
		unset( $o['precosPacote'] );
		return $o;
	}

	/**
	 * Melhor combinação de pacotes para as peças do dia a dia (os créditos vão para as peças
	 * mais caras; o resto, avulso). Só devolve algo quando sai mais barato que tudo avulso.
	 */
	function dla_melhor_pacote( $precos, $d ) {
		$n = count( $precos );
		if ( $n < 10 ) {
			return null;
		}
		rsort( $precos );
		$resto = array_fill( 0, $n + 1, 0.0 );
		for ( $k = $n - 1; $k >= 0; $k-- ) {
			$resto[ $k ] = $resto[ $k + 1 ] + $precos[ $k ];
		}
		$avulso = $resto[0];
		$ops    = array();
		foreach ( $d['pacotes']['opcoes'] as $op ) {
			$ops[ (int) $op['pecas'] ] = (float) $op['preco'];
		}
		if ( ! isset( $ops[10], $ops[25], $ops[50] ) ) {
			return null;
		}
		$melhor = null;
		for ( $c = 0; $c * 50 <= $n; $c++ ) {
			for ( $b = 0; $c * 50 + $b * 25 <= $n; $b++ ) {
				for ( $a = 0; $c * 50 + $b * 25 + $a * 10 <= $n; $a++ ) {
					if ( 0 === $a + $b + $c ) {
						continue;
					}
					$cred  = $c * 50 + $b * 25 + $a * 10;
					$custo = $a * $ops[10] + $b * $ops[25] + $c * $ops[50] + $resto[ $cred ];
					if ( null === $melhor || $custo < $melhor['total'] - 0.001 ) {
						$melhor = array(
							'p10'   => $a,
							'p25'   => $b,
							'p50'   => $c,
							'total' => $custo,
							'avulsas' => $n - $cred,
						);
					}
				}
			}
		}
		if ( null === $melhor || $melhor['total'] >= $avulso - 0.005 ) {
			return null;
		}
		$partes = array();
		foreach ( array( 50 => 'p50', 25 => 'p25', 10 => 'p10' ) as $pecas => $campo ) {
			if ( $melhor[ $campo ] > 0 ) {
				$partes[] = ( $melhor[ $campo ] > 1 ? $melhor[ $campo ] . ' pacotes' : '1 pacote' ) . ' de ' . $pecas . ' peças (' . dla_reais( $ops[ $pecas ] ) . ( $melhor[ $campo ] > 1 ? ' cada' : '' ) . ')';
			}
		}
		return array(
			'combinacao'  => dla_lista( $partes ),
			'pecasAvulsas' => $melhor['avulsas'],
			'total'       => round( $melhor['total'], 2 ),
			'avulso'      => round( $avulso, 2 ),
			'economia'    => round( $avulso - $melhor['total'], 2 ),
			'validadeDias' => (int) $d['pacotes']['validadeDias'],
		);
	}

	/* =====================================================================================
	 * Resposta
	 * ===================================================================================== */

	/**
	 * Monta a resposta a partir do texto e dos dados recebidos. Nunca devolve o texto recebido:
	 * só os textos aprovados e os nomes da tabela.
	 */
	function dla_responder( $texto, $entrada = null, $tem_arquivo = false ) {
		$d       = dla_dados();
		$T       = $d['textos'];
		$texto   = function_exists( 'mb_substr' ) ? mb_substr( (string) $texto, 0, DLA_LIMITE_TEXTO, 'UTF-8' ) : substr( (string) $texto, 0, DLA_LIMITE_TEXTO );
		$norm    = dla_normalizar( $texto );
		$idioma  = dla_idioma( $norm );
		$palavras = dla_palavras( $norm, $idioma );
		$r       = dla_reconhecer( $palavras, $d );
		$extra   = array();
		dla_ler_dados_entrada( $entrada, $r, $d, $idioma, $extra );
		$assuntos = array_values( array_unique( array_merge( dla_assuntos( $palavras, $d, $r ), $extra ) ) );
		$tem      = array_flip( $assuntos );
		$codigo   = dla_codigo( 'IA' );
		$linhas   = array();
		$fontes   = array();
		$mostrou_preco = false;
		$dados    = array(
			'tipo'               => 'resposta_automatica',
			'empresa'            => $d['empresa']['nome'],
			'respostaAutomatica' => true,
			'idiomaDetectado'    => $idioma,
			'idiomaDaResposta'   => 'pt-BR',
			'assuntos'           => $assuntos,
		);

		if ( 'en' === $idioma ) {
			$linhas[] = $T['avisoIngles'];
		} elseif ( 'es' === $idioma ) {
			$linhas[] = $T['avisoEspanhol'];
		}
		$linhas[] = $T['abertura'];

		// Orçamento
		$orc = null;
		if ( $r['itens'] ) {
			$orc = dla_orcamento( $r, $d );
		}
		if ( $orc && $orc['itens'] ) {
			$linhas[] = '';
			$linhas[] = $T['orcamentoTitulo'];
			foreach ( $orc['itens'] as $it ) {
				$qtd = ( $it['quantidadeInformada'] || $it['quantidade'] > 1 ) ? $it['quantidade'] . ' × ' : '';
				if ( null === $it['precoUnitario'] ) {
					$l = sprintf( '- %s%s: preço pela foto, pelo WhatsApp', $qtd, $it['peca'] );
				} elseif ( 'quilo' === $it['unidade'] && ! $it['quilosInformados'] ) {
					$l = sprintf( '- %s: a partir de %s o quilo; o peso é conferido na loja', $it['peca'], dla_reais( $it['precoUnitario'] ) );
				} elseif ( 'quilo' === $it['unidade'] ) {
					$l = sprintf( '- %s kg de %s: a partir de %s o quilo, %s', $it['quantidade'], dla_meio_frase( $it['peca'] ), dla_reais( $it['precoUnitario'] ), dla_reais( $it['subtotal'] ) );
				} else {
					$un = 'par' === $it['unidade'] ? ' o par' : ( 'unidade' === $it['unidade'] ? ' a unidade' : ( $it['quantidade'] > 1 ? ' cada' : '' ) );
					$l  = sprintf( '- %s%s: a partir de %s%s', $qtd, $it['peca'], dla_reais( $it['precoUnitario'] ), $un );
					if ( $it['quantidade'] > 1 ) {
						$l .= ', total ' . dla_reais( $it['subtotal'] );
					}
				}
				if ( '' !== (string) $it['prazo'] ) {
					$l .= '; prazo: ' . $it['prazo'];
				}
				if ( isset( $tem['expresso'] ) ) {
					if ( 'sim' === $it['expresso'] && null !== $it['expressoPrecoUnitario'] ) {
						$l .= '; no expresso, ' . dla_reais( $it['expressoPrecoUnitario'] ) . ( $it['quantidade'] > 1 ? ' cada' : '' );
					} elseif ( 'sim' === $it['expresso'] ) {
						$l .= '; tem expresso, com 50% a mais';
					} elseif ( 'nao' === $it['expresso'] ) {
						$l .= '; não tem expresso';
					} else {
						$l .= '; expresso sob consulta';
					}
				}
				$linhas[] = $l . '.';
				if ( ! empty( $it['pagina'] ) ) {
					$fontes[] = $it['pagina'];
				}
			}
			foreach ( $orc['observacoes'] as $obs ) {
				$linhas[] = $obs;
			}
			$varias = count( $orc['itens'] ) > 1;
			if ( $orc['total'] > 0 && $varias ) {
				$extra_total = array();
				if ( $orc['itensSemPreco'] ) {
					$extra_total[] = $T['totalSemFoto'];
				}
				if ( $orc['itensPorQuilo'] ) {
					$extra_total[] = $T['totalSemQuilo'];
				}
				$linhas[] = trim( sprintf( $T['total'], dla_reais( $orc['total'] ) ) . ' ' . implode( ' ', $extra_total ) );
			}
			if ( $orc['total'] > 0 || $orc['itensPorQuilo'] ) {
				$mostrou_preco = true;
			}
			if ( isset( $tem['expresso'] ) && $varias && $orc['total'] > 0 && $orc['expressoParaTodos'] && ! $orc['itensSemPreco'] ) {
				$linhas[] = sprintf( $T['totalExpresso'], dla_reais( $orc['totalExpresso'] ) );
			}
			if ( null !== $orc['prazoMaximoDias'] && count( $orc['itens'] ) > 1 ) {
				$linhas[] = sprintf( $T['prazoMaior'], $orc['prazoMaximoDias'] );
			}
			if ( null !== $orc['prazoMaximoDias'] ) {
				$linhas[] = $T['prazoNota'];
			}
			if ( $orc['pacote'] ) {
				$p        = $orc['pacote'];
				$avulsas  = '';
				if ( 1 === $p['pecasAvulsas'] ) {
					$avulsas = ' e 1 peça avulsa';
				} elseif ( $p['pecasAvulsas'] > 1 ) {
					$avulsas = ' e ' . $p['pecasAvulsas'] . ' peças avulsas';
				}
				$linhas[] = sprintf( $T['pacoteSugestao'], $p['combinacao'], $avulsas, dla_reais( $p['total'] ), dla_reais( $p['economia'] ), $p['validadeDias'] );
				$fontes[] = $d['paginas']['pacotes'];
			}
			$link_orc = dla_link_orcamento( $d, $orc, $r['bairros'], $codigo, isset( $tem['expresso'] ) );
			if ( $link_orc ) {
				$linhas[] = sprintf( $T['linkOrcamento'], $link_orc );
			}
			$fontes[] = $d['paginas']['precos'];
			$dados['orcamento'] = array(
				'linkOrcamento'          => $link_orc,
				'itens'                  => $orc['itens'],
				'total'                  => $orc['total'],
				'moeda'                  => 'BRL',
				'aPartirDe'              => true,
				'itensComPrecoPelaFoto'  => $orc['itensSemPreco'],
				'prazoMaximoDiasUteis'   => $orc['prazoMaximoDias'],
				'observacoes'            => $orc['observacoes'],
				'pacote'                 => $orc['pacote'],
			);
			if ( isset( $tem['expresso'] ) && $orc['expressoParaTodos'] && ! $orc['itensSemPreco'] && $orc['total'] > 0 ) {
				$dados['orcamento']['totalExpresso'] = $orc['totalExpresso'];
			}
		}

		// Peças que não lavamos
		if ( isset( $tem['naoLavamos'] ) ) {
			$linhas[] = '';
			if ( $r['naoLavamos'] ) {
				$nomes = array();
				foreach ( $r['naoLavamos'] as $id ) {
					$nomes[] = $d['naoLavamos'][ $id ]['nome'];
				}
				$linhas[] = sprintf( $T['naoLavamosEstes'], dla_lista( $nomes, 'nem' ) );
			} else {
				$linhas[] = $T['naoLavamosLista'];
			}
			$linhas[]            = $T['naoLavamosDuvida'];
			$dados['naoLavamos'] = $r['naoLavamos'] ? $r['naoLavamos'] : array_keys( $d['naoLavamos'] );
			$fontes[]            = $d['paginas']['precos'];
		}

		// Coleta
		if ( isset( $tem['coleta'] ) ) {
			$linhas[] = '';
			if ( $r['bairros'] ) {
				$info = array();
				foreach ( array_slice( $r['bairros'], 0, 2 ) as $bid ) {
					$b = $d['bairros'][ $bid ];
					if ( 'fora' === $b['tipo'] ) {
						$linhas[] = sprintf( $T['coletaFora'], $b['onde'] );
						$info[]   = array(
							'bairro'   => $b['nome'],
							'atendido' => false,
						);
						continue;
					}
					$rota  = $d['rotas'][ $b['rota'] ];
					$frase = sprintf( $T['coletaBairro'], $b['onde'], $rota['dias'], $rota['pedidoAte'] );
					if ( ! empty( $b['observacao'] ) ) {
						$frase .= ' ' . $b['observacao'];
					}
					$linhas[] = $frase;
					$info[]   = array(
						'bairro'        => $b['nome'],
						'atendido'      => true,
						'rota'          => $rota['nome'],
						'dias'          => $rota['dias'],
						'pedidoAte'     => $rota['pedidoAte'],
						'observacao'    => isset( $b['observacao'] ) ? $b['observacao'] : null,
						'pagina'        => ! empty( $b['pagina'] ) ? $b['pagina'] : $rota['pagina'],
					);
					$fontes[] = ! empty( $b['pagina'] ) ? $b['pagina'] : $rota['pagina'];
				}
				$linhas[]        = $T['coletaGeral'];
				$dados['coleta'] = $info;
			} else {
				$linhas[]        = $T['coletaResumo'];
				$dados['coleta'] = array(
					'resumo' => $T['coletaResumo'],
					'pagina' => $d['paginas']['coleta'],
				);
			}
			$fontes[] = $d['paginas']['coleta'];
		}

		// Prazos e expresso
		if ( isset( $tem['prazo'] ) && ! $orc ) {
			$linhas[] = '';
			$linhas[] = $T['prazos'];
			$fontes[] = $d['paginas']['precos'];
		}
		if ( isset( $tem['expresso'] ) ) {
			$linhas[] = '';
			$linhas[] = $T['expresso'];
			$fontes[] = $d['paginas']['expresso'];
		}

		// Pacotes
		if ( isset( $tem['pacotes'] ) ) {
			$ops = array();
			foreach ( $d['pacotes']['opcoes'] as $op ) {
				$ops[] = $op['pecas'] . ' peças por ' . dla_reais( $op['preco'] );
			}
			$linhas[]          = '';
			$linhas[]          = sprintf( $T['pacotes'], dla_lista( $ops ), $d['pacotes']['validadeDias'] );
			$mostrou_preco     = true;
			$dados['pacotes']  = $d['pacotes'];
			$fontes[]          = $d['paginas']['pacotes'];
		}

		// Lojas e horário
		if ( isset( $tem['lojas'] ) ) {
			$linhas[]       = '';
			$linhas[]       = $T['lojas'];
			$dados['lojas'] = $d['lojas'];
			$dados['horario'] = $d['horario'];
		}

		// Empresas e anfitriões
		if ( isset( $tem['empresas'] ) ) {
			$linhas[] = '';
			$linhas[] = sprintf( $T['empresas'], dla_reais( dla_preco( $d, 'farda' ) ), dla_reais( dla_preco( $d, 'jaleco' ) ) );
			$fontes[] = $d['paginas']['empresas'];
			$mostrou_preco = true;
		}
		if ( isset( $tem['airbnb'] ) ) {
			$linhas[] = '';
			$linhas[] = sprintf( $T['airbnb'], dla_reais( dla_preco( $d, 'lencois' ) ) );
			$fontes[] = $d['paginas']['airbnb'];
			$mostrou_preco = true;
		}

		// Outros assuntos com texto fixo
		foreach ( array( 'passar', 'manchas', 'pagamento', 'garantia', 'desconto' ) as $assunto ) {
			if ( isset( $tem[ $assunto ] ) ) {
				$linhas[] = '';
				$linhas[] = $T[ $assunto ];
				$fontes[] = $d['paginas'][ $assunto ];
			}
		}
		if ( $tem_arquivo ) {
			$linhas[] = '';
			$linhas[] = $T['foto'];
		}

		// Preços em geral, sem peça reconhecida
		if ( isset( $tem['precos'] ) && ! $orc ) {
			$ex = array();
			foreach ( $d['exemplosPreco'] as $id ) {
				if ( ! empty( $d['itens'][ $id ] ) && null !== $d['itens'][ $id ]['preco'] ) {
					$it   = $d['itens'][ $id ];
					$ex[] = dla_meio_frase( $it['curto'] ) . ', ' . dla_reais( $it['preco'] ) . ( 'quilo' === $it['unidade'] ? ' o quilo' : ( 'par' === $it['unidade'] ? ' o par' : '' ) );
				}
			}
			$linhas[]      = '';
			$linhas[]      = sprintf( $T['precosExemplos'], dla_lista( $ex, 'e', '; ' ) );
			$linhas[]      = $T['pedirDetalhes'];
			$mostrou_preco = true;
			$fontes[]      = $d['paginas']['precos'];
		}

		// Serviços, ou nada reconhecido
		$so_aviso = ! array_diff( $assuntos, array( 'servicos' ) );
		if ( isset( $tem['servicos'] ) || $so_aviso ) {
			$linhas[] = '';
			$linhas[] = $T['servicos'];
			if ( $so_aviso ) {
				$linhas[] = $T['pedirDetalhes'];
			}
			$fontes[] = $d['paginas']['precos'];
		}

		// Fecho
		$msg_whats = dla_mensagem_whatsapp( $codigo, $orc, $r, $d );
		$link      = 'https://wa.me/' . $d['empresa']['whatsapp'] . '?text=' . rawurlencode( $msg_whats );
		$linhas[]  = '';
		if ( $mostrou_preco || $orc ) {
			$linhas[] = $T['vistoria'];
		}
		$linhas[] = sprintf( $T['fecho'], $link );
		if ( $mostrou_preco || $orc ) {
			$linhas[] = sprintf( $T['dataTabela'], dla_data_br( $d['conferidoEm'] ) );
		}

		$dados['whatsapp']    = array(
			'codigoDeOrigem' => $codigo,
			'url'            => $link,
			'mensagem'       => $msg_whats,
			'numero'         => $d['empresa']['whatsappExibicao'],
		);
		$dados['lojasEHorario'] = array(
			'lojas'   => array_map( 'dla_loja_curta', $d['lojas'] ),
			'horario' => $d['horario'],
		);
		$dados['regras']      = $d['regras'];
		$dados['precosConferidosEm'] = $d['conferidoEm'];
		$dados['paginaParaAssistentes'] = $d['paginas']['assistentes'];
		$dados['fontes']      = array_values( array_unique( $fontes ) );

		return array(
			'texto'    => trim( preg_replace( "/\n{3,}/", "\n\n", implode( "\n", $linhas ) ) ),
			'dados'    => $dados,
			'assuntos' => $assuntos,
			'idioma'   => $idioma,
			'codigo'   => $codigo,
		);
	}

	function dla_preco( $d, $id ) {
		return isset( $d['itens'][ $id ] ) && null !== $d['itens'][ $id ]['preco'] ? $d['itens'][ $id ]['preco'] : 0;
	}

	function dla_loja_curta( $l ) {
		return array(
			'nome'     => $l['nome'],
			'endereco' => $l['endereco'],
			'mapa'     => $l['mapa'],
		);
	}

	/** Mensagem pronta do WhatsApp: código, peças e bairro, sem nenhum dado pessoal. */
	function dla_mensagem_whatsapp( $codigo, $orc, $r, $d ) {
		$partes = array();
		if ( $orc && $orc['itens'] ) {
			foreach ( $orc['itens'] as $it ) {
				if ( 'quilo' === $it['unidade'] && ! $it['quilosInformados'] ) {
					$partes[] = dla_meio_frase( $it['peca'] ) . ' (por quilo)';
				} elseif ( 'quilo' === $it['unidade'] ) {
					$partes[] = $it['quantidade'] . ' kg de ' . dla_meio_frase( $it['peca'] );
				} else {
					$partes[] = $it['quantidade'] . ' × ' . dla_meio_frase( $it['peca'] );
				}
			}
			$msg = sprintf( $d['textos']['whatsOrcamento'], $codigo, implode( '; ', $partes ) );
		} else {
			$msg = sprintf( $d['textos']['whatsGeral'], $codigo );
		}
		foreach ( $r['bairros'] as $bid ) {
			$msg .= ' Bairro: ' . $d['bairros'][ $bid ]['nome'] . '.';
			break;
		}
		if ( $orc && $orc['total'] > 0 ) {
			$msg .= ' Estimativa a partir de ' . dla_reais( $orc['total'] ) . '.';
		}
		return $msg;
	}

	/* =====================================================================================
	 * Protocolo A2A sobre JSON-RPC 2.0 (versões 1.0 e 0.3 no mesmo endereço)
	 * ===================================================================================== */

	function dla_metodos() {
		return array(
			'SendMessage'                      => array( '1.0', 'enviar' ),
			'SendStreamingMessage'             => array( '1.0', 'sem_stream' ),
			'GetTask'                          => array( '1.0', 'tarefa' ),
			'ListTasks'                        => array( '1.0', 'listar' ),
			'CancelTask'                       => array( '1.0', 'tarefa' ),
			'SubscribeToTask'                  => array( '1.0', 'sem_stream' ),
			'CreateTaskPushNotificationConfig' => array( '1.0', 'sem_push' ),
			'GetTaskPushNotificationConfig'    => array( '1.0', 'sem_push' ),
			'ListTaskPushNotificationConfigs'  => array( '1.0', 'sem_push' ),
			'DeleteTaskPushNotificationConfig' => array( '1.0', 'sem_push' ),
			'GetExtendedAgentCard'             => array( '1.0', 'sem_cartao' ),
			'message/send'                     => array( '0.3', 'enviar' ),
			'message/stream'                   => array( '0.3', 'sem_stream' ),
			'tasks/get'                        => array( '0.3', 'tarefa' ),
			'tasks/cancel'                     => array( '0.3', 'tarefa' ),
			'tasks/resubscribe'                => array( '0.3', 'sem_stream' ),
			'tasks/pushNotificationConfig/set' => array( '0.3', 'sem_push' ),
			'tasks/pushNotificationConfig/get' => array( '0.3', 'sem_push' ),
			'tasks/pushNotificationConfig/list' => array( '0.3', 'sem_push' ),
			'tasks/pushNotificationConfig/delete' => array( '0.3', 'sem_push' ),
			'agent/getAuthenticatedExtendedCard' => array( '0.3', 'sem_cartao' ),
		);
	}

	function dla_erro( $id, $codigo, $mensagem, $razao, $meta = array(), $violacoes = null ) {
		$detalhes = array(
			array(
				'@type'    => 'type.googleapis.com/google.rpc.ErrorInfo',
				'reason'   => $razao,
				'domain'   => 'a2a-protocol.org',
				'metadata' => (object) $meta,
			),
		);
		if ( $violacoes ) {
			$detalhes[] = array(
				'@type'           => 'type.googleapis.com/google.rpc.BadRequest',
				'fieldViolations' => $violacoes,
			);
		}
		return array(
			'jsonrpc' => '2.0',
			'id'      => $id,
			'error'   => array(
				'code'    => $codigo,
				'message' => $mensagem,
				'data'    => $detalhes,
			),
		);
	}

	function dla_parametro_invalido( $id, $campo, $descricao ) {
		return dla_erro(
			$id,
			-32602,
			'Invalid parameters',
			'INVALID_PARAMS',
			array(),
			array(
				array(
					'field'       => $campo,
					'description' => $descricao,
				),
			)
		);
	}

	/** Versão pedida: cabeçalho A2A-Version ou parâmetro A2A-Version; vazio vale 0.3. */
	function dla_versao_pedida() {
		$v = '';
		if ( isset( $_SERVER['HTTP_A2A_VERSION'] ) ) {
			$v = (string) $_SERVER['HTTP_A2A_VERSION'];
		} elseif ( isset( $_GET['A2A-Version'] ) && is_string( $_GET['A2A-Version'] ) ) {
			$v = $_GET['A2A-Version'];
		}
		$v = preg_replace( '/[^0-9A-Za-z.\-]/', '', trim( $v ) );
		return '' === $v ? '0.3' : substr( $v, 0, 20 );
	}

	/** Processa um pedido JSON-RPC e devolve a resposta (array). $meta recebe o que vai para o registro. */
	function dla_processar( $corpo, $versao, &$meta ) {
		$meta = array(
			'versao'   => $versao,
			'metodo'   => '',
			'assuntos' => array(),
			'idioma'   => '',
			'resultado' => 'ok',
		);
		$pedido = json_decode( $corpo, true, 64 );
		if ( null === $pedido && JSON_ERROR_NONE !== json_last_error() ) {
			$meta['resultado'] = '-32700';
			return dla_erro( null, -32700, 'Invalid JSON payload', 'JSON_PARSE_ERROR' );
		}
		if ( ! is_array( $pedido ) || ! $pedido ) {
			$meta['resultado'] = '-32600';
			return dla_erro( null, -32600, 'Request payload validation error', 'INVALID_REQUEST' );
		}
		if ( array_keys( $pedido ) === range( 0, count( $pedido ) - 1 ) ) {
			$meta['resultado'] = '-32600';
			return dla_erro( null, -32600, 'Batch requests are not supported', 'INVALID_REQUEST' );
		}
		$id = array_key_exists( 'id', $pedido ) ? $pedido['id'] : null;
		if ( ! ( null === $id || is_string( $id ) || is_int( $id ) ) ) {
			$meta['resultado'] = '-32600';
			return dla_erro( null, -32600, 'Invalid request: id must be a string, integer, or null', 'INVALID_REQUEST' );
		}
		if ( ! isset( $pedido['jsonrpc'] ) || '2.0' !== $pedido['jsonrpc'] ) {
			$meta['resultado'] = '-32600';
			return dla_erro( $id, -32600, "Invalid request: 'jsonrpc' must be exactly '2.0'", 'INVALID_REQUEST' );
		}
		if ( empty( $pedido['method'] ) || ! is_string( $pedido['method'] ) ) {
			$meta['resultado'] = '-32600';
			return dla_erro( $id, -32600, 'Method is required', 'INVALID_REQUEST' );
		}
		$metodo         = $pedido['method'];
		$metodos        = dla_metodos();
		$meta['metodo'] = substr( $metodo, 0, 60 );
		if ( ! isset( $metodos[ $metodo ] ) ) {
			$meta['resultado'] = '-32601';
			$meta['metodo']    = '(desconhecido)';
			return dla_erro( $id, -32601, 'Method not found', 'METHOD_NOT_FOUND' );
		}
		list( $familia, $acao ) = $metodos[ $metodo ];
		$maior                  = preg_match( '/^(\d+)\.(\d+)/', $versao, $vm ) ? (int) $vm[1] : -1;
		if ( $maior !== (int) $familia[0] ) {
			$meta['resultado'] = '-32009';
			return dla_erro(
				$id,
				-32009,
				sprintf( "A2A version '%s' is not supported by this handler. Expected version '%s'.", $versao, $familia ),
				'VERSION_NOT_SUPPORTED',
				array( 'supportedVersions' => '1.0, 0.3' )
			);
		}
		$meta['versao'] = $familia;
		$params         = isset( $pedido['params'] ) ? $pedido['params'] : array();
		if ( ! is_array( $params ) ) {
			$meta['resultado'] = '-32602';
			return dla_parametro_invalido( $id, 'params', 'params must be an object' );
		}
		switch ( $acao ) {
			case 'enviar':
				$resp = dla_enviar_mensagem( $id, $params, $familia, $meta );
				break;
			case 'tarefa':
				if ( empty( $params['id'] ) || ! is_string( $params['id'] ) ) {
					$resp = dla_parametro_invalido( $id, 'id', 'Task id is required' );
				} else {
					$resp = dla_erro( $id, -32001, 'Task not found', 'TASK_NOT_FOUND', array( 'motivo' => 'Este agente responde com mensagens e não cria tarefas.' ) );
				}
				break;
			case 'listar':
				$tam  = isset( $params['pageSize'] ) && is_int( $params['pageSize'] ) && $params['pageSize'] > 0 ? min( 100, $params['pageSize'] ) : 50;
				$resp = array(
					'jsonrpc' => '2.0',
					'id'      => $id,
					'result'  => array(
						'tasks'         => array(),
						'nextPageToken' => '',
						'pageSize'      => $tam,
						'totalSize'     => 0,
					),
				);
				break;
			case 'sem_stream':
				$resp = dla_erro( $id, -32004, 'Streaming is not supported by this agent; use ' . ( '1.0' === $familia ? 'SendMessage' : 'message/send' ) . '.', 'UNSUPPORTED_OPERATION' );
				break;
			case 'sem_push':
				$resp = dla_erro( $id, -32003, 'Push notifications are not supported by this agent.', 'PUSH_NOTIFICATION_NOT_SUPPORTED' );
				break;
			default:
				$resp = dla_erro( $id, -32007, 'This agent has no extended agent card.', 'EXTENDED_AGENT_CARD_NOT_CONFIGURED' );
		}
		if ( isset( $resp['error'] ) ) {
			$meta['resultado'] = (string) $resp['error']['code'];
		}
		return $resp;
	}

	function dla_enviar_mensagem( $id, $params, $familia, &$meta ) {
		if ( ! isset( $params['message'] ) || ! is_array( $params['message'] ) ) {
			return dla_parametro_invalido( $id, 'message', 'A message is required' );
		}
		$msg = $params['message'];
		if ( ! isset( $msg['parts'] ) || ! is_array( $msg['parts'] ) || ! $msg['parts'] ) {
			return dla_parametro_invalido( $id, 'message.parts', 'At least one part is required' );
		}
		if ( empty( $msg['messageId'] ) || ! is_string( $msg['messageId'] ) ) {
			return dla_parametro_invalido( $id, 'message.messageId', 'messageId is required' );
		}
		$papel = isset( $msg['role'] ) ? $msg['role'] : '';
		if ( ( '1.0' === $familia && 'ROLE_USER' !== $papel ) || ( '0.3' === $familia && 'user' !== $papel ) ) {
			return dla_parametro_invalido( $id, 'message.role', '1.0' === $familia ? 'role must be ROLE_USER' : 'role must be user' );
		}
		$textos      = array();
		$entrada     = null;
		$tem_arquivo = false;
		foreach ( array_slice( $msg['parts'], 0, 20 ) as $p ) {
			if ( ! is_array( $p ) ) {
				continue;
			}
			if ( '0.3' === $familia ) {
				$tipo = isset( $p['kind'] ) ? $p['kind'] : '';
				if ( 'text' === $tipo && isset( $p['text'] ) && is_string( $p['text'] ) ) {
					$textos[] = $p['text'];
				} elseif ( 'data' === $tipo && isset( $p['data'] ) ) {
					$entrada = $p['data'];
				} elseif ( 'file' === $tipo ) {
					$tem_arquivo = true;
				}
			} elseif ( isset( $p['text'] ) && is_string( $p['text'] ) ) {
				$textos[] = $p['text'];
			} elseif ( array_key_exists( 'data', $p ) ) {
				$entrada = $p['data'];
			} elseif ( isset( $p['url'] ) || isset( $p['raw'] ) ) {
				$tem_arquivo = true;
			}
		}
		if ( ! $textos && ! is_array( $entrada ) ) {
			if ( $tem_arquivo ) {
				return dla_erro( $id, -32005, 'This agent accepts text and JSON data only. Photos are evaluated by the team on WhatsApp.', 'CONTENT_TYPE_NOT_SUPPORTED', array( 'whatsapp' => 'https://wa.me/' . dla_dados_base()['empresa']['whatsapp'] ) );
			}
			return dla_parametro_invalido( $id, 'message.parts', 'At least one text or data part is required' );
		}
		$r                = dla_responder( implode( "\n", $textos ), $entrada, $tem_arquivo );
		$meta['assuntos'] = $r['assuntos'];
		$meta['idioma']   = $r['idioma'];

		$contexto = ( isset( $msg['contextId'] ) && is_string( $msg['contextId'] ) && preg_match( '/^[A-Za-z0-9._:-]{1,128}$/', $msg['contextId'] ) ) ? $msg['contextId'] : dla_uuid();
		$aceita   = array();
		$config   = isset( $params['configuration'] ) && is_array( $params['configuration'] ) ? $params['configuration'] : array();
		if ( isset( $config['acceptedOutputModes'] ) && is_array( $config['acceptedOutputModes'] ) ) {
			$aceita = array_map( 'strtolower', array_filter( $config['acceptedOutputModes'], 'is_string' ) );
		}
		$quer_texto = ! $aceita || array_intersect( $aceita, array( 'text/plain', 'text/*', '*/*', 'text' ) );
		$quer_dados = ! $aceita || array_intersect( $aceita, array( 'application/json', 'application/*', '*/*', 'data' ) );
		if ( ! $quer_texto && ! $quer_dados ) {
			$quer_texto = true;
		}
		$partes = array();
		if ( '1.0' === $familia ) {
			if ( $quer_texto ) {
				$partes[] = array(
					'text'      => $r['texto'],
					'mediaType' => 'text/plain',
				);
			}
			if ( $quer_dados ) {
				$partes[] = array(
					'data'      => $r['dados'],
					'mediaType' => 'application/json',
				);
			}
			$resultado = array(
				'message' => array(
					'messageId' => dla_uuid(),
					'contextId' => $contexto,
					'role'      => 'ROLE_AGENT',
					'parts'     => $partes,
				),
			);
		} else {
			if ( $quer_texto ) {
				$partes[] = array(
					'kind' => 'text',
					'text' => $r['texto'],
				);
			}
			if ( $quer_dados ) {
				$partes[] = array(
					'kind' => 'data',
					'data' => $r['dados'],
				);
			}
			$resultado = array(
				'kind'      => 'message',
				'messageId' => dla_uuid(),
				'contextId' => $contexto,
				'role'      => 'agent',
				'parts'     => $partes,
			);
		}
		return array(
			'jsonrpc' => '2.0',
			'id'      => $id,
			'result'  => $resultado,
		);
	}

	/* =====================================================================================
	 * HTTP
	 * ===================================================================================== */

	function dla_rotear() {
		$uri     = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
		$caminho = parse_url( $uri, PHP_URL_PATH );
		if ( ! is_string( $caminho ) ) {
			return;
		}
		$base = function_exists( 'home_url' ) ? rtrim( (string) parse_url( home_url( '/' ), PHP_URL_PATH ), '/' ) : '';
		if ( rtrim( $caminho, '/' ) !== $base . DLA_CAMINHO ) {
			return;
		}
		dla_atender();
	}

	function dla_atender() {
		$metodo = isset( $_SERVER['REQUEST_METHOD'] ) ? strtoupper( (string) $_SERVER['REQUEST_METHOD'] ) : 'GET';
		header( 'Access-Control-Allow-Origin: *' );
		header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
		header( 'Access-Control-Allow-Headers: Content-Type, A2A-Version, A2A-Extensions, Authorization' );
		header( 'Access-Control-Max-Age: 86400' );
		if ( 'OPTIONS' === $metodo ) {
			dla_enviar( 204, null );
		}
		$d = dla_dados_base();
		if ( 'POST' !== $metodo ) {
			header( 'Allow: POST, OPTIONS' );
			dla_enviar(
				405,
				array(
					'nome'        => $d['empresa']['nome'],
					'mensagem'    => 'Endereço do agente A2A da Dedicada Lavanderia (JSON-RPC 2.0, versões 1.0 e 0.3). Envie POST com SendMessage.',
					'cartao'      => $d['empresa']['site'] . '/.well-known/agent-card.json',
					'documentacao' => $d['paginas']['assistentes'],
				)
			);
		}
		if ( ! dla_limite_ok() ) {
			header( 'Retry-After: ' . DLA_JANELA );
			dla_registrar(
				array(
					'versao'    => '',
					'metodo'    => '',
					'assuntos'  => array(),
					'idioma'    => '',
					'resultado' => 'limite',
				)
			);
			dla_enviar( 429, dla_erro( null, -32603, 'Too many requests; try again in a few minutes.', 'RATE_LIMITED' ) );
		}
		$corpo = (string) file_get_contents( 'php://input', false, null, 0, DLA_LIMITE_BYTES + 1 );
		$meta  = array(
			'versao'    => dla_versao_pedida(),
			'metodo'    => '',
			'assuntos'  => array(),
			'idioma'    => '',
			'resultado' => '-32600',
		);
		if ( strlen( $corpo ) > DLA_LIMITE_BYTES ) {
			$resp = dla_erro( null, -32600, 'Payload too large (limit 16 KB)', 'INVALID_REQUEST' );
		} else {
			try {
				$resp = dla_processar( $corpo, dla_versao_pedida(), $meta );
			} catch ( Throwable $e ) {
				$meta['resultado'] = '-32603';
				$resp              = dla_erro( null, -32603, 'Internal error', 'INTERNAL_ERROR' );
			}
		}
		dla_registrar( $meta );
		dla_enviar( 200, $resp );
	}

	function dla_enviar( $status, $corpo ) {
		while ( ob_get_level() > 0 ) {
			ob_end_clean();
		}
		if ( function_exists( 'status_header' ) ) {
			status_header( $status );
		} else {
			http_response_code( $status );
		}
		header( 'Cache-Control: no-store' );
		header( 'X-Robots-Tag: noindex' );
		header( 'X-Content-Type-Options: nosniff' );
		if ( null !== $corpo ) {
			header( 'Content-Type: application/json; charset=utf-8' );
			echo json_encode( $corpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR );
		}
		exit;
	}

	/** Limite de pedidos por origem. O endereço de origem vira um resumo (hash) e some em 10 minutos. */
	function dla_limite_ok() {
		if ( ! function_exists( 'get_transient' ) ) {
			return true;
		}
		$ip    = isset( $_SERVER['REMOTE_ADDR'] ) ? (string) $_SERVER['REMOTE_ADDR'] : '';
		$sal   = function_exists( 'wp_salt' ) ? wp_salt( 'nonce' ) : 'dla';
		$chave = 'dla_rl_' . substr( hash( 'sha256', $ip . '|' . $sal ), 0, 20 );
		$n     = (int) get_transient( $chave );
		if ( $n >= DLA_LIMITE_PEDIDOS ) {
			return false;
		}
		set_transient( $chave, $n + 1, DLA_JANELA );
		return true;
	}

	/* =====================================================================================
	 * Registro (sem texto e sem IP)
	 * ===================================================================================== */

	function dla_programa() {
		$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? (string) $_SERVER['HTTP_USER_AGENT'] : '';
		if ( '' === $ua ) {
			return '(vazio)';
		}
		foreach ( dla_dados_base()['programas'] as $p ) {
			if ( false !== stripos( $ua, $p ) ) {
				return $p;
			}
		}
		return preg_match( '/^([A-Za-z0-9._-]{1,40})/', $ua, $m ) ? $m[1] : '(outro)';
	}

	function dla_registrar( $meta ) {
		if ( ! function_exists( 'get_option' ) ) {
			return;
		}
		$reg = get_option( 'dla_registro', array() );
		if ( ! is_array( $reg ) ) {
			$reg = array();
		}
		$reg[] = array(
			't' => dla_agora()->format( 'Y-m-d H:i' ),
			'v' => substr( (string) $meta['versao'], 0, 10 ),
			'm' => substr( (string) $meta['metodo'], 0, 60 ),
			'a' => implode( ',', (array) $meta['assuntos'] ),
			'l' => (string) $meta['idioma'],
			'p' => dla_programa(),
			'r' => (string) $meta['resultado'],
			'x' => ( isset( $_SERVER['HTTP_X_DEDICADA_TESTE'] ) && '' !== $_SERVER['HTTP_X_DEDICADA_TESTE'] ) ? 1 : 0,
		);
		if ( count( $reg ) > DLA_REGISTRO_MAX ) {
			$reg = array_slice( $reg, -DLA_REGISTRO_MAX );
		}
		update_option( 'dla_registro', $reg, false );
	}

	/* =====================================================================================
	 * Leitura da tabela publicada (duas vezes por dia)
	 * ===================================================================================== */

	function dla_sincronizar() {
		$base   = dla_dados_base();
		$estado = array(
			'quando' => time(),
			'ok'     => false,
			'motivo' => '',
			'lidas'  => 0,
			'diferencas' => array(),
			'semCorrespondencia' => array(),
		);
		// O parâmetro evita a cópia guardada pelo cache de páginas: a leitura pega a tabela em vigor.
		$resp = wp_remote_get( home_url( '/servicos/?dla-leitura=' . time() ), array( 'timeout' => 25 ) );
		if ( is_wp_error( $resp ) ) {
			$estado['motivo'] = 'Não abriu /servicos/: ' . $resp->get_error_message();
		} elseif ( 200 !== (int) wp_remote_retrieve_response_code( $resp ) ) {
			$estado['motivo'] = 'A página /servicos/ respondeu ' . (int) wp_remote_retrieve_response_code( $resp ) . '.';
		} else {
			$t                 = dla_extrair_tabela_html( wp_remote_retrieve_body( $resp ) );
			$estado['lidas']   = count( $t['linhas'] );
			$esperadas         = array();
			foreach ( $base['itens'] as $it ) {
				// Os apelidos (cobertor, tapete de banheiro) usam a linha de outra peça: não contam aqui.
				if ( ! empty( $it['linha'] ) && empty( $it['apelido'] ) ) {
					$esperadas[ dla_normalizar( $it['linha'] ) ] = $it;
				}
			}
			$achadas = 0;
			foreach ( $t['linhas'] as $l ) {
				$chave = dla_normalizar( $l['nome'] );
				if ( ! isset( $esperadas[ $chave ] ) ) {
					$estado['semCorrespondencia'][] = $l['nome'];
					continue;
				}
				++$achadas;
				$it = $esperadas[ $chave ];
				foreach ( array( 'preco', 'expresso', 'expressoPreco', 'prazo' ) as $campo ) {
					if ( (string) $it[ $campo ] !== (string) $l[ $campo ] ) {
						$estado['diferencas'][] = $l['nome'] . ' · ' . $campo . ': ' . ( null === $it[ $campo ] ? '—' : $it[ $campo ] ) . ' → ' . ( null === $l[ $campo ] ? '—' : $l[ $campo ] );
					}
				}
			}
			$total = count( array_unique( array_keys( $esperadas ) ) );
			if ( $achadas < 0.9 * $total ) {
				$estado['motivo'] = sprintf( 'Só %d de %d linhas da tabela foram reconhecidas; o orçamento continua com a tabela embutida.', $achadas, $total );
			} else {
				$estado['ok'] = true;
				update_option(
					'dla_tabela_viva',
					array(
						'data'    => dla_agora()->format( 'Y-m-d' ),
						'linhas'  => $t['linhas'],
						'pacotes' => $t['pacotes'],
					),
					false
				);
			}
		}
		update_option( 'dla_sincronizacao', $estado, false );
		return $estado;
	}

	function dla_agendar() {
		if ( function_exists( 'wp_next_scheduled' ) && ! wp_next_scheduled( 'dla_sincronizar_evento' ) ) {
			wp_schedule_event( time() + 120, 'twicedaily', 'dla_sincronizar_evento' );
		}
	}

	/** Mudou alguma opção com "preco" no nome (o Painel > Preços, por exemplo): lê a tabela de novo em 2 minutos. */
	function dla_opcao_salva( $nome ) {
		if ( 0 !== strpos( (string) $nome, 'dla_' ) && preg_match( '/pre(c|ç)o/i', (string) $nome ) && function_exists( 'wp_schedule_single_event' ) && ! wp_next_scheduled( 'dla_sincronizar_evento', array( 'mudanca' ) ) ) {
			wp_schedule_single_event( time() + 120, 'dla_sincronizar_evento', array( 'mudanca' ) );
		}
	}

	function dla_post_salvo( $post_id, $post ) {
		if ( is_object( $post ) && isset( $post->post_name ) && 'servicos' === $post->post_name && 'publish' === $post->post_status && ! wp_next_scheduled( 'dla_sincronizar_evento', array( 'mudanca' ) ) ) {
			wp_schedule_single_event( time() + 60, 'dla_sincronizar_evento', array( 'mudanca' ) );
		}
	}

	/* =====================================================================================
	 * Ferramentas > Orçamento (só administradores)
	 * ===================================================================================== */

	function dla_menu() {
		add_management_page( 'Orçamento da Dedicada', 'Orçamento', 'manage_options', 'dla-orcamento', 'dla_tela_admin' );
	}

	function dla_tela_admin() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$aviso = '';
		if ( isset( $_POST['dla_acao'] ) && 'sincronizar' === $_POST['dla_acao'] && check_admin_referer( 'dla_orcamento' ) ) {
			$e     = dla_sincronizar();
			$aviso = $e['ok'] ? 'Tabela lida agora.' : 'A leitura falhou: ' . $e['motivo'];
		}
		$base   = dla_dados_base();
		$d      = dla_dados();
		$estado = get_option( 'dla_sincronizacao' );
		echo '<div class="wrap"><h1>Orçamento da Dedicada</h1>';
		if ( $aviso ) {
			echo '<div class="notice notice-info"><p>' . esc_html( $aviso ) . '</p></div>';
		}
		echo '<p>Página: <code>' . esc_html( home_url( '/orcamento/' ) ) . '</code> (shortcode <code>[dedicada_orcamento]</code>) · versão do código ' . esc_html( DLA_VERSAO ) . ' · tabela embutida de ' . esc_html( dla_data_br( $base['tabelaEm'] ) ) . '.</p>';
		echo '<h2>Preços</h2><p>O orçamento usa agora a tabela ' . ( 'site' === $d['origemPrecos'] ? 'lida do site em ' . esc_html( dla_data_br( $d['conferidoEm'] ) ) : 'embutida (a leitura do site ainda não deu certo)' ) . '.</p>';
		if ( is_array( $estado ) ) {
			echo '<p>Última leitura de /servicos/: ' . esc_html( wp_date( 'd/m/Y H:i', $estado['quando'] ) ) . ' · ' . ( $estado['ok'] ? 'deu certo' : 'falhou: ' . esc_html( $estado['motivo'] ) ) . ' · ' . (int) $estado['lidas'] . ' linhas lidas.</p>';
			if ( $estado['diferencas'] ) {
				echo '<p><strong>Mudanças em relação à tabela embutida</strong> (o orçamento já usa os valores do site):</p><ul>';
				foreach ( $estado['diferencas'] as $l ) {
					echo '<li>' . esc_html( $l ) . '</li>';
				}
				echo '</ul>';
			}
			if ( $estado['semCorrespondencia'] ) {
				echo '<p><strong>Linhas do site que o orçamento ainda não reconhece</strong> (peça ao Claude para montar o orçamento de novo):</p><ul>';
				foreach ( $estado['semCorrespondencia'] as $l ) {
					echo '<li>' . esc_html( $l ) . '</li>';
				}
				echo '</ul>';
			}
		}
		echo '<form method="post">';
		wp_nonce_field( 'dla_orcamento' );
		echo '<p><button class="button button-primary" name="dla_acao" value="sincronizar">Ler a tabela de preços agora</button></p></form>';
		echo '<p>O agente A2A (/a2a/v1) não está ligado nesta versão.</p></div>';
	}

	/* =====================================================================================
	 * Página de orçamento: shortcode [dedicada_orcamento] (página /orcamento/)
	 * A lista de peças e os preços saem no HTML (o Google e as IAs leem); o JavaScript embutido
	 * soma, sugere o pacote, mostra a coleta do bairro e monta a mensagem com o número do orçamento.
	 * ===================================================================================== */

	function dla_h( $s ) {
		return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' );
	}

	/** Ids das peças que estão na calculadora. */
	function dla_ids_orcamento( $d ) {
		$ids = array();
		foreach ( $d['orcamento']['grupos'] as $g ) {
			foreach ( $g['itens'] as $id ) {
				if ( isset( $d['itens'][ $id ] ) && null !== $d['itens'][ $id ]['preco'] ) {
					$ids[ $id ] = true;
				}
			}
		}
		return $ids;
	}

	/** Link da página de orçamento já preenchida com as peças, o bairro e o código de origem. */
	function dla_link_orcamento( $d, $orc, $bairros, $codigo, $expresso ) {
		$ids    = dla_ids_orcamento( $d );
		$pecas  = array();
		foreach ( $orc['itens'] as $it ) {
			$id = $it['id'];
			if ( ! empty( $d['itens'][ $id ]['opcoes'] ) ) {
				$id = $d['itens'][ $id ]['base'];
			} elseif ( ! empty( $d['itens'][ $id ]['apelido'] ) ) {
				foreach ( $d['itens'] as $outro ) {
					if ( empty( $outro['apelido'] ) && ! empty( $outro['linha'] ) && $outro['linha'] === $d['itens'][ $id ]['linha'] ) {
						$id = $outro['id'];
						break;
					}
				}
			}
			if ( ! isset( $ids[ $id ] ) || ( 'quilo' === $it['unidade'] && ! $it['quilosInformados'] ) ) {
				continue;
			}
			$pecas[] = $id . ':' . $it['quantidade'];
		}
		if ( ! $pecas ) {
			return null;
		}
		$q = array(
			'pecas'  => implode( ',', $pecas ),
			'codigo' => $codigo,
		);
		foreach ( $bairros as $bid ) {
			$q['bairro'] = $bid;
			break;
		}
		if ( $expresso ) {
			$q['expresso'] = '1';
		}
		return $d['paginas']['orcamento'] . '?' . http_build_query( $q, '', '&', PHP_QUERY_RFC3986 );
	}

	function dla_shortcode_orcamento( $atts = array() ) {
		$d   = dla_dados();
		$cfg = $d['orcamento'];
		$ids = dla_ids_orcamento( $d );
		$js  = array(
			'itens'     => array(),
			'rotas'     => array(),
			'bairros'   => array(),
			'pacotes'   => array(),
			'validade'  => (int) $d['pacotes']['validadeDias'],
			'whatsapp'  => $d['empresa']['whatsapp'],
			'conferido' => dla_data_br( $d['conferidoEm'] ),
			'textos'    => array(
				'expresso' => 'No expresso, a peça que chega à loja do Santa Mônica até as 10h fica pronta no mesmo dia, às 17h (no sábado, antes das 13h); depois das 10h, no dia seguinte. Combine pelo WhatsApp antes de mandar.',
				'lojas'    => $d['textos']['lojas'],
			),
		);
		foreach ( $d['pacotes']['opcoes'] as $op ) {
			$js['pacotes'][] = array( (int) $op['pecas'], (float) $op['preco'] );
		}
		$h   = array();
		$h[] = '<div class="dlo" id="dlo"><style>' . dla_orcamento_css() . '</style>';
		$h[] = '<p class="dlo-intro">Marque as peças e as quantidades: a estimativa “a partir de”, o prazo, o pacote e o dia da coleta grátis no seu bairro aparecem na hora, e o botão monta a mensagem para o WhatsApp. Nenhum dado pessoal é pedido.</p>';
		$h[] = '<form class="dlo-form" action="#" onsubmit="return false" aria-label="Orçamento de lavanderia">';
		$h[] = '<div class="dlo-campo"><label for="dlo-busca">Procurar peça</label><input type="search" id="dlo-busca" placeholder="Ex.: edredom, terno, cortina" autocomplete="off"></div>';
		$primeiro = true;
		foreach ( $cfg['grupos'] as $g ) {
			$h[] = '<details class="dlo-grupo"' . ( $primeiro ? ' open' : '' ) . '><summary>' . dla_h( $g['nome'] ) . '</summary>';
			if ( ! empty( $g['nota'] ) ) {
				$h[] = '<p class="dlo-grupo-nota">' . dla_h( $g['nota'] ) . '</p>';
			}
			$h[] = '<ul class="dlo-itens">';
			foreach ( $g['itens'] as $id ) {
				if ( ! isset( $ids[ $id ] ) ) {
					continue;
				}
				$it    = $d['itens'][ $id ];
				$quilo = 'quilo' === $it['unidade'];
				$campo = 'dlo-q-' . $id;
				$preco = 'a partir de ' . dla_reais( $it['preco'] ) . ( $quilo ? ' o quilo' : ( 'par' === $it['unidade'] ? ' o par' : '' ) ) . ' · ' . $it['prazo'];
				$nome  = $it['curto'] . ( $quilo ? ' (em quilos)' : '' );
				$h[]   = '<li class="dlo-item" data-busca="' . dla_h( $it['curto'] . ' ' . ( isset( $it['busca'] ) ? $it['busca'] : '' ) ) . '">'
					. '<div class="dlo-peca"><label for="' . $campo . '">' . dla_h( $nome ) . '</label><span class="dlo-preco">' . dla_h( $preco ) . '</span></div>'
					. '<div class="dlo-passos"><button type="button" data-passo="-' . ( $quilo ? '0.5' : '1' ) . '" aria-controls="' . $campo . '" aria-label="' . dla_h( 'Menos: ' . $it['curto'] ) . '">−</button>'
					. '<input class="dlo-q" type="number" id="' . $campo . '" name="' . dla_h( $id ) . '" data-id="' . dla_h( $id ) . '" min="0" max="500" step="' . ( $quilo ? '0.5' : '1' ) . '" value="0" inputmode="' . ( $quilo ? 'decimal' : 'numeric' ) . '">'
					. '<button type="button" data-passo="' . ( $quilo ? '0.5' : '1' ) . '" aria-controls="' . $campo . '" aria-label="' . dla_h( 'Mais: ' . $it['curto'] ) . '">+</button></div></li>';
				$js['itens'][ $id ] = array(
					'c'  => $it['curto'],
					'p'  => (float) $it['preco'],
					'u'  => $it['unidade'],
					'e'  => $it['expresso'],
					'ep' => null === $it['expressoPreco'] ? null : (float) $it['expressoPreco'],
					'pz' => $it['prazo'],
					'pd' => $it['prazoDias'],
					'pc' => empty( $it['pacote'] ) ? 0 : 1,
				);
			}
			$h[]      = '</ul></details>';
			$primeiro = false;
		}
		$h[] = '<p class="dlo-pela-foto">' . dla_h( $cfg['pelaFoto'] ) . '</p>';

		// Bairros: atendidos (com o dia da rota) e fora das rotas, em ordem alfabética.
		$atendidos = array();
		$fora      = array();
		foreach ( $d['bairros'] as $bid => $b ) {
			if ( 'fora' === $b['tipo'] ) {
				$fora[ $bid ]               = $b['nome'];
				$js['bairros'][ $bid ]      = array( 'n' => $b['nome'], 'o' => $b['onde'], 'f' => 1 );
			} else {
				$atendidos[ $bid ]          = $b['nome'];
				$js['bairros'][ $bid ]      = array( 'n' => $b['nome'], 'o' => $b['onde'], 'r' => $b['rota'], 'obs' => isset( $b['observacao'] ) ? $b['observacao'] : '' );
				$js['rotas'][ $b['rota'] ]  = array( 'd' => $d['rotas'][ $b['rota'] ]['dias'], 'a' => $d['rotas'][ $b['rota'] ]['pedidoAte'] );
			}
		}
		$ordenar = function ( $a, $b ) {
			return strcmp( dla_normalizar( $a ), dla_normalizar( $b ) );
		};
		uasort( $atendidos, $ordenar );
		uasort( $fora, $ordenar );
		$h[] = '<div class="dlo-opcoes"><div class="dlo-campo"><label for="dlo-bairro">Bairro, para ver o dia da coleta grátis</label><select id="dlo-bairro" name="bairro"><option value="">Escolha o bairro</option><optgroup label="Com coleta e entrega grátis">';
		foreach ( $atendidos as $bid => $nome ) {
			$h[] = '<option value="' . dla_h( $bid ) . '">' . dla_h( $nome ) . '</option>';
		}
		$h[] = '</optgroup><optgroup label="Fora das rotas, no momento">';
		foreach ( $fora as $bid => $nome ) {
			$h[] = '<option value="' . dla_h( $bid ) . '">' . dla_h( $nome ) . '</option>';
		}
		$h[] = '</optgroup><option value="loja">Vou levar a uma das lojas</option></select></div>';
		$h[] = '<label class="dlo-check"><input type="checkbox" id="dlo-expresso" name="expresso"><span>Preciso com urgência (expresso)<small>50% a mais: pronta no mesmo dia, com a peça na loja do Santa Mônica até as 10h, ou no dia seguinte. Nem toda peça tem expresso.</small></span></label></div>';
		$h[] = '</form>';
		$h[] = '<div class="dlo-barra"><strong id="dlo-barra-total">Monte o orçamento</strong><a class="dlo-whats" href="https://wa.me/' . dla_h( $d['empresa']['whatsapp'] ) . '" target="_blank" rel="noopener">Enviar pelo WhatsApp</a></div>';
		$h[] = '<div id="dlo-resultado" class="dlo-resultado" aria-live="polite"><p class="dlo-vazio">Escolha as peças e as quantidades para ver a estimativa.</p></div>';
		$h[] = '<a class="dlo-whats" href="https://wa.me/' . dla_h( $d['empresa']['whatsapp'] ) . '" target="_blank" rel="noopener">Enviar o orçamento pelo WhatsApp</a>';
		// 08/11/2026 (passo 26): mandar o mesmo orçamento a outra pessoa (aparece com o JavaScript, quando há peças).
		$h[] = '<div class="dlo-enviar-bloco" hidden><a class="dlo-enviar" href="https://wa.me/" target="_blank" rel="noopener">Mandar este orçamento para alguém</a><p class="dlo-nota">A pessoa recebe as peças, a estimativa e um link que abre o mesmo orçamento.</p></div>';

		// Preços mais pedidos (sempre os da tabela em vigor)
		if ( ! isset( $atts['destaques'] ) || 'nao' !== $atts['destaques'] ) {
			$h[] = '<h2>Preços mais pedidos</h2><table class="dlo-destaques"><thead><tr><th scope="col">Peça</th><th scope="col">A partir de</th><th scope="col">Prazo</th><th scope="col">Expresso</th></tr></thead><tbody>';
			foreach ( $cfg['destaques'] as $id ) {
				if ( empty( $d['itens'][ $id ] ) || null === $d['itens'][ $id ]['preco'] ) {
					continue;
				}
				$it  = $d['itens'][ $id ];
				$exp = 'sim' === $it['expresso'] ? ( null !== $it['expressoPreco'] ? dla_reais( $it['expressoPreco'] ) : 'tem, +50%' ) : ( 'nao' === $it['expresso'] ? 'não tem' : 'sob consulta' );
				$h[] = '<tr><th scope="row">' . dla_h( $it['curto'] ) . '</th><td>' . dla_h( dla_reais( $it['preco'] ) . ( 'quilo' === $it['unidade'] ? ' o quilo' : ( 'par' === $it['unidade'] ? ' o par' : '' ) ) ) . '</td><td>' . dla_h( $it['prazo'] ) . '</td><td>' . dla_h( $exp ) . '</td></tr>';
			}
			$ops = array();
			foreach ( $d['pacotes']['opcoes'] as $op ) {
				$ops[] = $op['pecas'] . ' peças, ' . dla_reais( $op['preco'] );
			}
			$h[] = '</tbody></table><p>Pacotes de peças do dia a dia: ' . dla_h( implode( '; ', $ops ) ) . ', com ' . (int) $d['pacotes']['validadeDias'] . ' dias para usar. A tabela completa, com todas as peças, está em <a href="' . dla_h( $d['paginas']['precos'] ) . '">Serviços e preços</a>. Preços conferidos em ' . dla_h( dla_data_br( $d['conferidoEm'] ) ) . '.</p>';
		}
		// Perguntas frequentes, com os preços da tabela em vigor (e os dados estruturados FAQPage).
		if ( ! isset( $atts['perguntas'] ) || 'nao' !== $atts['perguntas'] ) {
			$perguntas = dla_perguntas_orcamento( $d );
			$h[]       = '<h2>Perguntas sobre o orçamento</h2>';
			$ld        = array();
			foreach ( $perguntas as $p ) {
				$h[]  = '<h3>' . dla_h( $p[0] ) . '</h3><p>' . dla_h( $p[1] ) . '</p>';
				$ld[] = array(
					'@type'          => 'Question',
					'name'           => $p[0],
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => $p[1],
					),
				);
			}
			$h[] = '<script type="application/ld+json">' . json_encode(
				array(
					'@context'   => 'https://schema.org',
					'@type'      => 'FAQPage',
					'mainEntity' => $ld,
				),
				JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES // sem JSON_UNESCAPED_UNICODE: só ASCII dentro de <script> (o servidor troca acentos por entidades)
			) . '</script>';
		}
		$h[] = '<script type="application/json" id="dlo-dados">' . json_encode( $js, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES ) . '</script>';
		$h[] = '<script>' . dla_orcamento_js() . '</script></div>';
		return implode( "\n", $h );
	}

	/** Perguntas da página de orçamento: os valores saem da tabela, para nunca ficarem velhos. */
	function dla_perguntas_orcamento( $d ) {
		$p   = function ( $id ) use ( $d ) {
			return isset( $d['itens'][ $id ] ) && null !== $d['itens'][ $id ]['preco'] ? dla_reais( $d['itens'][ $id ]['preco'] ) : '';
		};
		$pz  = function ( $id ) use ( $d ) {
			return isset( $d['itens'][ $id ] ) ? $d['itens'][ $id ]['prazo'] : '';
		};
		$p10 = '';
		foreach ( $d['pacotes']['opcoes'] as $op ) {
			if ( 10 === (int) $op['pecas'] ) {
				$p10 = dla_reais( $op['preco'] );
			}
		}
		// 08/11/2026 (passo 26, SEO, GEO e AEO): perguntas de quem procura simular o preço, com os valores da tabela em vigor.
		$lista = array(
			array(
				'Como simular o preço da lavanderia?',
				'Escolha as peças e as quantidades na lista e, se quiser, o bairro e o expresso: o total “a partir de”, o prazo, a sugestão de pacote e o dia da coleta grátis aparecem na hora, pela mesma tabela das lojas. Depois, é só mandar o orçamento pelo WhatsApp.',
			),
		);
		$ca = isset( $d['itens']['camisa-social'] ) ? $d['itens']['camisa-social']['preco'] : null;
		$te = isset( $d['itens']['terno'] ) ? $d['itens']['terno']['preco'] : null;
		$ed = isset( $d['itens']['edredom-casal'] ) ? $d['itens']['edredom-casal']['preco'] : null;
		if ( null !== $ca && null !== $te && null !== $ed ) {
			$lista[] = array(
				'Quanto fica um orçamento com camisas, terno e edredom?',
				'Pela tabela em vigor, 5 camisas sociais (a partir de ' . dla_reais( $ca ) . ' cada), 1 terno (a partir de ' . dla_reais( $te ) . ') e 1 edredom casal (a partir de ' . dla_reais( $ed ) . ') saem a partir de ' . dla_reais( 5 * $ca + $te + $ed ) . '. O valor de cada peça é confirmado na vistoria, antes de começar, e a coleta e a entrega são grátis nos bairros atendidos.',
			);
		}
		return array_merge( $lista, array(
			array(
				'De onde vêm os preços da simulação?',
				'Da tabela de Serviços e preços do site, a mesma das lojas. Os valores são “a partir de”, e a data em que a tabela foi conferida aparece no resultado da simulação.',
			),
			array(
				'A simulação mostra o dia da coleta no meu bairro?',
				'Sim. Ao escolher o bairro, aparecem os dias da rota e até que horas o pedido pelo WhatsApp entra na coleta do mesmo dia. Se o bairro estiver fora das rotas, a simulação indica as duas lojas, com os mesmos preços.',
			),
			array(
				'Quando a simulação sugere um pacote de peças?',
				'Com 10 peças do dia a dia ou mais, a simulação compara a conta peça por peça com os pacotes de 10, 25 e 50 peças e mostra o pacote quando ele sai por menos' . ( '' !== $p10 ? ' (o de 10 peças custa ' . $p10 . ')' : '' ) . '. O crédito do pacote vale por ' . (int) $d['pacotes']['validadeDias'] . ' dias.',
			),
			array(
				'E se a peça não estiver na lista da simulação?',
				'Mande a foto da peça e da etiqueta pelo WhatsApp: respondemos em cerca de 5 minutos, no horário das lojas, com o preço e o prazo. É o caso, por exemplo, da capa de sofá, do vestido de daminha, das fantasias, da roupa de neve e das peças de couro além da jaqueta.',
			),
			array(
				'O valor da simulação é o valor final?',
				'Os preços são “a partir de”, e o valor de cada peça é confirmado na vistoria, antes de começar. Se algo mudar o valor ou o prazo, a Dedicada avisa pelo WhatsApp antes de lavar e não cobra a mais sem a sua aprovação.',
			),
			array(
				'Tem pedido mínimo ou taxa de coleta?',
				'Não. A coleta e a entrega são grátis nos bairros atendidos, sem quantidade mínima, e os preços são os da loja. O pagamento pode ser na coleta ou na entrega, por Pix, cartão ou dinheiro.',
			),
			array(
				'Como mando o orçamento para a Dedicada?',
				'Toque em “Enviar pelo WhatsApp”: a mensagem já vai com as peças, o bairro e o número do orçamento, sem nenhum dado pessoal. A equipe responde em cerca de 5 minutos, no horário das lojas, e combina a coleta.',
			),
			array(
				'Posso mandar o orçamento para outra pessoa?',
				'Sim. Toque em “Mandar este orçamento para alguém”: a pessoa recebe as peças, a estimativa e um link que abre o mesmo orçamento, com o mesmo número, para conferir, mudar ou mandar para a Dedicada.',
			),
		) );
	}

	function dla_orcamento_js() {
		return <<<'DLAJS'
/*
 * Dedicada Lavanderia \u00b7 Or\u00e7amento r\u00e1pido (p\u00e1gina /orcamento/, shortcode [dedicada_orcamento])
 * Vai embutido no snippet do agente (agente-ia/fonte/agente.php); os pre\u00e7os v\u00eam da mesma tabela.
 * A lista de pe\u00e7as, os pre\u00e7os e o bot\u00e3o do WhatsApp j\u00e1 chegam prontos no HTML: este c\u00f3digo s\u00f3
 * soma, sugere o pacote, mostra a coleta do bairro e monta a mensagem com o n\u00famero do or\u00e7amento
 * ("or\u00e7amento n\u00ba 0511-7C"; por dentro, o c\u00f3digo SITE-0511-7C vai para o GA4).
 * 08/11/2026 (passo 26): a mensagem sai escrita, uma pe\u00e7a por linha, no padr\u00e3o do site ("Ol\u00e1! Vim pelo site e quero ...");
 * e "Mandar este or\u00e7amento para algu\u00e9m" manda as pe\u00e7as, a estimativa e o link pronto (o mesmo or\u00e7amento, com o mesmo n\u00famero)
 * pelo compartilhar do celular ou, sem ele, pelo WhatsApp sem n\u00famero.
 * Nenhum dado pessoal \u00e9 pedido nem guardado.
 */
(function () {
  'use strict';
  var raiz = document.getElementById('dlo');
  var bloco = document.getElementById('dlo-dados');
  if (!raiz || !bloco) return;
  var D;
  try { D = JSON.parse(bloco.textContent); } catch (e) { return; }
  raiz.className += ' dlo-js';

  var entradas = Array.prototype.slice.call(raiz.querySelectorAll('input.dlo-q'));
  var bairro = raiz.querySelector('#dlo-bairro');
  var expresso = raiz.querySelector('#dlo-expresso');
  var busca = raiz.querySelector('#dlo-busca');
  var saida = raiz.querySelector('#dlo-resultado');
  var barraTotal = raiz.querySelector('#dlo-barra-total');
  var botoes = Array.prototype.slice.call(raiz.querySelectorAll('.dlo-whats'));
  var blocoEnviar = raiz.querySelector('.dlo-enviar-bloco');
  var enviar = raiz.querySelector('.dlo-enviar');
  var codigo = gerarCodigo();
  // O que a pessoa v\u00ea: "n\u00ba 0511-7C" (sem o SITE-; os c\u00f3digos de outra origem, como IA-, aparecem inteiros).
  var numero = codigo.indexOf('SITE-') === 0 ? codigo.slice(5) : codigo;
  var ultimoEvento = '';
  var espera = null;

  function gerarCodigo() {
    var p = new URLSearchParams(location.search).get('codigo');
    if (p && /^(IA|SITE|WEB)-\d{4}-[A-Z0-9]{2}$/.test(p)) return p;
    var letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', d = new Date();
    var dd = ('0' + d.getDate()).slice(-2), mm = ('0' + (d.getMonth() + 1)).slice(-2);
    return 'SITE-' + dd + mm + '-' + letras.charAt(Math.floor(Math.random() * letras.length)) + letras.charAt(Math.floor(Math.random() * letras.length));
  }
  function arred(v) { return Math.round(v * 100) / 100; }
  function reais(v) {
    var s = arred(v).toFixed(2).split('.');
    return 'R$ ' + s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1];
  }
  function normal(s) {
    return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  function minuscula(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function evento(nome, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', nome, params); } catch (e) { /* sem GA4 */ }
  }

  /* Pacotes: os cr\u00e9ditos v\u00e3o para as pe\u00e7as mais caras; o resto, avulso. Igual ao agente. */
  function melhorPacote(precos) {
    var n = precos.length;
    if (n < 10) return null;
    precos = precos.slice().sort(function (a, b) { return b - a; });
    var resto = [], k, a, b, c;
    resto[n] = 0;
    for (k = n - 1; k >= 0; k--) resto[k] = resto[k + 1] + precos[k];
    var op = {};
    D.pacotes.forEach(function (p) { op[p[0]] = p[1]; });
    if (!op[10] || !op[25] || !op[50]) return null;
    var melhor = null;
    for (c = 0; c * 50 <= n; c++) for (b = 0; c * 50 + b * 25 <= n; b++) for (a = 0; c * 50 + b * 25 + a * 10 <= n; a++) {
      if (a + b + c === 0) continue;
      var cred = c * 50 + b * 25 + a * 10, custo = a * op[10] + b * op[25] + c * op[50] + resto[cred];
      if (!melhor || custo < melhor.total - 0.001) melhor = { a: a, b: b, c: c, total: custo, avulsas: n - cred };
    }
    if (!melhor || melhor.total >= resto[0] - 0.005) return null;
    var partes = [];
    [[50, 'c'], [25, 'b'], [10, 'a']].forEach(function (x) {
      var q = melhor[x[1]];
      if (q) partes.push((q > 1 ? q + ' pacotes' : '1 pacote') + ' de ' + x[0] + ' pe\u00e7as (' + reais(op[x[0]]) + (q > 1 ? ' cada' : '') + ')');
    });
    return { texto: partes.join(' e '), avulsas: melhor.avulsas, total: arred(melhor.total), economia: arred(resto[0] - melhor.total) };
  }

  function lerQtd(inp) {
    var v = parseFloat(String(inp.value).replace(',', '.'));
    if (!isFinite(v) || v < 0) return 0;
    return Math.min(v, 500);
  }

  function calcular() {
    var comExp = expresso && expresso.checked;
    var linhas = [], total = 0, pecas = 0, prazo = 0, semExp = [], precosPacote = [];
    entradas.forEach(function (inp) {
      var q = lerQtd(inp), it = D.itens[inp.getAttribute('data-id')];
      if (!q || !it) return;
      var unit = it.p, exp = false;
      if (comExp) {
        if (it.e === 'sim' && it.ep) { unit = it.ep; exp = true; } else semExp.push(it.c);
      }
      var sub = arred(q * unit);
      total += sub;
      if (it.u !== 'quilo') pecas += q;
      if (it.pd && it.pd > prazo) prazo = it.pd;
      if (it.pc && !comExp) for (var k = 0; k < q; k++) precosPacote.push(it.p);
      linhas.push({ id: inp.getAttribute('data-id'), it: it, q: q, unit: unit, sub: sub, exp: exp });
    });
    return { linhas: linhas, total: arred(total), pecas: pecas, prazo: prazo, semExp: semExp, pacote: melhorPacote(precosPacote), expresso: comExp };
  }

  function infoBairro() {
    if (!bairro || !bairro.value) return null;
    if (bairro.value === 'loja') return { loja: true };
    var b = D.bairros[bairro.value];
    if (!b) return null;
    if (b.f) return { fora: true, b: b };
    return { b: b, rota: D.rotas[b.r] };
  }

  function qtdTexto(l) {
    return l.it.u === 'quilo' ? String(l.q).replace('.', ',') + ' kg de ' + minuscula(l.it.c) : l.q + ' \u00d7 ' + minuscula(l.it.c);
  }

  /* 08/11 (passo 26): a mensagem escrita, uma pe\u00e7a por linha. */
  function mensagem(r, info) {
    if (!r.linhas.length) return 'Ol\u00e1! Vim pelo site e quero um or\u00e7amento (n\u00ba ' + numero + ').';
    var m = ['Ol\u00e1! Vim pelo site e quero confirmar o or\u00e7amento n\u00ba ' + numero + ':'];
    r.linhas.forEach(function (l) { m.push('\u2022 ' + qtdTexto(l) + (l.exp ? ' (expresso)' : '')); });
    if (info && info.b) m.push('Bairro: ' + info.b.n + '.');
    if (info && info.loja) m.push('Vou levar \u00e0 loja.');
    if (r.total > 0) m.push('Estimativa: a partir de ' + reais(r.total) + '.');
    return m.join('\n');
  }

  /* O link pronto deste or\u00e7amento (as pe\u00e7as, o bairro, o expresso e o mesmo n\u00famero). */
  function linkOrcamento(r) {
    var p = [];
    var pecas = r.linhas.map(function (l) { return l.id + ':' + String(l.q); }).join(',');
    if (pecas) p.push('pecas=' + encodeURIComponent(pecas));
    if (bairro && bairro.value) p.push('bairro=' + encodeURIComponent(bairro.value));
    if (r.expresso) p.push('expresso=1');
    p.push('codigo=' + encodeURIComponent(codigo));
    return location.origin + location.pathname + '?' + p.join('&');
  }

  /* O texto para mandar a outra pessoa (quem vai pagar ou decidir junto). */
  function textoEnviar(r) {
    return 'Montei um or\u00e7amento na Dedicada Lavanderia (n\u00ba ' + numero + '): ' + r.linhas.map(qtdTexto).join('; ') +
      '. Estimativa: a partir de ' + reais(r.total) + ', confirmada na vistoria da pe\u00e7a. Para ver ou mudar:';
  }

  function mostrar() {
    var r = calcular(), info = infoBairro(), h = [];
    if (!r.linhas.length) {
      h.push('<p class="dlo-vazio">Escolha as pe\u00e7as e as quantidades para ver a estimativa.</p>');
    } else {
      h.push('<h3>Seu or\u00e7amento preliminar</h3><ul class="dlo-linhas">');
      r.linhas.forEach(function (l) {
        var qtd = l.it.u === 'quilo' ? String(l.q).replace('.', ',') + ' kg de ' + minuscula(l.it.c) : l.q + ' \u00d7 ' + l.it.c;
        h.push('<li><span>' + esc(qtd) + (l.exp ? ' <em>(expresso)</em>' : '') + '</span><strong>' + reais(l.sub) + '</strong></li>');
      });
      h.push('</ul><p class="dlo-total">Total estimado: a partir de <strong>' + reais(r.total) + '</strong></p>');
      if (r.expresso && r.semExp.length) h.push('<p class="dlo-aviso">Sem expresso (prazo normal): ' + esc(r.semExp.join(', ')) + '.</p>');
      if (r.expresso) h.push('<p>' + esc(D.textos.expresso) + '</p>');
      if (r.prazo) h.push('<p>Prazo: at\u00e9 ' + r.prazo + ' dias \u00fateis (o s\u00e1bado conta), contados do dia em que as pe\u00e7as entram na loja.</p>');
      if (r.pacote) {
        h.push('<p class="dlo-pacote">Com ' + esc(r.pacote.texto) + (r.pacote.avulsas ? (r.pacote.avulsas === 1 ? ' e 1 pe\u00e7a avulsa' : ' e ' + r.pacote.avulsas + ' pe\u00e7as avulsas') : '') +
          ', as pe\u00e7as do dia a dia saem por <strong>' + reais(r.pacote.total) + '</strong>, ' + reais(r.pacote.economia) + ' a menos. O cr\u00e9dito do pacote vale por ' + D.validade + ' dias.</p>');
      }
    }
    if (info && info.rota) {
      h.push('<p class="dlo-coleta">Coleta e entrega gr\u00e1tis ' + esc(info.b.o) + ': ' + esc(info.rota.d) + '. Pedidos pelo WhatsApp at\u00e9 as ' + esc(info.rota.a) + ' entram na coleta do mesmo dia.' + (info.b.obs ? ' ' + esc(info.b.obs) : '') + '</p>');
    } else if (info && info.fora) {
      h.push('<p class="dlo-coleta">No momento, as rotas de coleta n\u00e3o passam ' + esc(info.b.o) + '. D\u00e1 para deixar e retirar a roupa numa das duas lojas, pelos mesmos pre\u00e7os.</p>');
    } else if (info && info.loja) {
      h.push('<p class="dlo-coleta">' + esc(D.textos.lojas) + '</p>');
    }
    if (r.linhas.length) {
      h.push('<p class="dlo-nota">Valores \u201ca partir de\u201d, confirmados na vistoria da pe\u00e7a, antes de come\u00e7ar. Tabela conferida em ' + esc(D.conferido) + '.</p>');
      h.push('<p class="dlo-codigo">Or\u00e7amento n\u00ba <strong>' + esc(numero) + '</strong></p>');
    }
    saida.innerHTML = h.join('');
    if (barraTotal) barraTotal.textContent = r.linhas.length ? 'A partir de ' + reais(r.total) : 'Monte o or\u00e7amento';
    var url = 'https://wa.me/' + D.whatsapp + '?text=' + encodeURIComponent(mensagem(r, info));
    botoes.forEach(function (b) { b.setAttribute('href', url); });
    if (blocoEnviar && enviar) {
      blocoEnviar.hidden = !r.linhas.length;
      if (r.linhas.length) enviar.setAttribute('href', 'https://wa.me/?text=' + encodeURIComponent(textoEnviar(r) + ' ' + linkOrcamento(r)));
    }
    raiz.setAttribute('data-total', r.total);
    agendarEvento(r);
  }

  function agendarEvento(r) {
    clearTimeout(espera);
    if (!r.linhas.length) return;
    espera = setTimeout(function () {
      var assinatura = r.pecas + '|' + r.total;
      if (assinatura === ultimoEvento) return;
      ultimoEvento = assinatura;
      evento('orcamento_calculado', { pecas: r.pecas, value: r.total, currency: 'BRL', expresso: r.expresso ? 'sim' : 'nao' });
    }, 2000);
  }

  /* Bot\u00f5es \u2212 e + */
  raiz.addEventListener('click', function (ev) {
    var alvo = ev.target.closest ? ev.target.closest('button[data-passo]') : null;
    if (!alvo) return;
    var inp = raiz.querySelector('#' + alvo.getAttribute('aria-controls'));
    if (!inp) return;
    var passo = parseFloat(alvo.getAttribute('data-passo'));
    inp.value = String(arred(Math.max(0, Math.min(500, lerQtd(inp) + passo))));
    mostrar();
  });
  entradas.forEach(function (inp) { inp.addEventListener('input', mostrar); });
  if (bairro) bairro.addEventListener('change', mostrar);
  if (expresso) expresso.addEventListener('change', mostrar);

  /* Procurar pe\u00e7a */
  if (busca) {
    busca.addEventListener('input', function () {
      var t = normal(busca.value).trim();
      Array.prototype.forEach.call(raiz.querySelectorAll('.dlo-grupo'), function (g) {
        var algum = false;
        Array.prototype.forEach.call(g.querySelectorAll('.dlo-item'), function (li) {
          var ok = !t || normal(li.getAttribute('data-busca') || li.textContent).indexOf(t) !== -1;
          li.hidden = !ok;
          if (ok) algum = true;
        });
        g.hidden = !algum;
        if (t && algum) g.open = true;
      });
    });
  }

  /* WhatsApp: GA4 conta o clique e o lead, com o c\u00f3digo de origem */
  botoes.forEach(function (b) {
    b.addEventListener('click', function () {
      var r = calcular();
      evento('whatsapp_click', { origem: 'orcamento', codigo: codigo, value: r.total, currency: 'BRL' });
      evento('generate_lead', { lead_source: 'orcamento', codigo: codigo, value: r.total, currency: 'BRL' });
    });
  });

  /* Mandar para algu\u00e9m: o compartilhar do celular, quando houver; sen\u00e3o, o WhatsApp sem n\u00famero (o link do bot\u00e3o). */
  if (enviar) {
    enviar.addEventListener('click', function (ev) {
      var r = calcular();
      if (!r.linhas.length) { ev.preventDefault(); return; }
      var nativo = typeof navigator.share === 'function';
      evento('share', { method: nativo ? 'compartilhar' : 'whatsapp', content_type: 'orcamento', item_id: codigo, value: r.total, currency: 'BRL' });
      if (nativo) {
        ev.preventDefault();
        navigator.share({ title: 'Or\u00e7amento da Dedicada Lavanderia', text: textoEnviar(r), url: linkOrcamento(r) }).catch(function () { /* cancelado */ });
      }
    });
  }

  /* Link pronto: /orcamento/?pecas=edredom-casal:2,camisa-social:5&bairro=trindade&expresso=1 */
  (function preencher() {
    var p = new URLSearchParams(location.search), algum = false;
    (p.get('pecas') || '').split(',').forEach(function (par) {
      var m = par.match(/^([a-z0-9-]+):(\d+(?:[.,]\d+)?)$/);
      if (!m) return;
      var inp = raiz.querySelector('input.dlo-q[data-id="' + m[1] + '"]');
      if (!inp) return;
      inp.value = String(Math.min(500, parseFloat(m[2].replace(',', '.'))));
      var g = inp.closest ? inp.closest('details') : null;
      if (g) g.open = true;
      algum = true;
    });
    var b = p.get('bairro');
    if (b && bairro && (b === 'loja' || D.bairros[b])) bairro.value = b;
    if (p.get('expresso') === '1' && expresso) expresso.checked = true;
    if (algum) setTimeout(function () { saida.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
  })();

  mostrar();
})();
DLAJS;
	}

	function dla_orcamento_css() {
		return <<<'DLACSS'
/* Dedicada Lavanderia \0000b7 Or\0000e7amento r\0000e1pido. Tudo dentro de .dlo, nas cores do site (preto, branco e cinza). */
.dlo {
  --dlo-preto: #111; --dlo-texto: #1a1a1a; --dlo-suave: #4a4a4a; --dlo-borda: #bdbdbd;
  --dlo-claro: #f3f3f3; --dlo-medio: #e6e6e6; --dlo-whats: #1f7a3f;
  max-width: 880px; margin: 0 auto; color: var(--dlo-texto); line-height: 1.5; font-size: 16px;
}
.dlo *, .dlo *::before, .dlo *::after { box-sizing: border-box; }
.dlo-intro { margin: 0 0 16px; font-size: 17px; }
.dlo-campo { display: block; margin: 0 0 16px; }
.dlo-campo > label, .dlo-rotulo { display: block; font-weight: 700; margin: 0 0 6px; }
.dlo input[type="search"], .dlo select {
  width: 100%; min-height: 48px; padding: 10px 12px; font-size: 16px;
  border: 1px solid var(--dlo-borda); border-radius: 8px; background: #fff; color: var(--dlo-texto);
}
.dlo-grupo { border: 1px solid var(--dlo-borda); border-radius: 10px; margin: 0 0 10px; background: #fff; }
.dlo-grupo > summary {
  cursor: pointer; list-style: none; padding: 14px 16px; font-weight: 700; font-size: 16.5px;
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
}
.dlo-grupo > summary::-webkit-details-marker { display: none; }
.dlo-grupo > summary::after { content: "+"; font-size: 22px; line-height: 1; }
.dlo-grupo[open] > summary::after { content: "\002212"; }
.dlo-grupo-nota { margin: -4px 16px 8px; font-size: 14px; color: var(--dlo-suave); }
.dlo-itens { list-style: none; margin: 0; padding: 0 8px 8px; }
.dlo-item {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 8px; border-top: 1px solid var(--dlo-medio);
}
.dlo-item[hidden], .dlo-grupo[hidden] { display: none; }
.dlo-peca { flex: 1 1 auto; min-width: 0; }
.dlo-peca label { font-weight: 600; display: block; }
.dlo-preco { display: block; font-size: 14px; color: var(--dlo-suave); }
.dlo-passos { display: flex; align-items: center; gap: 4px; flex: 0 0 auto; }
.dlo-passos button {
  display: none; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--dlo-preto);
  background: #fff; color: var(--dlo-preto); font-size: 22px; line-height: 1; cursor: pointer;
}
.dlo-js .dlo-passos button { display: inline-flex; align-items: center; justify-content: center; }
.dlo-passos button:focus-visible, .dlo-grupo > summary:focus-visible, .dlo-whats:focus-visible { outline: 3px solid #0b57d0; outline-offset: 2px; }
.dlo input.dlo-q {
  width: 64px; min-height: 44px; text-align: center; font-size: 16px; padding: 6px;
  border: 1px solid var(--dlo-borda); border-radius: 8px; -moz-appearance: textfield;
}
.dlo input.dlo-q::-webkit-outer-spin-button, .dlo input.dlo-q::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.dlo-opcoes { margin: 18px 0; padding: 16px; background: var(--dlo-claro); border-radius: 10px; }
.dlo-check { display: flex; gap: 10px; align-items: flex-start; font-weight: 600; cursor: pointer; }
.dlo-check input { width: 22px; height: 22px; margin: 2px 0 0; flex: 0 0 22px; }
.dlo-check small { display: block; font-weight: 400; color: var(--dlo-suave); }
.dlo-resultado { margin: 18px 0; padding: 18px 16px; border: 2px solid var(--dlo-preto); border-radius: 10px; background: #fff; }
.dlo-resultado h3 { margin: 0 0 10px; font-size: 19px; }
.dlo-linhas { list-style: none; margin: 0 0 10px; padding: 0; }
.dlo-linhas li { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; border-bottom: 1px dashed var(--dlo-borda); }
.dlo-total { font-size: 19px; margin: 10px 0; }
.dlo-pacote { padding: 10px 12px; background: var(--dlo-claro); border-radius: 8px; }
.dlo-aviso { color: #8a1c1c; }
.dlo-nota, .dlo-codigo, .dlo-vazio { font-size: 14.5px; color: var(--dlo-suave); }
.dlo-whats {
  display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 52px; padding: 12px 20px;
  background: var(--dlo-whats); color: #fff !important; text-decoration: none !important; font-weight: 700; font-size: 17px; border-radius: 10px;
}
.dlo-whats:hover { filter: brightness(1.08); }
.dlo-enviar-bloco { margin: 10px 0 0; }
.dlo-enviar-bloco[hidden] { display: none !important; }
.dlo-enviar {
  display: flex; align-items: center; justify-content: center; min-height: 50px; padding: 12px 20px;
  background: #fff; color: var(--dlo-whats) !important; border: 2px solid var(--dlo-whats); border-radius: 10px;
  font-weight: 700; font-size: 16px; text-decoration: none !important;
}
.dlo-enviar:hover { background: #f1f8f3; }
.dlo-enviar:focus-visible { outline: 3px solid #0b57d0; outline-offset: 2px; }
.dlo-enviar-bloco .dlo-nota { margin: 6px 0 0; text-align: center; }
.dlo-barra {
  position: sticky; bottom: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin: 12px -8px 0; padding: 10px 12px; background: #fff; border-top: 1px solid var(--dlo-borda); box-shadow: 0 -4px 12px rgba(0, 0, 0, .06);
}
.dlo-barra strong { font-size: 17px; }
.dlo-barra .dlo-whats { min-height: 46px; font-size: 16px; padding: 10px 16px; }
.dlo-pela-foto { font-size: 14.5px; color: var(--dlo-suave); }
.dlo-destaques { width: 100%; border-collapse: collapse; margin: 8px 0 16px; font-size: 15.5px; }
.dlo-destaques th, .dlo-destaques td { text-align: left; padding: 9px 8px; border-bottom: 1px solid var(--dlo-borda); vertical-align: top; }
.dlo-destaques thead th { font-size: 13px; text-transform: uppercase; letter-spacing: .04em; border-bottom: 2px solid var(--dlo-preto); }
@media (min-width: 720px) {
  .dlo-barra { margin: 12px 0 0; border: 1px solid var(--dlo-borda); border-radius: 10px 10px 0 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dlo * { scroll-behavior: auto !important; }
}
DLACSS;
	}

	/* =====================================================================================
	 * Início
	 * ===================================================================================== */

	function dla_iniciar() {
		if ( ! function_exists( 'add_action' ) ) {
			return;
		}
		// Versão só com o orçamento (resposta 543, 04/11/2026): a rota /a2a/v1 (dla_rotear) não é ligada.
		if ( did_action( 'init' ) ) {
			dla_agendar();
		} else {
			add_action( 'init', 'dla_agendar' );
		}
		add_action( 'dla_sincronizar_evento', 'dla_sincronizar' );
		add_action( 'save_post_page', 'dla_post_salvo', 10, 2 );
		add_action( 'updated_option', 'dla_opcao_salva', 10, 1 );
		add_action( 'admin_menu', 'dla_menu' );
		if ( function_exists( 'add_shortcode' ) ) {
			add_shortcode( 'dedicada_orcamento', 'dla_shortcode_orcamento' );
		}
	}

	if ( ! defined( 'DLA_BIBLIOTECA' ) ) {
		dla_iniciar();
	}
}
