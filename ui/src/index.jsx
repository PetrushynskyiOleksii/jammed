import ReactDOM from "react-dom"
import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"

import NavigationBar from "./components/navigation/navigationBar"
import TransportPage from "./components/pages/traffic.jsx"
import StaticPage from "./components/pages/transport.jsx"
import TrafficPage from "./components/pages/regions.jsx"

import "./index.sass"

ReactDOM.render(
    <div className="jammed_app">
        <React.Fragment>
            <Router>
                <NavigationBar />
                <Switch>
                    <Route path="/regions" component={TrafficPage} />
                    <Route path="/transport" component={StaticPage} />
                    <Route path="/traffic" component={TransportPage} />
                    <Redirect path="*" to="/regions"/>
                </Switch>
            </Router>
        </React.Fragment>
    </div>,
    document.getElementById("jammed")
)
