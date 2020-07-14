import React from 'react';


class Nave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            over: false,
            selected: false
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
            alert(`Nave ${this.state.selected}`);
        });
    };

    render()
        {
            return (
                <div id="nave" 
                className={`nave${this.state.over ? " over" : ""}`}
                onMouseEnter={this.handleMouseEnter} 
                onMouseLeave={this.handleMouseLeave}
                onClick={this.handleSelect}>
                </div>
            )
        }
}


export default Nave;