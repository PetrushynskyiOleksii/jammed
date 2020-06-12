import React from "react"

import ChartCell from "../../chart/chartCell"
import ChartHeader from "../../chart/chartHeader"
import ChartMessage from "../../chart/chartMessage"
import ChartLoader from "../../chart/chartLoader"
import ChartInfo from "../../chart/chartInfo"
import ScatterTile from "./scatter"
import { TIMESERIES_PATH } from "../../../utils/constants"
import { formatTime } from "../../../utils/helpers"
import request from "../../../utils/request"


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
        const { route, title } = this.props

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
        else if (!coordinates.length) return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title}/>
                <ChartMessage text="No data points" icon="warning"/>
            </ChartCell>
        )

        return (
            <ChartCell>
                <ChartHeader refresh={this.queryData} title={title} subtitle={route}/>
                <ChartInfo info={{"Last time": timestamp}}/>
                <ScatterTile data={coordinates}/>
            </ChartCell>
        )
    }
}
