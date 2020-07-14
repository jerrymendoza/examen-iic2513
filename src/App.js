import React from 'react';
import './App.css';
import Tablero from './containers/Tablero';
import Nave from './components/Nave';


class App extends React.Component {
  render() {
    const { battle } = this.props
    console.log(battle)
    console.log(battle.tablero.getCruz({x:'C', y: 5}))
    return (
      <div className="App">
        <h1>{this.props.message}</h1>
        <Tablero tablero={battle.tablero}/>
        <Nave /> 
      </div>
    );
  }
}

export default App;