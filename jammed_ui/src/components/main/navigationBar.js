import React from 'react';

import NavigationButton from "./navigationButton"
import { PATHS } from "../../services/constants"

import './navigation.css';

export default class NavigationBar extends React.Component {

    state = {
        active: null
    };

    componentDidMount() {
        const current = window.location.pathname.replace("/", "");
        this.setState({
            active: PATHS.includes(current) ? current : "static"
        })
    }

    handleChange = (label) => {
        this.setState({ active: label })
    };

    render() {
        const { active } = this.state;
        return (
            <div className="nav-bar">
                <NavigationButton label="static" active={active} onClick={this.handleChange} />
                <NavigationButton label="transport" active={active} onClick={this.handleChange} />
            </div>
        );
    }
}
