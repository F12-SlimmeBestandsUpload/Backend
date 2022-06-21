module.exports = (ws, frontHost, frontPort, wsPort) => {
	const {v4} = require("uuid");
	const https = require('https');
	const fs = require('fs');
	const key = process.env.PRIVATE_KEY_PATH;
    const cert = process.env.CERTIFICATE_PATH;
    const QRCode = require("qrcode");

    if (process.env.DEV_MODE == "true") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    const options = {
    	host: "0.0.0.0",
        key: fs.readFileSync(key, 'utf8'),
        cert: fs.readFileSync(cert, 'utf8')
    };

    if (process.env.PRIVATE_KEY_PASSPHRASE != 'null') {
        options.passphrase = process.env.PRIVATE_KEY_PASSPHRASE;
    }

    let httpsServer = https.createServer(options);

	const websocket = new ws.WebSocketServer({ server: httpsServer });

	httpsServer.listen(wsPort);

	class WebSocket {
		constructor(websocket, frontHost, frontPort) {
			this.websocket = websocket;
			this.websocket.on('connection', (ws, req) => {
				let id = v4();
				ws.id = id;
				QRCode.toDataURL("https://" + frontHost + ":" + frontPort + "/camera?id="+id, function (err, url) {
					if (err)
						console.log('error: ' + err)

					ws.send(url)
				})
				this.websocket.clients.forEach(function each(client) {
					console.log('Client.ID: ' + client.id);
				});
			});
		}

		send(id, key, iv, references) {
			this.websocket.clients.forEach(function each(ws) {
				if (ws.isAlive === false)
					return ws.terminate();
				if (ws.id !== id) {
					return;
				}
				ws.send(JSON.stringify({
					key: key,
					iv: iv,
					references: references,
				}));
			});
		}
	}

	return new WebSocket(websocket, frontHost, frontPort);
}