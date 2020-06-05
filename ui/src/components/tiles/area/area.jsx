import React from "react"

import { Area, AreaChart } from "recharts"

import { WHITE_COLOR, YELLOW_COLOR, CHART_HEIGHT, CHART_WIDTH } from "../../../utils/constants"


const data = [{uv: 0}, {uv: 1000}, {uv: 1000}, {uv: 1000}, {uv: 1500}]


export default class AreaTile extends React.PureComponent {
    render() {
        return (
            <AreaChart
                width={CHART_WIDTH}
                height={CHART_HEIGHT}
                data={data}
                margin={0}
            >
                <defs>
                    <linearGradient id="y-points" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor={YELLOW_COLOR} stopOpacity={1}/>
                        <stop offset="100%" stopColor={WHITE_COLOR} stopOpacity={0.75}/>
                    </linearGradient>
                </defs>
                <Area dataKey="uv" stroke={null} fill="url(#y-points)"/>
            </AreaChart>
        )
    }
}
