import React from "react"

import ChartsContainer from "@components/common/chartsContainer"
import DonutHistory from "@components/tiles/donutHistory/donutHistory"

import { YELLOW_THEME as theme } from "@utils/constants"


export default class RegionsPage extends React.PureComponent {

    render() {
        return (
            <div id="regions-page">
                <ChartsContainer>
                    <DonutHistory
                        theme={theme}
                        title="Галицький"
                    />
                    <DonutHistory
                        theme={theme}
                        title="Сихівський"
                    />
                    <DonutHistory
                        theme={theme}
                        title="Личаківський"
                    />
                    <DonutHistory
                        theme={theme}
                        title="Залізничний"
                    />
                    <DonutHistory
                        theme={theme}
                        title="Шевченківський"
                    />
                    <DonutHistory
                        theme={theme}
                        title="Франківський"
                    />
                </ChartsContainer>
            </div>
        )
    }
}
