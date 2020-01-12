import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis } from 'recharts';

import request from "../../services/request";
import { ChartTitle, ChartLoader, ChartError, ChartCell, ChartLastValue } from "../chart";
import { formatTimestamp } from "../../services/utils";


export default class ScatterTile extends React.Component {

    state = {
        data: [],
        loading: true,
        error: false,
        timestamp: null,
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
        const { url, route_name, field } = this.props;
        request.get(url, { route_name, field, delta: this.delta })
            .then(response => {
                const { coordinates, timestamp } = response.data;
                this.setState({
                    'loading': false,
                    'error': false,
                    'data': coordinates,
                    'timestamp': formatTimestamp(timestamp)
                });
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            })
    };

    toggleHide = () => {
        this.setState(prev => ({ hide: !prev.hide }))
    };

    render() {
        const { error, loading, data, timestamp, hide } = this.state;
        if (error) return <ChartError text="Data could not be loaded." icon="error"/>;
        if (loading) return <ChartLoader text="Loading data..." />;
        if (!data.length) return <ChartError text="No data points." icon="warning"/>;

        return (
            <div onMouseEnter={this.toggleHide} onMouseLeave={this.toggleHide}>
                <ChartCell>
                    <ChartTitle title={this.props.id}/>
                    {!hide && <ChartLastValue value={timestamp} />}
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
