import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import { ChartError } from "../charts/chart";
import request from "../services/request";

import "./search.css"


export default class SearchDialog extends React.Component {
    state = {
        data: [],
        error: false,
    };

    url = "/routes";

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        request.get(this.url)
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
        if (error) return <ChartError text="Data could not be loaded." icon="error"/>;

        return (
            <Dialog open={this.props.open} onClose={this.props.closeDialog}>
                <DialogContent>
                    {Object.keys(data).map(routeType =>
                        <React.Fragment key={routeType}>
                            <div className="search-section-title">{routeType}</div>
                            <div className="search-items-container">
                                {this.routes(data[routeType])}
                            </div>
                        </React.Fragment>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
}
