import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import StaticCharts from "./charts/static";
import TransportCharts from "./charts/transport";
import Navigation from "./main/navigation"

import './jammed.css';


export default class Jammed extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Router>
                    <Navigation />
                    <Switch>
                        <Route path="/static" component={StaticCharts}/>
                        <Route path="/transport" component={TransportCharts} />
                        <Redirect path="*" to="/static"/>
                    </Switch>
                </Router>
            </React.Fragment>
        );
    }
}
