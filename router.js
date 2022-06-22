const statusResponseService = require("./StatusResponseService");

module.exports = (app, fs, QRCode, websocket, multer, upload, aws, ttlAws) => {
	const Buffer = require("node:buffer").Buffer;
	const async_fs = require("node:fs/promises");

	// Post request
	app.post("/upload", upload.array('photos', 20), async (req, res) => {
		if (typeof req.body.id === 'undefined' || typeof req.body.key === 'undefined' || typeof req.body.iv === 'undefined' ) {
			res.end(this.statusResponseService.internalServerErrorResponse());
			return;
		}

		console.log("An upload occurred!");

		let references = [];

		// Alle bestanden versturen naar aws
		for (let i in req.files) {
			console.log(req.files[i])
			const data = await async_fs.readFile('./uploads/' + req.files[i].filename, null);
			let buffer = Buffer.from(data);
			let reference = await ttlAws.uniquePost(buffer);
			references.push(reference);
		}

		console.log(references);

		// Referenties en encryptie sleuter terug sturen naar portaal
		websocket.send(req.body.id, req.body.key, req.body.iv, references);

		res.end(this.statusResponseService.succesResponse("done"));
	});

	app.get("/reference", async (req, res) => {
		if (typeof req.query.ref === 'undefined') {
			statusResponseService.internalServerErrorResponse();
			return;
		}
		let ref = req.query.ref;
		let data = await aws.get(ref);
		res.end(data);
	})

	app.get("/ttl-reference", async (req, res) => {
		if (typeof req.query.ref === 'undefined') {
			res.end(this.statusResponseService.internalServerErrorResponse());
			return;
		}
		let ref = req.query.ref;
		let data = await ttlAws.get(ref);
		res.end(data);
	})

	app.post("/finalize",async (req, res) => {
		if (typeof req.body === 'undefined') {
			res.end(this.statusResponseService.internalServerErrorResponse());
			return;
		}
		// Alle bestanden versturen naar aws
		for (let i in req.body.reference) {
			var reference = req.body.reference[i];
			let data = await ttlAws.get(reference);
			if(data != null){
				response = await aws.post(reference,data);
				ttlAws.delete(reference)
			}
		}
		res.end()
	});

	app.delete('/ttl-delete', async (req, res) => {
		if (typeof req.query.ref === 'undefined') {
			res.end(this.statusResponseService.internalServerErrorResponse());
			return;
		}
		let ref = req.query.ref;
		let data = await ttlAws.delete(ref);
		res.end(data);
	})

	app.delete('/delete', async (req, res) => {
		if (typeof req.query.ref === 'undefined') {
			res.end(this.statusResponseService.internalServerErrorResponse());
			return;
		}
		let ref = req.query.ref;
		let data = await aws.delete(ref);
		res.end(data);
	})

	return app;
}
