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
		<h1 class="screen-sm-hide"><a class="link-color-foreground" href="<?php echo $page->url; ?>"><?php echo $page->title; ?></a></h1>
		<h1 class="screen-sm-show mr-sm">
			<a class="link-color-foreground flex align-center" href="<?php echo $page->url; ?>">
				<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-logo"/></svg>
			</a>
		</h1>
		<form id="search-form" class="flex align-center nowrap" method="get" action="<?php echo $pages->get('template=search')->url ?>">
			<input id="search" type="search" name="search" class="bg-primary-hv color-foreground"
				placeholder="<?php echo $page->label_search; ?>"
				data-nosearch="<?php echo $page->label_noresults; ?>"
				data-search="<?php echo $page->label_search; ?>"/>
			<button class="btn-icon link-color-foreground ml-sm hide">
				<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-search"/></svg>
			</button>
		</form>
		<button class="aside-btn btn-icon screen-sm-show-flex flex align-center ml-sm screen-sm-ml-0 link-color-foreground" type="button">
			<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-three-dots"/></svg>
		</button>
	</header>

	<aside id="aside" class="flex flex-column nowrap justify-between gap-md shadow">
		<nav class="flex flex-column px-md gap-md">
			<div class="menu-header flex justify-between align-center">
				<h1><a class="link-color-primary"><?php echo $page->title; ?></a></h1>
				<button class="btn-icon close-aside screen-sm-show-flex flex align-center" type="button">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-x-lg"/></svg>
				</button>
			</div>
			<hr class="screen-sm-show mt-neg-md">
			<h4 class="color-grey-light"><?php echo $page->label_language; ?></h4>
			<ul class="flex flex-column">
				<?php foreach($page->parent->children as $child) { ?>
				<li><a class="flex align-center btn-link <?php if($page->id == $child->id) echo 'active'; ?>" href="<?php echo $child->url; ?>"><?php echo $child->language_name; ?></a></li>
				<?php } ?>
			</ul>
			<hr>
			<h4 class="color-grey-light"><?php echo $page->label_steps; ?></h4>
			<ul class="flex flex-column">
				<?php foreach($page->filter_steps as $step) { ?>
				<li><button class="btn-link flex align-center svg-active-sm category-btn" type="button" data-filter="<?php echo $step->filter_data; ?>">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-check-circle-fill"/></svg>
					<?php echo $step->title; ?></button></li>
				<?php } ?>
			</ul>
			<hr>
			<h4 class="color-grey-light"><?php echo $page->label_book_tags; ?></h4>
			<div class="flex">
				<?php foreach($page->filter_tags as $tag) { ?>
					<button class="btn-link flex align-center svg-active-sm tag-btn" type="button" data-filter="<?php echo $page->name . '-' . $tag->filter_data; ?>">
						<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-check-circle-fill"/></svg>
						<?php
						if ($page->name == 'en-us') echo $tag->filter_en_us;
						else if ($page->name == 'es-es') echo $tag->filter_es_es;
						?>
					</button>
				<?php } ?>
			</div>
			<hr>
			<h4 class="color-grey-light"><?php echo $page->label_tags; ?></h4>
			<div class="flex">
				<?php
				$tags = [];
				foreach($page->parent->children as $child) {
					foreach($child->filter_tags as $tag) {
						$found = False;
						foreach($tags as $t) {
							if ($tag->filter_data == $t->filter_data) {
								$found = True;
								break;
							}
						}
						if (!$found) $tags[] = $tag;
					}
				}
				foreach($tags as $tag) { ?>
					<button class="btn-link flex align-center svg-active-sm tag-btn" type="button" data-filter="<?php echo $tag->filter_data; ?>">
						<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-check-circle-fill"/></svg>
						<?php
						if ($page->name == 'en-us') echo $tag->filter_en_us;
						else if ($page->name == 'es-es') echo $tag->filter_es_es;
						?>
					</button>
				<?php } ?>
			</div>
		</nav>
		<footer class="flex flex-column px-md gap-md pb-lg">
			<ul class="flex justify-center align-center gap-md mt-md">
				<li><a class="flex align-center font-small" href="<?php echo $page->findOne('template=contact')->url; ?>">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-envelope-fill"/></svg>
					<?php echo $page->label_contact; ?></a></li>
				<li><a class="flex align-center font-small" href="https://git.aleyoscar.com/emet/resurrexit" target="_blank">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-git"/></svg>
					<?php echo $page->label_source; ?></a></li>
				<?php if($page->editable()): ?>
				<li><a class="flex align-center font-small" href="<?php echo $page->editUrl(); ?>">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-pencil"/></svg>
					<?php echo $page->label_edit; ?></a></li>
				<?php endif; ?>
			</ul>
		</footer>
	</aside>

	<main class="flex flex-column gap-md p-md screen-sm-px-0">
		<div class="psalm-list-header flex justify-between align-center screen-sm-px-md">
			<h2><?php echo $page->label_psalms; ?></h2>
			<div class="flex align-center gap-md">
				<button class="btn-icon sort-btn link-color-secondary" type="button">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-sort-alpha-down"/></svg>
				</button>
				<button class="btn-icon sort-btn link-color-secondary hide" type="button">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-sort-alpha-up"/></svg>
				</button>
				<a class="clear-btn hide" href="<?php echo $page->url; ?>"><?php echo $page->label_showall; ?></a>
			</div>
		</div>
		<div class="psalm-list flex flex-column">
			<?php foreach($page->children as $child) {
				if ($child->template == 'psalm') { ?>
			<a id="p<?php echo $child->psalm_id; ?>"
				class="psalm-item flex flex-column p-md <?php echo $child->psalm_step->value; ?>
				<?php foreach($child->psalm_tags as $tag) echo $page->name . '-' . $tag->value . ' '; ?>"
				href="<?php echo $child->url; ?>" data-search="">
				<span class="font-bold color-primary"><?php echo $child->title; ?></span>
				<span class="font-small color-secondary"><?php echo $child->psalm_subtitle; ?></span>
			</a>
			<?php } } ?>
		</div>
		<p class="no-psalms color-secondary hide"><?php echo $page->label_nomatch; ?></p>
	</main>
</div>
