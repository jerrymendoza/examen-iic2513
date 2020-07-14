import React from 'react';
import './App.css';
import Tablero from './containers/Tablero';

import PropTypes from 'prop-types';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>{this.props.message}</h1>
        <Tablero/>
      </div>
    );
  }
}

App.propTypes = {
  message: PropTypes.string.isRequired,
};

export default App;