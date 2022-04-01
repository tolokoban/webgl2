import * as React from "react"
import "./image-view.css"

export interface ImageViewProps {
    className?: string
    src: string
    width?: number
    height?: number
}

/**
 * A simple image that won't display anything if the image fails to load.
 * Because the default <img /> will display a "broken" glyph in case of error.
 */
export default function ImageView(props: ImageViewProps) {
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => setLoading(true), [props.src])
    return (
        <img
            className={getClassNames(props, loading)}
            src={props.src}
            width={props.width}
            height={props.height}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(true)}
        />
    )
}

function getClassNames(props: ImageViewProps, loading: boolean): string {
    const classNames = ["custom", "ui-view-ImageView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (loading === true) classNames.push("loading")

    return classNames.join(" ")
}
