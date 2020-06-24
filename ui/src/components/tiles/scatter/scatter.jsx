import React from "react"

import { ScatterChart, Scatter, XAxis, YAxis } from "recharts"

import { BLUE_COLOR, CHART_HEIGHT, CHART_WIDTH } from "@utils/constants"

export default class ScatterTile extends React.PureComponent {
    render() {
        const { data } = this.props
        return (
            <ScatterChart
                width={CHART_HEIGHT}
                height={CHART_WIDTH}
                margin={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
                <XAxis domain={["auto", "auto"]} type="number" dataKey="latitude" hide={true}/>
                <YAxis domain={["auto", "auto"]} type="number" dataKey="longitude" hide={true}/>
                <Scatter data={data} fill={BLUE_COLOR}/>
            </ScatterChart>
        )
    }
}
