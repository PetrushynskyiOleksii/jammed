import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import request from "../../services/request";
import { ChartTitle, ChartLoader, ChartError, ChartCell } from "../chart";

import './tiles.css';


export default class LineTile extends React.Component {

    state = {
        data: [],
        delta: 10800,
        loading: true,
        error: false,
    };

    componentDidMount() {
        this.queryData();
        this.interval = setInterval(() => {
            this.setState({ loading: true });
            this.queryData();
        }, 300 * 1000)
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    queryData = () => {
        const { delta } = this.state;
        const { url, route_name, id } = this.props;
        request.get(url, { route_name, delta, units: id })
            .then(response => {
                this.setState({
                    'loading': false,
                    'error': false,
                    'data': response.data,
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
    };

    formatTicks = (tick) => {
        const ts = new Date(1000 * tick);
        const hours = (ts.getHours() < 10 ? '0' : '') + ts.getHours();
        const minutes = (ts.getMinutes() < 10 ? '0' : '') + ts.getMinutes();
        return `${hours}:${minutes}`
    };

    render() {
        const { error, loading, data } = this.state;
        if (error) return <ChartError text="Data could not be loaded."/>;
        if (loading) return <ChartLoader text="Loading data..." />;
        if (!data.length) return <ChartError text="No data points." />;

        return (
            <ChartCell>
                <ChartTitle title={this.props.id}/>
                <LineChart width={435} height={250} data={this.state.data} >
                    <XAxis interval="preserveStartEnd" domain={["auto", "auto"]}
                           type="number"
                           dataKey="timestamp"
                           tickFormatter={this.formatTicks}
                           tickCount={6}
                    />
                    <YAxis domain={["auto", "auto"]}/>
                    <Line strokeWidth={1.5}
                          stroke="#d3864d"
                          type="monotone"
                          dot={false}
                          dataKey={this.props.id}
                    />
                </LineChart>
            </ChartCell>
        )
    }
}
