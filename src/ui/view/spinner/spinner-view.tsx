import * as React from "react"
import Icon from "../icon"
import "./spinner-view.css"

export interface SpinnerViewProps {
    className?: string
    label?: string
}

export default function SpinnerView(props: SpinnerViewProps) {
    return (
        <div className={getClassNames(props)}>
            <Icon name="gear" className="spin" />
            {props.label && <div className="label">{props.label}</div>}
        </div>
    )
}

function getClassNames(props: SpinnerViewProps): string {
    const classNames = ["custom", "ui-view-SpinnerView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
