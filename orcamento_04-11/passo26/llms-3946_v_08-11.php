/**
 * Dedicada - llms.txt (04/10/2026)
 * Serve /llms.txt (texto puro) com as paginas do modelo novo: servicos, guias de cuidado,
 * ferramenta de manchas e contato. A lista e automatica: entram as paginas publicadas cujo
 * conteudo tem a marca do modelo (ded-trilha). As descricoes vem da meta description do Yoast.
 * A HostGator responde 404 propria para enderecos .txt que nao existem como arquivo (o pedido
 * nem chega ao WordPress). Por isso o texto e GRAVADO como arquivo fisico em ABSPATH/llms.txt:
 * ao salvar qualquer pagina, uma vez por dia (cron) e quando o arquivo nao existe. O recurso
 * "llms.txt" do Yoast fica desligado para ele nao sobrescrever o arquivo.
 */
if ( ! function_exists( 'ded_llms_txt_servir' ) ) {

add_action( 'init', 'ded_llms_txt_servir', 1 );
add_action( 'init', 'ded_llms_txt_garantir_arquivo', 20 );
add_action( 'save_post', 'ded_llms_txt_ao_salvar', 20, 2 );
add_action( 'ded_llms_txt_diario', 'ded_llms_txt_gravar' );

function ded_llms_txt_caminho() {
	return trailingslashit( ABSPATH ) . 'llms.txt';
}

/** Grava o arquivo fisico. Devolve true se gravou (ou se ja estava igual). */
function ded_llms_txt_gravar() {
	delete_transient( 'ded_llms_txt' );
	$txt     = ded_llms_txt_montar();
	$caminho = ded_llms_txt_caminho();
	if ( file_exists( $caminho ) && is_readable( $caminho ) && file_get_contents( $caminho ) === $txt ) {
		return true;
	}
	$ok = @file_put_contents( $caminho, $txt, LOCK_EX );
	return $ok !== false;
}

function ded_llms_txt_ao_salvar( $post_id, $post ) {
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}
	if ( ! $post || $post->post_type !== 'page' ) {
		return;
	}
	ded_llms_txt_gravar();
}

/** Primeira execucao e seguranca: cria o arquivo se faltar e agenda a regravacao diaria. */
function ded_llms_txt_garantir_arquivo() {
	$versao = '2026-11-08.1'; // mude ao alterar o texto: o arquivo e regravado no proximo pedido.
	if ( ! wp_next_scheduled( 'ded_llms_txt_diario' ) ) {
		wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'ded_llms_txt_diario' );
	}
	if ( ! file_exists( ded_llms_txt_caminho() ) || get_option( 'ded_llms_txt_versao' ) !== $versao ) {
		if ( ded_llms_txt_gravar() ) {
			update_option( 'ded_llms_txt_versao', $versao, false );
		}
	}
}

