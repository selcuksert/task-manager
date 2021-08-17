import React, { Component } from 'react';

class Progress extends Component {
    render() {
        return (
            <div>
                <div className="progress">
                    <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${this.props.width}%` }} role="progressbar"></div>
                </div>
            </div>
        )
    }
}

export default Progress;
