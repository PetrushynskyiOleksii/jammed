import React from "react"

import "./common.sass"


export default class ChartCell extends React.PureComponent {
    render() {
        const { className, children } = this.props
        return (
            <div className={`chart-cell ${className}`}>
                {children}
            </div>
        )
    }
}
