import React from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

import request from "../../services/request";
import { ChartTitle, ChartLoader, ChartError, ChartCell } from "../chart";

import './tiles.css';


export default class BarTile extends React.Component {
    state = {
        data: [],
        loading: true,
        error: false,
        limit: 10,
        skip: 0,
        count: 0,
        max: 0,
    };

    componentDidMount() {
        this.queryCount();
        this.queryData();
    }

    yDomain() {
        return [0, this.state.max]
    };

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
        const { skip, limit, max } = this.state;
        request.get(url, { id, limit, skip })
            .then(response => {
                const { data } = response;
                this.setState({
                    'loading': false,
                    'error': false,
                    'data': data,
                    'max': skip ? max: Math.ceil(data[0].value / 10) * 10
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
        if (skip + limit < count) {
            this.setState({
                skip: skip + limit
            }, this.queryData);
        }
    };

    prevPage = () => {
        const { limit, skip } = this.state;
        if (skip > 0) {
            this.setState({
                skip: Math.max(skip - limit, 0)
            }, this.queryData);
        }
    };

    render() {
        if (this.state.error) return <ChartError text="Data could not be loaded."/>;
        if (this.state.loading) return <ChartLoader text="Loading data..." />;

        return (
            <ChartCell>
                <ChartTitle title={this.props.id}/>
                <div onClick={this.nextPage} onContextMenu={this.prevPage}>
                    <BarChart width={400} height={275} data={this.state.data}>
                        <XAxis dataKey="id" interval={0} />
                        <YAxis domain={this.yDomain()} />
                        <Bar dataKey="value" />
                    </BarChart>
                </div>
            </ChartCell>
        )
    }
}
