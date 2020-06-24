import React from "react"

import ChartHeader from "@components/chart/chartHeader"
import ChartLoader from "@components/chart/chartLoader"
import ChartMessage from "@components/chart/chartMessage"
import ChartCell from "@components/chart/chartCell"
import ChartInfo from "@components/chart/chartInfo"
import { TIMESERIES_PATH } from "@utils/constants"
import { convertToHour } from "@utils/helpers"
import request from "@utils/request"
import AreaTile from "./area"


export default class AreaContainer extends React.Component {

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
        const { route, title, period: delta } = this.props

        if (!route) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title}/>
                <ChartMessage text="No route chosen" icon="empty"/>
            </ChartCell>
        )
        else if (error) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title}/>
                <ChartMessage text="Data could not be loaded" icon="error"/>
            </ChartCell>
        )
        else if (loading) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title}/>
                <ChartLoader/>
            </ChartCell>
        )
        else if (!timeseries.length) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title}/>
                <ChartMessage text="No data points" icon="warning"/>
            </ChartCell>
        )

        const lastValue = timeseries[timeseries.length - 1].value.toFixed(2)
        const period = convertToHour(delta) + "h"

        return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title} subtitle={route}/>
                <ChartInfo info={{"Last value": lastValue, "Period": period}}/>
                <AreaTile data={timeseries}/>
            </ChartCell>
        )
    }
}
