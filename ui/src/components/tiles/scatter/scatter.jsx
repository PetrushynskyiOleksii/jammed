import React from "react"

import { ScatterChart, Scatter, XAxis, YAxis } from "recharts"

import { BLUE_COLOR, CHART_HEIGHT, CHART_WIDTH } from "@utils/constants"
import "./scatter.sass"


const SCATTER_CHART_HEIGHT = CHART_HEIGHT + 100


export default class ScatterTile extends React.PureComponent {
    render() {
        const { data } = this.props
        return (
            <ScatterChart
                width={CHART_WIDTH}
                height={SCATTER_CHART_HEIGHT}
                margin={{ top: 15, left: 15, right: 15, bottom: 15 }}
            >
                <XAxis domain={["auto", "auto"]} type="number" dataKey="latitude" hide={true}/>
                <YAxis domain={["auto", "auto"]} type="number" dataKey="longitude" hide={true}/>
                <Scatter data={data} fill={BLUE_COLOR}/>
            </ScatterChart>
        )
    }
}
