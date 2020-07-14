import React from 'react';

class Nave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            over: false,
            selected: false,
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
            this.props.handleShipSelection(this.props.ship)
        });
    };

    render()
        {
            const { ship } = this.props;
            return (
                <div
                className={`nave${this.state.over ? " over" : ""} ${ship.tipo} ${ship.positioned ? " positioned" : ""}`}
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}
                onClick={this.handleSelect}>
                    {ship.id}
                </div>
            )
        }
}



export default Nave;