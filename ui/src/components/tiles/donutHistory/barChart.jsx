import React from "react"

import { BarChart as BarContainer, Bar, Cell, YAxis } from "recharts"

import { RED_YELLOW_GRADIENT, CHART_WIDTH, CHART_ANIMATION, YELLOW_COLOR } from "@utils/constants"


const CHART_BAR_WIDTH = 10
const CHART_BAR_HEIGHT = 75


export default class BarChart extends React.PureComponent {

    getBarGradient = (value) => {
        const gradientNumber = Math.ceil(value / 10)
        return `url(#bar-cell-${gradientNumber-1})`
    }

    render() {
        const { data } = this.props

        return (
            <BarContainer
                width={CHART_WIDTH}
                height={CHART_BAR_HEIGHT}
                barSize={CHART_BAR_WIDTH}
                data={data}
                margin={null}
            >
                <defs>
                    {RED_YELLOW_GRADIENT.map((stopColor, i) =>
                        <linearGradient key={i} id={`bar-cell-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={stopColor} stopOpacity={1}/>
                            <stop offset="100%" stopColor={YELLOW_COLOR} stopOpacity={1}/>
                        </linearGradient>
                    )}
                </defs>
                <YAxis domain={[0, 100]} type="number" dataKey="value" hide={true}/>
                <Bar
                    dataKey="value"
                    animationDuration={CHART_ANIMATION}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={this.getBarGradient(entry.value)}
                        />
                    ))}
                </Bar>
            </BarContainer>
        )
    }
}