function ded_llms_txt_servir() {
	if ( empty( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}
	$path = (string) strtok( $_SERVER['REQUEST_URI'], '?' );
	if ( rtrim( $path, '/' ) !== '/llms.txt' ) {
		return;
	}
	$txt = get_transient( 'ded_llms_txt' );
	if ( ! is_string( $txt ) || $txt === '' ) {
		$txt = ded_llms_txt_montar();
		set_transient( 'ded_llms_txt', $txt, HOUR_IN_SECONDS );
	}
	status_header( 200 );
	header( 'Content-Type: text/plain; charset=utf-8' );
	header( 'X-Content-Type-Options: nosniff' );
	header( 'Cache-Control: public, max-age=3600' );
	echo $txt; // phpcs:ignore WordPress.Security.EscapeOutput -- texto puro montado aqui mesmo.
	exit;
}

function ded_llms_txt_descricao( $post_id ) {
	$d = get_post_meta( $post_id, '_yoast_wpseo_metadesc', true );
	$d = is_string( $d ) ? $d : '';
	if ( function_exists( 'ded_precos_texto_simples' ) ) {
		$d = ded_precos_texto_simples( $d ); // [preco id=...] vira o valor da tabela central, como no Yoast.
	}
	$d = wp_strip_all_tags( $d );
	$d = html_entity_decode( $d, ENT_QUOTES, 'UTF-8' );
	$d = preg_replace( '/\s+/u', ' ', $d );
	return trim( (string) $d );
}

function ded_llms_txt_linha( $post ) {
	$titulo = html_entity_decode( get_the_title( $post ), ENT_QUOTES, 'UTF-8' );
	$titulo = preg_replace( '/\s+/u', ' ', $titulo );
	$linha  = '- [' . trim( $titulo ) . '](' . get_permalink( $post ) . ')';
	$d      = ded_llms_txt_descricao( $post->ID );
	if ( $d !== '' ) {
		$linha .= ': ' . $d;
	}
	return $linha;
}

function ded_llms_txt_montar() {
	$site = untrailingslashit( home_url() );
	$l    = array();

	$l[] = '# Dedicada Lavanderia';
	$l[] = '';
	$l[] = '> ' . "Lavanderia em Florian\u{00f3}polis (SC) desde 2003: lavagem a seco, wet cleaning e passadoria de roupas, edredons e pe\u{00e7}as delicadas, com coleta e entrega gr\u{00e1}tis nos bairros atendidos. Lojas no Centro e em Santa M\u{00f4}nica (matriz). Atendimento pelo WhatsApp +55 48 98428-0639.";
	$l[] = '';
	$l[] = "Os pre\u{00e7}os publicados nas p\u{00e1}ginas de servi\u{00e7}o v\u{00ea}m de uma tabela \u{00fa}nica, s\u{00e3}o \"a partir de\" e podem mudar sem aviso; o valor final \u{00e9} confirmado na vistoria da pe\u{00e7}a, antes de come\u{00e7}ar. Nota 4,7 no Google (loja do Centro).";
	$l[] = '';

	// 1. Paginas de servico do modelo novo: filhas de /servicos/ com a marca ded-sv-.
	$hub = get_page_by_path( 'servicos' );
	$servicos = array();
	if ( $hub ) {
		$filhas = get_posts( array(
			'post_type'      => 'page',
			'post_status'    => 'publish',
			'post_parent'    => $hub->ID,
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'ASC',
		) );
		foreach ( $filhas as $p ) {
			if ( strpos( $p->post_content, 'ded-sv-' ) !== false ) {
				$servicos[] = $p;
			}
		}
		// 16/10/2026: tambem as paginas de servico de primeiro nivel com a marca ded-sv- (wet cleaning e pacotes).
		$raiz = get_posts( array(
			'post_type'      => 'page',
			'post_status'    => 'publish',
			'post_parent'    => 0,
			'posts_per_page' => -1,
		) );
		$inicio = (int) get_option( 'page_on_front' );
		foreach ( $raiz as $p ) {
			if ( $p->ID === $hub->ID || $p->ID === $inicio || strpos( $p->post_name, 'cuidados-' ) === 0 ) {
				continue;
			}
			if ( strpos( $p->post_content, 'ded-sv-' ) !== false ) {
				$servicos[] = $p;
			}
		}
		usort( $servicos, function ( $a, $b ) {
			return strcmp( remove_accents( get_the_title( $a ) ), remove_accents( get_the_title( $b ) ) );
		} );
	}
	$l[] = "## Servi\u{00e7}os (pre\u{00e7}o, prazo e como fazemos)";
	if ( $hub ) {
		$l[] = '- [Todos os servi' . "\u{00e7}" . 'os](' . get_permalink( $hub ) . ')';
	}
	foreach ( $servicos as $p ) {
		$l[] = ded_llms_txt_linha( $p );
	}
	// 30/10 (passo 14): a pagina Para empresas (uniformes, nota fiscal e fatura), quando publicada.
	$empresas = get_page_by_path( 'para-empresas' );
	if ( $empresas && $empresas->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $empresas );
	}
	// 05/11 (passo 16): a pagina Para idosos (coleta em casa ou no lar de idosos), quando publicada.
	$idosos = get_page_by_path( 'para-idosos' );
	if ( $idosos && $idosos->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $idosos );
	}
	$l[] = '';

	// 2. Guias de cuidado: paginas de primeiro nivel com slug cuidados-* e a marca do modelo.
	$topo = get_posts( array(
		'post_type'      => 'page',
		'post_status'    => 'publish',
		'post_parent'    => 0,
		'posts_per_page' => -1,
		'orderby'        => 'title',
		'order'          => 'ASC',
	) );
	$guias = array();
	$central = null;
	foreach ( $topo as $p ) {
		if ( strpos( $p->post_name, 'cuidados-' ) !== 0 || strpos( $p->post_content, 'ded-trilha' ) === false ) {
			continue;
		}
		if ( $p->post_name === 'cuidados-por-tecido' ) {
			$central = $p;
		} else {
			$guias[] = $p;
		}
	}
	$l[] = "## Guias de cuidado por tecido e pe\u{00e7}a";
	if ( $central ) {
		$l[] = ded_llms_txt_linha( $central );
	}
	foreach ( $guias as $p ) {
		$l[] = ded_llms_txt_linha( $p );
	}
	// 06/11 (passo 20): o Calendario da lavanderia (o que lavar em cada mes), quando publicado.
	$calendario = get_page_by_path( 'calendario-da-lavanderia' );
	if ( $calendario && $calendario->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $calendario );
	}
	$l[] = '';

	// 3. Ferramentas. 08/11 (passo 26): o simulador de orcamento (/orcamento/) antes do diagnostico de manchas.
	$diag = get_page_by_path( 'diagnostico-de-manchas' );
	$orc  = get_page_by_path( 'orcamento' );
	$tem_diag = $diag && $diag->post_status === 'publish';
	$tem_orc  = $orc && $orc->post_status === 'publish';
	if ( $tem_diag || $tem_orc ) {
		$l[] = "## Ferramentas";
		if ( $tem_orc ) {
			$l[] = ded_llms_txt_linha( $orc );
		}
		if ( $tem_diag ) {
			$l[] = ded_llms_txt_linha( $diag );
		}
		$l[] = '';
	}

	// 4. Atendimento e lojas (dados do cabecalho do site, conferidos com o dono).
	$l[] = "## Atendimento e lojas";
	// 07/11 (passo 23): ligacao (643), e-mail, idiomas (325) e o tempo de resposta (29), como na pagina de Contato.
	$l[] = '- ' . "WhatsApp e liga\u{00e7}\u{00e3}o: +55 48 98428-0639 (https://wa.me/5548984280639); no WhatsApp, resposta em cerca de 5 minutos no hor\u{00e1}rio das lojas, tamb\u{00e9}m em espanhol, ingl\u{00ea}s e franc\u{00ea}s. E-mail: contato@dedicadalavanderia.com.br. Instagram: https://www.instagram.com/lavanderia.dedicada/";
	$l[] = '- ' . "Coleta e entrega gr\u{00e1}tis nos bairros atendidos" . ': ' . $site . '/lavanderia-coleta-e-entrega-em-florianopolis/';
	$l[] = '- ' . "Loja do Centro: Rua Germano Wendhausen, 286, Centro, Florian\u{00f3}polis, SC, CEP 88015-460. Segunda a sexta, das 8h \u{00e0}s 18h; s\u{00e1}bado, das 8h \u{00e0}s 13h. Mapa: https://www.google.com/maps?cid=12049800564194816433";
	$l[] = '- ' . "Matriz, Santa M\u{00f4}nica: Rua Dr. Agostinho Sielski, 44, Santa M\u{00f4}nica, Florian\u{00f3}polis, SC, CEP 88035-320. Segunda a sexta, das 8h \u{00e0}s 18h; s\u{00e1}bado, das 8h \u{00e0}s 13h. Mapa: https://www.google.com/maps?cid=13063940176413908687";
	$l[] = '- ' . "As duas lojas fecham aos domingos e em todos os feriados; nesses dias, n\u{00e3}o h\u{00e1} coleta nem entrega.";
	// 07/11 (passo 23): a pagina de Contato com o titulo e a descricao do Yoast, como as outras.
	$contato = get_page_by_path( 'contato' );
	if ( $contato && $contato->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $contato );
	}
	// 30/10 (passo 12): a pagina de Perguntas frequentes por tema; enquanto ela nao estiver publicada, as perguntas da central.
	$faq = get_page_by_path( 'faq-perguntas-frequentes' );
	if ( $faq && $faq->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $faq );
	} elseif ( $hub ) {
		$l[] = '- [Perguntas frequentes sobre pre' . "\u{00e7}" . 'os, prazos e coleta](' . get_permalink( $hub ) . '#perguntas)';
	}
	// 05/11 (passo 17): a pagina Indique e ganhe, quando publicada.
	$indique = get_page_by_path( 'indique' );
	if ( $indique && $indique->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $indique );
	}
	// 05/11 (passo 18): a pagina Vale-presente, quando publicada.
	$vale = get_page_by_path( 'vale-presente' );
	if ( $vale && $vale->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $vale );
	}
	// 05/11 (passo 19): a pagina Trabalhe conosco, quando publicada.
	$trabalhe = get_page_by_path( 'trabalhe-conosco' );
	if ( $trabalhe && $trabalhe->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $trabalhe );
	}
	// 07/11 (passo 22): a pagina Acessibilidade (coleta ate a porta, WhatsApp por audio, loja e site), quando publicada.
	$acessibilidade = get_page_by_path( 'acessibilidade' );
	if ( $acessibilidade && $acessibilidade->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $acessibilidade );
	}
	// 07/11 (passo 21): a pagina Sustentabilidade (wet cleaning, solvente recuperado, agua tratada e reaproveitada, rotas e
	// cabides), quando publicada.
	$sustentabilidade = get_page_by_path( 'sustentabilidade' );
	if ( $sustentabilidade && $sustentabilidade->post_status === 'publish' ) {
		$l[] = ded_llms_txt_linha( $sustentabilidade );
	}
	$l[] = '';

	// 5. Optional (padrao llmstxt.org): o que pode ser pulado.
	$l[] = "## Optional";
	$l[] = '- [Blog](' . $site . '/blog/)';
	$l[] = '- [Mapa do site (XML)](' . $site . '/sitemap_index.xml)';
	$l[] = '';

	return implode( "\n", $l );
}

}
