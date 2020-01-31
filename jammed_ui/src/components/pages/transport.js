import React from "react";

import SearchIcon from '@material-ui/icons/Search';

import LineContainer from "../tiles/line";
import ScatterContainer from "../tiles/scatter"
import SearchDialog from "../search/search";
import request from "../../services/request";
import { ChartContainer } from "../tiles/chart";
import { getQuery } from "../../services/queries";


export default class TransportCharts extends React.Component {
    delta = 10800 * 1000;  // 3 hours

    state = {
        open: false,
        routeName: null,
        available_routes: []
    };

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        const query = getQuery("available_routes", { delta: this.delta });
        request.get("/available_routes", { query })
            .then(response => {
                this.setState({
                    error: false,
                    routeName: localStorage.getItem("routeName"),
                    available_routes: response.data
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
    };

    openDialog = () => {
        this.setState({
            open: true
        })
    };

    closeDialog = () => {
        this.setState({
            open: false,
            routeName: localStorage.getItem("routeName"),
        })
    };

    render() {
        const { open, routeName, available_routes } = this.state;
        return (
            <React.Fragment>
                <ChartContainer>
                    <LineContainer id="trips_count" url="/timeseries" routeName={routeName} />
                    <LineContainer id="avg_speed" url="/timeseries" routeName={routeName} />
                    <LineContainer id="avg_distance" url="/timeseries" routeName={routeName} />
                    <ScatterContainer id="coordinates" url="/timeseries" routeName={routeName} />
                </ChartContainer>
                {available_routes.length && <SearchIcon onClick={this.openDialog} className="search-button"/>}
                <SearchDialog open={open}
                    closeDialog={this.closeDialog}
                    routeName={routeName}
                    data={available_routes}
                />
            </React.Fragment>
        )
    }
}
