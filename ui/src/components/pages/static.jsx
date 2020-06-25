import React from "react"

import ChartsContainer from "@components/chart/chartsContainer"
import BarContainer from "@components/tiles/bar/barContainer"
import { GREEN_THEME as theme } from "@utils/constants"

import "./pages.sass"


export default class StaticPage extends React.PureComponent {

    render() {
        return (
            <div id="static-page">
                <ChartsContainer>
                    <BarContainer
                        theme={theme}
                        title="stops per routes"
                        path="stops_per_routes"
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
