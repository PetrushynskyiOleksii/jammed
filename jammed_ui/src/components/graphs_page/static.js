import React, {Component} from "react";

import {TransportsPie, StopsPie} from "./graphs/pie";
import request from '../../services/request'
import PreLoader from '../preloader'


const url = '/graphs/static?data_limit=15';


class StaticGraphs extends Component {

    state = {
        'loading': true,
        'stops': null,
        'transports': null,
    };

    componentDidMount() {
        this.getGraphsData();
    };

    getGraphsData = () => {
        request.get(url)
            .then(response => {
                let stops = {};
                let transports = {};

                response.data.forEach(item => {
                    if (item.id.startsWith('stop')) stops[item.id] = item;
                    else if (item.id.startsWith('transport')) transports[item.id] = item;
                });

                this.setState({
                    'loading': false,
                    'stops': stops,
                    'transports': transports
                });
            })
    };

    render() {
        const {transports, stops} = this.state;

        if (this.state.loading) return (
            <div className='preloader'><PreLoader/></div>
        );

        return (
            <div className='charts-container'>
                <TransportsPie transports={transports}/>
                <StopsPie stops={stops}/>
            </div>
        )
    }
}

export default StaticGraphs;
