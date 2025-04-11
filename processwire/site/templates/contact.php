<?php namespace ProcessWire;

// Template file for “home” template used by the homepage
// ------------------------------------------------------
// The #content div in this file will replace the #content div in _main.php
// when the Markup Regions feature is enabled, as it is by default.
// You can also append to (or prepend to) the #content div, and much more.
// See the Markup Regions documentation:
// https://processwire.com/docs/front-end/output/markup-regions/

$form = new \FrontendForms\Form('contact-form');

$name = new \FrontendForms\InputText('name');
$name->setLabel($page->ml_name);
$name->setRule('required');
$form->add($name);

$email = new \FrontendForms\InputEmail('email');
$email->setLabel($page->ml_email);
$email->setRule('required');
$email->setSanitizer('email');
$form->add($email);

$message = new \FrontendForms\Textarea('message');
$message->setLabel($page->ml_message);
$message->setRule('required');
$form->add($message);

$button = new \FrontendForms\Button('submit');
$button->setAttribute('value', $page->ml_send);
$form->add($button);

if ($form->isValid()) {
	$body = "<h1>Resurrexit Contact Form</h1>";
	$body .= '<p>Sender: ' . $form->getValue('name') . '</p>';
	$body .= '<p>E-Mail: ' . $form->getValue('email') . '</p>';
	$body .= '<p>' . $form->getValue('message') . '</p>';

	$m = wireMail();
	$sent = $m->to('admin@resurrexit.app')
		->from($form->getValue('email'))
		->subject('Resurrexit Contact Form - ' . $form->getValue('name'))
		->bodyHTML($body)
		->send();

	if (!$sent) {
		$form->generateEmailSentErrorAlert();
	}
}

?>

<li id="lang-btn"><details class="dropdown">
	<summary>
		<svg class="icon" width="1em" height="1em" fill="currentColor"><use xlink:href="#icon-translate"/></svg>
	</summary>
	<ul>
		<?php foreach($languages as $language) {
			if (!$page->viewable($language)) continue;
			$url = $page->localUrl($language);
			echo "<li><a href='$url'>$language->title</a></li>";
		} ?>
	</ul>
</details></li>

<main id="main" class="container">
	<article>
		<?php
		if ($form->getShowForm()) echo '<h2>'.$page->ml_title.'</h2>';
		echo $form->render();
		?>
	</article>
</main>
