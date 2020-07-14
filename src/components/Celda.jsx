import React from 'react';


class Celda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cell: props.cell,
            over: false
        };
    }

    handleMouseEnter = () => {
        const { cell } = this.state;
        cell.myId()
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
            return (
                <div
                className={`celda${this.state.over ? " over" : ""}`}
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}>
                </div>
            )
        }
}


export default Celda;