import React from "react"

import Slider from "@material-ui/core/Slider"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"

import { TIMESERIES_PATH, ROUTE_KEY, PERIOD_KEY } from "@utils/constants"
import request from "@utils/request"
import "./search.sass"


export default class SearchDialog extends React.Component {

    state = {
        loading: false,
        error: false,
        route: localStorage.getItem(ROUTE_KEY),
        period: localStorage.getItem(PERIOD_KEY),
        data: []
    }

    setRouteName = (route) => {
        const { period } = this.state

        this.setState({ route })
        localStorage.setItem(ROUTE_KEY, route)
        localStorage.setItem(PERIOD_KEY, period)

        this.props.submit(route, period)
    };

    setPeriod = (event, period) => {
        this.setState({ period })
    };

    componentDidMount() {
        this.queryData()
    }

    queryData = () => {
        this.setState({ loading: true })
        const endpoint_path = `${TIMESERIES_PATH}/routes`
        request.get(endpoint_path)
            .then(response => {
                this.setState({
                    data: response.data.result,
                    loading: false,
                    error: false,
                })
            })
            .catch(() => {
                this.setState({
                    error: true
                })
            })
    }

    render() {
        const { open } = this.props
        const { data, route, period } = this.state
        return (
            <Dialog open={open}>
                <DialogContent className="search-dialog">
                    <div className="search-period">
                        <div className="search-period-title">
                            Period:
                            <span className="search-period-value">
                                {period}h
                            </span>
                        </div>
                        <div className="search-period-slider">
                            <Slider
                                value={parseInt(period)}
                                onChange={this.setPeriod}
                                aria-labelledby="discrete-slider"
                                valueLabelDisplay="off"
                                min={1}
                                max={24}
                            />
                        </div>
                    </div>
                    {data.map(item =>
                        <div key={item.route_type} className="search-transport-wrapper">
                            <div className="search-transport-title">
                                {item.route_type}
                            </div>
                            <div className="search-transport-container">
                                {item.route_names.map(name =>
                                    <div key={name}
                                        className={route !== name ?
                                            "search-transport":
                                            "search-transport search-transport-active"
                                        }
                                        data-name={name}
                                        onClick={() => {this.setRouteName(name)}}>
                                        {name}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
}
