import { connect } from 'react-redux';

import App from '../App';

const mapStateToProps = state => ({
  message: state.message,
  battle: state.battle
});

const Game = connect(
  mapStateToProps, {}
)(App);

export default Game;