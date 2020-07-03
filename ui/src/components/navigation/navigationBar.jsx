import React from "react"

import NavigationButton from "./navigationButton"
import "./navigation.sass"


export default class NavigationBar extends React.PureComponent {
    render() {
        return (
            <div className="nav-bar">
                <NavigationButton label="regions" to="/regions" />
                <NavigationButton label="transport" to="/transport" />
                <NavigationButton label="traffic" to="/traffic" />
            </div>
        )
    }
}
