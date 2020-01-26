import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis } from 'recharts';

import request from "../services/request";
import { getQuery } from "../services/queries"
import { formatTimestamp } from "../services/utils";
import { ChartTitle, ChartLoader, ChartError, ChartCell, ChartLastValue } from "./chart";


export default class ScatterTile extends React.Component {

    state = {
        data: [],
        timestamp: null,
        error: false,
        loading: true,
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
        const { routeName, id, url } = this.props;
        const query = getQuery(id, { routeName });

        request.get(url, { query })
            .then(response => {
                const { timestamp, value } = response.data[0];
                this.setState({
                    'data': value,
                    'timestamp': formatTimestamp(timestamp),
                    'error': false,
                    'loading': false
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
        else if (error) return <ChartError text="Data could not be loaded." icon="error"/>;
        else if (loading) return <ChartLoader text="Loading data..." />;
        else if (!data.length) return <ChartError text="No data points." icon="warning"/>;

        return (
            <ChartCell>
                <ChartTitle title={id} routeName={routeName} />
                <ChartLastValue value={timestamp} />
                <ScatterChart width={450} height={250}>
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
