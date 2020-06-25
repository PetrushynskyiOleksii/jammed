import React from "react"

import SearchIcon from "@material-ui/icons/Search"
import ErrorIcon from "@material-ui/icons/Error"
import WarningIcon from "@material-ui/icons/Warning"
import BlockIcon from "@material-ui/icons/Block"
import TrendingUpIcon from "@material-ui/icons/TrendingUp"
import BarChartOutlinedIcon from "@material-ui/icons/BarChartOutlined"


// ICONS
export const ERROR_ICON = <ErrorIcon />
export const WARNING_ICON = <WarningIcon />
export const EMPTY_ICON = <BlockIcon />
export const STATIC_ICON = <BarChartOutlinedIcon />
export const TRANSPORT_ICON = <TrendingUpIcon />
export const SEARCH_ICON = <SearchIcon />

// COLORS
export const YELLOW_COLOR = "#EBC673"
export const BLACK_COLOR = "#1A1A1A"
export const BLACK_LIGHT_COLOR = "#282828"
export const GREY_COLOR = "#C6C6C6"
export const GREY_DARK_COLOR = "#8d8c8c"
export const WHITE_COLOR = "#FFFFFF"
export const BLUE_COLOR = "#6AD1F1"
export const GREEN_COLOR = "#A8F14C"

// CHART STUFF
export const CHART_WIDTH = 300
export const CHART_HEIGHT = 250
export const CHART_ANIMATION = 1500

// ENDPOINTS PATHS
export const TIMESERIES_PATH = "/timeseries"
export const ROUTES_PATH = "/routes"

// LOCAL STORAGE
export const ROUTE_KEY = "route"
export const PERIOD_KEY = "period"

// TIME
export const HOUR_SECONDS = 3600

// THEMES
export const GREEN_THEME = "green"
export const BLUE_THEME = "blue"
