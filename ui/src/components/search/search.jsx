import React from "react"

import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"

import SearchPeriod from "@components/search/searchPeriod"
import SearchTransport from "@components/search/searchTransport"
import SearchError from "@components/search/searchError"
import { TIMESERIES_PATH, ROUTE_KEY, PERIOD_KEY } from "@utils/constants"
import request from "@utils/request"
import "./search.sass"


export default class SearchDialog extends React.Component {

    state = {
        loading: false,
        error: false,
        currentRoute: localStorage.getItem(ROUTE_KEY),
        period: localStorage.getItem(PERIOD_KEY) || 1,
        data: []
    }

    setRouteName = (currentRoute) => {
        const { period } = this.state

        this.setState({ currentRoute })
        localStorage.setItem(ROUTE_KEY, currentRoute)
        localStorage.setItem(PERIOD_KEY, period)

        this.props.submit(currentRoute, period)
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
        const { open, close } = this.props
        const { data, currentRoute, period } = this.state
        if (!data.length) return (
            <Dialog open={open} onClose={close}>
                <DialogContent className="search-dialog">
                    <SearchError />
                </DialogContent>
            </Dialog>
        )
        return (
            <Dialog open={open} onClose={close}>
                <DialogContent className="search-dialog">
                    <SearchPeriod period={period} setPeriod={this.setPeriod}/>
                    <SearchTransport
                        transports={data}
                        currentRoute={currentRoute}
                        setRouteName={this.setRouteName}
                    />
                </DialogContent>
            </Dialog>
        )
    }
}
