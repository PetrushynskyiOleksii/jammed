import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

import renderLoader from "../utils/preloader";
import renderError from "../utils/error";
import request from "../../../services/request";


export default class BarTile extends Component {
    state = {
        data: [],
        loading: true,
        error: false,
        limit: 10,
        skip: 0,
        count: 0,
    };

    componentDidMount() {
        this.queryCount();
        this.queryData();
    }

    queryCount = () => {
        const { url, id } = this.props;
        request.get(url + '/count', { id })
            .then(response => {
                this.setState({
                    'count': response.data.count
                });
            })
    };

    queryData = () => {
        const { url, id } = this.props;
        const { skip, limit } = this.state;
        request.get(url, { id, limit, skip })
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

    nextPage = () => {
        const { limit, skip, count } = this.state;
        if (skip + limit >= count) return;
        this.setState({
            skip: skip + limit
        }, this.queryData);
    };

    prevPage = () => {
        const {limit, skip} = this.state;
        if (!skip) return;
        this.setState({
            skip: Math.max(skip - limit, 0)
        }, this.queryData);
    };

    render() {
        if (this.state.error) return renderError("Data could not be loaded.");
        if (this.state.loading) return renderLoader("Loading data...");

        const title = this.props.id.replace(/_/g, ' ');
        return (
            <div className="chart-cell"
                onClick={this.nextPage}
                onContextMenu={this.prevPage}>
                <div className="chart-title">{title}</div>
                <BarChart width={400} height={275} data={this.state.data}>
                    <XAxis interval={0} stroke="#c6c6c6" dataKey="id" />
                    <YAxis stroke="#c6c6c6" />
                    <Bar dataKey="value" fill="#d3864d" opacity={0.5} />
                </BarChart>
            </div>
        )
    }
}
