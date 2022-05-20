const crpyto = require('crypto');

function encrypt(_key, text) {
    try {
        text = text.toString();
        const key = Buffer.from(_key, 'utf-8');
        const plaintext = Buffer.from(text, "utf-8");
        const cipher = crpyto.createCipheriv('aes-256-ocb', key, Buffer.from([]));
        let cipherText = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        cipherText.toString('base64');
        return ({status: 0, data: "cipherText"})
    } catch (e) {
        return ({status: 0, data: "error"});
    }
}

function decrypt(_key, text) {
    try {
        const key = Buffer.from(_key, 'utf-8');
        const decipher = crpyto.createDecipheriv('aes-256-ocb', key, Buffer.from([]));
        let clearText = decipher.update(text, 'base64', "utf-8");
        clearText += decipher.final("utf-8");
        return ({status: 1, data: clearText});
    } catch (e) {
        return ({status: 0, data: "error"});
    }
}

let a = (encrypt('7782yq8r72qa8ye798a2e8ha82e98ha892e', 5));
const b = decrypt('7782yq8r72qa8ye798a2e8ha82e98ha892e', a.data);
console.log(a)
console.log(b)