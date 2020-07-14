import React from 'react';
import Celda from '../components/Celda';
import getTablero from '../game'; 

class Tablero extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            over: false,
            tablero: getTablero(),
        };
    }

    handleMouseEnter = () => {
        console.log(`Entro! al tablero`)
        this.setState({
            over: true
        })
    };
    handleMouseLeave = () => {
        console.log(`Salio! al tablero`)
        this.setState({
            over: false
        })
    };


    render()
        {
        const {tablero} = this.state;  
        const mapa = tablero.map((position) => <Celda key={`${position.x}${position.y}`} x={position.x} y={position.y}/>);
        return (
            <div id="tablero" 
            className={`tablero${this.state.over ? " over" : ""}`}
            onMouseEnter={this.handleMouseEnter} 
            onMouseLeave={this.handleMouseLeave}>
                {mapa}
            </div>
        )
        }
}
export default Tablero;