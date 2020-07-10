import React from "react"

import ChartHeader from "@components/common/chartHeader"
import ChartLoader from "@components/common/chartLoader"
import ChartMessage from "@components/common/chartMessage"
import ChartInfo from "@components/common/chartInfo"
import ChartCell from "@components/common/chartCell"
import PieChart from "@components/tiles/donutHistory/pieChart"
import BarChart from "@components/tiles/donutHistory/barChart"

import request from "@utils/request"
import { CONGESTION_PATH } from "@utils/constants"

import "./donutHistory.sass"


const CHART_LIMIT_ITEMS = 18


export default class DonutHistory extends React.Component {

    state = {
        loading: false,
        error: false,
        data: []
    }

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        const { title } = this.props

        this.setState({ loading: true })
        const endpoint_path = `${CONGESTION_PATH}/${title}`
        request.get(endpoint_path, { limit: CHART_LIMIT_ITEMS })
            .then(response => {
                const { result } = response.data
                this.setState({
                    data: result,
                    loading: false,
                    error: false
                })
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
    }

    render() {
        const { data, error, loading } = this.state
        const { title, theme } = this.props

        if (error) return (
            <ChartCell className="donut-history">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartMessage theme={theme} text="Data could not be loaded" icon="error-icon"/>
            </ChartCell>
        )
        else if (loading) return (
            <ChartCell className="donut-history">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartLoader theme={theme}/>
            </ChartCell>
        )
        else if (!data.length) return (
            <ChartCell className="donut-history">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartMessage theme={theme} text="No data points" icon="warning-icon"/>
            </ChartCell>
        )

        const lastItem = data[data.length - 1]
        const lastItemPercentage = `${Math.round(lastItem.value)}%`
        return (
            <ChartCell className="donut-history">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <div className="pie-chart">
                    <ChartInfo theme={theme} main={lastItemPercentage} />
                    <PieChart data={lastItem} />
                </div>
                <div className="bar-chart">
                    <BarChart data={data} />
                </div>
            </ChartCell>
        )
    }
}
