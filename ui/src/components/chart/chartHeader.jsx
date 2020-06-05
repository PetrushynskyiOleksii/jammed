import React from "react"

import "./chart.sass"


export default class ChartHeader extends React.PureComponent {
    render() {
        const { title, subtitle } = this.props
        return (
            <div className="chart-header">
                <div className="chart-title">{title}</div>
                <div className="chart-subtitle">{subtitle}</div>
            </div>
        )
    }
}

