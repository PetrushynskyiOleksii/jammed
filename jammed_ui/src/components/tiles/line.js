import React from 'react';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

import request from "../services/request";
import { getQuery } from "../services/queries";
import { formatTimestamp } from "../services/utils";

import { ChartTitle, ChartLoader, ChartError, ChartCell, ChartLastValue } from "./chart";
import './tiles.css';

const HOUR = 3600 * 1000;

export default class LineTile extends React.Component {
    deltas = [HOUR, 3 * HOUR, 6 * HOUR, 12 * HOUR, 24 * HOUR];
    state = {
        data: [],
        loading: true,
        error: false,
        delta: 3 * HOUR
    };

    componentDidMount() {
        const { delta } = this.state;
        this.queryData(delta);
        this.interval = setInterval(() => {
            this.setState({ loading: true });
            this.queryData(delta);
        }, 300 * 1000)
    };

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.routeName !== this.props.routeName) {
            this.queryData(this.state.delta);
        }
    }

    queryData = (delta) => {
        const { id, url, routeName } = this.props;
        const query = getQuery(id, { routeName, delta });

        request.get(url, { query })
            .then(response => {
                this.setState({
                    'delta': delta,
                    'data': response.data,
                    'loading': false,
                    'error': false,
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
    };

    getLastValue = () => {
        const lastValue = this.state.data.slice(-1)[0].value;
        return Math.round(lastValue * 100) / 100
    };

    changePeriod = (e) => {
        const deltaIndex = this.deltas.indexOf(this.state.delta);
        const newDeltaIndex = e.type === "click" ? deltaIndex - 1 : deltaIndex + 1;
        const delta = this.deltas[newDeltaIndex];
        if (delta) this.queryData(delta);
    };

    render() {
        const { error, loading, data } = this.state;
        const { id, routeName } = this.props;

        if (!routeName) return <ChartError text="No route chosen." icon="empty"/>;
        else if (error) return <ChartError text="Data could not be loaded." icon="error"/>;
        else if (loading) return <ChartLoader text="Loading data..." />;
        else if (!data.length) return <ChartError text="No data points." icon="warning"/>;

        return (
            <ChartCell>
                <ChartTitle title={id} routeName={routeName} />
                <ChartLastValue value={this.getLastValue()} />
                <div onClick={this.changePeriod} onContextMenu={this.changePeriod}>
                <LineChart width={450} height={250} data={data} >
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
                          dataKey="value"
                    />
                </LineChart>
                </div>
            </ChartCell>
        )
    }
}
