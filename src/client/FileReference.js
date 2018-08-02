/* eslint-disable no-alert, no-console, no-undef, arrow-parens */

import prettybytes from 'pretty-bytes';
import { sha256, pako, ab2hex, msgpack } from './utils';

/**
 * Cheatsheet:
 * - arraybuffer to uint8array: new Uint8Array(buffer);
 * - uint8array to arraybuffer: uint8array.buffer;
 */

class FileReference {

  constructor(file) {
    this.file = file;
  }

  fromFile(file) {
    const self = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const { result } = e.target;
        const uint8array = new Uint8Array(result);
        self.sizeRaw = uint8array.byteLength;
        self.sizeRawPretty = prettybytes(uint8array.byteLength);
        self.hashRaw = ab2hex(sha256(uint8array));
        const compressed = pako.deflate(uint8array, { level: 9, memLevel: 9 });
        self.bufferCompressed = compressed;
        self.sizeCompressed = compressed.byteLength;
        self.sizeCompressedPretty = prettybytes(compressed.byteLength);
        self.hashCompressed = ab2hex(sha256(compressed));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Splits by chunkSize
   */
  chunk() {
    const { sizeCompressed, bufferCompressed } = this;

    // lock at 16kb chunks to fit well with WebRTC frame size limit
    const chunkSize = 16 * 1024;
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
        hash: ab2hex(sha256(chunk)),
      });
    }
    const chunkIndexBufferHash = ab2hex(sha256(msgpack.encode(chunkIndex)));

    this.chunkCount = chunkCount;
    this.chunkIndex = chunkIndex;
    this.chunkSize = chunkSize;
    this.chunkSizePretty = prettybytes(chunkSize);
    this.chunkIndexBufferHash = chunkIndexBufferHash;
  }
}

export default FileReference;
