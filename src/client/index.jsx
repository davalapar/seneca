/* eslint-disable no-alert, no-console, no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2';
import nacl from 'tweetnacl';
import sha256 from 'fast-sha256';
import pako from 'pako';
import utils from 'tweetnacl-util';
import mitt from 'mitt';
import createStore from 'unistore';
import { Map, List } from 'immutable';

const Store = createStore();
const Events = mitt();

let initialState = Map({});
initialState = initialState.set('FileReferences', List());
Store.setState(initialState);

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
        resolve(pako.deflate(result, { level: 9, memLevel: 9 }));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}

const App = () => (
  <div>
    <label htmlFor="add-files">
      <input
        style={{ display: 'none' }}
        id="add-files"
        type="file"
        multiple
        onChange={(e) => {
          const { files } = e.target;
          Array.from(files).forEach((file) => {
            const tempFileRef = new FileReference(file);
            tempFileRef.raw().then(console.log);
            tempFileRef.compressed().then(console.log);
            console.log(tempFileRef);
            let State = Store.getState();
            let FileReferences = State.get('FileReferences');
            FileReferences = FileReferences.push(tempFileRef);
            State = State.set('FileReferences', FileReferences);
            Store.setState(State);
          });
        }}
      />
      <Button variant="outlined" size="small" component="span">
        Add Files
      </Button>
    </label>
    <hr />
    <Button variant="contained" size="small" color="primary" onClick={() => swal('Clicked!')}>
      Start
    </Button>
  </div>
);

ReactDOM.render(<App />, document.querySelector('#app'));

utils.arraybufferToHex = (buffer) => {
  return Array
    .from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

window.nacl = nacl;
window.utils = utils;
window.sha256 = sha256;
window.pako = pako;
window.Store = Store;
window.Events = Events;
