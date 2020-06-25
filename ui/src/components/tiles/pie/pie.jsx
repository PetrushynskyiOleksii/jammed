import React from "react"

import { PieChart, Pie, Cell } from "recharts"

import { GREEN_COLOR, CHART_HEIGHT, CHART_WIDTH, BLACK_LIGHT_COLOR, CHART_ANIMATION } from "@utils/constants"
import "./pie.sass"

const CHART_PIE_ANGLE = 270
const CHART_PIE_PADDING = 2.5
const CHART_PIE_HEIGHT = CHART_HEIGHT + 75


export default class PieTile extends React.PureComponent {

    renderPie = (data, inner, outer, active, changeActive) => {
        return (
            <Pie
                data={data}
                dataKey="value"
                fill="url(#radial-gradient)"
                innerRadius={inner}
                outerRadius={outer}
                startAngle={-CHART_PIE_ANGLE}
                endAngle={CHART_PIE_ANGLE}
                paddingAngle={CHART_PIE_PADDING}
                stroke={BLACK_LIGHT_COLOR}
                onClick={changeActive}
                animationBegin={0}
                animationDuration={CHART_ANIMATION}
                cursor="pointer"
            >
                {data.map((entry, index) =>
                    <Cell
                        key={`cell-${index}`}
                        fill={index === active ? "url(#pie-cell-active)" : "url(#pie-cell)"}
                    />
                )}
            </Pie>
        )
    }

    render() {
        const { data, activeIndex, changeActive } = this.props


        return (
            <PieChart
                width={CHART_WIDTH}
                height={CHART_PIE_HEIGHT}
            >
                <defs>
                    <radialGradient id="pie-cell"  gradientUnits="userSpaceOnUse">
                        <stop offset="25%" stopColor={GREEN_COLOR} stopOpacity={0.0} />
                        <stop offset="100%" stopColor={GREEN_COLOR} stopOpacity={1} />
                    </radialGradient>
                    <radialGradient id="pie-cell-active" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor={GREEN_COLOR} stopOpacity={0.5} />
                        <stop offset="100%" stopColor={GREEN_COLOR} stopOpacity={1} />
                    </radialGradient>
                </defs>
                {this.renderPie(data, 70, 80, activeIndex, changeActive)}
                {this.renderPie(data, 87, 120, activeIndex, changeActive)}
            </PieChart>
        )
    }
}
