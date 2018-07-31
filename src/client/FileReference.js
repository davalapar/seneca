/* eslint-disable no-alert, no-console, no-undef */

import utils from './utils';

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
        self.rawBuffer = result;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  compressed() {
    const { file } = this;
    const self = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const { result } = e.target;
        self.rawBuffer = result;
        resolve(utils.pako.deflate(result, { level: 9, memLevel: 9 }));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}

export default FileReference;
