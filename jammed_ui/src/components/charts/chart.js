import React from 'react';
import Loader from 'react-loader-spinner'
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning'
import BlockIcon from '@material-ui/icons/Block';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './chart.css';


export class ChartContainer extends React.Component {
    disableContextMenu = (e) => {
        // e.preventDefault();
    };

    render() {
        return (
            <div className="chart-container"
                 onContextMenu={this.disableContextMenu}>
                {this.props.children}
            </div>
        );
    }
}

export class ChartTitle extends React.Component {
    render() {
        const { title, routeName } = this.props;
        const formattedTitle = title.replace(/_/g, ' ')
        return (
            <div className="chart-title">
                {formattedTitle}{routeName && " / "}
                <span className="chart-route-title">
                    {this.props.routeName}
                </span>
            </div>
        );
    }
}

export class ChartCell extends React.Component {
    render() {
        return (
            <div className="chart-cell">
                {this.props.children}
            </div>
        );
    }
}

export class ChartLoader extends React.Component {
    render() {
        return (
            <ChartCell>
                <div className="chart-text">{this.props.text}</div>
                <Loader
                    type="ThreeDots"
                    color="#767676"
                    height={30}
                />
            </ChartCell>
        )
    }
}

export class ChartError extends React.Component{
    icons = {
        error: <ErrorIcon />,
        warning: <WarningIcon />,
        empty: <BlockIcon />
    };
    render() {
        const { icon, text } = this.props
        return (
            <ChartCell>
                <div className="chart-text">{text}</div>
                {this.icons[icon]}
            </ChartCell>
        )
    }
}

export class ChartLastValue extends React.Component{
    render() {
        return (
            <div className="chart-last-value">
                {this.props.value}
            </div>
        )
    }
}
