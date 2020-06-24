import React from "react"
import { NavLink } from "react-router-dom"

import { TRANSPORT_ICON, STATIC_ICON } from "@utils/constants"


const ICONS = {
    transport: TRANSPORT_ICON,
    static: STATIC_ICON
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
