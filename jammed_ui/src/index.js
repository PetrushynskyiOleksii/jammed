import ReactDOM from 'react-dom';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Navigation from "./components/main/navigation";
import StaticCharts from "./components/pages/static";
import TransportCharts from "./components/pages/transport";

import './index.css';



ReactDOM.render(
    <div className="jammed_app">
        <React.Fragment>
                <Router>
                    <Navigation />
                    <Switch>
                        <Route path="/static" component={StaticCharts}/>
                        <Route path="/transport" component={TransportCharts} />
                    </Switch>
                </Router>
            </React.Fragment>
    </div>,
    document.getElementById('jammed')
);
