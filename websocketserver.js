module.exports = (ws, http, frontHost, frontPort, wsPort) => {

	const server = http.createServer();
	const websocket = new ws.WebSocketServer({ server });

	server.listen(wsPort);

	class WebSocket {
		constructor(websocket, frontHost, frontPort) {
			this.websocket = websocket;
			// hier
		}

		send(key, iv, references) {
			websocket.clients.forEach(function each(ws) {
				if (ws.isAlive === false)
					return ws.terminate();
				if (ws.id !== key) {
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