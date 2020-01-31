import React from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

import request from "../../services/request";
import { ChartTitle, ChartLoader, ChartError, ChartCell } from "./chart";

import './tiles.css';


class BarTile extends React.PureComponent {
    render() {
        const { yDomain, data } = this.props;
        return (
            <BarChart width={450} height={250} data={data}>
                <XAxis dataKey="id" interval={0} />
                <YAxis domain={yDomain} />
                <Bar dataKey="value" />
            </BarChart>
        )
    }
}


export default class BarContainer extends React.Component {
    state = {
        data: [],
        limit: 10,
        skip: 0,
        count: 0,
        max: 0,
        loading: true,
        error: false,
    };

    componentDidMount() {
        this.queryCount();
        this.queryData(0);
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

    queryData = (skip) => {
        const { url, id } = this.props;
        const { limit, max } = this.state;

        request.get(url, { id, limit, skip })
            .then(response => {
                const { data } = response;
                this.setState({
                    'skip': skip,
                    'data': data,
                    'max': skip ? max: Math.ceil(data[0].value / 10) * 10,
                    'loading': false,
                    'error': false
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
            this.queryData(skip + limit);
        }
    };

    prevPage = () => {
        const { limit, skip } = this.state;
        if (skip > 0) {
            this.queryData(Math.max(skip - limit, 0))
        }
    };

    render() {
        const { error, loading, data } = this.state;
        if (error) return <ChartCell><ChartError text="Data could not be loaded." icon="error"/></ChartCell>;
        else if (loading) return <ChartCell><ChartLoader text="Loading data..." /></ChartCell>;

        return (
            <ChartCell>
                <ChartTitle title={this.props.id}/>
                <div onClick={this.nextPage} onContextMenu={this.prevPage}>
                    <BarTile yDomain={this.yDomain()} data={data} />
                </div>
            </ChartCell>
        )
    }
}
