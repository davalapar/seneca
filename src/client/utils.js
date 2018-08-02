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

/**
 * ArrayBuffer to hex
 */
utils.ab2hex = (buffer) => {
  return Array
    .from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export default utils;
