import React from "react"

import ChartsContainer from "../chart/chartsContainer"
import AreaContainer from "../tiles/area/areaContainer"
import ScatterContainer from "../tiles/scatter/scatterContainer"

import "./pages.sass"


export default class TransportCharts extends React.PureComponent {

    state = {
        route: "А10"
    }

    render() {
        const { route } = this.state
        return (
            <div id="transport-page">
                <ChartsContainer>
                    <AreaContainer
                        route={route}
                        path="trips_count"
                        title="trips count"
                    />
                    <AreaContainer
                        route={route}
                        path="avg_speed"
                        title="avg speed"
                    />
                    <AreaContainer
                        route={route}
                        path="avg_distance"
                        title="avg distance"
                    />
                    <ScatterContainer
                        route={route}
                        path="coordinates"
                        title="coordinates"
                    />
                </ChartsContainer>
            </div>
        )
    }
}
