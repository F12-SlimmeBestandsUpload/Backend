module.exports = (ws, http, frontHost, frontPort, wsPort) => {
	const {v4} = require("uuid");
	const server = http.createServer();
	const websocket = new ws.WebSocketServer({ server });

	server.listen(wsPort);

	class WebSocket {
		constructor(websocket, frontHost, frontPort) {
			this.websocket = websocket;
			this.websocket.on('connection', function connection(ws, req) {
				let id = v4();
				ws.id = id;
				QRCode.toDataURL("http://" + frontHost + ":" + frontPort + "/camera?id="+id, function (err, url) {
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