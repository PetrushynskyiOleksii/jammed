import React from 'react';
import {
    RadarChart, PolarGrid, PolarRadiusAxis, PolarAngleAxis, Radar
} from 'recharts';

import request from "../../services/request";
import { ChartTitle, ChartLoader, ChartError, ChartCell } from "../chart";

import './tiles.css';


export default class RadarTile extends React.Component {
    state = {
        loading: true,
        error: false,
        data: []
    };

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        const { url, id } = this.props;
        request.get(url, { id })
            .then(response => {
                this.setState({
                    'loading': false,
                    'error': false,
                    'data': response.data
                });
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            })
    };

    render() {
        if (this.state.error) return <ChartError text="Data could not be loaded." icon="error"/>;
        if (this.state.loading) return <ChartLoader text="Loading data..." />;

        return (
            <ChartCell>
                <ChartTitle title={this.props.id}/>
                <RadarChart width={500} height={275} data={this.state.data}>
                    <PolarGrid />
                    <PolarRadiusAxis />
                    <PolarAngleAxis dataKey="id"/>
                    <Radar dataKey="value" />
                </RadarChart>
            </ChartCell>
        )
    }
}
