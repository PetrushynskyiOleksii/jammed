import React from "react"

import ErrorIcon from "@material-ui/icons/Error"
import WarningIcon from "@material-ui/icons/Warning"
import BlockIcon from "@material-ui/icons/Block"
import TrendingUpIcon from "@material-ui/icons/TrendingUp"
import BarChartOutlinedIcon from "@material-ui/icons/BarChartOutlined"

export const ICONS = {
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    empty: <BlockIcon />,
    static: <BarChartOutlinedIcon />,
    transport: <TrendingUpIcon />
}

// COLORS
export const YELLOW = "#EBC673"
export const BLACK = "#1A1A1A"
export const BLACK_LIGHT = "#282828"
export const GREY = "#C6C6C6"
export const WHITE = "#FFFFFF"
