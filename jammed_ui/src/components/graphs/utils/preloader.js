import React from 'react';
import Loader from 'react-loader-spinner'

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


export default function renderLoader(text) {
    return (
        <div className="chart-cell">
            <div className="chart-text">
                {text}
            </div>
            <Loader
                type="ThreeDots"
                color="#767676"
                height={30}
            />
        </div>
    )
}
