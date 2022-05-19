const {v4} = require("uuid");
module.exports = (app, staticFileServer, fs, QRCode, websocket, multer, upload) => {
	const appPort = 8000;
	const staticPort = 9999;

	function getLocalIp() {
		// Dit pakt jouw lokale IP adress zodat jou telefoon naar jou server kan gaan.
		// Voorbeeld lokaal IP: 192.168.1.29
		var os = require( 'os' );
		var networkInterfaces = os.networkInterfaces();
		let address = null;
		if (typeof networkInterfaces.Ethernet !== 'undefined') {
			address = networkInterfaces.Ethernet[1].address;
		} else if (typeof networkInterfaces.WiFi !== 'undefined') {
			address = networkInterfaces.WiFi[1].address;
		} else if (typeof networkInterfaces['Wi-Fi 2'] !== 'undefined') {
			address = networkInterfaces['Wi-Fi 2'][1].address;
		} else {
			address = networkInterfaces['Wi-Fi'][1].address;
		}
		return address;
	}

	app.get('/', (req, res) => {
		console.log("Here!");
		fs.readFile("index.html", function (err,data) {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
		});
	});

	app.get('/mobile', (req, res) => {
		fs.readFile("mobiele_weergave.html", function (err,data) {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
		});
	});

	app.post('/mobile', upload.single('pic'), (req, res) => {
		fs.readFile('./uploads/' + req.file.filename, null, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
		  	websocket.clients.forEach(function each(ws) {
				if (ws.isAlive === false)
					return ws.terminate();
				ws.send(data);
			});
		});
		res.send("done!");
	});

	app.get('/qrcode', (req, res) => {

		QRCode.toDataURL("http://" + getLocalIp() + ":" + appPort + "/mobile", function (err, url) {
			if (err)
				console.log('error: ' + err)

			res.end(url)
		})

	});

	app.listen(appPort, "0.0.0.0", () => {
		console.log(`The application is listening on port ${appPort} and the static file server on ${staticPort}!
			Go to localhost:${appPort}/`);
	});

	staticFileServer.createServer(function (req, res) {
		fs.readFile(__dirname + req.url, function (err,data) {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
		});
	}).listen(staticPort);

	websocket.on('connection', function connection(ws, req) {
		let id = v4();
		ws.id = id;
		QRCode.toDataURL("http://" + getLocalIp() + ":" + appPort + "/mobile/"+id, function (err, url) {
			if (err)
				console.log('error: ' + err)

			ws.send(url)
		})
		websocket.clients.forEach(function each(client) {
			console.log('Client.ID: ' + client.id);
		});
	});
}