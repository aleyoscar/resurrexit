<?php namespace ProcessWire;

$status = '';

$secret = "6LdlUPcqAAAAAK9pL--i7XsE5zxXHpSE-uJOFTJt";
$url = "https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=".$_POST["g-recaptcha-response"];
$verify = json_decode(file_get_contents($url));
if (!$verify->success) $status = "captcha";

if ($status != "captcha") {
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
	if ($sent > 0) $status = "success";
	else if ($sent < 0) $status = "incomplete";
	else $status = "failed";
}

if ($status == "success") echo '<p class="notify success">' . $page->parent->label_email_success . '</p>';
else if ($status == "invalid") echo '<p class="notify error">' . $page->parent->label_email_missing . '</p>';
else if ($status == "failed") echo '<p class="notify error">' . $page->parent->label_email_error . '</p>';
else if ($status == "captcha") echo '<p class="notify error">' . $page->parent->label_email_captcha . '</p>';

?>
