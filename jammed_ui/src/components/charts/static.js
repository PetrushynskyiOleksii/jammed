import React from "react";

import RadarTile from "./tiles/radar";
import BarTile from "./tiles/bar";
import { ChartContainer } from "./chart";


export default class StaticCharts extends React.Component {
    render() {
        return (
            <ChartContainer>
                <RadarTile url="/static" id="transport_per_type"/>
                <RadarTile url="/static"  id="transport_per_agencies"/>
                <BarTile url="/static" id="transport_per_routes"/>
                <BarTile url="/static" id="stops_per_routes"/>
                <RadarTile url="/static" id="stops_per_regions"/>
            </ChartContainer>
        )
    }
}
