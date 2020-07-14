import React from 'react';
import './App.css';
import Tablero from './containers/Tablero';
import Nave from './components/Nave';
import Battle from './game'; 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        battle: new Battle(),
        shipSelected: NaN,
    };
  }
  handleShipSelection = (ship) => {
    this.setState({
      shipSelected: ship,
    })

  }
  render() {
    const { battle } = this.state

    const naves = Object.keys(battle.naves).map((key, index) => <Nave 
                                                key={key}
                                                ship={battle.naves[key]} 
                                                handleShipSelection={this.handleShipSelection}
                                                />);

    return (
      <div className="App">
        <h1>IIC2513 - EXAMEN </h1>
        <p>{`${this.state.shipSelected}`}</p>
        <Tablero 
          tablero={battle.tablero}
        />
        {naves}
      </div>
    );
  }
}

export default App;