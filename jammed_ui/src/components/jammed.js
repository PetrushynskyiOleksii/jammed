import React, {Component} from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'

import StaticGraphs from './graphs_page/static'
import './jammed.css';


class Jammed extends Component {

    state = {value: 0};

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {value} = this.state;

        return (
            <div>
                <div>
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        centered>
                        <Tab label="Static Graphs"/>
                        <Tab label="Dynamic Graphs"/>
                    </Tabs>
                </div>
                <div>
                    {value === 0 && <StaticGraphs/>}
                    {value === 1 && <div>Dynamic Test Page</div>}
                </div>
            </div>
        );
    }
}

export default Jammed;
