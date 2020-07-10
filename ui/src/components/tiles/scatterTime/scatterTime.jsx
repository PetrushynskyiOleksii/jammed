import React from "react"

import ChartCell from "@components/common/chartCell"
import ChartHeader from "@components/common/chartHeader"
import ChartMessage from "@components/common/chartMessage"
import ChartLoader from "@components/common/chartLoader"
import ScatterChart from "@components/tiles/scatterTime/scatterChart"

import request from "@utils/request"
import { TIMESERIES_PATH } from "@utils/constants"
import { formatTime } from "@utils/helpers"

import "./scatterTime.sass"


export default class ScatterTime extends React.Component {

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
            <ChartCell className="scatter-time">
                <ChartHeader refresh={this.queryData} title={title} theme={theme}/>
                <ChartMessage theme={theme} text="No route chosen" icon="empty-icon"/>
            </ChartCell>
        )
        else if (error) return (
            <ChartCell className="scatter-time">
                <ChartHeader refresh={this.queryData} title={title} theme={theme}/>
                <ChartMessage theme={theme} text="Data could not be loaded" icon="error-icon"/>
            </ChartCell>
        )
        else if (loading) return (
            <ChartCell className="scatter-time">
                <ChartHeader refresh={this.queryData} title={title} theme={theme}/>
                <ChartLoader theme={theme}/>
            </ChartCell>
        )
        else if (!coordinates.length) return (
            <ChartCell className="scatter-time">
                <ChartHeader refresh={this.queryData} title={title} theme={theme}/>
                <ChartMessage theme={theme} text="No data points" icon="warning-icon"/>
            </ChartCell>
        )

        return (
            <ChartCell className="scatter-time">
                <ChartHeader refresh={this.queryData} title={title} subtitle={route} theme={theme}/>
                <div className="scatter-chart">
                    <div className="scatter-chart-time">{timestamp}</div>
                    <ScatterChart data={coordinates}/>
                </div>
            </ChartCell>
        )
    }
}
