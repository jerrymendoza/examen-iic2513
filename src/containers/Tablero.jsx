import React from 'react';
import Celda from '../components/Celda';


class Tablero extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            over: false,
        };
    }

    handleMouseEnter = () => {
        this.setState({
            over: true
        })
    };
    handleMouseLeave = () => {
        this.setState({
            over: false
        })
    };
    render()
        {

        const { tablero } = this.props;  
 
        const mapa = Object.keys(tablero.elements).map((key, index) => <Celda 
                                                    key={key}
                                                    cell={tablero.elements[key]}
                                                    handleCellClick={this.props.handleCellClick}
                                                    handlePositionMouse={this.props.handlePositionMouse}
                                                    />);
        
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