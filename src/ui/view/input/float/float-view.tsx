import * as React from "react"
import TextInput from "../text"
import "./float-view.css"


export interface FloatViewProps {
    className?: string
    value: number
    min?: number
    max?: number
    label?: string
    size?: number
    width?: string
    enabled?: boolean
    wide?: boolean
    onChange?(value: number): void
    onEnterPressed?(value: number): void
}

const RX_FLOAT = /^[+-]?([.][0-9]+|[0-9]+([.][0-9]+)?)(e[+-]?[0-9]+)?$/gi

export default function FloatView(props: FloatViewProps) {
    const {
        value,
        label,
        size,
        enabled,
        wide,
        width,
        onChange,
        onEnterPressed,
    } = props
    const validator = (value: string) => {
        RX_FLOAT.lastIndex = -1
        if (!RX_FLOAT.test(value)) return false
        const numericValue = parseFloat(value)
        if (typeof props.min === "number" && numericValue < props.min)
            return false
        if (typeof props.max === "number" && numericValue > props.max)
            return false
        return true
    }
    return (
        <TextInput
            className={getClassNames(props)}
            value={`${value}`}
            label={label}
            size={size}
            enabled={enabled}
            wide={wide}
            width={width}
            validator={validator}
            onChange={value => onChange && onChange(parseFloat(value))}
            onEnterPressed={value =>
                onEnterPressed && onEnterPressed(parseFloat(value))
            }
        />
    )
}

function getClassNames(props: FloatViewProps): string {
    const classNames = ["custom", "ui-view-input-FloatView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
