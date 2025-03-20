<?php namespace ProcessWire;

// Template file for pages using the “basic-page” template
// -------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

$audio_sources = [];
foreach($page->parent->audio_order as $ao) {
	$ao->audio_url = $page->parent->audio_source . '/' . $page->name . '_' . $ao->audio_psalmist_short . '.mp3';
	$check_headers = @get_headers($ao->audio_url);
	if($check_headers && strpos($check_headers[0], '200')) $audio_sources[] = $ao;
}

$audio_langs = [];
foreach($page->parent->parent->children as $child) {
	foreach($child->children('psalm_id=' . $page->psalm_id) as $psalm) $audio_langs[] = $psalm;
}

$chords = [];

foreach(explode("|", $page->parent->chord_base) as $base) {
	$chords[] = $base;
	foreach(explode("|", $page->parent->chord_suffix) as $suffix) {
		$chords[] = $base . $suffix;
	}
}

$sections = [];

foreach($page->parent->sections as $section) {
	$sections[$section->section_code] = $section->section_class;
}

$started_chords = false;
$chord_line = "";
$lyric = [[]];
$column = 0;
$section = -1;
foreach (explode("\n", $page->psalm_lyrics) as $line) {
	$stripped = preg_replace('/\s+/', ' ', trim($line));
	if ($stripped) {
		if (array_key_exists($stripped, $sections)) { // START SECTION
			$section++;
			$lyric[$column][] = [
				"class" => $sections[$stripped],
				"lines" => []
			];
		} elseif (empty(array_diff(explode(" ", $stripped), $chords)) && !$started_chords) {
			$started_chords = true;
			$chord_line = $line;
		} elseif ($stripped === "---") {
			$lyric[] = [];
			$column++;
			$section = -1;
		} else {
			if ($started_chords) {
				$started_chords = false;
				$chord_line = rtrim($chord_line);
				$limit = 0;
				while ($chord_line && $limit < 10) {
					$i = strrpos($chord_line, " ") ? strrpos($chord_line, " ") + 1 : 0;
					$stripped = mb_substr($stripped, 0, $i, 'UTF-8') .
						"<span class='chord'>" . mb_substr($chord_line, $i, null, 'UTF-8') . "</span>" .
						mb_substr($stripped, $i, null, 'UTF-8');
					$chord_line = rtrim(mb_substr($chord_line, 0, $i, 'UTF-8'));
					$limit++;
				}
			}
			$lyric[$column][$section]["lines"][] = $stripped;
		}
	}
}



?>

<div id="wrapper" class="wrapper">
	<header class="bg-primary flex justify-between align-center nowrap">
		<h1><a class="link-color-foreground flex align-center" href="<?php echo $page->parent->url; ?>">
			<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-arrow-left"/></svg>
		</a></h1>
		<div class="eplayer" data-src="<?php if(count($audio_sources)) echo $audio_sources[0]->audio_url; ?>" data-type="audio/mp3">
			<?php if(!count($audio_sources)) echo "<p class='no-audio text-center color-foreground'>" . $page->parent->label_noaudio . "</p>"; ?>
		</div>
		<button class="aside-btn btn-icon flex align-center link-color-foreground" type="button">
			<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-three-dots"/></svg>
		</button>
	</header>

	<aside class="flex flex-column nowrap justify-between gap-md shadow aside-always">
		<nav class="flex flex-column px-md gap-md">
			<div class="menu-header flex justify-between align-center">
				<h1><a class="link-color-primary"><?php echo $page->parent->title; ?></a></h1>
				<button class="btn-icon close-aside flex align-center" type="button">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-x-lg"/></svg>
				</button>
			</div>
			<?php ?>
			<hr class="mt-neg-md">
			<h4 class="color-grey-light"><?php echo $page->parent->label_language; ?></h4>
			<ul class="flex flex-column">
				<?php foreach($audio_langs as $al) { ?>
				<li><a class="flex align-center btn-link <?php if($al->parent->id == $page->parent->id) echo 'active'; ?>" href="<?php echo $al->url; ?>"><?php echo $al->parent->language_name; ?></a></li>
				<?php } ?>
			</ul>
			<?php if (count($audio_sources) > 1) { ?>
			<hr>
			<h4 class="color-grey-light"><?php echo $page->parent->label_audio_source; ?></h4>
			<ul class="flex flex-column">
				<?php foreach($audio_sources as $as) { ?>
				<li><a class="flex align-center btn-link audio-source-btn <?php if($as == $audio_sources[0]) echo 'active'; ?>"
					data-source="<?php echo $as->audio_url; ?>">
					<?php echo $as->audio_psalmist_long; ?></a></li>
				<?php } ?>
			</ul>
			<?php } ?>
		</nav>
		<footer class="flex flex-column px-md gap-md pb-lg">
			<ul class="flex justify-center align-center gap-md mt-md">
				<li><a class="flex align-center font-small" href="/en-US/contactus/">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-envelope-fill"/></svg>
					<?php echo $page->parent->label_contact; ?></a></li>
				<li><a class="flex align-center font-small" href="https://git.aleyoscar.com/emet/resurrexit" target="_blank">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-git"/></svg>
					<?php echo $page->parent->label_source; ?></a></li>
				<?php if($page->editable()): ?>
				<li><a class="flex align-center font-small" href="<?php echo $page->editUrl(); ?>">
					<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-pencil"/></svg>
					<?php echo $page->parent->label_edit; ?></a></li>
				<?php endif; ?>
			</ul>
		</footer>
	</aside>

	<main class="psalm p-lg flex flex-column gap-md shadow screen-sm-p-md <?php echo $page->psalm_step->value; ?>">
		<h2 class="color-primary text-center"><?php echo $page->title; ?></h2>
		<h3 class="color-secondary text-center"><?php echo $page->psalm_subtitle; ?></h3>
		<?php if($page->psalm_capo) echo "<p class='capo'>Capo " . $page->psalm_capo . "</p>"; ?>
		<div class="lyrics mt-md">
			<?php foreach($lyric as $c) {
				echo "<div class='column'>";
				foreach($c as $s) {
					echo "<div class='section " . $s['class'] . "'>";
					foreach($s["lines"] as $l) {
						echo "<p class='line'>$l</p>";
					}
					echo "</div>";
				}
				echo "</div>";
			} ?>
		</div>
	</main>

	<div class="overlay fullscreen hide close-aside bg-secondary"></div>
</div>
