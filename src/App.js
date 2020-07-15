import React from 'react';
import './App.css';
import Tablero from './containers/Tablero';
import Nave from './components/Nave';
import Battle from './game';


class GameApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        battle: new Battle(),
        shipSelected: NaN,
        positionMouse: {x:NaN, y:NaN},
        inAction: NaN
    };
    //console.log(this.state.battle.tablero.getCruz({x:'F', y: 1}, 2))
  }


  handleShipSelection = (ship) => {
    if (!ship.positioned) {
      this.setState({
        shipSelected: ship,
      })
    }
  }
  
  handleCellClick = (cell) => {
    const { shipSelected, positionMouse, battle, inAction } = this.state

    if (battle.playing && cell.content && !shipSelected) {
      switch (this.state.inAction) {
        case 'move':          
          this.state.battle.activateRange(cell, 'move')
          this.setState({shipSelected: cell.content })
          break
          
        case 'fire':
          this.state.battle.activateRange(cell, 'fire')
          this.setState({shipSelected: cell.content })
          break

        default:
          console.log('Sin nada')
      }
    } else if (shipSelected && !battle.playing) {
        this.state.battle.insertShipOnField(shipSelected, positionMouse)
        this.setState({
          shipSelected: NaN,
        })
    } else if (shipSelected && battle.playing && inAction){
      const response = battle.accion({action: inAction, ship:shipSelected, cell: cell})
      
      if (response) {
        console.log(`${inAction} - ${shipSelected.id} -> ${cell.id}`)
        this.setState({})
        this.cancelButton()
      }
    }
  };

  handlePositionMouse = (positionMouse) => {
    this.setState({
      positionMouse
    })
  }

  reset = () => {
    this.setState({
      battle: new Battle(),
        shipSelected: NaN,
        positionMouse: {x:NaN, y:NaN},
        inAction: NaN
    })
  }

  start = () => {
    if (this.state.battle.start()) {
      this.setState({},console.log(this.state.battle))
    }
  }

  moveButton = () => {
    this.state.battle.makeSelectable()
    this.setState({inAction: 'move', shipSelected: NaN})
  }
  fireButton = () => {
    this.state.battle.makeSelectable()
    this.setState({inAction: 'fire', shipSelected: NaN})
  }

  cancelButton = () => {
    this.state.battle.cancelTarget()
    this.setState({inAction: NaN,  shipSelected: NaN})
  }
  surrenderButton = () => {

  }
  render() {
    const { battle} = this.state

    const naves = Object.keys(battle.naves).map((key, index) => <Nave 
                                                key={key}
                                                ship={battle.naves[key]} 
                                                handleShipSelection={this.handleShipSelection}
                                                />);

    return (
      <div id="game">
        <div id="info">
        <h1>IIC2513 - EXAMEN </h1>
        <p>selected: {this.state.shipSelected ? this.state.shipSelected.id : 'No Selected'} </p>
        <p>accion: {this.state.inAction}</p>
        </div>
        <div id="center">
        <Tablero 
          tablero={battle.tablero}
          handleCellClick={this.handleCellClick}
          handlePositionMouse={this.handlePositionMouse}
        />
        <div id="sidebar">
          <div id="naves">{naves}</div>
          <button onClick={this.reset}>
            reset
          </button>

          <button 
          onClick={this.start}
          className={`button${!battle.ready ? " disabled" : ""}${!battle.playing ? " show" : " hide"}`}>
            start
          </button>

          <div className={`actions${battle.playing ? " show" : " hide"}`}>
            Actions:
            <button onClick={this.moveButton}>move</button>
            <button onClick={this.fireButton}>fire</button>
            <button onClick={this.cancelButton}>cancel</button>
            <button onClick={this.surrenderButton}>surrender</button>

          </div>
        </div>
        

        </div>
      </div>
    );
  }
}

export default GameApp;