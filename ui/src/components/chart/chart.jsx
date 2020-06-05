import React from "react"

import { ICONS } from "../../utils/constants"

import "./chart.sass"
import "./chart-loader.sass"


export class ChartsContainer extends React.PureComponent {
    render() {
        return (
            <div className="charts-container">
                {this.props.children}
            </div>
        )
    }
}

export class ChartCell extends React.PureComponent {
    render() {
        return (
            <div className="chart-cell">
                {this.props.children}
            </div>
        )
    }
}

export class ChartHeader extends React.PureComponent {
    render() {
        const { title, route } = this.props
        return (
            <div className="chart-header">
                <div className="chart-title">{title}</div>
                <div className="route-name">{route}</div>
            </div>
        )
    }
}

export class ChartLoader extends React.PureComponent {
    render() {
        return (
            <div className="chart-loader">
                <div className="chart-loader-line"/>
            </div>
        )
    }
}

export class ChartMessage extends React.PureComponent {
    render() {
        const { icon, text } = this.props
        return (
            <div className="chart-message">
                <div className="chart-message-text">{text}</div>
                {ICONS[icon]}
            </div>
        )
    }
}
