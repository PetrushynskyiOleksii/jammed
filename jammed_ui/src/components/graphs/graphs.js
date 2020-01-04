import React, { Component } from "react";
import RadarTile from "./tiles/radar";
import BarTile from "./tiles/bar";

import './graphs.css';


export default class Graphs extends Component {

    disableContextMenu = (e) => {
        e.preventDefault();
    };

    render() {
        return (
            <div className="chart-container"
                onContextMenu={this.disableContextMenu}>
                <RadarTile url="/static" id="transport_per_type"/>
                <RadarTile url="/static"  id="transport_per_agencies"/>
                <BarTile url="/static" id="transport_per_routes"/>
                <BarTile url="/static" id="stops_per_routes"/>
                <RadarTile url="/static" id="stops_per_regions"/>
            </div>
        )
    }
}
