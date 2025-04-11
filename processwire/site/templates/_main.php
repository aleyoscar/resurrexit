<?php namespace ProcessWire;

// Optional main output file, called after rendering page’s template file.
// This is defined by $config->appendTemplateFile in /site/config.php, and
// is typically used to define and output markup common among most pages.
//
// When the Markup Regions feature is used, template files can prepend, append,
// replace or delete any element defined here that has an "id" attribute.
// https://processwire.com/docs/front-end/output/markup-regions/

/** @var Page $page */
/** @var Pages $pages */
/** @var Config $config */

$home = $pages->get('/'); /** @var HomePage $home */

?><!DOCTYPE html>
<html lang="en">
	<head>
		<title><?php echo $page->title; ?></title>

		<meta charset="utf-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
		<meta name="description" content="A multilingual songbook and tool set for the Neocatechumenal Way"/>

		<meta name="apple-mobile-web-app-title" content="Resurrexit">
		<meta name="application-name" content="Resurrexit">
		<meta name="msapplication-TileColor" content="#8e110b">
		<meta name="msapplication-config" content="/browserconfig.xml">
		<meta name="theme-color" content="#8e110b">

		<link rel="apple-touch-icon" sizes="180x180" href="<?php echo $config->urls->templates; ?>images/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="<?php echo $config->urls->templates; ?>images/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="<?php echo $config->urls->templates; ?>images/favicon-16x16.png">
		<link rel="manifest" href="/site.webmanifest">
		<link rel="mask-icon" href="<?php echo $config->urls->templates; ?>images/safari-pinned-tab.svg" color="#8e110b">
		<link rel="shortcut icon" href="/favicon.ico">

		<link rel="stylesheet" href="<?php echo $config->urls->templates; ?>styles/pico.colors.css?v=211">
		<link rel="stylesheet" href="<?php echo $config->urls->templates; ?>styles/pico.red.min.css?v=211">
		<link rel="stylesheet" href="<?php echo $config->urls->templates; ?>styles/eplayer.css?v=52">
		<link rel="stylesheet" href="<?php echo $config->urls->templates; ?>styles/main-2.css?v=151">
		<?php
			$custom_css = '';
			if ($page->custom_css) $custom_css = $page->custom_css;
			if ($page->parent->custom_css) $custom_css = $page->parent->custom_css;
			if ($custom_css) echo '<link rel="stylesheet" href="' . $custom_css . '">';
		?>

		<script src="<?php echo $config->urls->templates; ?>scripts/js.cookie.min.js?v=305" defer></script>
		<script src="<?php echo $config->urls->templates; ?>scripts/eplayer.js?v=150" defer></script>
		<script src="<?php echo $config->urls->templates; ?>scripts/main.js?v=150" defer></script>

	</head>
	<body id="html-body">
		<svg xmlns="http://www.w3.org/2000/svg" class="hide">
			<symbol id="icon-logo" viewBox="0 0 16 16">
				<path d="m 10.099302,9.145582 -2.0846142,1.203575 2.6856642,4.651671 h 2.779461 z" />
				<path d="m 4.706354,1.0012492 a 1.2035749,1.2035749 0 0 0 -0.0119,3.18e-5 1.2035749,1.2035749 0 0 0 -1.0342574,0.6017797 1.2035749,1.2035749 0 0 0 -0.1612518,0.6017719 v 5.84848 L 5.9060168,6.6635429 V 4.2894476 L 8.8814717,6.0072737 5.9060168,7.7251776 v -3.27e-5 L 4.1006934,8.7674136 v 3.2e-5 A 1.2035749,1.2035749 0 0 0 3.4989215,9.809714 v 5.190733 h 2.407072 V 10.504638 L 11.889803,7.0498527 a 1.2035749,1.2035749 0 0 0 0.0051,-0.00319 1.2035749,1.2035749 0 0 0 0.439276,-0.44444 1.2035749,1.2035749 0 0 0 -0.0038,-1.1966529 1.2035749,1.2035749 0 0 0 -0.440528,-0.4405279 V 4.9646216 L 5.3040038,1.1622583 a 1.2035749,1.2035749 0 0 0 -0.00509,-0.00318 1.2035749,1.2035749 0 0 0 -0.5926332,-0.1582497 z" />
			</symbol>
			<symbol id="icon-list" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
			</symbol>
			<symbol id="icon-three-dots" viewBox="0 0 16 16">
				<path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
			</symbol>
			<symbol id="icon-translate" viewBox="0 0 16 16">
				<path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
				<path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
			</symbol>
			<symbol id="icon-search" viewBox="0 0 16 16">
				<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
			</symbol>
			<symbol id="icon-x" viewBox="0 0 16 16">
				<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
			</symbol>
			<symbol id="icon-x-lg" viewBox="0 0 16 16">
				<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
			</symbol>
			<symbol id="icon-envelope-fill" viewBox="0 0 16 16">
				<path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
			</symbol>
			<symbol id="icon-git" viewBox="0 0 16 16">
				<path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.03 1.03 0 0 0 0-1.457"/>
			</symbol>
			<symbol id="icon-bug-fill" viewBox="0 0 16 16">
				<path d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A5 5 0 0 0 3 6h10a5 5 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A5 5 0 0 0 8 1a5 5 0 0 0-2.731.811l-.29-.956z"/>
				<path d="M13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975"/>
			</symbol>
			<symbol id="icon-check-circle-fill" viewBox="0 0 16 16">
				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
			</symbol>
			<symbol id="icon-arrow-left" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
			</symbol>
			<symbol id="icon-sort-alpha-down" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"/>
				<path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z"/>
			</symbol>
			<symbol id="icon-sort-alpha-up" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"/>
				<path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z"/>
			</symbol>
			<symbol id="icon-pencil" viewBox="0 0 16 16">
				<path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
			</symbol>
			<symbol id="icon-moon" viewBox="0 0 16 16">
  				<path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
			</symbol>
			<symbol id="icon-sun" viewBox="0 0 16 16">
  				<path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
			</symbol>
			<symbol id="icon-funnel" viewBox="0 0 16 16">
				<path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
			</symbol>
		</svg>
		<header id="header"></header>
		<main id="main"></main>
		<footer id="footer">
			<nav class="center">
				<ul>
					<li><a class="secondary" href="<?php echo $page->findOne('template=contact')->url; ?>">
						<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-envelope-fill"/></svg>
					</a></li>
					<li><a class="secondary" href="https://git.aleyoscar.com/emet/resurrexit" target="_blank">
						<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-git"/></svg>
					</a></li>
					<li><a id="theme-btn" class="secondary">
						<svg class="icon theme-toggle theme-dark" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-moon"/></svg>
						<svg class="icon theme-toggle theme-light" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-sun"/></svg>
					</a></li>
					<?php if ($page->editable()) { ?>
					<li><a class="secondary" href="<?php echo $page->editUrl(); ?>">
						<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-pencil"/></svg>
					</a></li>
					<?php } ?>
				</ul>
			</nav>
		</footer>
	</body>
</html>
