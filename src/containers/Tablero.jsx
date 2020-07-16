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
            className={`tablero`}
            onMouseEnter={this.handleMouseEnter} 
            onMouseLeave={this.handleMouseLeave}>
                <div className="x-axis axis">
                    <span>A</span>
                    <span>B</span>
                    <span>C</span>
                    <span>D</span>
                    <span>E</span>
                    <span>F</span>
                    <span>G</span>
                    <span>H</span>
                    <span>I</span>
                    <span>J</span>
                </div>
                <div className="y-axis axis">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                </div>
                <div className="mapa">{mapa}</div>
            </div>
            
        )
        }
}



export default Tablero;