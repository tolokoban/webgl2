import * as React from "react"

import "./drag-and-drop-view.css"

export interface DragAndDropViewProps {
    className?: string
    /** Type of the dragged data, and also accepted type for drop zone. */
    type: string
    /** This is the data we move around when dragging. */
    data?: string
    /** A data of the accepted type has been dropped. */
    onDrop?(data: string): void
    children?: React.ReactNode
}

const MIMETYPE_PREFIX = "application/x-tp-"

export default function DragAndDropView(props: DragAndDropViewProps) {
    const mimetype = `${MIMETYPE_PREFIX}${props.type}`
    const [droppable, setDroppable] = React.useState(false)
    const handleDrop = (evt: React.DragEvent<HTMLDivElement>) => {
        setDroppable(false)
        evt.preventDefault()
        const data = evt.dataTransfer.getData(mimetype)
        if (!data || data === props.data) return

        if (props.onDrop) props.onDrop(data)
    }
    const handleDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
        evt.preventDefault()
        const data = evt.dataTransfer.getData(mimetype)
        if (!data || data === props.data || !props.onDrop) return

        setDroppable(true)
        evt.dataTransfer.dropEffect = "move"
    }
    const handleDragStart = (evt: React.DragEvent<HTMLDivElement>) => {
        evt.dataTransfer.setData(mimetype, props.data ?? "")
    }
    return (
        <div
            className={getClassNames(props, droppable)}
            draggable={props.data ? true : false}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={() => setDroppable(false)}
        >
            {props.children}
        </div>
    )
}

function getClassNames(
    props: DragAndDropViewProps,
    droppable: boolean
): string {
    const classNames = ["custom", "ui-view-DragAndDropView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (droppable) classNames.push("droppable")

    return classNames.join(" ")
}
