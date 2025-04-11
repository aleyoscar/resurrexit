<?php namespace ProcessWire;

// Template file for pages using the “basic-page” template
// -------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

$home = $pages->get('/'); /** @var HomePage $home */

$tags = [];
foreach($page->parent->children("template=psalm-list") as $child) {
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
if ($page->name == 'en-us') {
	usort($tags, function($a, $b) {
		return strcmp($a->filter_en_us, $b->filter_en_us);
	});
} else if ($page->name == 'es-es') {
	usort($tags, function($a, $b) {
		return strcmp($a->filter_es_es, $b->filter_es_es);
	});
}

?>

<main id="main" class="container grid grid-aside">
	<aside>
		<nav class="borders menu">
			<form role="search" id="search-form" method="get" action="<?php echo $pages->get('template=search')->url ?>">
				<input id="search" type="search" name="search"
					placeholder="<?php echo $page->label_search; ?>"
					data-nosearch="<?php echo $page->label_noresults; ?>"
					data-search="<?php echo $page->label_search; ?>"/>
				<!-- <button type="submit">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-search"/></svg>
				</button> -->
			</form>
			<details>
				<summary><strong><?php echo $page->label_steps; ?></strong></summary>
				<ul>
					<?php foreach($page->filter_steps as $step) { ?>
					<li class="category-btn" data-filter="<?php echo $step->filter_data; ?>"><a class="secondary"><?php echo $step->title; ?></a></li>
					<?php } ?>
				</ul>
			</details>
			<details>
				<summary><strong><?php echo $page->label_book_tags; ?></strong></summary>
				<ul>
					<?php foreach($page->filter_tags as $tag) { ?>
					<li class="tag-btn" data-filter="<?php echo $page->name . '-' . $tag->filter_data; ?>"><a class="secondary">
						<?php
						if ($page->name == 'en-us') echo $tag->filter_en_us;
						else if ($page->name == 'es-es') echo $tag->filter_es_es;
						?>
					</a></li>
					<?php } ?>
				</ul>
			</details>
			<details>
				<summary><strong><?php echo $page->label_tags; ?></strong></summary>
				<ul>
					<?php foreach($tags as $tag) { ?>
					<li class="tag-btn" data-filter="<?php echo $tag->filter_data; ?>"><a class="secondary">
						<?php
						if ($page->name == 'en-us') echo $tag->filter_en_us;
						else if ($page->name == 'es-es') echo $tag->filter_es_es;
						?>
					</a></li>
					<?php } ?>
				</ul>
			</details>
		</nav>
	</aside>

	<div id="content" class="content" role="document">
		<table class="psalm-list">
			<tbody>
				<?php foreach($page->children('template=psalm') as $child) {
					$tags = '';
					foreach($child->psalm_tags as $tag) $tags .= ' ' . $page->name . '-' . $tag->value . ' ' . $tag->value;
					foreach($page->siblings as $sibling) {
						foreach($sibling->children('psalm_id=' . $child->psalm_id) as $c) {
							foreach($c->psalm_tags as $tag) $tags .= ' ' . $tag->value;
						}
					}
					?>
				<tr id="p<?php echo $child->psalm_id; ?>"
					class="psalm-item <?php echo $child->psalm_step->value . $tags; ?>"
					data-search="">
					<td><a href="<?php echo $child->url; ?>"><hgroup>
						<h6><?php echo $child->title; ?></h6>
						<p><small><?php echo $child->psalm_subtitle; ?></small></p>
					</hgroup></a></td>
				</tr>
				<?php } ?>
			</tbody>
		</table>
		<p class="no-psalms center hide"><?php echo $page->label_noresults; ?></p>
		<div class="flex sort-menu">
			<a class="sort-btn secondary" role="button">
				<strong>Sort</strong> <svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-sort-alpha-down"/></svg>
			</a>
			<a class="sort-btn secondary hide" role="button">
				<strong>Sort</strong> <svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-sort-alpha-up"/></svg>
			</a>
			<a class="clear-btn secondary hide" href="<?php echo $page->url; ?>" role="button">
				<?php echo $page->label_showall; ?>
			</a>
		</div>
	</div>
</main>
