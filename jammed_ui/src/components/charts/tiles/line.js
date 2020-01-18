import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import request from "../../services/request";
import { formatTimestamp } from "../../services/utils";
import { ChartTitle, ChartLoader, ChartError, ChartCell, ChartLastValue } from "../chart";

import './tiles.css';


export default class LineTile extends React.Component {

    state = {
        data: [],
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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.routeName !== this.props.routeName) {
            this.queryData();
        }
    }

    queryData = () => {
        const { url, routeName, id } = this.props;
        if (!routeName) return;

        request.get(url, { route_name: routeName, units: id })
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

    getLastValue = () => {
        const lastValue = this.state.data.slice(-1)[0][this.props.id];
        return Math.round(lastValue * 100) / 100
    };

    render() {
        const { error, loading, data } = this.state;
        const { id, routeName } = this.props;

        if (!routeName) return <ChartError text="No route chosen." icon="empty"/>;
        if (error) return <ChartError text="Data could not be loaded." icon="error"/>;
        if (loading) return <ChartLoader text="Loading data..." />;
        if (!data.length) return <ChartError text="No data points." icon="warning"/>;

        return (
            <ChartCell>
                <ChartTitle title={id} routeName={routeName} />
                <ChartLastValue value={this.getLastValue()} />
                <LineChart width={435} height={250} data={data} >
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
                          dataKey={id}
                    />
                </LineChart>
            </ChartCell>
        )
    }
}
