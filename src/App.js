import React from 'react';
import './App.css';
import Tablero from './containers/Tablero';


class App extends React.Component {
  render() {
    const { battle } = this.props
    console.log(battle)
    console.log(battle.tablero.getCruz({x:'C', y: 5}))
    return (
      <div className="App">
        <h1>{this.props.message}</h1>
        <Tablero tablero={battle.tablero}/>
      </div>
    );
  }
}

export default App;