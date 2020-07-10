import React from "react"

import SearchDialog from "@components/search/search"
import ChartsContainer from "@components/common/chartsContainer"
import AreaNumber from "@components/tiles/areaNumber/areaNumber"
import ScatterTime from "@components/tiles/scatterTime/scatterTime"

import Icon from "@icons/icon"
import { BIG_ICON_SIZE, ROUTE_KEY, PERIOD_KEY, HOUR_SECONDS, BLUE_THEME as theme } from "@utils/constants"


export default class TrafficPage extends React.PureComponent {

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
            <div id="traffic-page">
                <ChartsContainer>
                    <AreaNumber
                        theme={theme}
                        period={periodSeconds}
                        route={route}
                        path="trips_count"
                        title="trips count"
                    />
                    <AreaNumber
                        theme={theme}
                        period={periodSeconds}
                        route={route}
                        path="avg_speed"
                        title="avg speed"
                    />
                    <AreaNumber
                        theme={theme}
                        period={periodSeconds}
                        route={route}
                        path="avg_distance"
                        title="avg distance"
                    />
                    <ScatterTime
                        theme={theme}
                        period={periodSeconds}
                        route={route}
                        path="coordinates"
                        title="coordinates"
                    />
                </ChartsContainer>
                <div className="search-button" onClick={this.openSearch}>
                    <Icon name="search-icon" className="search-icon" size={BIG_ICON_SIZE}/>
                </div>
                <SearchDialog
                    open={searchOpened}
                    submit={this.submit}
                />
            </div>
        )
    }
}
