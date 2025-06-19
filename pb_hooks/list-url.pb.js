onRecordAfterCreateSuccess((e) => {
	// Set url to id
	$app.logger().debug(`Setting ${e.record.get('name')} url to ${e.record.get('id')}`);
	e.record.set('url', 'https://resurrexit.app/list/?list=' + e.record.get('id'));
	e.next();
}, "res_lists");
