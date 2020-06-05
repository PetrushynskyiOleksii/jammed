import React from "react"

import { ScatterChart, Scatter, XAxis, YAxis } from "recharts"

import { YELLOW_COLOR, CHART_HEIGHT, CHART_WIDTH } from "../../../utils/constants"


const data = [
    { x: 100, y: 200 },
    { x: 120, y: 100 },
    { x: 130, y: 100 },
    { x: 140, y: 250 },
    { x: 150, y: 300 },
    { x: 160, y: 280 },
    { x: 170, y: 480 },
    { x: 180, y: 580 },
    { x: 190, y: 280 },
]


export default class ScatterTile extends React.PureComponent {
    render() {
        return (
            <ScatterChart
                width={CHART_HEIGHT}
                height={CHART_WIDTH}
                margin={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
                <XAxis domain={["auto", "auto"]} type="number" dataKey="x" hide={true}/>
                <YAxis domain={["auto", "auto"]} type="number" dataKey="y" hide={true}/>
                <Scatter data={data} fill={YELLOW_COLOR}/>
            </ScatterChart>
        )
    }
}
