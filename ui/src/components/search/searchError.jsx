import React from "react"

import Icon from "@icons/icon"
import { BIG_ICON_SIZE } from "@utils/constants"

export default class SearchError extends React.PureComponent {

    render() {
        return (
            <div className="search-error">
                <Icon
                    name="error-icon"
                    className="search-error-icon"
                    size={BIG_ICON_SIZE}
                />
                <div className="search-error-message">
                    No available transport routes
                </div>
            </div>
        )
    }
}
