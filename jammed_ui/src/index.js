import ReactDOM from 'react-dom';
import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";

import NavigationBar from "./components/main/navigationBar";
import StaticCharts from "./components/pages/static";
import TransportCharts from "./components/pages/transport";

import './index.css';



ReactDOM.render(
    <div className="jammed_app">
        <React.Fragment>
                <Router>
                    <NavigationBar />
                    <Switch>
                        <Route path="/static" component={StaticCharts}/>
                        <Route path="/transport" component={TransportCharts} />
                        <Redirect path="*" to="/static"/>
                    </Switch>
                </Router>
            </React.Fragment>
    </div>,
    document.getElementById('jammed')
);
