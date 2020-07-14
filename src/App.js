import React from 'react';
import './App.css';
import Tablero from './containers/Tablero';
import Nave from './components/Nave';


class App extends React.Component {
  render() {
    const { battle } = this.props
    console.log(battle)

    const naves = Object.keys(battle.naves).map((key, index) => <Nave 
                                                key={key}
                                                ship={battle.naves[key]} 
                                                />);

    return (
      <div className="App">
        <h1>{this.props.message}</h1>
        <Tablero tablero={battle.tablero}/>
        {naves}
      </div>
    );
  }
}

export default App;