const crypto = require('crypto');

function encrypt(_key, buffer) {
    try {
        const key = Buffer.from(_key, 'utf-8');
        //TODO: Research gcm, how to USE it and why it's better.
        const cipher = crpyto.createCipheriv('aes-256-ocb', key, Buffer.from([]));
        let cipherText = Buffer.concat([cipher.update(buffer), cipher.final()]);
        cipherText.toString('base64');
        return ({status: 0, data: cipherText});
    } catch (e) {
        return ({status: 0, data: "error"});
    }
}

function encryptblob(_key, blob) {
    // TODO: Code to convert blob into a buffer.
    var blob = new Blob([array], {type: "application/pdf"});

    let blobToBuffer = Buffer.from(blob);
    return encrypt();
}

function decrypt(_key, text) {
    try {
        const key = Buffer.from(_key, 'utf-8');
        const decipher = crypto.createDecipheriv('aes-256-ocb', key, Buffer.from([]));
        let clearText = decipher.update(text, 'base64', "utf-8");
        clearText += decipher.final("utf-8");
        return ({status: 1, data: clearText});
    } catch (e) {
        return ({status: 0, data: "error"});
    }
}

//TODO: Make a function that creates a random key.
function key(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

let a = (encrypt('7782yq8r72qa8ye798a2e8ha82e98ha892e', 5));
const b = decrypt('7782yq8r72qa8ye798a2e8ha82e98ha892e', a.data);
console.log(a)
console.log(b)