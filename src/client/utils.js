/* eslint-disable no-alert, no-console, no-undef, arrow-body-style */

import sha256 from 'fast-sha256';
import pako from 'pako';
import swal from 'sweetalert2';
import msgpack5 from 'msgpack5';
import nacl from 'tweetnacl';
import naclutils from 'tweetnacl-util';

// https://stackoverflow.com/q/37200080
export { sha256, pako, swal };

export const { encodeUTF8, decodeUTF8, decodeBase64, encodeBase64 } = naclutils;

export const msgpack = msgpack5();

/**
 * arraybuffer to hex:
 */
export const ab2hex = (buffer) => {
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
export const sbKey = () => nacl.randomBytes(nacl.secretbox.keyLength);

// create secretbox nonce, uint8array
export const sbNonce = () => nacl.randomBytes(nacl.secretbox.nonceLength);

// sencrypts using secretbox, sbEncrypt(message, nonce, key)
export const sbEncrypt = nacl.secretbox.bind(nacl);

// decrypts using secretbox, sbDecrypt(encryptedMessage, nonce, key)
export const sbDecrypt = nacl.secretbox.open.bind(nacl.secretbox);

/**
 * User-oriented:
 * - Each user has their own public and private keys.
 * - Both are used to authenticate source of messages.
 */

// creates a keypair, { publicKey, secretKey }
export const sKeyPair = nacl.sign.keyPair.bind(nacl.sign);

// signs a message, sSign(message, secretKey)
export const sSign = nacl.sign.bind(nacl);

// returns a verified message, sVerify(signedMessage, publicKey)
export const sVerify = nacl.sign.open.bind(nacl.sign);
