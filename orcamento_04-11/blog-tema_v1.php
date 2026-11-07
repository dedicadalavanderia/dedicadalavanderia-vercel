/*
 * Dedicada - Blog por tema (07/11/2026, passo 25 do esboco do site; respostas 651 e 652 do dono:
 * "pode ir variando entre os 3" e "sim, o que for melhor para seo, geo e aeo").
 * Gerado por fonte/modelo/build_blog.py, versao v1. Nao editar aqui: mudar o gerador e gravar de novo.
 *
 * Nos posts do mapa (cada post num dos 7 temas da /blog/):
 *  1. trilha "Inicio > Blog > tema" logo antes do titulo do post;
 *  2. assinatura no comeco do texto: foto, "Por <socio>, <cargo> da Dedicada Lavanderia", o tema e as datas de publicacao
 *     e de atualizacao (no lugar do "Revisado por" dos 14 posts que ja tinham, com a mesma pessoa);
 *  3. dados estruturados com o mesmo autor e as mesmas datas da assinatura: os 14 posts que ja tinham BlogPosting mantem as
 *     datas do proprio bloco; os outros ganham um BlogPosting com as datas do WordPress; todos ganham Person e trilha;
 *  4. "Mais sobre <tema>" no fim do texto: ate 5 posts do mesmo tema, os guias e servicos do tema e o link do tema na /blog/;
 *  5. sai da pagina a linha em ingles do tema ("Posted at ... by Dedicada ... Likes"), a data curta do titulo e a lista de
 *     etiquetas (as etiquetas e as categorias continuam no WordPress).
 * Na /blog/ (pagina 916), da pagina 2 em diante da lista: um cabecalho curto no lugar do texto da primeira pagina.
 * Nada muda no feed, na REST, no painel nem nos posts fora do mapa. Para voltar: desativar este snippet (nunca apagar).
 */
