import React from "react"

import { EMPTY_ICON, ERROR_ICON, WARNING_ICON } from "../../utils/constants"

import "./chart.sass"


const ICONS = {
    empty: EMPTY_ICON,
    error: ERROR_ICON,
    warning: WARNING_ICON
}

export default class ChartMessage extends React.PureComponent {
    render() {
        const { icon, text } = this.props
        return (
            <div className="chart-message">
                <div className="chart-message-text">{text}</div>
                {ICONS[icon]}
            </div>
        )
    }
}
