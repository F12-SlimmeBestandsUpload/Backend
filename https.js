const https = require('https');
const fs = require('fs');
const key = './cert/key.pem';
const cert = './cert/cert.pem';
const privkey = './cert/privkey.pem';

//TODO: Remove this disgusting hack.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const options = {
    passphrase: "1234",
    hostname: 'http://localhost:4200',
    port: 4200,
    path: '/',
    method: 'GET',
    key: fs.readFileSync(key, 'utf8'),
    cert: fs.readFileSync(cert, 'utf8')
};

https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Succesfully connected\n');
}).listen(4200);

const httpsGet = https.get('https://localhost:4200', (res) => {
    console.log('Statuscode: ', res.statusCode);
    console.log('Headers: ', res.headers);

    res.on('Data: ', (d) => {
        process.stdout.write(d);
    });

}).on('Error: ', (e) => {
    console.error(e);
});

