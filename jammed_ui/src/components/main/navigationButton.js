import React from "react";
import { Link } from "react-router-dom";

import { ICONS } from "../../services/constants"

export default class NavigationButton extends React.Component {

    render() {
        const { active, label, onClick } = this.props;
        return (
            <Link to={"/" + label} onClick={() => onClick(label)}>
                <div className={active !== label ? "nav-button": "nav-button-active"} >
                    {ICONS[label]}
                    <div className="nav-label">{label}</div>
                </div>
            </Link>
        )
    }
}
