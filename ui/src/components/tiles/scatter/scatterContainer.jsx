import React from "react"

import ChartCell from "@components/chart/chartCell"
import ChartHeader from "@components/chart/chartHeader"
import ChartMessage from "@components/chart/chartMessage"
import ChartLoader from "@components/chart/chartLoader"
import { TIMESERIES_PATH } from "@utils/constants"
import { formatTime } from "@utils/helpers"
import request from "@utils/request"
import ScatterTile from "./scatter"


export default class ScatterContainer extends React.Component {

    state = {
        error: false,
        loading: true,
        timestamp: null,
        coordinates: []
    }

    componentDidMount() {
        this.queryData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.route !== this.props.route) {
            this.queryData()
        }
    }

    queryData = () => {
        const { route, path } = this.props
        if (!route) return

        this.setState({ loading: true })
        const endpoint_path = `${TIMESERIES_PATH}/${route}/${path}`
        request.get(endpoint_path)
            .then(response => {
                const { timestamp, value } = response.data.result
                this.setState({
                    coordinates: value,
                    timestamp: formatTime(timestamp),
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
        const { error, loading, coordinates, timestamp } = this.state
        const { route, title, theme } = this.props

        if (!route) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title} theme={theme}/>
                <ChartMessage theme={theme} text="No route chosen" icon="empty"/>
            </ChartCell>
        )
        else if (error) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title} theme={theme}/>
                <ChartMessage theme={theme} text="Data could not be loaded" icon="error"/>
            </ChartCell>
        )
        else if (loading) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title} theme={theme}/>
                <ChartLoader theme={theme}/>
            </ChartCell>
        )
        else if (!coordinates.length) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title} theme={theme}/>
                <ChartMessage theme={theme} text="No data points" icon="warning"/>
            </ChartCell>
        )

        return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title} subtitle={route} theme={theme}/>
                <div className="scatter-chart">
                    <div className="scatter-chart-time">{timestamp}</div>
                    <ScatterTile data={coordinates}/>
                </div>
            </ChartCell>
        )
    }
}
