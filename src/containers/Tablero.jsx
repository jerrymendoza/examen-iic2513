import React from 'react';
import { connect } from 'react-redux';
import Celda from '../components/Celda';


class Tablero extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            over: false,
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

        const { tablero } = this.props;  
 
        const mapa = Object.keys(tablero.elements).map((key, index) => <Celda 
                                                    key={key}
                                                    cell={tablero.elements[key]} 
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

const mapStateToProps = (state) => {
    return {
        tablero: state.tablero
    };
};

export default Tablero;