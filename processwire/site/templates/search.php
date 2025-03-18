<?php namespace ProcessWire;

// Template file for pages using the “basic-page” template
// -------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

if($config->ajax) {
	// Return search results in JSON format
	$se = $modules->get('SearchEngine');
	$query = $se->find($input->get->q);
	$json = $se->renderResultsJSON([
		'results_json_fields' => [
			'title' => 'title',
			'psalm_id' => 'psalm_id'
		],
		'results_json_options' => JSON_PRETTY_PRINT,
	], $query);
	header("Content-type: application/json");  // Output results as JSON
	echo $json;
	return $this->halt();
}

?>
