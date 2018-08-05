import nacl from 'tweetnacl';

class NaclSign {
  constructor() {
    const { publicKey, secretKey } = nacl.sign.keyPair();
    this.publicKey = publicKey;
    this.secretKey = secretKey;
  }

  /**
   * @param {Uint8Array} message - raw message.
   * @param {Boolean} detached - optional; if true, only returns signature instead.
   */
  sign(message, detached) {
    const { secretKey } = this;
    if (detached === true) {
      return nacl.sign.detached(message, secretKey);
    }
    return nacl.sign(message, secretKey);
  }

  /**
   * @param {Uint8Array} message - message, signed or raw.
   * @param {Uint8Array} publicKey - sender's public key.
   * @param {Uint8Array} signature - optional signature, only used if raw message was sent.
   */
  static verify(message, publicKey, signature) {
    if (Boolean(signature) === true) {
      return nacl.sign.detached.verify(message, signature, publicKey);
    }
    return nacl.sign.open(message, publicKey);
  }
}

export default NaclSign;
