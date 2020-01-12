import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import SearchIcon from '@material-ui/icons/Search';

import LineTile from "./tiles/line";
import ScatterTile from "./tiles/scatter"
import { ChartContainer } from "./chart";

import "./dialog.css"


export default class TransportCharts extends React.Component {
    state = { open: false };

    openDialog = () => {
        this.setState({ open: true })
    };

    closeDialog = () => {
        this.setState({ open: false })
    };

    render() {
        return (
            <div>
                <ChartContainer>
                    <LineTile id="trips_count" url="/timeseries" route_name="А47" />
                    <LineTile id="avg_speed" url="/timeseries" route_name="А47" />
                    <LineTile id="avg_distance" url="/timeseries" route_name="А47" />
                    <ScatterTile id="coordinates" url="/timeseries/coordinates" route_name="А47"/>
                </ChartContainer>
                <SearchIcon onClick={this.openDialog} className="search-button"/>

                <Dialog open={this.state.open} onClose={this.closeDialog}>
                    <DialogTitle>TODO</DialogTitle>
                    <DialogContent>TODO</DialogContent>
                </Dialog>
            </div>
        )
    }
}
