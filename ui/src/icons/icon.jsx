import React from "react"

import icons from "@icons/iconsMap"


export default class Icon extends React.PureComponent {
    render() {
        const { name, className, size } = this.props
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                width={size}
                height={size}
                viewBox="0 0 24 24"
            >
                {icons[name]}
            </svg>
        )
    }
}
