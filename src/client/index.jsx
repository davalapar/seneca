/* eslint-disable no-alert, no-console, no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

const App = () => {
  return (
    <Button variant="contained" color="primary">
      Hello World
    </Button>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));