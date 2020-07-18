import React from "react"

export default class SearchTransport extends React.PureComponent {
    render() {
        const { transports, currentRoute, setRouteName } = this.props
        return (
            <>
                {transports.map(item =>
                    <div key={item.route_type} className="search-transport-wrapper">
                        <div className="search-transport-title">
                            {item.route_type}
                        </div>
                        <div className="search-transport-container">
                            {item.route_names.map(name =>
                                <div key={name}
                                    className={currentRoute !== name ?
                                        "search-transport":
                                        "search-transport search-transport-active"
                                    }
                                    data-name={name}
                                    onClick={() => {setRouteName(name)}}>
                                    {name}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        )
    }
}
