import React from 'react';
import { Link } from "react-router-dom";

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';

import './navigation.css';


class NavigationButton extends React.Component {

    isActive = () => {
        const { active, label } = this.props;
        return active === label ? " nav-button-active": ""
    };

    render() {
        const { label, onClick } = this.props;
        const to = "/" + label;
        return (
            <Link to={to} onClick={() => onClick(label)}>
                <div className={"nav-button" + this.isActive()} >
                    {this.props.children}
                    <div className="nav-label">{label}</div>
                </div>
            </Link>
        )
    }
}


export default class Navigation extends React.Component {

    state = {
        active: window.location.pathname.replace("/", "")
    };

    handleChange = (label) => {
        this.setState({ active: label })
    };

    render() {
        const { active } = this.state;
        return (
            <div className="nav">
                <NavigationButton label="static" active={active} onClick={this.handleChange}>
                    <BarChartOutlinedIcon className="icon"/>
                </NavigationButton>
                <NavigationButton label="transport" active={active} onClick={this.handleChange}>
                    <TrendingUpIcon className="icon"/>
                </NavigationButton>
            </div>
        );
    }
}
