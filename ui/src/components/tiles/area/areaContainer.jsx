import React from "react"

import ChartHeader from "../../chart/chartHeader"
import ChartLoader from "../../chart/chartLoader"
import ChartMessage from "../../chart/chartMessage"
import ChartCell from "../../chart/chartCell"
import ChartInfo from "../../chart/chartInfo"
import AreaTile from "./area"


export default class AreaContainer extends React.Component {
    state = {
        loading: false,
        error: false,
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
                <ChartInfo info={{"Last value": "20.2", "Period": "2h"}}/>
                <AreaTile data={data}/>
            </ChartCell>
        )
    }
}
