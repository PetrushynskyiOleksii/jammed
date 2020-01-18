import React from "react";

import SearchIcon from '@material-ui/icons/Search';

import LineTile from "./tiles/line";
import ScatterTile from "./tiles/scatter"
import SearchDialog from "../search/search";
import { ChartContainer } from "./chart";


export default class TransportCharts extends React.Component {
    state = {
        open: false,
        routeName: localStorage.getItem("routeName")
    };

    openDialog = () => {
        this.setState({ open: true })
    };

    closeDialog = () => {
        this.setState({
            open: false,
            routeName: localStorage.getItem("routeName"),
        })
    };

    render() {
        const { open, routeName } = this.state;
        return (
            <React.Fragment>
                <ChartContainer>
                    <LineTile id="trips_count" url="/timeseries" routeName={routeName} />
                    <LineTile id="avg_speed" url="/timeseries" routeName={routeName} />
                    <LineTile id="avg_distance" url="/timeseries" routeName={routeName} />
                    <ScatterTile id="coordinates" url="/timeseries/coordinates" routeName={routeName} />
                </ChartContainer>
                <SearchIcon onClick={this.openDialog} className="search-button"/>
                <SearchDialog open={open} closeDialog={this.closeDialog} routeName={routeName}/>
            </React.Fragment>
        )
    }
}
