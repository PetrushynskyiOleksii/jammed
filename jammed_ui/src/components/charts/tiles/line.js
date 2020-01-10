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
    };

    queryData = () => {
        const { delta } = this.state;
        const { url, route_name, id } = this.props;
        const units = [id, "timestamp"];
        request.get(url, { route_name, delta, units })
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
        if (this.state.error) return <ChartError text="Data could not be loaded."/>;
        if (this.state.loading) return <ChartLoader text="Loading data..." />;

        return (
            <ChartCell>
                <ChartTitle title={this.props.id}/>
                <LineChart width={435} height={275} data={this.state.data} >
                    <XAxis interval={3} dataKey="timestamp" tickFormatter={this.formatTicks}/>
                    <YAxis domain={['auto', 'auto']}/>
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

