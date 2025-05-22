<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'static/PHPMailer/src/Exception.php';
require 'static/PHPMailer/src/PHPMailer.php';
require 'static/PHPMailer/src/SMTP.php';

header('Content-Type: application/json');
$response = ['status' => 'error', 'message' => 'Invalid request'];

require '../../config/res-config.php';

// Configuration
$smtp_host = defined('SMTP_HOST') ? SMTP_HOST : null;
$smtp_username = defined('SMTP_USERNAME') ? SMTP_USERNAME : null;
$smtp_password = defined('SMTP_PASSWORD') ? SMTP_PASSWORD : null;
$smtp_port = defined('SMTP_PORT') ? SMTP_PORT : null;
$to_email = defined('TO_EMAIL') ? TO_EMAIL : null;
$from_email = defined('FROM_EMAIL') ? FROM_EMAIL : null;
$subject = 'Resurrexit - Contact Form';

// Validate configuration
if (!$smtp_host || !$smtp_username || !$smtp_password || !$to_email || !$from_email) {
	$response['status'] = 'error';
	$response['message'] = 'Missing SMTP configuration.';
	exit;
}

// Validate and sanitize input
function sanitize($data) {
	return htmlspecialchars(strip_tags(trim($data)));
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	// Check honeypot field
	if (!empty($_POST['subject'])) {
		$response['status'] = 'error';
		$response['message'] = 'Spam detected';
		echo json_encode($response);
		exit;
	}

	$name = isset($_POST['contact-name']) ? sanitize($_POST['contact-name']) : '';
	$email = isset($_POST['contact-email']) ? sanitize($_POST['contact-email']) : '';
	$message = isset($_POST['contact-message']) ? sanitize($_POST['contact-message']) : '';
	$token = isset($_POST['contact-token']) ? $_POST['contact-token'] : '';

	// Basic validation
	if (empty($name) || empty($email) || empty($message)) {
		$response['status'] = 'error';
		$response['message'] = 'All fields are required';
		echo json_encode($response);
		exit;
	}
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		$response['status'] = 'error';
		$response['message'] = 'Invalid email address';
		echo json_encode($response);
		exit;
	}
	if ($token !== 'random-token') {
		$response['status'] = 'error';
		$response['message'] = 'Invalid token';
		echo json_encode($response);
		exit;
	}

	// Prepare email content
	$body = "Name: $name\n";
	$body .= "Email: $email\n";
	$body .= "Message:\n$message\n";

	$mail = new PHPMailer(true);
	try {
		$mail->isSMTP();
		$mail->Host = $smtp_host;
		$mail->SMTPAuth = true;
		$mail->Username = $smtp_username;
		$mail->Password = $smtp_password;
		$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
		$mail->Port = $smtp_port;

		$mail->setFrom($from_email, 'Contact Form');
		$mail->addAddress($to_email);
		$mail->addReplyTo($email, $name);

		$mail->isHTML(false);
		$mail->Subject = $subject;
		$mail->Body = $body;

		$mail->send();
		$response['status'] = 'success';
		$response['message'] = 'Thank you! Your message has been sent.';
	} catch (Exception $e) {
		$response['status'] = 'error';
		$response['message'] = 'Sorry, an error occurred: ' . $mail->ErrorInfo;
	}
}

echo json_encode($response);
?>
