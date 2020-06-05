import React from "react"

import ChartCell from "../../chart/chartCell"
import ChartHeader from "../../chart/chartHeader"
import ChartMessage from "../../chart/chartMessage"
import ChartLoader from "../../chart/chartLoader"
import ChartInfo from "../../chart/chartInfo"
import ScatterTile from "./scatter"


export default class ScatterContainer extends React.Component {

    state = {
        error: false,
        loading: true,
    }

    render() {
        const { error, loading, data } = this.state
        const { route, title } = this.props

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
                <ChartLoader/>
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
                <ChartHeader title={title} subtitle="Т08"/>
                <ChartInfo info={{"Last time": "20:20"}}/>
                <ScatterTile data={data}/>
            </ChartCell>
        )
    }
}
