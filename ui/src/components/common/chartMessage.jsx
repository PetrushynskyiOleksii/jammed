import React from "react"

import Icon from "@icons/icon"
import { BIG_ICON_SIZE } from "@utils/constants"

import "./common.sass"


export default class ChartMessage extends React.PureComponent {
    render() {
        const { icon, text, theme } = this.props
        return (
            <div className="chart-message">
                <div className={`chart-message-text chart-message-text-${theme}`}>
                    {text}
                </div>
                <Icon
                    name={icon}
                    className={`chart-message-icon chart-message-icon-${theme}`}
                    size={BIG_ICON_SIZE}
                />
            </div>
        )
    }
}
