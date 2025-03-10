<?php namespace ProcessWire;

// Template file for pages using the “basic-page” template
// -------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

// if($config->ajax) {
	// Send email
$contact_name = $sanitizer->selectorValue($input->post->name);
$contact_email = $sanitizer->selectorValue($input->post->email);
$contact_message = $sanitizer->selectorValue($input->post->message);
$contact_recipient = 'admin@resurrexit.app';
$sent = 0;
if ($contact_name && $contact_email && $contact_message) {
	$m = wireMail();
	$sent = $m->to($contact_recipient)
		->from($contact_email)
		->subject('Resurrexit Contact Form | ' . $contact_name)
		->body($contact_message)
		->send();
} else {
	$sent = -1;
}

?>

<div id="wrapper">
	<div class="flex flex-column gap-lg justify-center align-center fullscreen bg-primary nowrap py-lg screen-xs-p-0">
		<div class="flex flex-column justify-between gap-md card bg-foreground p-lg screen-xs-px-md nowrap">
			<?php
			if ($sent > 0) echo '<p class="message-sent">' . $page->parent->label_email_success . '</p>';
			else if ($sent < 0) echo '<p class="site-error-203 hide">' . $page->parent->label_email_missing . '</p>';
			else echo '<p class="site-error-201 hide">' . $page->parent->label_email_error . '</p>';
			?>
			<ul class="flex justify-center gap-md">
				<li><a href="<?php echo $page->parent->url; ?>"><?php echo $page->parent->label_home; ?></a></li>
			</ul>
		</div>
	</div>
</div>
