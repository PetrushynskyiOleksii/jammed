import React, {Component} from 'react';
import {PieChart, Pie, Label, Tooltip, Legend} from 'recharts';

import {dataTypes} from '../../../services/mappings';


const colors = ['#232440', '#8596A7', '#A7CCCC'];
const angles = {'startAngle': 90, 'endAngle': 450};
const radiuses = [
    {'innerRadius': 80, 'outerRadius': 160},
    {'innerRadius': 170, 'outerRadius': 200},
    {'innerRadius': 210, 'outerRadius': 230}
];


const renderTooltip = ({active, payload}) => {
    if (active) {
        const {name, value, dataType} = payload[0].payload;
        return (
            <div className="tooltip">
                <p><small>{name}</small></p>
                <p><strong>{value}</strong></p>
            </div>
        );
    }
};

const renderTitle = (props) => {
    const {cx, cy} = props.viewBox;
    const title = props.title.split(' ');
    return (
        <g>
            <text className='pie-title' x={cx} y={cy - 5}>
                {title[0]}
            </text>
            <text className='pie-title' x={cx} y={cy + 25}>
                {title[1]}
            </text>
        </g>
    );
};


class TransportsPie extends Component {

    title = 'Transport Counts';
    legend = [
        {value: 'Per Routes', type: 'rect', color: colors[0]},
        {value: 'Per Transport Type', type: 'rect', color: colors[1]},
        {value: 'Per Agencies', type: 'rect', color: colors[2]},
    ];

    render() {
        const {transports} = this.props;
        const per_routes = transports['transport_per_routes'].data;
        const per_agencies = transports['transport_per_agencies'].data;
        const per_transport_type = transports['transport_per_transport_type'].data;

        return (
            <PieChart width={700} height={600} margin={{'left': 100}}>
                <Pie data={per_routes}
                     fill={colors[0]}
                     {...radiuses[0]}
                     {...angles}
                     animationBegin={250}>
                    <Label content={renderTitle} position='center' title={this.title}/>
                </Pie>
                <Pie data={per_transport_type}
                     fill={colors[1]}
                     {...radiuses[1]}
                     {...angles}
                     animationBegin={500}/>
                <Pie data={per_agencies}
                     fill={colors[2]}
                     {...radiuses[2]}
                     {...angles}
                     animationBegin={750}/>
                <Tooltip content={renderTooltip}/>
                <Legend layout="vertical" verticalAlign="middle" align="right" payload={this.legend}/>
            </PieChart>
        );
    }
}

class StopsPie extends Component {

    title = 'Transport Stops';
    legend = [
        {value: 'Per Routes', type: 'rect', color: colors[0]},
        {value: 'Per Regions', type: 'rect', color: colors[1]},
    ];

    render() {
        const {stops} = this.props;
        const per_routes = stops['stops_per_routes'].data;
        const per_regions = stops['stops_per_regions'].data;

        return (
            <PieChart width={600} height={600} margin={{'left': 100}}>
                <Pie data={per_routes}
                     fill={colors[0]}
                     {...radiuses[0]}
                     {...angles}
                     animationBegin={750}>
                    <Label content={renderTitle} position='center' title={this.title}/>
                </Pie>
                <Pie data={per_regions}
                     fill={colors[1]}
                     {...radiuses[1]}
                     {...angles}
                     animationBegin={1000}/>

                <Tooltip content={renderTooltip}/>
                <Legend layout="vertical" verticalAlign="middle" align="right" payload={this.legend}/>
            </PieChart>
        );
    }
}

export {TransportsPie, StopsPie};
