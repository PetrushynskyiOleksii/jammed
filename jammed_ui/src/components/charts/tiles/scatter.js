import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis } from 'recharts';

import request from "../../services/request";
import { ChartTitle, ChartLoader, ChartError, ChartCell } from "../chart";


class ScatterTimestamp extends React.Component {

    formatTimestamp = (timestamp) => {
        const ts = new Date(1000 * timestamp);
        const hours = (ts.getHours() < 10 ? '0' : '') + ts.getHours();
        const minutes = (ts.getMinutes() < 10 ? '0' : '') + ts.getMinutes();
        return `${hours}:${minutes}`
    };

    render() {
        const { timestamp, hide } = this.props;
        if (hide) return null;

        return (
            <div className="scatter-timestamp">
                {this.formatTimestamp(timestamp)}
            </div>
        )
    }
}


export default class ScatterTile extends React.Component {

    state = {
        data: [],
        loading: true,
        error: false,
        timestamp: null,
        hideTimestamp: true
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
        const { url, route_name, field } = this.props;
        request.get(url, { route_name, field, delta: this.delta })
            .then(response => {
                const { coordinates, timestamp } = response.data;
                this.setState({
                    'loading': false,
                    'error': false,
                    'data': coordinates,
                    'timestamp': timestamp
                });
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            })
    };

    toggleTimestamp = () => {
        this.setState(prevState => ({
            hideTimestamp: !prevState.hideTimestamp
        }));
    };

    render() {
        const { error, loading, data, timestamp, hideTimestamp } = this.state;
        if (error) return <ChartError text="Data could not be loaded."/>;
        if (loading) return <ChartLoader text="Loading data..." />;
        if (!data.length) return <ChartError text="No data points." />;

        return (
            <div onMouseEnter={this.toggleTimestamp} onMouseLeave={this.toggleTimestamp}>
                <ChartCell>
                    <ChartTitle title={this.props.id}/>
                    <ScatterTimestamp timestamp={timestamp} hide={hideTimestamp} />
                    <ScatterChart width={435} height={250}>
                        <XAxis domain={['auto', 'auto']} type="number" dataKey="latitude" />
                        <YAxis domain={['auto', 'auto']} dataKey="longitude" />
                        <Scatter data={data} />
                    </ScatterChart>
                </ChartCell>
            </div>
        );
    }
}
