import * as React from "react"
import { isString } from "../../../tools/type-guards"
import Label from "../label"
import "./simple-combo-view.css"

export interface SimpleComboViewProps {
    className?: string
    label?: string
    wide?: boolean
    value: string
    options: { [key: string]: string | { [key: string]: string } }
    onChange(this: void, value: string): void
}

export default function SimpleComboView(props: SimpleComboViewProps) {
    const { label, options, onChange } = props
    const [value, setValue] = React.useState(props.value)
    const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = evt.target.value
        setValue(newValue)
        onChange(newValue)
    }
    return (
        <div className={getClassNames(props)}>
            <Label value={label} />
            <div className="container theme-shadow-button">
                <select
                    className="theme-color-input"
                    value={value}
                    onChange={handleChange}
                >
                    {Object.keys(options).map(key =>
                        renderOptions(key, options[key])
                    )}
                </select>
                <div className="dropdown-button theme-color-primary">▼</div>
            </div>
            <Label value={label} visible={false} />
        </div>
    )
}

function getClassNames(props: SimpleComboViewProps): string {
    const classNames = ["custom", "ui-view-SimpleComboView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.wide === true) classNames.push("wide")

    return classNames.join(" ")
}

function renderOptions(
    key: string,
    value: string | { [key: string]: string }
): any {
    if (isString(value))
        return (
            <option key={key} value={key}>
                {value}
            </option>
        )
    return (
        <optgroup key={`grp/${key}`} label={key}>
            {Object.keys(value).map(k => (
                <option key={k} value={k}>
                    {value[k]}
                </option>
            ))}
        </optgroup>
    )
}
