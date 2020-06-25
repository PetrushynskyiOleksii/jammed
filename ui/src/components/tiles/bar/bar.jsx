import React from "react"

import { BarChart, Bar, Cell } from "recharts"

import { GREEN_COLOR, CHART_HEIGHT, CHART_WIDTH } from "@utils/constants"
import "./bar.sass"


const BAR_WIDTH = 15
const BAR_MARGIN = 5


export default class AreaTile extends React.PureComponent {

    render() {
        const { data, activeIndex, changeActive } = this.props
        const chartWidth = Math.max(data.length * (BAR_WIDTH + BAR_MARGIN), CHART_WIDTH)

        return (
            <BarChart
                className="bar-chart"
                width={chartWidth}
                height={CHART_HEIGHT}
                barSize={BAR_WIDTH}
                data={data}
                margin={null}
            >
                <defs>
                    <linearGradient id="y-points" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GREEN_COLOR} stopOpacity={0.5}/>
                        <stop offset="100%" stopColor={GREEN_COLOR} stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="y-points-active" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GREEN_COLOR} stopOpacity={1}/>
                        <stop offset="100%" stopColor={GREEN_COLOR} stopOpacity={0.0}/>
                    </linearGradient>
                </defs>
                <Bar dataKey="value" onClick={changeActive}>
                    {data.map((entry, index) => (
                        <Cell
                            cursor="pointer"
                            key={`cell-${index}`}
                            fill={index === activeIndex ? "url(#y-points-active)" : "url(#y-points)"}
                        />
                    ))}
                </Bar>
            </BarChart>
        )
    }
}
