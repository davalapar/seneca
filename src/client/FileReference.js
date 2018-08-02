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
        self.bufferRaw = uint8array;
        self.sizeRaw = uint8array.byteLength;
        self.sizeRawPretty = prettybytes(uint8array.byteLength);
        self.hashRaw = utils.ab2hex(utils.sha256(uint8array));
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
      if (Boolean(self.bufferRaw) === true) {
        const compressed = compress(self.bufferRaw);
        self.bufferCompressed = compressed;
        self.sizeCompressed = compressed.byteLength;
        self.sizeCompressedPretty = prettybytes(compressed.byteLength);
        self.hashCompressed = utils.ab2hex(utils.sha256(compressed));
        resolve(compressed);
      } else {
        self.raw()
          .then((result) => {
            const compressed = compress(result);
            self.bufferCompressed = compressed;
            resolve(compressed);
          })
          .catch(reject);
      }
    });
  }

  chunk() {
    const { sizeCompressed, bufferCompressed } = this;
    /**
     * Splits by chunkSize
     */
    let chunkSize;
    for (let i = 1; i <= 10; i += 1) {
      const kilobytes = (2 ** i) * 1024;
      if (kilobytes < sizeCompressed / 8) {
        chunkSize = kilobytes;
      }
    }
    const chunkCount = Math.ceil(sizeCompressed / chunkSize);
    const chunkIndex = [];
    for (let i = 0; i < chunkCount; i += 1) {
      const begin = i * chunkSize;
      const end = (i * chunkSize) + chunkSize;
      const chunk = bufferCompressed.slice(begin, end);
      chunkIndex.push({
        begin,
        end,
        size: chunk.byteLength,
        pretty: prettybytes(chunk.byteLength),
        hash: utils.ab2hex(utils.sha256(chunk)),
      });
    }
    this.chunkIndex = chunkIndex;
    this.chunkSize = chunkSize;
    this.chunkSizePretty = prettybytes(chunkSize);
  }
}

export default FileReference;
