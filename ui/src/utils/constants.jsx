import React from "react"

import LocationCityIcon from "@material-ui/icons/LocationCity"
import TrafficIcon from "@material-ui/icons/Traffic"
import DirectionsBusIcon from "@material-ui/icons/DirectionsBus"
import SearchIcon from "@material-ui/icons/Search"
import ErrorIcon from "@material-ui/icons/Error"
import WarningIcon from "@material-ui/icons/Warning"
import BlockIcon from "@material-ui/icons/Block"


// ICONS
export const ERROR_ICON = <ErrorIcon />
export const WARNING_ICON = <WarningIcon />
export const EMPTY_ICON = <BlockIcon />
export const TRANSPORT_ICON = <DirectionsBusIcon />
export const TRAFFIC_ICON = <TrafficIcon />
export const SEARCH_ICON = <SearchIcon />
export const REGIONS_ICON = <LocationCityIcon />

// COLORS
export const YELLOW_COLOR = "#EBC673"
export const BLACK_COLOR = "#1A1A1A"
export const BLACK_LIGHT_COLOR = "#282828"
export const GREY_COLOR = "#C6C6C6"
export const GREY_DARK_COLOR = "#8d8c8c"
export const WHITE_COLOR = "#FFFFFF"
export const BLUE_COLOR = "#6AD1F1"
export const GREEN_COLOR = "#A8F14C"
export const RED_COLOR = "#EC5353"
export const RED_YELLOW_GRADIENT = [
    "#EBC673",
    "#EBB96F",
    "#EBAC6B",
    "#EB9F68",
    "#EB9264",
    "#EB8661",
    "#EB795D",
    "#EB6C5A",
    "#EB5F56",
    "#EC5353"
]

// CHART STUFF
export const CHART_WIDTH = 300
export const CHART_HEIGHT = 250
export const CHART_ANIMATION = 1500

// ENDPOINTS PATHS
export const TIMESERIES_PATH = "/traffic"
export const CONGESTION_PATH = "/traffic/congestion"
export const ROUTES_PATH = "/transport"

// LOCAL STORAGE
export const ROUTE_KEY = "route"
export const PERIOD_KEY = "period"

// TIME
export const HOUR_SECONDS = 3600

// THEMES
export const GREEN_THEME = "green"
export const BLUE_THEME = "blue"
export const YELLOW_THEME = "yellow"
