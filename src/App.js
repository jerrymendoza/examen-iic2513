import React from 'react';
import './App.css';
import Tablero from './containers/Tablero';
import Nave from './components/Nave';
import Bitacora from './components/Bitacora';
import Battle from './game';
import { ApiService } from './Api';

function textLine(origin, data){
  
  switch (data.action.type) {
    case 'FIRE':
      // [Usuario]: Disparo - D1 - D6
      return `[${origin}]: FIRE - ${data.action.ship} - ${convertRowColumn(data.action.row, data.action.column)}`
    
    case 'MOVE':
      return `[${origin}]: MOVE - ${data.action.ship} - ${data.action.direction} - ${data.action.quantity} `
      
    default:
    
  }
}
const columns = ['A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J']
function convertRowColumn(row, column) {
  return `${columns[column]}${row+1}`
}

class GameApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        battle: new Battle(),
        shipSelected: NaN,
        positionMouse: {x:NaN, y:NaN},
        inAction: NaN,
        waiting: false,
        bitacora : [],
        win:false,
        lose:false,
        surrender:false,
    };
    this.handleCellClick = this.handleCellClick.bind(this);
    //console.log(this.state.battle.tablero.getCruz({x:'F', y: 1}, 2))
  }
  refreshPage() {
    window.location.reload(false);
  }

  handleWIN(){
    this.setState({
      win:true
    })
  }
  handleLOSE(){
    this.setState({
      lose:true
    })
  }


  showEnemies = () => {
    var positions = []
    this.setState({
      waiting:true
    })

    ApiService().get(`/games/${this.state.gameId}/test/ships`).then( data => {
      console.log(data.data)
      data.data.map(elemento => {

        var cell = this.state.battle.tablero.getCellById(`${columns[elemento.position.column]}${elemento.position.row+1}`)
        positions.push(cell)
      })
      this.state.battle.tablero.showEnemies(positions)
      setTimeout(
        function() {
          this.state.battle.tablero.hideEnemies();
        }
        .bind(this),
        3000
    );
      this.setState({
        waiting:false
      })}

    )
  }
  handleBitacora(message){
    console.log(message)
    let bitacora = [...this.state.bitacora];
    bitacora.unshift(message);
    this.setState({ bitacora });
  }
  handleShipSelection = (ship) => {
    if (!ship.positioned) {
      this.setState({
        shipSelected: ship,
      })
    }
  }
  
  handleCellClick(cell){
    const { shipSelected, positionMouse, battle, inAction } = this.state

    if (battle.playing && cell.content && !shipSelected) {
      switch (this.state.inAction) {
        case 'MOVE':          
          this.state.battle.activateRange(cell, 'MOVE')
          this.setState({shipSelected: cell.content })
          break
          
        case 'FIRE':
          this.state.battle.activateRange(cell, 'FIRE')
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
      const payload = battle.accion({action: inAction, ship:shipSelected, cell: cell})
      
      if (payload) {
        switch (inAction){
          case 'FIRE':
            this.handleBitacora(textLine('User', payload))

            this.setState({
              waiting: true
            })
              ApiService().post(`/games/${this.state.gameId}/action`, payload).then(response => {
                //textLine('Computer', response.data)
                ///// EVENTOS
                this.handleResponseEvents(response.data.events)
                this.handleResponseAction(response.data.action)
                

                this.setState({waiting:false})
              }
            ).catch(error => console.log(error))
            break

          case 'MOVE':
            this.handleBitacora(textLine('User', payload))
            this.setState({
              waiting: true
            })
              // console.log(`[Usuario] ${inAction} - ${shipSelected.id} - ${cell.id}`)
              ApiService().post(`/games/${this.state.gameId}/action`, payload).then(response => {

                //textLine('Computer', response.data)
                this.handleResponseEvents(response.data.events)
                this.handleResponseAction(response.data.action)
                

                this.setState({waiting:false})
              }
            ).catch(error => console.log(error))
            break
          default:
            console.log('Nada por aca...')
        }
        
        this.setState({})
        this.cancelButton()
      }
    }
  };

  handleResponseAction(action){
    switch (action.type){
      case 'FIRE':
        // escribir bitacora
        
        this.handleBitacora(`[Computer] FIRE - ${action.ship} - ${convertRowColumn(action.row, action.column)}`)
        // ver si impacto
        const cell = this.state.battle.receiveFire(convertRowColumn(action.row, action.column))
        if (cell){
          // escribir bitacora si fue efectivo
          this.handleBitacora(`[Computer]: [HIT] ${cell.content.id} of User`)
          this.handleBitacora(`[Computer]: [DESTROY] ${cell.content.id} of User`)
        }
        break

      case 'MOVE':
        this.handleBitacora(`[Computer] MOVE - ${action.ship} - ${action.direction} - ${action.quantity}`)
        //menssage que se movio (no me interesa)
        break

      default:
    }
  }
  handleResponseEvents(events){

    events.forEach(event => {
      console.log(event)
      if (event.type === 'HIT_SHIP') {
        this.handleBitacora(`[User]: [HIT] ${event.ship} of Computer`)
      }
      if (event.type === 'SHIP_DESTROYED') {
        this.handleBitacora(`[User]: [DESTROY] ${event.ship} of Computer`)
      }
      if (event.type === 'ALL_SHIPS_DESTROYED') {
        this.handleBitacora(`[User]: [WIN]`)
        this.handleWIN();
      }

    });
  }

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
      inAction: NaN,
      waiting: false,
      bitacora : [],
    })
  }

  start = () => {
    this.setState({
      waiting: true
    })
    ApiService().post('/games', {}).then( data => {
      //console.log(data.data);
      this.state.battle.start()
      this.setState({
        waiting:false,
        gameId: data.data.gameId
      })

    
    }).catch(error => alert(error))
  }

  moveButton = () => {
    this.state.battle.makeSelectable()
    this.setState({inAction: 'MOVE', shipSelected: NaN})
  }
  fireButton = () => {
    this.state.battle.makeSelectable()
    this.setState({inAction: 'FIRE', shipSelected: NaN})
  }

  cancelButton = () => {
    this.state.battle.cancelTarget()
    this.setState({inAction: NaN,  shipSelected: NaN})
  }
  surrenderButton = () => {
    this.setState({
      surrender:true
    })
  }
  render() {
    const { battle, inAction} = this.state

    const naves = Object.keys(battle.naves).map((key, index) => <Nave 
                                                key={key}
                                                ship={battle.naves[key]} 
                                                handleShipSelection={this.handleShipSelection}
                                                />);

    return (
      <>
      <div id="game" className={this.state.waiting || this.state.win || this.state.lose || this.state.surrender ? ' disabled': ''}>
        <div id="info">
          <h1>IIC2513 - EXAMEN </h1>
          <p>selected: {this.state.shipSelected ? this.state.shipSelected.id : 'No Selected'} </p>
          <p>accion: {this.state.inAction}</p>
          <p>esperando: {`${this.state.waiting}`}</p>
        </div>
        <div id="center">
        <Tablero 
          tablero={battle.tablero}
          handleCellClick={this.handleCellClick}
          handlePositionMouse={this.handlePositionMouse}
        />
        <div id="sidebar">
          
          <div id="naves">{naves}</div>
          <button onClick={this.reset} className={`${!battle.playing ? " show" : " hide"}`}>
            reset
          </button>

          <button 
          onClick={this.start}
          className={`button${!battle.ready ? " disabled" : ""}${!battle.playing ? " show" : " hide"}`}>
            start
          </button>

          <div className={`actions${battle.playing ? " show" : " hide"}`}>
            Actions:
            <button onClick={this.moveButton} className={`${inAction === 'FIRE' ? " disabled": ""} `}>move</button>
            <button onClick={this.fireButton} className={`${inAction === 'MOVE' ? " disabled": ""} `}>fire</button>
            <button onClick={this.cancelButton}>cancel</button>
            <button onClick={this.surrenderButton}>surrender</button>
            <button onClick={this.showEnemies}>Show Enemies</button>

          </div>
          <Bitacora lista={this.state.bitacora}/>
        </div>
        

        </div>
      </div>
      <div className={`${!this.state.waiting ? ' hide': 'cargando'}`}> cargando...</div>
      <div className={`${!this.state.win ? ' hide': 'win'}`}> YOU WIN...<button onClick={this.refreshPage}>click to play.. !</button></div>
      <div className={`${!this.state.lose ? ' hide': 'lose'}`}> YOU LOSE...<button onClick={this.refreshPage}>click to play.. !</button></div>
      <div className={`${!this.state.surrender ? ' hide': 'surrender'}`}> [SURRENDER] YOU LOSE...<button onClick={this.refreshPage}>click to play.. !</button></div>
      </>
    );
  }
}

export default GameApp;