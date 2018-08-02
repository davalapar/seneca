/* eslint-disable no-alert, no-console, no-undef, arrow-parens */

import prettybytes from 'pretty-bytes';
import utils from './utils';

/**
 * Cheatsheet:
 * - arraybuffer to uint8array: new Uint8Array(buffer);
 * - uint8array to arraybuffer: uint8array.buffer;
 */

class FileReference {
  constructor(file) {
    this.file = file;
  }

  raw() {
    const { file } = this;
    const self = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const { result } = e.target;
        const uint8array = new Uint8Array(result);
        self.buffer_raw = uint8array;
        self.size_raw = prettybytes(uint8array.byteLength);
        self.hash_raw = utils.ab2hex(utils.sha256(uint8array));
        resolve(uint8array);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  compressed() {
    const self = this;
    return new Promise((resolve, reject) => {
      const compress = (x) => utils.pako.deflate(x, { level: 9, memLevel: 9 });
      if (Boolean(self.buffer_raw) === true) {
        const compressed = compress(self.buffer_raw);
        self.buffer_compressed = compressed;
        self.size_compressed = prettybytes(compressed.byteLength);
        self.hash_compressed = utils.ab2hex(utils.sha256(compressed));
        resolve(compressed);
      } else {
        self.raw()
          .then((result) => {
            const compressed = compress(result);
            self.buffer_compressed = compressed;
            resolve(compressed);
          })
          .catch(reject);
      }
    });
  }

  chunk() {
    const self = this;
    /**
     * Splits by chunkSize
     */
    const chunkSize = 16 * 1024;
    const chunkCount = Math.ceil(self.buffer_compressed.byteLength / chunkSize)
    console.log(chunkCount);
    for (let i = 0; i < chunkCount; i += 1) {
      const chunk = self.buffer_compressed.slice(i * chunkSize, (i * chunkSize) + chunkSize);
      const chunkHash = utils.ab2hex(utils.sha256(chunk));
      console.log(String(i), prettybytes(chunk.byteLength), chunkHash);
    }
  }
}

export default FileReference;
