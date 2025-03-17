<?php namespace ProcessWire;

// Template file for “home” template used by the homepage
// ------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

?>
<div id="wrapper">
	<div class="flex flex-column gap-lg justify-center align-center fullscreen bg-primary nowrap py-lg screen-xs-p-0">
		<div class="flex flex-column justify-between gap-md card bg-foreground p-lg screen-xs-px-md nowrap">
			<?php if (isset($_POST['name'])) {
				$files->include("email", array('func' => 'require'));
			} else { ?>
			<form id="contact-form" class="flex flex-column gap-md" method="POST">
				<h2>Contact</h2>
				<input id="lang" type="hidden" name="lang" value="<?php echo $page->parent->url; ?>">
				<input id="name" type="text" name="name" placeholder="<?php echo $page->parent->label_name ?>" />
				<input id="email" type="email" name="email" placeholder="<?php echo $page->parent->label_email; ?>" />
				<textarea id="message" name="message" placeholder="<?php echo $page->parent->label_message; ?>"></textarea>
				<div class="g-recaptcha" data-sitekey="6LdlUPcqAAAAABGxX2JNBkSIpr9t-CKe101Z_18C"></div>
				<button type="submit"><?php echo $page->parent->label_send; ?></button>
			</form>
			<?php } ?>
			<ul class="flex justify-center gap-md">
				<li><a href="<?php echo $page->parent->url; ?>"><?php echo $page->parent->label_home; ?></a></li>
			</ul>
		</div>
	</div>
	<script src="https://www.google.com/recaptcha/api.js"></script>
</div>
