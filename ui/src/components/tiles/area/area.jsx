import React from "react"
import { AreaChart, Area } from "recharts"

import { YELLOW, WHITE } from "../../../utils/constants"
import { ChartHeader, ChartLoader, ChartMessage, ChartCell } from "../../chart/chart"

import "./area.sass"


const data = [{uv: 0}, {uv: 1000}, {uv: 1000}, {uv: 1000}, {uv: 1500}]

class AreaTile extends React.PureComponent {
    render() {
        return (
            <div className="area-tile">
                <AreaChart
                    width={300}
                    height={250}
                    data={data}
                    margin={0}
                >
                    <defs>
                        <linearGradient id="y-points" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="25%" stopColor={YELLOW} stopOpacity={1}/>
                            <stop offset="100%" stopColor={WHITE} stopOpacity={0.75}/>
                        </linearGradient>
                    </defs>
                    <Area dataKey="uv" stroke={null} fill="url(#y-points)"/>
                </AreaChart>
            </div>
        )
    }
}

class AreaInfo extends React.PureComponent {
    render() {
        const { period, lastValue } = this.props
        return (
            <div className="area-info">
                <div className="area-info-row">
                    Period:
                    <span className="area-info-row-value">{period}h</span>
                </div>
                <div className="area-info-row">
                    Last value:
                    <span className="area-info-row-value">{lastValue}</span>
                </div>
            </div>
        )
    }
}


export default class AreaContainer extends React.Component {
    state = {
        loading: false,
        error: false,
    }

    render() {
        const { error, loading, data } = this.state
        const { route, title } = this.props
        return (
            <ChartCell>
                <ChartHeader title={title}/>
                <ChartLoader text="Loading data..." />
            </ChartCell>
        )
        if (!route) return (
            <ChartCell>
                <ChartHeader title={title}/>
                <ChartMessage text="No route chosen" icon="empty"/>
            </ChartCell>
        )
        else if (error) return (
            <ChartCell>
                <ChartHeader title={title}/>
                <ChartMessage text="Data could not be loaded" icon="error"/>
            </ChartCell>
        )
        else if (loading) return (
            <ChartCell>
                <ChartHeader title={title}/>
                <ChartLoader text="Loading data..." />
            </ChartCell>
        )
        else if (!data.length) return (
            <ChartCell>
                <ChartHeader title={title}/>
                <ChartMessage text="No data points" icon="warning"/>
            </ChartCell>
        )

        return (
            <ChartCell>
                <ChartHeader title={title} route="Т08"/>
                <AreaInfo lastValue={20} period={2}/>
                <AreaTile data={data}/>
            </ChartCell>
        )
    }
}
