import React from 'react';

class Celda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x : props.x,
            y : props.y
        };
    }

    handleMouseEnter = () => {
        console.log(`Entro! (${this.state.x},${this.state.y})`)
    };
    handleMouseLeave = () => {
        console.log(`Salio! (${this.state.x},${this.state.y})`)
    };

    render()
        {
            return (
                <div id="celda" 
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}>
                </div>
            )
        }
}
export default Celda;