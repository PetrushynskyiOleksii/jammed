import React from "react"

import "./common.sass"


export default class ChartHeader extends React.PureComponent {
    render() {
        const { title, subtitle, refresh, theme } = this.props
        return (
            <div className="chart-header">
                <div
                    onClick={refresh}
                    className={`chart-title chart-title-${theme}`}
                >
                    {title}
                </div>
                <div className="chart-subtitle">{subtitle}</div>
            </div>
        )
    }
}

