/* eslint-disable no-alert, no-console, no-undef */

import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import mitt from 'mitt';
import createStore from 'unistore';
import { Map, List } from 'immutable';
import FileReference from './FileReference';
import utils from './utils';

const Store = createStore();
const Events = mitt();

let initialState = Map({});
initialState = initialState.set('FileReferences', List());
Store.setState(initialState);

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
            tempFileRef.raw()
              .then(() => tempFileRef.compressed())
              .then(() => tempFileRef.chunk())
              .then(() => console.log(tempFileRef));
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
    <Button variant="contained" size="small" color="primary" onClick={() => utils.swal('Clicked!')}>
      Start
    </Button>
  </div>
);

ReactDOM.render(<App />, document.querySelector('#app'));

window.utils = utils;
window.Store = Store;
window.Events = Events;
