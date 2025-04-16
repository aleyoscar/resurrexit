<?php namespace ProcessWire;

// Template file for pages using the “basic-page” template
// -------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

$home = $pages->get('/'); /** @var HomePage $home */

// Check what audio sources are available

$audio_sources = [];
foreach($page->parent->audio_order as $ao) {
	$ao->audio_url = $page->parent->audio_source . '/' . $page->name . '_' . $ao->audio_psalmist_short . '.mp3';
	$check_headers = @get_headers($ao->audio_url);
	if($check_headers && strpos($check_headers[0], '200')) $audio_sources[] = $ao;
}

// Find this psalm in other languages

$audio_langs = [];
foreach($page->parent->parent->children as $child) {
	foreach($child->children('psalm_id=' . $page->psalm_id) as $psalm) $audio_langs[] = $psalm;
}

// Setup chord array by combining each chord base with each chord suffix (La + #m)

$chords = [];
foreach(explode("|", $page->parent->chord_base) as $base) {
	$chords[] = $base;
	foreach(explode("|", $page->parent->chord_suffix) as $suffix) {
		$chords[] = $base . $suffix;
	}
}

// Setup sections array

$sections = [];
foreach($page->parent->sections as $section) {
	$sections[$section->section_code] = $section->section_class;
}

// Generate lyrics

$started_chords = false;
$chord_line = "";
$lyric = [[[]]];
$leaf = 0;
$column = 0;
$section = -1;
foreach (explode("\n", $page->psalm_lyrics) as $line) {
	$stripped = preg_replace('/\s+/', ' ', trim($line));
	if ($stripped) {
		// echo "\n" . $stripped;
		if (array_key_exists($stripped, $sections)) { // START SECTION
			// echo " | Found section: " . $sections[$stripped];
			$section++;
			$lyric[$leaf][$column][] = [
				"class" => $sections[$stripped],
				"lines" => []
			];
		} elseif (empty(array_diff(explode(" ", $stripped), $chords)) && !$started_chords) { // START CHORDS
			$started_chords = true;
			$chord_line = $line;
		} elseif ($stripped === "---") { // START COLUMN
			$lyric[$leaf][] = [];
			$column++;
			$section = -1;
		} elseif ($stripped === "------") { // START LEAF
			$lyric[] = [[]];
			$leaf++;
			$column = 0;
			$section = -1;
		} else { // PARSE LINE
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
			foreach ($sections as $key => $s) {
				$i = strrpos($stripped, $key);
				if ($i) $stripped = str_replace($key, "<span class='float-right " . $s . "'>", $stripped) . "</span>";
			}
			$lyric[$leaf][$column][$section]["lines"][] = $stripped;
		}
	}
}
?>

<a id="header-logo" class="contrast flex center no-decoration" aria-label="Resurrexit homepage" href="<?php echo $page->parent->url; ?>">
	<svg class="icon hide-lg" width="2em" height="2em" fill="currentColor"><use xlink:href="#icon-logo"/></svg>
	<h1 class="hide-sm"><?php echo $page->parent->title; ?></h1>
</a>

<ul id="lang-dropdown-list">
	<?php foreach($audio_langs as $al) { ?>
	<li><a href="<?php echo $al->url; ?>"><?php echo $al->parent->language_name; ?></a></li>
	<?php } ?>
</ul>

<main id="main" class="container eplayer-padding">
	<article id="content" class="content psalm <?php echo $page->psalm_step->value; ?>" role="document">
		<hgroup>
			<h4 class="center primary"><?php echo $page->title; ?></h2>
			<p class="center"><?php echo $page->psalm_subtitle; ?></p>
		</hgroup>
		<?php if($page->psalm_capo) echo "<p class='capo'>Capo " . $page->psalm_capo . "</p>"; ?>
		<div class="lyrics">
			<?php foreach ($lyric as $key => $leaf) {
				echo "<div class='leaf grid'>";
				foreach ($leaf as $column) {
					echo "<div class='column'>";
					foreach ($column as $section) {
						echo "<section class='" . $section['class'] . "'>";
						foreach ($section["lines"] as $line) {
							echo "<p class='line'>$line</p>";
						}
						echo "</section>";
					}
					echo "</div>";
				}
				echo "</div>";
				if (count($lyric) > 1 && $key < count($lyric) - 1) echo "<hr>";
			} ?>
		</div>
	</article>
</main>

<footer id="footer" class="eplayer-wrapper flex center">
	<?php if(count($audio_sources)) { ?>
		<div class="eplayer" data-src="<?php echo $audio_sources[0]->audio_url; ?>" data-type="audio/mp3"></div>
		<details class="dropdown">
			<summary><svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-info"/></svg></summary>
			<ul dir="rtl" class="up">
				<li><strong><?php echo $page->parent->label_audio_source; ?></strong></li>
				<?php foreach($audio_sources as $as) { ?>
				<li>
					<a class="audio-source-btn <?php if($as == $audio_sources[0]) echo 'active'; ?>"
						data-source="<?php echo $as->audio_url; ?>"
						data-name="<?php echo $as->audio_psalmist_long; ?>">
						<?php echo $as->audio_psalmist_long; ?>
					</a>
				</li>
				<?php } ?>
			</ul>
		</details>
	<?php } else { ?>
	<div class="eplayer-wrapper">
		<p class='center'><?php echo $page->parent->label_noaudio; ?></p>
	</div>
	<?php } ?>
</footer>
