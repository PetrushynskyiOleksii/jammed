import React from "react"

import "./common.sass"


export default class ChartLoader extends React.PureComponent {
    render() {
        const { theme } = this.props
        return (
            <div className="chart-loader">
                <div className={`chart-loader-line chart-loader-line-${theme}`}/>
            </div>
        )
    }
}
