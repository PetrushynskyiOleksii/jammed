import React from "react"
import { NavLink } from "react-router-dom"

import { ICONS } from "../../utils/constants"

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
