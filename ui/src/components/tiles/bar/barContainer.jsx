import React from "react"

import ChartHeader from "@components/chart/chartHeader"
import ChartLoader from "@components/chart/chartLoader"
import ChartMessage from "@components/chart/chartMessage"
import ChartCell from "@components/chart/chartCell"
import ChartInfo from "@components/chart/chartInfo"
import request from "@utils/request"
import { ROUTES_PATH } from "@utils/constants"
import BarTile from "./bar"


export default class BarContainer extends React.Component {

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
            <ChartCell>
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartMessage theme={theme} text="Data could not be loaded" icon="error"/>
            </ChartCell>
        )
        else if (loading) return (
            <ChartCell>
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartLoader theme={theme}/>
            </ChartCell>
        )
        else if (!data.length) return (
            <ChartCell>
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartMessage theme={theme} text="No data points" icon="warning"/>
            </ChartCell>
        )

        const { id, value } = data[activeIndex]
        return (
            <ChartCell>
                <ChartHeader theme={theme} refresh={this.queryData} title={title} />
                <ChartInfo theme={theme} info={{"Transport": id, "Value": value}}/>
                <div className="bar-chart">
                    <BarTile data={data} activeIndex={activeIndex} changeActive={this.changeActive}/>
                </div>
            </ChartCell>
        )
    }
}
