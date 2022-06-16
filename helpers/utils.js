const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf-8');

function validatePassword(password, hash, salt) {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function genPassword(password) {
    let salt = crypto.randomBytes(32).toString('hex');
    let genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

function issueJWT(user) {
    const _id = user._id;

    const expiresIn = '15s';

    const payload = {
        sub: _id,
        iat: Math.floor(Date.now / 1000)
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {expiresIn: expiresIn, algorithm: 'RS256'});

    return {
        token: signedToken,
        expires: expiresIn
    }
}

module.exports.validatePassword = validatePassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;