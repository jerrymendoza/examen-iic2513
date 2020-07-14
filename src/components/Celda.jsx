import React from 'react';

class Celda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x : props.x,
            y : props.y,
            over: false
        };
    }

    handleMouseEnter = () => {
        console.log(`Entro! (${this.state.x},${this.state.y})`)
        this.setState({
            over: true
        })
    };
    handleMouseLeave = () => {
        console.log(`Salio! (${this.state.x},${this.state.y})`)
        this.setState({
            over: false
        })
    };

    render()
        {
            return (
                <div id="celda" 
                className={`celda${this.state.over ? " over" : ""}`}
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}>
                </div>
            )
        }
}
export default Celda;