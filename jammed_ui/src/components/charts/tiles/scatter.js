import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis } from 'recharts';

import request from "../../services/request";
import { ChartTitle, ChartLoader, ChartError, ChartCell } from "../chart";


export default class ScatterTile extends React.Component {
    state = {
        data: [],
        loading: true,
        error: false,
        timestamp: null,
    };

    componentDidMount() {
        this.queryData();
    };


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

    render() {
        const { error, loading, data } = this.state;
        if (error) return <ChartError text="Data could not be loaded."/>;
        if (loading) return <ChartLoader text="Loading data..." />;
        if (!data.length) return <ChartError text="No data points." />;

        return (
            <ChartCell>
                <ChartTitle title={this.props.id}/>
                <ScatterChart width={435} height={250}>
                    <XAxis domain={['auto', 'auto']} type="number" dataKey="latitude" />
                    <YAxis domain={['auto', 'auto']} dataKey="longitude" />
                    <Scatter data={data} />
                </ScatterChart>
            </ChartCell>
        );
    }
}
