import React from "react"

import "./chartLoader.sass"


export default class ChartLoader extends React.PureComponent {
    render() {
        return (
            <div className="chart-loader">
                <div className="chart-loader-line"/>
            </div>
        )
    }
}
