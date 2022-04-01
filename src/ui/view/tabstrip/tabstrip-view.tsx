import * as React from "react"
import "./tabstrip-view.css"

export interface TabstripViewProps {
    className?: string
    theme?: "screen" | "frame" | "section"
    /** Labels of each header tab. */
    headers: string[]
    children: JSX.Element[]
    value?: number
    onChange?(value: number): void
}

export default function TabstripView(props: TabstripViewProps) {
    const { headers, children, value, onChange } = props
    const [selection, setSelection] = React.useState(
        (value ?? 0) % headers.length
    )
    const handleClick = (index: number) => {
        setSelection(index)
        if (onChange) onChange(index)
    }
    const child = props.children[selection]
    return (
        <div className={getClassNames(props)}>
            <header>
                {headers.map((item, idx) => (
                    <button
                        key={idx}
                        className={selection === idx ? "selected" : ""}
                        onClick={() => handleClick(idx)}
                    >
                        {item}
                    </button>
                ))}
                <div className="space"></div>
            </header>
            <main>
                <div className={"selected"}>{child}</div>
            </main>
        </div>
    )
}

function getClassNames(props: TabstripViewProps): string {
    const classNames = ["custom", "ui-view-TabstripView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
