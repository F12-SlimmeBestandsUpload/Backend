const https = require('https');
// const fs = require('fs');

const options = {
    hostname: 'http://localhost:4200',
    port: 4200,
    path: '/',
    method: 'GET'
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

