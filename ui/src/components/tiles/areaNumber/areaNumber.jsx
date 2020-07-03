import React from "react"

import ChartHeader from "@components/common/chartHeader"
import ChartLoader from "@components/common/chartLoader"
import ChartMessage from "@components/common/chartMessage"
import ChartCell from "@components/common/chartCell"
import ChartInfo from "@components/common/chartInfo"
import AreaChart from "@components/tiles/areaNumber/areaChart"

import request from "@utils/request"
import { TIMESERIES_PATH } from "@utils/constants"
import { convertToHour } from "@utils/helpers"


export default class AreaNumber extends React.Component {

    state = {
        loading: false,
        error: false,
        timeseries: []
    }

    componentDidMount() {
        this.queryData(this.state.delta)
    }

    componentDidUpdate(prevProps) {
        const { period: prevPeriod, route: prevRoute } = prevProps
        const { period, route } = this.props
        if (prevPeriod !== period || prevRoute !== route) {
            this.queryData()
        }
    }

    queryData = () => {
        const { route, path, period } = this.props
        if (!route) return

        this.setState({ loading: true })
        const endpoint_path = `${TIMESERIES_PATH}/${route}/${path}`
        request.get(endpoint_path, { delta: period })
            .then(response => {
                this.setState({
                    timeseries: response.data.result,
                    loading: false,
                    error: false,
                })
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
    }

    render() {
        const { error, loading, timeseries } = this.state
        const { route, title, theme, period: delta } = this.props

        if (!route) return (
            <ChartCell className="area-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title}/>
                <ChartMessage theme={theme} text="No route chosen" icon="empty"/>
            </ChartCell>
        )
        else if (error) return (
            <ChartCell className="area-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title}/>
                <ChartMessage theme={theme} text="Data could not be loaded" icon="error"/>
            </ChartCell>
        )
        else if (loading) return (
            <ChartCell className="area-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title}/>
                <ChartLoader theme={theme} />
            </ChartCell>
        )
        else if (!timeseries.length) return (
            <ChartCell className="area-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title}/>
                <ChartMessage theme={theme} text="No data points" icon="warning"/>
            </ChartCell>
        )

        const lastValue = timeseries[timeseries.length - 1].value.toFixed(2)
        const period = convertToHour(delta)

        return (
            <ChartCell className="area-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} subtitle={route}/>
                <ChartInfo theme={theme} main={lastValue} sub={`Period: ${period}h`}/>
                <AreaChart data={timeseries}/>
            </ChartCell>
        )
    }
}
