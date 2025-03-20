<?php namespace ProcessWire;

// Template file for “home” template used by the homepage
// ------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

?>

<div id="wrapper" class="flex flex-column gap-lg justify-center nowrap align-center fullscreen bg-primary">
	<div class="flex flex-column align-center nowrap">
		<h1 class="flex align-center color-foreground font-xx">
			<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-logo"/></svg>
		</h1>
		<h1 class="color-foreground">Resurrexit</h1>
	</div>
	<div class="flex flex-column gap-md nowrap">
		<?php if($page->hasChildren): ?>
		<ul class="flex flex-column align-center">
			<?php echo $page->children("template=psalm-list")->each("<li><a class='btn btn-foreground w-xs text-center' href='{url}'>{language_name}</a></li>"); ?>
		</ul>
		<?php endif; ?>
	</div>
</div>
