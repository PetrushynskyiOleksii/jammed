import React from "react"

import ChartsContainer from "@components/chart/chartsContainer"
import AreaContainer from "@components/tiles/area/areaContainer"
import ScatterContainer from "@components/tiles/scatter/scatterContainer"
import SearchDialog from "@components/search/search"
import { SEARCH_ICON, ROUTE_KEY, PERIOD_KEY, HOUR_SECONDS } from "@utils/constants"

import "./pages.sass"


export default class TransportCharts extends React.PureComponent {

    state = {
        searchOpened: false,
        route: localStorage.getItem(ROUTE_KEY),
        period: localStorage.getItem(PERIOD_KEY) || 1
    }

    openSearch = () => {
        this.setState({ searchOpened: true })
    }

    submit = (route, period) => {
        this.setState({
            route,
            period,
            searchOpened: false,
        })
    };

    render() {
        const { route, period, searchOpened } = this.state

        const periodSeconds = parseInt(period) * HOUR_SECONDS
        return (
            <div id="transport-page">
                <ChartsContainer>
                    <AreaContainer
                        period={periodSeconds}
                        route={route}
                        path="trips_count"
                        title="trips count"
                    />
                    <AreaContainer
                        period={periodSeconds}
                        route={route}
                        path="avg_speed"
                        title="avg speed"
                    />
                    <AreaContainer
                        period={periodSeconds}
                        route={route}
                        path="avg_distance"
                        title="avg distance"
                    />
                    <ScatterContainer
                        period={periodSeconds}
                        route={route}
                        path="coordinates"
                        title="coordinates"
                    />
                </ChartsContainer>
                <div className="search-button" onClick={this.openSearch}>
                    { SEARCH_ICON }
                </div>
                <SearchDialog
                    open={searchOpened}
                    submit={this.submit}
                />
            </div>
        )
    }
}
