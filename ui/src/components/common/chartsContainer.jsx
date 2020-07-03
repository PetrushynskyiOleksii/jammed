import React from "react"

import "./chart.sass"


export default class ChartsContainer extends React.PureComponent {
    render() {
        return (
            <div className="charts-container">
                {this.props.children}
            </div>
        )
    }
}
