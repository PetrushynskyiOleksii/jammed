import ReactDOM from "react-dom"
import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"

import NavigationBar from "./components/navigation/navigationBar"
import TransportCharts from "./components/pages/transport.jsx"

import "./index.sass"

ReactDOM.render(
    <div className="jammed_app">
        <React.Fragment>
            <Router>
                <NavigationBar />
                <Switch>
                    <Route path="/transport" component={TransportCharts} />
                    <Redirect path="*" to="/static"/>
                </Switch>
            </Router>
        </React.Fragment>
    </div>,
    document.getElementById("jammed")
)
