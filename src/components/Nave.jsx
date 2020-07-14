import React from 'react';


class Nave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            over: false,
            selected: false,
            ship: props.ship,
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

    handleSelect = () => {
        this.setState({selected: this.state.selected ? false : true}, () => {
            alert(`Nave[${this.state.ship.tipo}] ${this.state.selected}`);
        });
    };

    render()
        {
            return (
                <div
                className={`nave${this.state.over ? " over" : ""} ${this.state.ship.tipo}`}
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}
                onClick={this.handleSelect}>
                </div>
            )
        }
}


export default Nave;