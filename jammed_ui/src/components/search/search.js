import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import "./search.css"


export default class SearchDialog extends React.Component {

    setRouteName = (event) => {
        localStorage.setItem("routeName", event.target.dataset.name);
        this.props.closeDialog();
    };

    render() {
        const { data, open, closeDialog, routeName } = this.props;
        return (
            <Dialog open={open} onClose={closeDialog}>
                <DialogContent >
                    {data.map(route =>
                        <React.Fragment key={route.route_type}>
                            <div className="search-section-title">
                                {route.route_type}
                            </div>
                            <div className="search-items-container">
                                {route.route_names.map(name =>
                                    <div key={name}
                                         className={routeName !== name ? "search-item": "search-item-active" }
                                         data-name={name}
                                         onClick={this.setRouteName}>
                                         {name}
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
}
