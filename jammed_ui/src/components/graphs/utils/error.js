import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


export default function renderError(text) {
    const style = { color: "#767676", fontSize: 40 };
    return (
        <div className="chart-cell">
            <div className="chart-text">
                {text}
            </div>
            <ErrorIcon style={style}/>
        </div>
    )
}
