/*
 * Dedicada - Zoom liberado no celular (07/11/2026, resposta 635 do dono: "sim, para todo o site").
 *
 * O tema Bridge escreve no cabecalho de todas as paginas
 *   <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
 * e o "user-scalable=no" impede aumentar a tela com os dedos no celular (WCAG 1.4.4; LBI, art. 63).
 * Este trecho troca so esse atributo: abre um buffer no get_header (antes do header.php) e fecha no comeco
 * do wp_head (antes de qualquer outra saida do wp_head). O resto da pagina nao passa por aqui. Nada mais muda.
 * Para voltar: desativar este snippet (nunca apagar).
 */
if ( ! function_exists( 'ded_viewport_trocar' ) ) {
	function ded_viewport_trocar( $html ) {
		if ( ! is_string( $html ) ) {
			return $html;
		}
		return str_replace(
			'content="width=device-width,initial-scale=1,user-scalable=no"',
			'content="width=device-width,initial-scale=1"',
			$html
		);
	}

	function ded_viewport_inicio() {
		if ( is_admin() || is_feed() || isset( $GLOBALS['ded_viewport_nivel'] ) ) {
			return;
		}
		ob_start( 'ded_viewport_trocar' );
		$GLOBALS['ded_viewport_nivel'] = ob_get_level();
	}

	function ded_viewport_fim() {
		if ( isset( $GLOBALS['ded_viewport_nivel'] ) && ob_get_level() === $GLOBALS['ded_viewport_nivel'] ) {
			ob_end_flush();
		}
		$GLOBALS['ded_viewport_nivel'] = 0;
	}

	add_action( 'get_header', 'ded_viewport_inicio', 9999 );
	add_action( 'wp_head', 'ded_viewport_fim', -9999 );
}
