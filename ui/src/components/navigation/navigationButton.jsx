import React from "react"
import { NavLink } from "react-router-dom"

import { TRAFFIC_ICON, TRANSPORT_ICON, REGIONS_ICON } from "@utils/constants"


const ICONS = {
    traffic: TRAFFIC_ICON,
    transport: TRANSPORT_ICON,
    regions: REGIONS_ICON
}

export default class NavigationButton extends React.PureComponent {

    render() {
        const { label, to } = this.props
        return (
            <NavLink to={to} className="nav-item" activeClassName="nav-item-active">
                {ICONS[label]}
                <div className="nav-label">{label}</div>
            </NavLink>
        )
    }
}
