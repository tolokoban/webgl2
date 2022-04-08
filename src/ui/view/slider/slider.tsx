import * as React from "react"
import Label from "@/ui/view/label"
import "./slider.css"

export interface SliderViewProps {
    className?: string
    label?: string
    wide?: boolean
    /** Minimal value. Default to 0 */
    min?: number
    /** Maximal value. Default to 100 */
    max?: number
    value: number
    /** Minimal delta between two different values */
    steps?: number
    onChange(this: void, value: number): void
}

const DEFAULT_MIN_VALUE = 0
const DEFAULT_MAX_VALUE = 100
const MIN_STEP = 1e-6

/**
 * @see https://material.io/components/sliders
 */
export default function SliderView(props: SliderViewProps) {
    const { onChange } = props
    const min = props.min ?? DEFAULT_MIN_VALUE
    const max = props.max ?? DEFAULT_MAX_VALUE
    const steps = Math.max(MIN_STEP, props.steps ?? 1)
    const [value, setValue] = React.useState(clamp(props.value, min, max))
    React.useEffect(() => setValue(clamp(props.value, min, max)), [props.value])
    React.useEffect(() => {
        onChange(value)
    }, [value])
    const refTrack = React.useRef<null | HTMLInputElement>(null)
    useKeyboardHandler(refTrack, value, min, max, steps, setValue, onChange)
    if (min >= max) return <Error min={min} max={max} />
    const PERCENT = 100
    const percent = `${(PERCENT * (value - min)) / (max - min)}%`
    return (
        <div className={getClassNames(props)} tabIndex={0}>
            <Label value={props.label} />
            <input
                type="range"
                ref={refTrack}
                min={min}
                max={max}
                value={value}
                onChange={(evt) => setValue(parseFloat(evt.target.value))}
            />
        </div>
    )
}

/**
 * With Keyboard, using Up and Bottom arrow will perform big steps.
 * Pressing Up arrow once is the same as pressing Left arrow BIG_STEP times.
 */
const BIG_STEP = 10

function useKeyboardHandler(
    ref: React.MutableRefObject<HTMLDivElement | null>,
    value: number,
    min: number,
    max: number,
    steps: number,
    setValue: (this: void, val: number) => void,
    onChange: (this: void, val: number) => void
) {
    React.useEffect(() => {
        const div = ref.current
        if (!div) return undefined

        const handleKeyDown = makeKeyDownHandler(
            steps,
            min,
            value,
            max,
            setValue,
            onChange
        )
        div.addEventListener("keydown", handleKeyDown, true)
        return () => div.removeEventListener("keydown", handleKeyDown, true)
    }, [ref, value, min, max, steps])
}

function makeKeyDownHandler(
    steps: number,
    min: number,
    value: number,
    max: number,
    setValue: (this: void, val: number) => void,
    onChange: (this: void, val: number) => void
) {
    return (evt: KeyboardEvent) => {
        let delta = 0
        switch (evt.key) {
            case "ArrowLeft":
                delta = -steps
                break
            case "ArrowRight":
                delta = steps
                break
            case "ArrowUp":
                delta = steps * BIG_STEP
                break
            case "ArrowDown":
                delta = -steps * BIG_STEP
                break
            case "Home":
                delta = min - value
                break
            case "End":
                delta = max - value
                break
            case ".":
                delta = 0.5 * (min + max) - value
                break
            default:
                return
        }
        const newValue = clamp(value + delta, min, max)
        if (newValue === value) return

        setValue(newValue)
        onChange(newValue)
    }
}

function getClassNames(props: SliderViewProps): string {
    const classNames = ["custom", "ui-view-SliderView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.wide === true) classNames.push("wide")

    return classNames.join(" ")
}

function Error(props: { min: number; max: number }) {
    return (
        <div>
            ERROR! min = {props.min} {" > "} max = {props.max}
        </div>
    )
}

function clamp(value: number, min = 0, max = 1): number {
    return Math.max(Math.min(value, max), min)
}
