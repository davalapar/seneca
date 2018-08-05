import nacl from 'tweetnacl';

class NaclSecretBox {
  constructor() {
    this.key = nacl.randomBytes(nacl.secretbox.keyLength);
  }

  /**
   * @param {Uint8Array} message - raw message.
   */
  encrypt(message) {
    const { key } = this;
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    return {
      message: nacl.secretbox(message, nonce, key),
      nonce,
    };
  }

  /**
   * @param {Uint8Array} message - encrypted message.
   * @param {Uint8Array} nonce - one-time nonce.
   */
  decrypt(message, nonce) {
    const { key } = this;
    return nacl.secretbox.open(message, nonce, key);
  }
}

export default NaclSecretBox;
