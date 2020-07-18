import React from "react"

import Slider from "@material-ui/core/Slider"


export default class SearchPeriod extends React.PureComponent {
    render() {
        const { setPeriod, period } = this.props
        return (
            <div className="search-period">
                <div className="search-period-title">
                    Period:
                    <span className="search-period-value">
                        {period}h
                    </span>
                </div>
                <div className="search-period-slider">
                    <Slider
                        value={parseInt(period)}
                        onChange={setPeriod}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="off"
                        min={1}
                        max={24}
                    />
                </div>
            </div>
        )
    }
}
