import React, { Component } from "react";
import RadarTile from "./tiles/radar";
import BarTile from "./tiles/bar";

import './graphs.css';


export default class Graphs extends Component {

    render() {
        return (
            <div className="chart-container">
                <RadarTile url="/static" id="transport_per_type"/>
                <RadarTile url="/static"  id="transport_per_agencies"/>
                <BarTile url="/static" id="transport_per_routes" limit={10}/>
                <BarTile url="/static" id="stops_per_routes" limit={10}/>
                <RadarTile url="/static" id="stops_per_regions"/>
            </div>
        )
    }
}
