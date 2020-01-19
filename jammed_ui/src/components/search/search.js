import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import request from "../services/request";

import "./search.css"


export default class SearchDialog extends React.Component {
    state = {
        data: [],
        error: false,
    };

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        request.get("/routes")
            .then(response => {
                this.setState({
                    error: false,
                    data: response.data
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
    };

    setRouteName = (name) => {
        localStorage.setItem("routeName", name);
        this.props.closeDialog(name);
    };

    activeRoute(name) {
        return this.props.routeName === name ? " search-item-active" : ""
    }

    routes(routeNames){
        return routeNames.map(name =>
            <div key={name} className={"search-item " + this.activeRoute(name)}
                onClick={() => this.setRouteName(name)}>
                {name}
            </div>
        )
    }

    render() {
        const { error, data } = this.state;
        return (
            <Dialog open={this.props.open && !error} onClose={this.props.closeDialog}>
                <DialogContent>
                    {data.map(route =>
                        <React.Fragment key={route.route_type}>
                            <div className="search-section-title">{route.route_type}</div>
                            <div className="search-items-container">
                                {this.routes(route.route_names)}
                            </div>
                        </React.Fragment>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
}
