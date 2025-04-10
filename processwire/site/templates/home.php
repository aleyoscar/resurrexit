<?php namespace ProcessWire;

// Template file for “home” template used by the homepage
// ------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

// $files->include('reset.php');

?>

<main id="main" class="container center card">
	<h1><svg><use xlink:href="#icon-logo"/></svg></h1>
	<h1>Resurrexit</h1>
	<?php if($page->hasChildren) { ?>
		<div class="grid">
			<?php echo $page->children("template=psalm-list")->each("<a href='{url}' role='button'>{language_name}</a>"); ?>
		</div>
	<?php } ?>
</main>
