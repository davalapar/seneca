/* eslint-disable no-console, no-undef, arrow-body-style */

import sha256 from 'fast-sha256/sha256';
import pako from 'pako';
import msgpack5 from 'msgpack5';
import nacl from 'tweetnacl';
import naclutils from 'tweetnacl-util';
import prettybytes from 'pretty-bytes';

export const fromUTF8 = naclutils.decodeUTF8;
export const toUTF8 = naclutils.encodeUTF8;
export const fromBase64 = naclutils.decodeBase64;
export const toBase64 = naclutils.encodeBase64;

export const toHex = (param) => {
  const hex = uint8array => Array
    .from(uint8array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  if (Object.prototype.isPrototypeOf.call(Uint8Array.prototype, param) === true) {
    return hex(param);
  }
  if (Object.prototype.isPrototypeOf.call(ArrayBuffer.prototype, param) === true) {
    return hex(new Uint8Array(param));
  }
  throw new TypeError('toHex, expecting parameter to be instance of uint8array or arraybuffer.');
};

export const fromRandomBytes = nacl.randomBytes;

export const toSHA256 = sha256;
export const toSHA256Hex = param => toHex(toSHA256(param));

export const pakoDeflate = (param, opts) => pako.deflate(param, opts || { level: 9, memLevel: 9 });
export const pakoInflate = pako.inflate;

const msgpack = msgpack5();
export const msgpackEncode = msgpack.encode;
export const msgpackDecode = msgpack.decode;

export const fromFile = param => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const { result } = e.target;
    const uint8array = new Uint8Array(result);
    resolve(uint8array);
  };
  reader.onerror = reject;
  reader.readAsArrayBuffer(param);
});

export const fromArrayBuffer = param => param.buffer;
export const toArrayBuffer = param => new Uint8Array(param);

export const toPretty = prettybytes;
