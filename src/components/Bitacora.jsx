import React from 'react';


class Bitacora extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render(){
        const { lista } = this.props
        return (
            <div id="bitacora">
                    {lista.map((value, i) => (
                    <p key={i}>{value}</p>
                ))}

            </div>
        )
    }
}

export default Bitacora;