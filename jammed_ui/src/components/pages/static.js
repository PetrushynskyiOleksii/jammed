import React from "react";

import RadarContainer from "../tiles/radar";
import BarContainer from "../tiles/bar";
import { ChartContainer } from "../tiles/chart";


export default class StaticCharts extends React.Component {
    render() {
        return (
            <ChartContainer>
                <RadarContainer url="/static" id="transport_per_type"/>
                <RadarContainer url="/static"  id="transport_per_agencies"/>
                <BarContainer url="/static" id="transport_per_routes"/>
                <BarContainer url="/static" id="stops_per_routes"/>
                <RadarContainer url="/static" id="stops_per_regions"/>
            </ChartContainer>
        )
    }
}
