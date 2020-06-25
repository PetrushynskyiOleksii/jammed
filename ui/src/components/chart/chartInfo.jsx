import React from "react"


export default class ChartInfo extends React.PureComponent {
    render() {
        const { theme, main, sub } = this.props
        return (
            <div className="chart-info">
                <div className={`chart-info-main chart-info-main-${theme}`}>
                    {main}
                </div>
                <div className="chart-info-sub">
                    {sub}
                </div>
            </div>
        )
    }
}
