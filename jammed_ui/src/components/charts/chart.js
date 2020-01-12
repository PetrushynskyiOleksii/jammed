import React from 'react';
import Loader from 'react-loader-spinner'
import ErrorIcon from '@material-ui/icons/Error';

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
    formatTitle = () => {
        return this.props.title.replace(/_/g, ' ')
    };

    render() {
        return (
            <div className="chart-title">{this.formatTitle()}</div>
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
    render() {
        return (
            <ChartCell>
                <div className="chart-text">{this.props.text}</div>
                <ErrorIcon className="icon"/>
            </ChartCell>
        )
    }
}
