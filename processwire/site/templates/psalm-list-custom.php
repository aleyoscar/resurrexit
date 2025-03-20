<?php namespace ProcessWire;

// Template file for pages using the “basic-page” template
// -------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

?>

<div id="wrapper" class="wrapper">

	<header id="header" class="bg-primary flex justify-between align-center nowrap">
		<h1><a class="link-color-foreground" href="<?php echo $page->url; ?>"><?php echo $page->title; ?></a></h1>
	</header>

	<main class="flex flex-column gap-md p-md screen-sm-px-0">
		<?php foreach ($page->psalm_sections as $section) { ?>
		<div class="psalm-list-header flex justify-between align-center screen-sm-px-md">
			<h2><?php echo $section->title; ?></h2>
		</div>
			<?php foreach ($page->psalms as $psalm) {
				if ($psalm->psalm_section->title == $section->title) {
					if ($psalm->psalm_title) echo "<h3>" . $psalm->psalm_title . "</h3>"; ?>
					<div class="psalm-list flex flex-column bl-md">
						<?php foreach ($psalm->psalm_pages as $pp) { ?>
						<a id="p<?php echo $pp->psalm_id; ?>"
							class="psalm-item flex flex-column p-sm"
							href="<?php echo $pp->url; ?>">
							<span class="font-bold color-primary"><?php echo $pp->title; ?></span>
							<span class="font-small color-secondary"><?php echo $psalm->psalm_cantor; ?> <?php echo $pp->psalm_key; ?></span>
						</a>
						<?php } ?>
					</div>
				<?php }
			}
		} ?>
	</main>
	<footer class="flex flex-column px-md gap-md pb-lg">
		<ul class="flex justify-center align-center gap-md mt-md">
			<?php if($page->editable()): ?>
			<li><a class="flex align-center font-small" href="<?php echo $page->editUrl(); ?>">
				<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-pencil"/></svg></a></li>
			<?php endif; ?>
		</ul>
	</footer>
	<div class="overlay fullscreen hide close-aside bg-secondary"></div>
</div>
