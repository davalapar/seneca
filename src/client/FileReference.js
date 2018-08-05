/* eslint-disable no-alert, no-console, no-undef, arrow-parens */

import {
  toSHA256Hex, pakoDeflate, msgpackEncode, fromFile, toPretty,
} from './Uint8ArrayTools';

/**
 * Cheatsheet:
 * - arraybuffer to uint8array: new Uint8Array(buffer);
 * - uint8array to arraybuffer: uint8array.buffer;
 */

class FileReference {
  constructor(file) {
    this.file = file;
    this.fileName = file.name;
    this.fileType = file.type;
  }

  fromFile(file) {
    const self = this;
    return fromFile(file)
      .then((raw) => {
        self.sizeRaw = raw.byteLength;
        self.sizeRawPretty = toPretty(raw.byteLength);
        self.hashRaw = toSHA256Hex(raw);
        const compressed = pakoDeflate(raw);
        self.bufferCompressed = compressed;
        self.sizeCompressed = compressed.byteLength;
        self.sizeCompressedPretty = toPretty(compressed.byteLength);
        self.hashCompressed = toSHA256Hex(compressed);
      });
  }

  /**
   * Splits by chunkSize
   */
  chunk() {
    const { sizeCompressed, bufferCompressed } = this;
    if (Boolean(bufferCompressed) === true) {
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
          end: begin + chunk.byteLength,
          size: chunk.byteLength,
          pretty: toPretty(chunk.byteLength),
          hash: toSHA256Hex(chunk),
        });
      }
      const chunkIndexBufferHash = toSHA256Hex(msgpackEncode(chunkIndex));
      this.chunkCount = chunkCount;
      this.chunkIndex = chunkIndex;
      this.chunkSize = chunkSize;
      this.chunkSizePretty = toPretty(chunkSize);
      this.chunkIndexBufferHash = chunkIndexBufferHash;
    }
  }
}

export default FileReference;
