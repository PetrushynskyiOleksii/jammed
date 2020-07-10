import React from "react"

import ChartHeader from "@components/common/chartHeader"
import ChartLoader from "@components/common/chartLoader"
import ChartMessage from "@components/common/chartMessage"
import ChartCell from "@components/common/chartCell"
import ChartInfo from "@components/common/chartInfo"
import BarChart from "@components/tiles/barNumber/barChart"

import request from "@utils/request"
import { ROUTES_PATH } from "@utils/constants"

import "./barNumber.sass"


export default class BarNumber extends React.Component {

    state = {
        loading: false,
        error: false,
        data: [],
        activeIndex: 0,
    }

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        const { path } = this.props

        this.setState({ loading: true })
        const endpoint_path = `${ROUTES_PATH}/${path}`
        request.get(endpoint_path)
            .then(response => {
                this.setState({
                    data: response.data.result,
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

    changeActive = (bar, index) => {
        this.setState({ activeIndex: index })
    }

    render() {
        const { error, loading, data, activeIndex } = this.state
        const { title, theme } = this.props

        if (error) return (
            <ChartCell className="bar-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartMessage theme={theme} text="Data could not be loaded" icon="error-icon"/>
            </ChartCell>
        )
        else if (loading) return (
            <ChartCell className="bar-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartLoader theme={theme}/>
            </ChartCell>
        )
        else if (!data.length) return (
            <ChartCell className="bar-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartMessage theme={theme} text="No data points" icon="warning-icon"/>
            </ChartCell>
        )

        const { id, value } = data[activeIndex]
        return (
            <ChartCell className="bar-number">
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartInfo theme={theme} main={value} sub={`Transport: ${id}`}/>
                <div className="bar-chart">
                    <BarChart data={data} activeIndex={activeIndex} changeActive={this.changeActive}/>
                </div>
            </ChartCell>
        )
    }
}
