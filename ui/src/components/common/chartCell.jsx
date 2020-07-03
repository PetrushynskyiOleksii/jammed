import React from "react"

import "./chart.sass"


export default class ChartCell extends React.PureComponent {
    render() {
        return (
            <div className="chart-cell">
                {this.props.children}
            </div>
        )
    }
}
