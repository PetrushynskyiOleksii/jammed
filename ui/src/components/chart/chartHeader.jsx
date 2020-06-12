import React from "react"

import "./chart.sass"


export default class ChartHeader extends React.PureComponent {
    render() {
        const { title, subtitle, refresh } = this.props
        return (
            <div className="chart-header">
                <div onClick={refresh} className="chart-title">{title}</div>
                <div className="chart-subtitle">{subtitle}</div>
            </div>
        )
    }
}

