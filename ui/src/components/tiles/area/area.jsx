import React from "react"

import { Area, AreaChart, YAxis } from "recharts"

import { WHITE_COLOR, YELLOW_COLOR, CHART_HEIGHT, CHART_WIDTH } from "../../../utils/constants"


export default class AreaTile extends React.PureComponent {
    render() {
        const { data } = this.props
        return (
            <AreaChart
                width={CHART_WIDTH}
                height={CHART_HEIGHT}
                data={data}
                margin={null}
            >
                <defs>
                    <linearGradient id="y-points" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor={YELLOW_COLOR} stopOpacity={1}/>
                        <stop offset="100%" stopColor={WHITE_COLOR} stopOpacity={0.5}/>
                    </linearGradient>
                </defs>
                <YAxis domain={["auto", "auto"]} hide={true}/>
                <Area dataKey="value" stroke={null} fill="url(#y-points)"/>
            </AreaChart>
        )
    }
}
