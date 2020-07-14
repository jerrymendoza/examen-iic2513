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
        this.setState({
            over: true
        })
    };
    handleMouseLeave = () => {
        this.setState({
            over: false
        })
    };
    handleCellClick = () => {
        this.props.handleCellClick(this.state.cell)
    }

    render()
        {
            return (
                <div
                className={`celda${this.state.over ? " over" : ""}`}
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}
                onClick={this.handleCellClick}
                >
                </div>
            )
        }
}


export default Celda;