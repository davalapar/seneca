/* eslint-disable no-alert, no-console, no-undef, arrow-body-style */

import nacl from 'tweetnacl';
import utils from 'tweetnacl-util';
import sha256 from 'fast-sha256';
import pako from 'pako';
import swal from 'sweetalert2';
import msgpack5 from 'msgpack5';

utils.msgpack = msgpack5();
utils.nacl = nacl;
utils.sha256 = sha256;
utils.pako = pako;
utils.swal = swal;

// arraybuffer to hex:
utils.ab2hex = (buffer) => {
  return Array
    .from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Package-oriented:
 * - Each package has its own key and nonce.
 * - Both are used to encrypt communication across discovery endpoints.
 */

// create secretbox key, uint8array
utils.sbKey = () => nacl.randomBytes(nacl.secretbox.keyLength);

// create secretbox nonce, uint8array
utils.sbNonce = () => nacl.randomBytes(nacl.secretbox.nonceLength);

// sencrypts using secretbox, sbEncrypt(message, nonce, key)
utils.sbEncrypt = nacl.secretbox.bind(nacl);

// decrypts using secretbox, sbDecrypt(encryptedMessage, nonce, key)
utils.sbDecrypt = nacl.secretbox.open.bind(nacl.secretbox);

/**
 * User-oriented:
 * - Each user has their own public and private keys.
 * - Both are used to authenticate source of messages.
 */

// creates a keypair, { publicKey, secretKey }
utils.sKeyPair = nacl.sign.keyPair.bind(nacl.sign);

// signs a message, sSign(message, secretKey)
utils.sSign = nacl.sign.bind(nacl);

// returns a verified message, sVerify(signedMessage, publicKey)
utils.sVerify = nacl.sign.open.bind(nacl.sign);

export default utils;
