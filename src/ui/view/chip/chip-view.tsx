/**
 * @see https://material.io/components/chips#input-chips
 */
import * as React from "react"
import { ColorName } from "../types"
import "./chip-view.css"


export interface ChipViewProps {
    className?: string
    color?: ColorName
    /** Default to false. */
    outline?: boolean
    /** Default to false. */
    removable?: boolean
    /** Default to true. */
    enabled?: boolean
    label: string
    thumbnail?: JSX.Element
    tag?: any
    onClick?(tag?: any): void
    onRemove?(tag?: any): void
}

export default function ChipView(props: ChipViewProps) {
    const { thumbnail, label, removable, tag, onClick, onRemove } = props
    const handleClick = () => {
        if (onClick) onClick(tag)
    }
    const handleRemove: React.MouseEventHandler<SVGSVGElement> = evt => {
        if (!onRemove) return
        evt.preventDefault()
        evt.stopPropagation()
        onRemove(tag)
    }
    return (
        <button className={getClassNames(props)} onClick={handleClick}>
            {thumbnail && <div className="thumbnail">{thumbnail}</div>}
            <div className="label">{label}</div>
            {removable === true && (
                <svg viewBox="0 0 24 24" onClick={handleRemove}>
                    <path
                        fill="currentColor"
                        d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
                    />
                </svg>
            )}
        </button>
    )
}

function getClassNames(props: ChipViewProps): string {
    const classNames = ["custom", "ui-view-ChipView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    classNames.push(`color-${props.color ?? 'primary'}`)

    return classNames.join(" ")
}
