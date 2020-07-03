import React from "react"

import { EMPTY_ICON, ERROR_ICON, WARNING_ICON } from "@utils/constants"

import "./common.sass"


const ICONS = {
    empty: EMPTY_ICON,
    error: ERROR_ICON,
    warning: WARNING_ICON
}

export default class ChartMessage extends React.PureComponent {
    render() {
        const { icon, text, theme } = this.props
        return (
            <div className="chart-message">
                <div className={`chart-message-text chart-message-text-${theme}`}>
                    {text}
                </div>
                <div className={`chart-message-icon chart-message-icon-${theme}`}>
                    {ICONS[icon]}
                </div>
            </div>
        )
    }
}
