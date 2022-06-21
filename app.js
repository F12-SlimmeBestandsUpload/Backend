const express = require('express')
const app = express()
const cors = require('cors')
//import { S3Client } from "@aws-sdk/client-s3";
const awsSdk = require('@aws-sdk/client-s3');
const awsFactory = require('./aws.js')
require('dotenv').config();

let appPort = parseInt(process.env.BACK_END_PORT);
app.use(express.json());
app.use(cors())

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

var fs = require('fs')
var http = require('http')
const QRCode = require('qrcode')
const ws = require('ws');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

var router = require('./router.js')
var server = require('./websocketserver.js')

var aws = awsFactory(
	awsSdk,
	process.env.MOCK_AWS,
	process.env.REGION,
	process.env.BUCKET,
	process.env.ACCESS_KEY,
	process.env.SECRET_KEY
)

var ttlAws = awsFactory(
	awsSdk,
	process.env.TTL_MOCK_AWS,
	process.env.TTL_REGION,
	process.env.TTL_BUCKET,
	process.env.TTL_ACCESS_KEY,
	process.env.TTL_SECRET_KEY
)

var websocket = server(
	ws,
	process.env.FRONT_END_HOST,
	process.env.FRONT_END_PORT,
	parseInt(process.env.WEBSOCKET_PORT),
	QRCode
)

const appWithFunctionality = router(
	app,
	fs,
	QRCode,
	websocket,
	multer,
	upload,
	aws,
	ttlAws
)

var httpsServer = require('./https.js')(appWithFunctionality, appPort)

httpsServer.listen(appPort, "0.0.0.0", () => {
	console.log(`The application is listening on port ${appPort}!
		Go to localhost:${appPort}/`);
});