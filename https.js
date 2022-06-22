module.exports = (app, port) => {
    const https = require('https');
    const fs = require('fs');
    const key = process.env.PRIVATE_KEY_PATH;
    const cert = process.env.CERTIFICATE_PATH;



    if (process.env.DEV_MODE == "true") {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }



    const options = {
        hostname: '0.0.0.0',
        port: port,
        key: fs.readFileSync(key, 'utf8'),
        cert: fs.readFileSync(cert, 'utf8')
    };



    if (process.env.PRIVATE_KEY_PASSPHRASE != 'null') {
        options.passphrase = process.env.PRIVATE_KEY_PASSPHRASE;
    }



    return https.createServer(options, app);
}
