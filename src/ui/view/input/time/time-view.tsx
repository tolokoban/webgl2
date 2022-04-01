import { relative } from "path/posix"
import * as React from "react"
import Label from "../../label"
import InputInteger from "../integer"
import "./time-view.css"

export interface TimeViewProps {
    className?: string
    label?: string
    /** Number of seconds since midnight. */
    value: number
    duration?: boolean
    showSeconds?: boolean
    onChange(value: number): void
}

export default function TimeView(props: TimeViewProps) {
    const { value, label, duration, showSeconds, onChange } = props
    const [hour, setHour] = useHour(value)
    const [minute, setMinute] = useMinute(value)
    const [second, setSecond] = useSecond(value)
    React.useEffect(() => {
        const time = second + 60 * minute + 3600 * hour
        onChange(time)
    }, [hour, minute, second])
    return (
        <div className={getClassNames(props)}>
            <Label value={label} />
            <div className="row">
                <InputInteger
                    value={hour}
                    width="2.5em"
                    min={0}
                    max={duration === true ? undefined : 23}
                    onChange={setHour}
                />
                <InputInteger
                    value={minute}
                    width="2.5em"
                    min={0}
                    max={59}
                    onChange={setMinute}
                />
                {showSeconds === true && (
                    <InputInteger
                        value={second}
                        width="2.5em"
                        min={0}
                        max={59}
                        onChange={setSecond}
                    />
                )}
            </div>
            <Label value={label} visible={false} />
        </div>
    )
}

function getClassNames(props: TimeViewProps): string {
    const classNames = ["custom", "ui-view-input-TimeView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function useHour(time: number): [number, (value: number) => void] {
    const initialHour = Math.floor((time ?? 0) / 3600)
    const [hour, setHour] = React.useState(isNaN(initialHour) ? 0 : initialHour)
    return [hour, setHour]
}

function useMinute(time: number): [number, (value: number) => void] {
    const initialMinute = Math.floor((time ?? 0) / 60) % 60
    const [minute, setMinute] = React.useState(
        isNaN(initialMinute) ? 0 : initialMinute
    )
    return [minute, setMinute]
}

function useSecond(time: number): [number, (value: number) => void] {
    const initialSecond = Math.floor(time ?? 0) % 60
    const [second, setSecond] = React.useState(
        isNaN(initialSecond) ? 0 : initialSecond
    )
    return [second, setSecond]
}
