/* eslint-disable no-alert, no-console, no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert2';

const App = () => {
  return (
    <Button variant="contained" color="primary" onClick={() => swal('Clicked!')}>
      Hello World
    </Button>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));