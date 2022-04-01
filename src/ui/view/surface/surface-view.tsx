import * as React from "react"
import { ColorName } from "../types"
import "./surface-view.css"

export interface SurfaceViewProps {
    className?: string
    color?: ColorName
    children:
        | string
        | boolean
        | null
        | JSX.Element
        | Array<string | boolean | null | JSX.Element>
}

export default function SurfaceView(props: SurfaceViewProps) {
    return <div className={getClassNames(props)}>{props.children}</div>
}

function getClassNames(props: SurfaceViewProps): string {
    const classNames = [
        "custom",
        "ui-view-SurfaceView",
        `theme-color-${props.color ?? "frame"}`,
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
