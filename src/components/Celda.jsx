import React from 'react';


class Celda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cell: props.cell,
            over: false,
        };
    }
    handleMouseEnter = () => {
        const { cell } = this.state;
        this.props.handlePositionMouse({
            x: cell.x,
            y: cell.y
        })
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
    };

    render()
        {
            const { cell } = this.props;
            const content = cell.content ? cell.content : '';
            return (
                <div
                className={`celda${this.state.over ? " over" : ""}${content ? ` ${content.tipo}` : ""} ${cell.selectable ? " selectable" : ""} ${!cell.active ? " inactive" : ""} ${cell.lighting ? " light" : ""}`}
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}
                onClick={this.handleCellClick}
                >
                    {content.id}
                </div>
            )
        }
}


export default Celda;