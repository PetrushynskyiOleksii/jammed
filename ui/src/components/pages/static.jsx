import React from "react"

import ChartsContainer from "@components/chart/chartsContainer"
import BarContainer from "@components/tiles/bar/barContainer"
import PieContainer from "@components/tiles/pie/pieContainer"
import { GREEN_THEME as theme } from "@utils/constants"

import "./pages.sass"


export default class StaticPage extends React.PureComponent {

    render() {
        return (
            <div id="static-page">
                <ChartsContainer>
                    <PieContainer
                        theme={theme}
                        title="transport per type"
                        path="transport_per_type"
                    />
                    <BarContainer
                        theme={theme}
                        title="stops per routes"
                        path="stops_per_routes"
                    />
                    <PieContainer
                        theme={theme}
                        title="transport per agencies"
                        path="transport_per_agencies"
                    />
                    <BarContainer
                        theme={theme}
                        title="transport per routes"
                        path="transport_per_routes"
                    />
                </ChartsContainer>
            </div>
        )
    }
}
