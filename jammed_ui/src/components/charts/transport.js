import React from "react";

import LineTile from "./tiles/line";
import ScatterTile from "./tiles/scatter"
import { ChartContainer } from "./chart";


export default class TransportCharts extends React.Component {
    render() {
        return (
            <ChartContainer>
                <LineTile id="trips_count" url="/timeseries" route_name="А47" />
                <LineTile id="avg_speed" url="/timeseries" route_name="А47" />
                <ScatterTile id="coordinates" url="/timeseries/coordinates" route_name="А47"/>
            </ChartContainer>
        )
    }
}
