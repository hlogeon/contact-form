import mailjet from 'node-mailjet';
import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.post('/', (req, res) => {
		const request = mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
		    .post("send")
		    .request({
		    	FromEmail: process.env.SENDER_EMAIL,
		    	FromName: process.env.SENDER_NAME,
		    	Subject: process.env.SUBJECT,
		    	'Text-part': "\n From: " + req.body.name + "\n email: " + req.body.email + "\n Message: " + req.body.message,
		    	Recipients: [{'Email': process.env.RECIPIENT_EMAIL}]
		  }, function (err, res) {
				if (err) {
					return res.json({
						status: "error",
						statusCode: err.statusCode,
						message: err.ErrorMessage
					});
				} else {
					return res.json({
						status: "ok",
					});
				}
			});
	});

	return api;
}
