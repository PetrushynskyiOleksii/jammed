import React from "react";

import ErrorIcon from "@material-ui/icons/Error";
import WarningIcon from "@material-ui/icons/Warning";
import BlockIcon from "@material-ui/icons/Block";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';

export const PATHS = ["static", "transport"];
export const ICONS = {
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    empty: <BlockIcon />,
    static: <BarChartOutlinedIcon />,
    transport: <TrendingUpIcon />
}
