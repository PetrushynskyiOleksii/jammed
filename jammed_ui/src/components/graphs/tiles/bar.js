import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

import renderLoader from "../utils/preloader";
import renderError from "../utils/error";
import request from "../../../services/request";


export default class BarTile extends Component {
    state = {
        loading: true,
        error: false,
        data: []
    };

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        const { url, id, limit } = this.props;
        request.get(url, { id, limit })
            .then(response => {
                this.setState({
                    'loading': false,
                    'error': false,
                    'data': response.data
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
    };

    render() {
        if (this.state.error) return renderError("Data could not be loaded.");
        if (this.state.loading) return renderLoader("Loading data...");

        const title = this.props.id.replace(/_/g, ' ');
        return (
            <div className="chart-cell">
                <div className="chart-title">{title}</div>
                <BarChart width={400} height={275} data={this.state.data}>
                    <XAxis stroke="#c6c6c6" dataKey="id" />
                    <YAxis stroke="#c6c6c6" />
                    <Bar dataKey="value" fill="#d3864d" opacity={0.5} />
                </BarChart>
            </div>
        )
    }
}
