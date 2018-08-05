import nacl from 'tweetnacl';

class NaclBox {
  constructor() {
    const { publicKey, secretKey } = nacl.box.keyPair();
    this.publicKey = publicKey;
    this.secretKey = secretKey;
  }

  /**
   * @param {Uint8Array} message - raw message.
   * @param {Uint8Array} publicKey - receiver's public key.
   */
  encrypt(message, publicKey) {
    const { secretKey } = this;
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    return {
      message: nacl.box(message, nonce, publicKey, secretKey),
      nonce,
    };
  }

  /**
   * @param {Uint8Array} message - encrypted message.
   * @param {Uint8Array} nonce - one-time nonce.
   * @param {Uint8Array} publicKey - sender's public key.
   */
  decrypt(message, nonce, publicKey) {
    const { secretKey } = this;
    return nacl.box.open(message, nonce, publicKey, secretKey);
  }
}

export default NaclBox;
