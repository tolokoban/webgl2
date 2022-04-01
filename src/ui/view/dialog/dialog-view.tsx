import * as React from "react"
import Button from "../button"
import Icon from "../icon"
import { ColorName } from "../types"
import "./dialog-view.css"

export interface DialogViewProps {
    className?: string
    /** If a `title` is defined, a dark primary header will be displayed. */
    title?: string
    /** If title is defined, you can add an icon to its left. */
    icon?: string
    /** If `false`, __OK__ button will be disabled. */
    valid?: boolean
    /** Use flat button for cancel, or if there is only one button. */
    flat?: boolean
    children: JSX.Element | JSX.Element[] | string | null | boolean | Error
    /** Triggered when __OK__ button has been clicked */
    onOK?(): void
    /** Triggered when __Cancel__ button has been clicked */
    onCancel?(): void
    /** If `true` don't display any __Cancel__ button. */
    hideCancel?: boolean
    /** If `true` don't display any __OK__ button. */
    hideOK?: boolean
    /** Rename the __OK__ button. */
    labelOK?: string
    /** Color of OK button. Default to primary. */
    colorOK?: ColorName
    /** Rename the __Cancel__ button. */
    labelCancel?: string
    maxWidth?: string
    /** Prefered width. Default to "auto". **/
    width?: string
}

export default function DialogView(props: DialogViewProps) {
    const {
        colorOK,
        flat,
        title,
        icon,
        valid,
        children,
        hideCancel,
        hideOK,
        labelOK,
        labelCancel,
        onOK,
        onCancel,
    } = props

    return (
        <div
            className={getClassNames(props)}
            style={{
                maxWidth: props.maxWidth ?? "100vw",
                width: props.width ?? "auto",
            }}
        >
            {title && (
                <header>
                    {icon && <Icon name={icon} />}
                    <div>{title}</div>
                </header>
            )}
            <div>{extractErrorMessageIfNeeded(children)}</div>
            {(!hideOK || !hideCancel) && (
                <footer>
                    {!(hideCancel ?? false) && (
                        <Button
                            label={labelCancel ?? "Cancel"}
                            onClick={onCancel}
                            flat={true}
                        />
                    )}
                    {!(hideOK ?? false) && (
                        <Button
                            color={colorOK ?? "primary"}
                            enabled={valid ?? true}
                            label={labelOK ?? "OK"}
                            onClick={onOK}
                            flat={hideCancel && flat}
                        />
                    )}
                </footer>
            )}
        </div>
    )
}

function getClassNames(props: DialogViewProps): string {
    const classNames = ["custom", "ui-view-DialogView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function extractErrorMessageIfNeeded(children: string | boolean | JSX.Element | JSX.Element[] | Error | null): React.ReactNode {
    if (children instanceof Error) return children.message
}

