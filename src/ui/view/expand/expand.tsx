import * as React from "react"
import { ReactReduxContext } from "react-redux"
import Icon from "../icon"
import Touchable from "../touchable"
import "./expand.css"

interface IExpandProps {
    className?: string
    label: string
    value?: boolean
    onChange?(value: boolean): void
    children: React.ReactNode
}

const ICON_SIZE = "2rem"

export default function Expand(props: IExpandProps) {
    const [value, setValue] = React.useState(props.value ?? false)
    React.useEffect(() => setValue(props.value ?? value), [props.value])
    const handleToggleValue = () => {
        setValue(!value)
        if (props.onChange) props.onChange(!value)
    }

    const classes = ["custom", "tfw-view-Expand", props.className ?? ""]

    return (
        <div className={classes.join(" ")} tabIndex={0} aria-expanded={value}>
            <Touchable onClick={handleToggleValue}>
                <div className="head">
                    <div className="icons">
                        <Icon name="plus-o" size={ICON_SIZE} />
                        <Icon name="minus-o" size={ICON_SIZE} />
                    </div>
                    <div>{props.label}</div>
                </div>
            </Touchable>
            <div className="body">{props.children}</div>
        </div>
    )
}
