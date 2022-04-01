import * as React from "react"
import Label from "../label"
import "./progress.css"

interface IProgressProps {
    className?: string
    label?: string
    wide?: boolean
    height?: string | number
    value: number
    visible?: boolean
}

const HUNDRED = 100

export default function Progress(props: IProgressProps) {
    const { label, wide, height, visible } = props
    if (visible === false) return null

    const classes = [
        'custom', 'ui-view-Progress',
        props.className ?? ""
    ]
    if (wide === true) {
        classes.push('wide')
    }
    const value = clamp(props.value ?? 0)
    const percent = value * HUNDRED

    return (<div className={classes.join(' ')}>
        <Label value={label} />
        <div className="bar theme-color-screen" style={{
            height: height ?? "1em"
        }}>
            <div style={{
                transform: `translateX(${percent - HUNDRED}%)`
            }}>{percent}</div>
        </div>
    </div>)
}

function clamp(value: number): number {
    if (value < 0) return 0
    if (value > 1) return 1
    return value
}
