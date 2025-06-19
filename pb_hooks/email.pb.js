onRecordAfterCreateSuccess((e) => {
	// Send email
	e.next();
	if (e.record.get('subject')) {
		throw new Error('Bot detected');
	}
	const message = new MailerMessage({
		from: {
			address: e.app.settings().meta.senderAddress,
			name: e.app.settings().meta.senderName
		},
		to: [{address: 'ocam@aleyoscar.com'}],
		subject: `Resurrexit Contact Form Submission - ${e.record.get('name')}`,
		html: `
			<p><strong>Name:</strong> ${e.record.get('name')}</p>
			<p><strong>Email:</strong> ${e.record.email()}</p>
			<p><strong>Message:</strong> ${e.record.get('message')}</p>
		`
	});
	e.app.newMailClient().send(message);
}, "res_contact");
