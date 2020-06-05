import React from "react"

import ChartsContainer from "../chart/chartsContainer"
import AreaContainer from "../tiles/area/areaContainer"
import ScatterContainer from "../tiles/scatter/scatterContainer"

import "./pages.sass"


export default class TransportCharts extends React.PureComponent {

    state = {
        route: "Т08"
    }

    render() {
        const { route }  = this.props
        return (
            <div id="transport-page">
                <ChartsContainer>
                    <AreaContainer
                        path="/timeseries"
                        route={route}
                        operation="sum"
                        field="1"
                        title="trips count"
                    />
                    <AreaContainer
                        path="/timeseries"
                        route={route}
                        operation="avg"
                        field="trip_speed"
                        title="avg speed"
                    />
                    <AreaContainer
                        path="/timeseries"
                        route={route}
                        operation="avg"
                        field="trip_distance"
                        title="avg distance"
                    />
                    <ScatterContainer
                        path="/timeseries"
                        route={route}
                        title="coordinates"
                    />
                </ChartsContainer>
            </div>
        )
    }
}
