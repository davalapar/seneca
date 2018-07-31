/* eslint-disable no-alert, no-console, no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2';
import nacl from 'tweetnacl';
import sha256 from 'fast-sha256';
import pako from 'pako';
import utils from 'tweetnacl-util';

const App = () => (
  <div>
    <label htmlFor="add-files">
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="add-files"
        multiple
        type="file"
      />
      <Button variant="contained" component="span">
        Add Files
      </Button>
    </label>
    <hr />
    <Button variant="contained" color="primary" onClick={() => swal('Clicked!')}>
      Hello World
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
