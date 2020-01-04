import React, { Component } from 'react';
import {
    RadarChart, PolarGrid, PolarRadiusAxis, PolarAngleAxis, Radar
} from 'recharts';

import renderLoader from "../utils/preloader";
import renderError from "../utils/error";
import request from "../../../services/request";


export default class RadarTile extends Component {
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
        if (this.state.error) return renderError("Data could not be loaded.");
        if (this.state.loading) return renderLoader("Loading data...");

        const title = this.props.id.replace(/_/g, ' ');
        return (
            <div className="chart-cell ">
                <div className="chart-title">{title}</div>
                <RadarChart width={500} height={275} data={this.state.data}>
                    <PolarGrid />
                    <PolarRadiusAxis />
                    <PolarAngleAxis stroke="#c6c6c6" dataKey="id"/>
                    <Radar dataKey="value" fill="#d3864d" fillOpacity={0.5}/>
                </RadarChart>
            </div>
        )
    }
}
