import React from "react"

import ChartsContainer from "@components/common/chartsContainer"
import BarNumber from "@components/tiles/barNumber/barNumber"
import DonutNumber from "@components/tiles/donutNumber/donutNumber"

import { GREEN_THEME as theme } from "@utils/constants"


export default class TransportPage extends React.PureComponent {

    render() {
        return (
            <div id="transport-page">
                <ChartsContainer>
                    <DonutNumber
                        theme={theme}
                        title="transport per type"
                        path="transport_per_type"
                    />
                    <BarNumber
                        theme={theme}
                        title="stops per routes"
                        path="stops_per_routes"
                    />
                    <DonutNumber
                        theme={theme}
                        title="transport per agencies"
                        path="transport_per_agencies"
                    />
                    <BarNumber
                        theme={theme}
                        title="transport per routes"
                        path="transport_per_routes"
                    />
                </ChartsContainer>
            </div>
        )
    }
}
