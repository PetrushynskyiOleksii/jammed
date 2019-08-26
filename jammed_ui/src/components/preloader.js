import React, {Component} from 'react';
import Loader from 'react-loader-spinner'

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


export default class PreLoader extends Component {
    render() {
        return (
            <Loader
                type="ThreeDots"
                color="#4B4B4B"
                height="100"
                width="100"
            />
        );
    }
}