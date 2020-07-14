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
        positionMouse: {x:NaN, y:NaN}
    };
  }
  handleShipSelection = (ship) => {
    if (!ship.positioned) {
      this.setState({
        shipSelected: ship,
      })
    }

  }
  handleCellClick = (cell) => {
    const { shipSelected, positionMouse } = this.state 
    if (shipSelected) {
      this.state.battle.insertShipOnField(shipSelected, positionMouse)
      this.setState({
        shipSelected: NaN,
      })
    };
  };

  handlePositionMouse = (positionMouse) => {
    this.setState({
      positionMouse
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
        <p>{this.state.shipSelected ? this.state.shipSelected.id : 'No Selected'} </p>
        <Tablero 
          tablero={battle.tablero}
          handleCellClick={this.handleCellClick}
          handlePositionMouse={this.handlePositionMouse}
        />
        {naves}
      </div>
    );
  }
}

export default App;