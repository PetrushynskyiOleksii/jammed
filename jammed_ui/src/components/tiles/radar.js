import React from 'react';
import {
    RadarChart, PolarGrid, PolarRadiusAxis, PolarAngleAxis, Radar
} from 'recharts';

import request from "../../services/request";
import { ChartTitle, ChartLoader, ChartError, ChartCell } from "./chart";

import './tiles.css';


class RadarTile extends React.PureComponent {
    render() {
        return (
            <RadarChart width={450} height={250} data={this.props.data}>
                <PolarGrid />
                <PolarRadiusAxis />
                <PolarAngleAxis dataKey="id"/>
                <Radar dataKey="value" />
            </RadarChart>
        )
    }
}

export default class RadarContainer extends React.Component {

    state = {
        data: [],
        loading: true,
        error: false
    };

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        const { url, id } = this.props;

        request.get(url, { id })
            .then(response => {
                this.setState({
                    'data': response.data,
                    'loading': false,
                    'error': false
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
    };

    render() {
        const { error, loading, data } = this.state;
        if (error) return <ChartCell><ChartError text="Data could not be loaded." icon="error"/></ChartCell>;
        else if (loading) return <ChartCell><ChartLoader text="Loading data..." /></ChartCell>;
        else return (
            <ChartCell>
                <ChartTitle title={this.props.id}/>
                <RadarTile data={data}/>
            </ChartCell>
        )
    }
}
