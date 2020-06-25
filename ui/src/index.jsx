import ReactDOM from "react-dom"
import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"

import NavigationBar from "./components/navigation/navigationBar"
import TransportPage from "./components/pages/transport.jsx"
import StaticPage from "./components/pages/static.jsx"

import "./index.sass"

ReactDOM.render(
    <div className="jammed_app">
        <React.Fragment>
            <Router>
                <NavigationBar />
                <Switch>
                    <Route path="/static" component={StaticPage} />
                    <Route path="/transport" component={TransportPage} />
                    <Redirect path="*" to="/transport"/>
                </Switch>
            </Router>
        </React.Fragment>
    </div>,
    document.getElementById("jammed")
)
