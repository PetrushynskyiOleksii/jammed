import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import request from "../../services/request";
import { formatTimestamp } from "../../services/utils";
import { ChartTitle, ChartLoader, ChartError, ChartCell, ChartLastValue } from "../chart";

import './tiles.css';


export default class LineTile extends React.Component {

    state = {
        data: [],
        delta: 10800,
        loading: true,
        error: false,
        hide: true
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

    toggleHide = () => {
        this.setState(prev => ({ hide: !prev.hide }))
    };

    getLastValue = () => {
        const lastValue = this.state.data.slice(-1)[0][this.props.id];
        return Math.round(lastValue * 100) / 100
    };

    render() {
        const { error, loading, data, hide } = this.state;
        if (error) return <ChartError text="Data could not be loaded." icon="error"/>;
        if (loading) return <ChartLoader text="Loading data..." />;
        if (!data.length) return <ChartError text="No data points." icon="warning"/>;

        return (
            <div onMouseEnter={this.toggleHide} onMouseLeave={this.toggleHide}>
                <ChartCell>
                    <ChartTitle title={this.props.id} />
                    {!hide && <ChartLastValue value={this.getLastValue()} />}
                    <LineChart width={435} height={250} data={this.state.data} >
                        <XAxis interval="preserveStartEnd" domain={["auto", "auto"]}
                               type="number"
                               dataKey="timestamp"
                               tickFormatter={formatTimestamp}
                               tickCount={6}
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Line strokeWidth={1.5}
                              stroke="#d3864d"
                              type="monotone"
                              dot={false}
                              dataKey={this.props.id}
                        />
                    </LineChart>
                </ChartCell>
            </div>
        )
    }
}
