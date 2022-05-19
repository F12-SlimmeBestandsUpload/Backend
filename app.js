const express = require('express')
const app = express()
const cors = require('cors')

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

var websocket = server(ws, http)
router(app, http, fs, QRCode, websocket, multer, upload)