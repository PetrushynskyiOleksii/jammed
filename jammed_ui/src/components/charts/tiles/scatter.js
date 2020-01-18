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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.routeName !== this.props.routeName) {
            this.queryData();
        }
    }

    queryData = () => {
        const { url, routeName, field } = this.props;
        if (!routeName) return;

        request.get(url, { route_name: routeName, field })
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

    formatTicks = (tick) => {
        return tick.toFixed(3);
    };

    render() {
        const { error, loading, data, timestamp } = this.state;
        const { id, routeName } = this.props;

        if (!routeName) return <ChartError text="No route chosen." icon="empty"/>;
        if (error) return <ChartError text="Data could not be loaded." icon="error"/>;
        if (loading) return <ChartLoader text="Loading data..." />;
        if (!data.length) return <ChartError text="No data points." icon="warning"/>;

        return (
            <ChartCell>
                <ChartTitle title={`${id} / ${routeName}`}/>
                <ChartLastValue value={timestamp} />
                <ScatterChart width={435} height={250}>
                    <XAxis type="number"
                           dataKey="latitude"
                           domain={['auto', 'auto']}
                           tickFormatter={this.formatTicks}
                    />
                    <YAxis domain={['auto', 'auto']}
                           dataKey="longitude"
                            tickFormatter={this.formatTicks}
                    />
                    <Scatter data={data} />
                </ScatterChart>
            </ChartCell>
        );
    }
}
