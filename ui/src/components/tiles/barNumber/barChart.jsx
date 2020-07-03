import React from "react"

import { BarChart as BarContainer, Bar, Cell } from "recharts"

import { GREEN_COLOR, CHART_HEIGHT, CHART_WIDTH, CHART_ANIMATION } from "@utils/constants"

import "../../chart/chart.sass"

const CHART_BAR_WIDTH = 15
const CHART_BAR_MARGIN = 5

export default class BarChart extends React.PureComponent {

    render() {
        const { data, activeIndex, changeActive } = this.props
        const chartWidth = Math.max(data.length * (CHART_BAR_WIDTH + CHART_BAR_MARGIN), CHART_WIDTH)

        return (
            <BarContainer
                width={chartWidth}
                height={CHART_HEIGHT}
                barSize={CHART_BAR_WIDTH}
                data={data}
                margin={null}
            >
                <defs>
                    <linearGradient id="bar-cell" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GREEN_COLOR} stopOpacity={0.5}/>
                        <stop offset="100%" stopColor={GREEN_COLOR} stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="bar-cell-active" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GREEN_COLOR} stopOpacity={1}/>
                        <stop offset="100%" stopColor={GREEN_COLOR} stopOpacity={0.0}/>
                    </linearGradient>
                </defs>
                <Bar
                    dataKey="value"
                    onClick={changeActive}
                    animationDuration={CHART_ANIMATION}
                >
                    {data.map((entry, index) => (
                        <Cell
                            cursor="pointer"
                            key={`cell-${index}`}
                            fill={index === activeIndex ? "url(#bar-cell-active)" : "url(#bar-cell)"}
                        />
                    ))}
                </Bar>
            </BarContainer>
        )
    }
}
