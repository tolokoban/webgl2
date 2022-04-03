import * as React from "react"
import "./instruction-view.css"

export type InstructionDefinition<T> =
    | InstructionConstDefinition<T>
    | InstructionFunctionDefinition<T>

interface InstructionDefinitionCommon<T> {
    /** Code to use in language interpreter */
    code: number
    /** Produced type */
    type: string
}

interface InstructionConstDefinition<T> extends InstructionDefinitionCommon<T> {
    data?: T
}

interface InstructionFunctionDefinition<T>
    extends InstructionDefinitionCommon<T> {
    args?: {
        /** <arg name>: <expected type> */
        [name: string]: string
    }
}

export interface InstructionViewProps<T> {
    className?: string
    value: InstructionDefinition<T>
    prefix?: string
}

export default function InstructionView<T>(props: InstructionViewProps<T>) {
    return <div className={getClassNames(props)}></div>
}

function getClassNames<T>(props: InstructionViewProps<T>): string {
    const classNames = ["custom", "view-InstructionView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
