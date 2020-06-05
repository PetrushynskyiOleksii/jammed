import React from "react"


export default class ChartInfo extends React.PureComponent {
    render() {
        const { info} = this.props
        return (
            <div className="chart-info">
                {Object.keys(info).map(row => (
                    <div className="chart-info-row">
                        {row}:
                        <span className="chart-info-row-value">
                            {info[row]}
                        </span>
                    </div>
                ))}
            </div>
        )
    }
}
