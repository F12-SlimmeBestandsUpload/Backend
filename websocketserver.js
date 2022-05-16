module.exports = (ws, http) => {

	const server = http.createServer();
	const websocket = new ws.WebSocketServer({ server });

	server.listen(6969);

	return websocket;
}