if ( ! function_exists( 'ded_blog_mapa' ) ) {

	function ded_blog_site() {
		return 'https://dedicadalavanderia.com.br';
	}

	// Modo de teste (so na versao "-teste" do gerador): so para quem administra o site e com ?ded_blog_teste=1 no endereco.
	function ded_blog_ligado() {
		return true;
	}

	function ded_blog_temas() {
		return array(
			"manchas" => array(
				"nome" => "Manchas, cheiros e problemas na roupa",
				"mais" => "Mais sobre manchas, cheiros e problemas na roupa",
				"todos" => "Todos os posts sobre manchas, cheiros e problemas na roupa",
				"pilares" => array(
					array(
						"Diagn\u{f3}stico de Manchas",
						"/diagnostico-de-manchas/",
					),
					array(
						"Remo\u{e7}\u{e3}o de manchas e odores",
						"/servicos/remocao-de-manchas-dificeis-em-florianopolis/",
					),
				),
			),
			"tecidos-delicados" => array(
				"nome" => "Seda, linho e tecidos delicados",
				"mais" => "Mais sobre seda, linho e tecidos delicados",
				"todos" => "Todos os posts sobre seda, linho e tecidos delicados",
				"pilares" => array(
					array(
						"Cuidados por tecido",
						"/cuidados-por-tecido/",
					),
					array(
						"Lavagem de roupas finas e seda",
						"/servicos/lavagem-de-roupas-finas-em-florianopolis/",
					),
				),
			),
			"la-e-inverno" => array(
				"nome" => "L\u{e3} e roupas de inverno",
				"mais" => "Mais sobre l\u{e3} e roupas de inverno",
				"todos" => "Todos os posts sobre l\u{e3} e roupas de inverno",
				"pilares" => array(
					array(
						"Cuidados com a l\u{e3}",
						"/cuidados-la/",
					),
					array(
						"Lavagem de casacos e jaquetas",
						"/servicos/lavagem-de-casacos-e-jaquetas-em-florianopolis/",
					),
				),
			),
			"cama-casa-e-bebe" => array(
				"nome" => "Cama, casa e beb\u{ea}",
				"mais" => "Mais sobre cama, casa e beb\u{ea}",
				"todos" => "Todos os posts sobre cama, casa e beb\u{ea}",
				"pilares" => array(
					array(
						"Lavagem de edredom",
						"/servicos/lavagem-de-edredom-em-florianopolis/",
					),
					array(
						"Cama, mesa e banho",
						"/servicos/lavagem-de-roupa-de-cama-mesa-e-banho-em-florianopolis/",
					),
					array(
						"Cuidados com a roupa de beb\u{ea}",
						"/cuidados-roupa-de-bebe/",
					),
				),
			),
			"dia-a-dia" => array(
				"nome" => "Roupas do dia a dia, sociais e de esporte",
				"mais" => "Mais sobre roupas do dia a dia, sociais e de esporte",
				"todos" => "Todos os posts sobre roupas do dia a dia, sociais e de esporte",
				"pilares" => array(
					array(
						"Tabela de pre\u{e7}os",
						"/servicos/",
					),
					array(
						"Cal\u{e7}as jeans e de sarja",
						"/cuidados-jeans-sarja/",
					),
					array(
						"Lavagem de terno",
						"/servicos/lavagem-de-terno-a-seco-em-florianopolis/",
					),
				),
			),
			"quando-usar-lavanderia" => array(
				"nome" => "Quando vale a pena usar uma lavanderia",
				"mais" => "Mais sobre quando vale a pena usar uma lavanderia",
				"todos" => "Todos os posts sobre quando vale a pena usar uma lavanderia",
				"pilares" => array(
					array(
						"Como funciona",
						"/como-funciona/",
					),
					array(
						"Qual lavanderia escolher",
						"/qual-lavanderia-escolher/",
					),
					array(
						"Garantia",
						"/garantia/",
					),
				),
			),
			"florianopolis" => array(
				"nome" => "Florian\u{f3}polis: clima, praia e bairros",
				"mais" => "Mais sobre Florian\u{f3}polis: clima, praia e bairros",
				"todos" => "Todos os posts sobre Florian\u{f3}polis: clima, praia e bairros",
				"pilares" => array(
					array(
						"Coleta e entrega gr\u{e1}tis",
						"/lavanderia-coleta-e-entrega-em-florianopolis/",
					),
					array(
						"Calend\u{e1}rio da lavanderia",
						"/calendario-da-lavanderia/",
					),
				),
			),
		);
	}

	function ded_blog_autores() {
		return array(
			"liliane" => array(
				"nome" => "Liliane Sella Mazza",
				"cargo" => "s\u{f3}cia fundadora",
				"job" => "S\u{f3}cia fundadora",
				"id" => "/#liliane-mazza",
				"foto" => "/wp-content/uploads/2026/09/liliane-sella-mazza-dedicada-lavanderia.webp",
			),
			"jorge" => array(
				"nome" => "Jorge Isaac Mazza",
				"cargo" => "s\u{f3}cio fundador",
				"job" => "S\u{f3}cio fundador",
				"id" => "/#jorge-mazza",
				"foto" => "/wp-content/uploads/2026/09/jorge-isaac-mazza-dedicada-lavanderia.webp",
			),
			"alejandro" => array(
				"nome" => "Alejandro David Mazza",
				"cargo" => "s\u{f3}cio administrador",
				"job" => "S\u{f3}cio administrador",
				"id" => "/#alejandro-mazza",
				"foto" => "/wp-content/uploads/2026/09/alejandro-david-mazza-dedicada-lavanderia.webp",
			),
		);
	}

	// post => array( tema, socio, relacionados )
	function ded_blog_mapa() {
		static $m = null;
		if ( null === $m ) {
			$m = array(
				900 => array( "manchas", "alejandro", array( 2257, 2183, 2154, 2323, 1199 ) ),
				905 => array( "quando-usar-lavanderia", "alejandro", array( 2320, 2307, 1058, 2355, 2341 ) ),
				914 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 2079, 1871, 1101 ) ),
				1011 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1949, 1886 ) ),
				1013 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 2677, 2333 ) ),
				1028 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1011, 1949 ) ),
				1030 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 2000, 1051 ) ),
				1036 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1054, 1835 ) ),
				1051 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 2314, 1994 ) ),
				1054 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1835, 2232 ) ),
				1058 => array( "quando-usar-lavanderia", "alejandro", array( 2320, 2307, 3092, 2440, 905 ) ),
				1071 => array( "tecidos-delicados", "liliane", array( 2222, 1868, 2082, 2014, 2140 ) ),
				1101 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 2079, 1874, 1883 ) ),
				1104 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1633, 1028 ) ),
				1108 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 2082, 2014 ) ),
				1121 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1036, 1054 ) ),
				1195 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1121, 1036 ) ),
				1199 => array( "manchas", "jorge", array( 2257, 2183, 2154, 2164, 2169 ) ),
				1207 => array( "manchas", "jorge", array( 2257, 2183, 2154, 2653, 2280 ) ),
				1245 => array( "manchas", "jorge", array( 2257, 2183, 2154, 900, 2323 ) ),
				1292 => array( "manchas", "jorge", array( 2257, 2183, 2154, 1207, 2653 ) ),
				1295 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 2079, 914, 1871 ) ),
				1312 => array( "la-e-inverno", "jorge", array( 1892, 1962, 1994, 2144, 3085 ) ),
				1364 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 2637, 1759 ) ),
				1633 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1028, 1011 ) ),
				1649 => array( "dia-a-dia", "alejandro", array( 2209, 2079, 1871, 1101, 1874 ) ),
				1759 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1195, 1121 ) ),
				1772 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1915, 1938 ) ),
				1781 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1772, 1915 ) ),
				1796 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 2296, 2299 ) ),
				1835 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 2232, 2663 ) ),
				1838 => array( "manchas", "jorge", array( 2257, 2183, 2154, 1292, 1207 ) ),
				1852 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1781, 1772 ) ),
				1859 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1852, 1781 ) ),
				1862 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1364, 2637 ) ),
				1865 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1108, 2082 ) ),
				1868 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 2082, 2014, 2140 ) ),
				1871 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 2079, 1101, 1874 ) ),
				1874 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 2079, 1883, 2129 ) ),
				1883 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 2079, 2129, 1977 ) ),
				1886 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1030, 2000 ) ),
				1892 => array( "la-e-inverno", "jorge", array( 1312, 1962, 1994, 2144, 3085 ) ),
				1915 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1938, 1865 ) ),
				1931 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1934, 1859 ) ),
				1934 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1859, 1852 ) ),
				1938 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1865, 1108 ) ),
				1949 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1886, 1030 ) ),
				1962 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1994, 2144, 3085 ) ),
				1977 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 2079, 1295, 914 ) ),
				1994 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 2144, 3085 ) ),
				2000 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1051, 2314 ) ),
				2014 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 2140, 1796 ) ),
				2079 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 1871, 1101, 1874 ) ),
				2082 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 2014, 2140 ) ),
				2111 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1104, 1633 ) ),
				2129 => array( "dia-a-dia", "alejandro", array( 1649, 2209, 2079, 1977, 1295 ) ),
				2140 => array( "tecidos-delicados", "alejandro", array( 1071, 2222, 1868, 1796, 2296 ) ),
				2144 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 3085, 2111 ) ),
				2154 => array( "manchas", "liliane", array( 2257, 2183, 2164, 2169, 2160 ) ),
				2160 => array( "manchas", "liliane", array( 2257, 2183, 2154, 2173, 2196 ) ),
				2164 => array( "manchas", "liliane", array( 2257, 2183, 2154, 2169, 2160 ) ),
				2169 => array( "manchas", "alejandro", array( 2257, 2183, 2154, 2160, 2173 ) ),
				2173 => array( "manchas", "liliane", array( 2257, 2183, 2154, 2196, 2186 ) ),
				2183 => array( "manchas", "alejandro", array( 2257, 2154, 2164, 2169, 2160 ) ),
				2186 => array( "manchas", "jorge", array( 2257, 2183, 2154, 2192, 1838 ) ),
				2192 => array( "manchas", "jorge", array( 2257, 2183, 2154, 1838, 1292 ) ),
				2196 => array( "manchas", "liliane", array( 2257, 2183, 2154, 2186, 2192 ) ),
				2209 => array( "dia-a-dia", "alejandro", array( 1649, 2079, 1871, 1101, 1874 ) ),
				2222 => array( "tecidos-delicados", "liliane", array( 1071, 1868, 2082, 2014, 2140 ) ),
				2232 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 2663, 3100 ) ),
				2257 => array( "manchas", "alejandro", array( 2183, 2154, 2164, 2169, 2160 ) ),
				2270 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 2682, 1931 ) ),
				2280 => array( "manchas", "jorge", array( 2257, 2183, 2154, 2380, 1245 ) ),
				2296 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 2299, 2304 ) ),
				2299 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 2304, 2270 ) ),
				2304 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 2270, 2682 ) ),
				2307 => array( "quando-usar-lavanderia", "alejandro", array( 2320, 1058, 3092, 2440, 905 ) ),
				2314 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 1994, 2144 ) ),
				2320 => array( "quando-usar-lavanderia", "alejandro", array( 2307, 1058, 3092, 2440, 905 ) ),
				2323 => array( "manchas", "jorge", array( 2257, 2183, 2154, 1199, 2164 ) ),
				2333 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1862, 1364 ) ),
				2341 => array( "quando-usar-lavanderia", "alejandro", array( 2320, 2307, 1058, 2843, 3092 ) ),
				2355 => array( "quando-usar-lavanderia", "alejandro", array( 2320, 2307, 1058, 2341, 2843 ) ),
				2380 => array( "manchas", "jorge", array( 2257, 2183, 2154, 1245, 900 ) ),
				2418 => array( "florianopolis", "alejandro", array( 2469, 2484, 2466, 2449 ) ),
				2440 => array( "quando-usar-lavanderia", "alejandro", array( 2320, 2307, 1058, 905, 2355 ) ),
				2449 => array( "florianopolis", "alejandro", array( 2469, 2484, 2466, 2418 ) ),
				2466 => array( "florianopolis", "alejandro", array( 2469, 2484, 2449, 2418 ) ),
				2469 => array( "florianopolis", "alejandro", array( 2484, 2466, 2449, 2418 ) ),
				2484 => array( "florianopolis", "alejandro", array( 2469, 2466, 2449, 2418 ) ),
				2633 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 3100, 1013, 2677 ) ),
				2637 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1759, 1195 ) ),
				2653 => array( "manchas", "jorge", array( 2257, 2183, 2154, 2280, 2380 ) ),
				2663 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 3100, 1013 ) ),
				2674 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2633, 3100, 1013, 2677 ) ),
				2677 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 2333, 1862 ) ),
				2682 => array( "tecidos-delicados", "liliane", array( 1071, 2222, 1868, 1931, 1934 ) ),
				2693 => array( "cama-casa-e-bebe", "liliane", array( 2674, 2633, 3100, 1013, 2677 ) ),
				2843 => array( "quando-usar-lavanderia", "alejandro", array( 2320, 2307, 1058, 3092, 2440 ) ),
				3085 => array( "la-e-inverno", "jorge", array( 1892, 1312, 1962, 2111, 1104 ) ),
				3092 => array( "quando-usar-lavanderia", "alejandro", array( 2320, 2307, 1058, 2440, 905 ) ),
				3100 => array( "cama-casa-e-bebe", "liliane", array( 2693, 2674, 2633, 1013, 2677 ) ),
			);
		}
		return $m;
	}

	function ded_blog_post_do_mapa() {
		if ( ! ded_blog_ligado() || is_admin() || is_feed() || ! is_singular( 'post' ) || ! in_the_loop() || ! is_main_query() ) {
			return 0;
		}
		$id = (int) get_the_ID();
		if ( $id < 1 || (int) get_queried_object_id() !== $id ) {
			return 0;
		}
		$m = ded_blog_mapa();
		return isset( $m[ $id ] ) ? $id : 0;
	}

	function ded_blog_data( $s ) {
		if ( ! is_string( $s ) || ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})/', $s, $d ) ) {
			return null;
		}
		return array( $d[1] . '-' . $d[2] . '-' . $d[3], $d[3] . '/' . $d[2] . '/' . $d[1] );
	}

	function ded_blog_titulo( $p ) {
		$t = html_entity_decode( wp_strip_all_tags( get_the_title( $p ) ), ENT_QUOTES, 'UTF-8' );
		return trim( str_replace( "\xc2\xa0", ' ', $t ) );
	}

	function ded_blog_rep( $s ) {
		return addcslashes( $s, '\\$' );
	}

	function ded_blog_link( $href, $texto ) {
		return '<a href="' . esc_url( $href ) . '">' . esc_html( $texto ) . '</a>';
	}

	function ded_blog_descricao( $id ) {
		$d = '';
		if ( function_exists( 'YoastSEO' ) ) {
			try {
				$meta = YoastSEO()->meta->for_current_page();
				if ( $meta && is_string( $meta->description ) ) {
					$d = $meta->description;
				}
			} catch ( \Throwable $e ) {
				$d = '';
			}
		}
		if ( '' === $d ) {
			$d = (string) get_post_meta( $id, '_yoast_wpseo_metadesc', true );
		}
		if ( false !== strpos( $d, '%%' ) ) {
			$d = '';
		}
		return trim( html_entity_decode( wp_strip_all_tags( $d ), ENT_QUOTES, 'UTF-8' ) );
	}

	function ded_blog_pessoa( $a ) {
		$s = ded_blog_site();
		return array(
			'@type'    => 'Person',
			'@id'      => $s . $a['id'],
			'name'     => $a['nome'],
			'jobTitle' => $a['job'],
			'image'    => $s . $a['foto'],
			'url'      => $s . '/sobre/#equipe',
			'worksFor' => array( '@id' => $s . '/#centro' ),
		);
	}

	function ded_blog_trilha_ld( $url, $tema, $titulo ) {
		$s = ded_blog_site();
		$t = ded_blog_temas();
		return array(
			'@type'           => 'BreadcrumbList',
			'@id'             => $url . '#trilha',
			'itemListElement' => array(
				array( '@type' => 'ListItem', 'position' => 1, 'name' => "In\u{ed}cio", 'item' => $s . '/' ),
				array( '@type' => 'ListItem', 'position' => 2, 'name' => 'Blog', 'item' => $s . '/blog/' ),
				array( '@type' => 'ListItem', 'position' => 3, 'name' => $t[ $tema ]['nome'], 'item' => $s . '/blog/#' . $tema ),
				array( '@type' => 'ListItem', 'position' => 4, 'name' => $titulo ),
			),
		);
	}

	function ded_blog_trilha_html( $tema ) {
		$s   = ded_blog_site();
		$t   = ded_blog_temas();
		$sep = ' <span aria-hidden="true">&rsaquo;</span> ';
		return '<nav class="ded-trilha ded-blog-trilha" aria-label="Voc&ecirc; est&aacute; em">'
			. '<a href="' . esc_url( $s . '/' ) . '">In&iacute;cio</a>' . $sep
			. '<a href="' . esc_url( $s . '/blog/' ) . '">Blog</a>' . $sep
			. ded_blog_link( $s . '/blog/#' . $tema, $t[ $tema ]['nome'] ) . '</nav>';
	}

	function ded_blog_assinatura( $a, $tema, $pub, $mod ) {
		$s     = ded_blog_site();
		$t     = ded_blog_temas();
		$dp    = ded_blog_data( $pub );
		$dm    = ded_blog_data( $mod );
		$datas = '';
		if ( $dp ) {
			$datas .= ' &middot; Publicado em <time datetime="' . esc_attr( $dp[0] ) . '">' . esc_html( $dp[1] ) . '</time>';
		}
		if ( $dm && ( ! $dp || $dm[0] !== $dp[0] ) ) {
			$datas .= ' &middot; Atualizado em <time datetime="' . esc_attr( $dm[0] ) . '">' . esc_html( $dm[1] ) . '</time>';
		}
		return '<div class="ded-blog-assina"><img src="' . esc_url( $s . $a['foto'] ) . '" alt="" width="48" height="48" decoding="async">'
			. '<p><span class="ded-blog-por">Por <a href="' . esc_url( $s . '/sobre/#equipe' ) . '"><strong>' . esc_html( $a['nome'] )
			. '</strong></a>, ' . esc_html( $a['cargo'] ) . ' da Dedicada Lavanderia</span>'
			. '<span class="ded-blog-meta">' . ded_blog_link( $s . '/blog/#' . $tema, $t[ $tema ]['nome'] ) . $datas . '</span></p></div>';
	}

	function ded_blog_mais( $rel, $tema ) {
		$s     = ded_blog_site();
		$t     = ded_blog_temas();
		$itens = '';
		if ( $rel ) {
			$ps = get_posts(
				array(
					'post__in'            => $rel,
					'orderby'             => 'post__in',
					'post_type'           => 'post',
					'post_status'         => 'publish',
					'posts_per_page'      => count( $rel ),
					'no_found_rows'       => true,
					'ignore_sticky_posts' => true,
				)
			);
			foreach ( $ps as $p ) {
				$itens .= '<li>' . ded_blog_link( get_permalink( $p ), ded_blog_titulo( $p ) ) . '</li>';
			}
		}
		$guias = array();
		foreach ( $t[ $tema ]['pilares'] as $g ) {
			$guias[] = ded_blog_link( $s . $g[1], $g[0] );
		}
		$h  = '<aside class="ded-blog-mais" aria-labelledby="ded-blog-mais-titulo"><h2 id="ded-blog-mais-titulo">' . esc_html( $t[ $tema ]['mais'] ) . '</h2>';
		$h .= $itens ? '<ul class="ded-leia">' . $itens . '</ul>' : '';
		$h .= '<p class="ded-blog-guias"><strong>Guias e servi&ccedil;os do tema:</strong> ' . implode( ' &middot; ', $guias ) . '</p>';
		$h .= '<p class="ded-blog-todos"><a href="' . esc_url( $s . '/blog/#' . $tema ) . '">' . esc_html( $t[ $tema ]['todos'] ) . ' &rarr;</a></p></aside>';
		return $h;
	}

	function ded_blog_conteudo( $content ) {
		$id = ded_blog_post_do_mapa();
		if ( ! $id || ! is_string( $content ) || '' === $content || false !== strpos( $content, 'class="ded-blog-assina"' ) ) {
			return $content;
		}
		$m       = ded_blog_mapa();
		$autores = ded_blog_autores();
		list( $tema, $socio, $rel ) = $m[ $id ];
		$a      = $autores[ $socio ];
		$s      = ded_blog_site();
		$t      = ded_blog_temas();
		$url    = get_permalink( $id );
		$titulo = ded_blog_titulo( $id );
		$tem_bp = ( false !== strpos( $content, '"BlogPosting"' ) );
		$pub    = '';
		$mod    = '';
		if ( $tem_bp ) {
			// Os 14 posts que ja tinham BlogPosting no texto: o bloco fica, com o autor, a pessoa e a trilha acertados.
			$feito = false;
			if ( preg_match_all( '#<script type="application/ld\+json">(.*?)</script>#s', $content, $mm, PREG_OFFSET_CAPTURE ) ) {
				foreach ( $mm[1] as $b ) {
					$o = json_decode( $b[0], true );
					if ( ! is_array( $o ) || empty( $o['@graph'] ) || ! is_array( $o['@graph'] ) ) {
						continue;
					}
					$novo  = array();
					$achou = false;
					foreach ( $o['@graph'] as $n ) {
						if ( ! is_array( $n ) || ! isset( $n['@type'] ) ) {
							$novo[] = $n;
						} elseif ( 'BlogPosting' === $n['@type'] && ! $achou ) {
							$achou                = true;
							$pub                  = isset( $n['datePublished'] ) ? (string) $n['datePublished'] : '';
							$mod                  = isset( $n['dateModified'] ) ? (string) $n['dateModified'] : '';
							$n['author']          = array( '@id' => $s . $a['id'] );
							$n['articleSection']  = $t[ $tema ]['nome'];
							$novo[]               = $n;
						} elseif ( 'Person' !== $n['@type'] && 'BreadcrumbList' !== $n['@type'] ) {
							$novo[] = $n;
						}
					}
					if ( ! $achou ) {
						continue;
					}
					$novo[]      = ded_blog_pessoa( $a );
					$novo[]      = ded_blog_trilha_ld( $url, $tema, $titulo );
					$o['@graph'] = $novo;
					$enc         = wp_json_encode( $o, JSON_UNESCAPED_SLASHES );
					if ( is_string( $enc ) && '' !== $enc ) {
						$content = substr_replace( $content, $enc, $b[1], strlen( $b[0] ) );
						$feito   = true;
					}
					break;
				}
			}
			if ( ! $feito ) {
				return $content;   // BlogPosting que nao deu para ler: o post fica como esta
			}
		} else {
			// Os outros posts: um BlogPosting novo, com as datas do WordPress.
			$pub = (string) get_post_time( 'c', true, $id );
			$mod = (string) get_post_modified_time( 'c', true, $id );
			$bp  = array(
				'@type'    => 'BlogPosting',
				'@id'      => $url . '#artigo',
				'headline' => $titulo,
			);
			$desc = ded_blog_descricao( $id );
			if ( '' !== $desc ) {
				$bp['description'] = $desc;
			}
			$bp['url']              = $url;
			$bp['mainEntityOfPage'] = array( '@type' => 'WebPage', '@id' => $url );
			$bp['inLanguage']       = 'pt-BR';
			$bp['datePublished']    = $pub;
			$bp['dateModified']     = $mod;
			$bp['author']           = array( '@id' => $s . $a['id'] );
			$bp['publisher']        = array( '@id' => $s . '/#centro' );
			$img                    = get_the_post_thumbnail_url( $id, 'full' );
			if ( $img ) {
				$bp['image'] = $img;
			}
			$bp['articleSection'] = $t[ $tema ]['nome'];
			$ld  = array( '@context' => 'https://schema.org', '@graph' => array( $bp, ded_blog_pessoa( $a ), ded_blog_trilha_ld( $url, $tema, $titulo ) ) );
			$enc = wp_json_encode( $ld, JSON_UNESCAPED_SLASHES );
			if ( ! is_string( $enc ) || '' === $enc ) {
				return $content;
			}
			$content .= "\n" . '<script type="application/ld+json">' . $enc . '</script>';
		}
		$assina = ded_blog_assinatura( $a, $tema, $pub, $mod );
		$trocas = 0;
		$c2     = preg_replace( '#<p style="display:flex;align-items:center;gap:12px;font-size:14px"><img[^>]*><span>Revisado por <strong>[^<]+</strong>, [^<]+</span></p>#', ded_blog_rep( $assina ), $content, 1, $trocas );
		if ( is_string( $c2 ) && $trocas ) {
			$content = $c2;
		} else {
			$content = $assina . "\n" . $content;
		}
		return $content . "\n" . ded_blog_mais( $rel, $tema );
	}

	function ded_blog_paginada( $content ) {
		if ( ! ded_blog_ligado() || is_admin() || is_feed() || ! is_page( 916 ) || ! in_the_loop() || ! is_main_query() ) {
			return $content;
		}
		$pg = (int) get_query_var( 'paged' );
		if ( $pg < 2 ) {
			return $content;
		}
		$s   = ded_blog_site();
		$sep = ' <span aria-hidden="true">&rsaquo;</span> ';
		return '<style>' . "h1.ded-bl-h1{margin:0 0 14px;font-family:Montserrat,sans-serif;font-size:24px;line-height:36px;font-weight:400;letter-spacing:5px;text-transform:uppercase;color:#303030}.ded-bl-pag{max-width:900px;margin:40px auto 30px;padding:0 20px;text-align:center}.ded-bl-pag .ded-trilha{margin:0 auto 24px}.ded-bl-pag p a{color:#1e4468 !important;text-decoration:underline;text-underline-offset:3px}@media (max-width:768px){h1.ded-bl-h1{font-size:19px;line-height:28px;letter-spacing:3px}}" . '</style><div class="ded-bl-pag">'
			. '<nav class="ded-trilha" aria-label="Voc&ecirc; est&aacute; em"><a href="' . esc_url( $s . '/' ) . '">In&iacute;cio</a>' . $sep
			. '<a href="' . esc_url( $s . '/blog/' ) . '">Blog</a>' . $sep . '<span aria-current="page">P&aacute;gina ' . $pg . '</span></nav>'
			. '<h1 class="ded-bl-h1">Blog da Dedicada Lavanderia: posts mais recentes, p&aacute;gina ' . $pg . '</h1>'
			. '<p>Os posts tamb&eacute;m est&atilde;o organizados por tema na <a href="' . esc_url( $s . '/blog/' ) . '">primeira p&aacute;gina do blog</a>.</p></div>';
	}

	function ded_blog_css() {
		if ( ! ded_blog_ligado() || is_admin() || is_feed() || ! is_singular( 'post' ) ) {
			return;
		}
		$m = ded_blog_mapa();
		if ( ! isset( $m[ (int) get_queried_object_id() ] ) ) {
			return;
		}
		echo '<style id="ded-blog-css">' . ".ded-blog-trilha{max-width:none;margin:0 0 12px;text-align:left}.ded-blog-assina{display:flex;align-items:center;gap:12px;margin:0 0 18px}.ded-blog-assina img{width:48px;height:48px;border-radius:50%;flex:0 0 48px;object-fit:cover;margin:0}.ded-blog-assina p{margin:0;font-size:14px;line-height:1.5}.ded-blog-assina span{display:block}.ded-blog-meta{font-size:13px;color:#555}.ded-blog-assina a,.ded-blog-mais p a{color:#1e4468 !important;text-decoration:underline;text-underline-offset:3px}.ded-blog-mais{margin:40px 0 10px}.ded-blog-mais .ded-leia{max-width:none}.ded-blog-mais p{margin:14px 0 0}.ded-blog-trilha a:focus-visible,.ded-blog-assina a:focus-visible,.ded-blog-mais a:focus-visible{outline:3px solid #1e4468;outline-offset:3px}" . "</style>\n";
	}

	// Trocas no HTML do tema em volta do texto (so no post do mapa, so entre o comeco e o fim do loop principal).
	function ded_blog_buffer_trocar( $html ) {
		if ( ! is_string( $html ) || '' === $html || empty( $GLOBALS['ded_blog_id'] ) ) {
			return $html;
		}
		$m  = ded_blog_mapa();
		$id = (int) $GLOBALS['ded_blog_id'];
		if ( ! isset( $m[ $id ] ) ) {
			return $html;
		}
		// O tema escreve atributos (itemprop) que um filtro tira depois deste buffer: os padroes aceitam atributos a mais.
		$n    = 0;
		$novo = preg_replace( '#<div\b[^>]*\bclass="post_info"[^>]*>.*?<div\b[^>]*\bclass="blog_like"[^>]*>.*?</div>\s*</div>#s', '', $html, 1, $n );
		if ( ! is_string( $novo ) || ! $n ) {
			$novo = preg_replace( '#<div\b[^>]*\bclass="post_info"[^>]*>(?:(?!</?div\b).)*</div>#s', '', $html, 1, $n );
		}
		if ( is_string( $novo ) && $n ) {
			$html = $novo;
		}
		$trilha = ded_blog_trilha_html( $m[ $id ][0] );
		$novo   = preg_replace_callback(
			'#(<h2\b[^>]*\bclass="entry_title"[^>]*>)\s*<span\b[^>]*\bclass="date entry_date updated"[^>]*>.*?</span>\s*#s',
			function ( $mm ) use ( $trilha ) {
				return $trilha . $mm[1];
			},
			$html,
			1,
			$n
		);
		if ( ! is_string( $novo ) || ! $n ) {
			$novo = preg_replace_callback(
				'#<h2\b[^>]*\bclass="entry_title"[^>]*>#',
				function ( $mm ) use ( $trilha ) {
					return $trilha . $mm[0];
				},
				$html,
				1,
				$n
			);
		}
		if ( is_string( $novo ) && $n ) {
			$html = $novo;
		}
		$novo = preg_replace( '#<div\b[^>]*\bclass="single_tags clearfix"[^>]*>\s*<div\b[^>]*\bclass="tags_text"[^>]*>.*?</div>\s*</div>#s', '', $html, 1, $n );
		if ( is_string( $novo ) && $n ) {
			$html = $novo;
		}
		return $html;
	}

	function ded_blog_buffer_inicio( $q ) {
		if ( ! ded_blog_ligado() || is_admin() || is_feed() || ! ( $q instanceof WP_Query ) || ! $q->is_main_query() || ! $q->is_singular( 'post' ) || isset( $GLOBALS['ded_blog_nivel'] ) ) {
			return;
		}
		$id = (int) $q->get_queried_object_id();
		$m  = ded_blog_mapa();
		if ( ! isset( $m[ $id ] ) ) {
			return;
		}
		$GLOBALS['ded_blog_id'] = $id;
		ob_start( 'ded_blog_buffer_trocar' );
		$GLOBALS['ded_blog_nivel'] = ob_get_level();
	}

	function ded_blog_buffer_fim( $q ) {
		if ( ! ( $q instanceof WP_Query ) || ! $q->is_main_query() ) {
			return;
		}
		if ( ! empty( $GLOBALS['ded_blog_nivel'] ) && ob_get_level() === $GLOBALS['ded_blog_nivel'] ) {
			ob_end_flush();
			$GLOBALS['ded_blog_nivel'] = 0;
		}
	}

	add_filter( 'the_content', 'ded_blog_conteudo', 99990 );
	add_filter( 'the_content', 'ded_blog_paginada', 99991 );
	add_action( 'wp_head', 'ded_blog_css', 20 );
	add_action( 'loop_start', 'ded_blog_buffer_inicio', 1 );
	add_action( 'loop_end', 'ded_blog_buffer_fim', 999 );
}
