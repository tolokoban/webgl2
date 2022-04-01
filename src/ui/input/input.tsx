import * as React from "react"
import Modal from "../modal"
import Dialog from "../view/dialog"
import Input from "../view/input/text"

export interface IInputStringOptions {
    /** Name of the input. Used for browser autocompletion. */
    name?: string
    label?: string
    title?: string
    defaultValue?: string
    validator?(value: string): boolean
    extraContent?: string | JSX.Element
    labelOK?: string
    labelCancel?: string
    maxWidth?: string
}

export async function inputString(
    params: IInputStringOptions
): Promise<string | undefined> {
    return new Promise(resolve => {
        let value = params.defaultValue ?? ""
        const modal = new Modal({
            padding: "1em",
            onClose: () => resolve(undefined),
            content: (
                <InputString
                    onResolve={async value => {
                        await modal.hide()
                        resolve(value)
                    }}
                    {...params}
                />
            ),
        })
        modal.show()
    })
}

interface IInputStringProps extends IInputStringOptions {
    onResolve(value: string | undefined): void
}

function InputString(props: IInputStringProps) {
    const { validator } = props
    const [value, setValue] = React.useState(props.defaultValue ?? "")
    const [valid, setValid] = React.useState(validator && validator(value))
    const handleOK = () => {
        if (!valid) return

        props.onResolve(value)
    }
    return (
        <Dialog
            labelOK={props.labelOK}
            labelCancel={props.labelCancel}
            title={props.title ?? props.label}
            maxWidth={props.maxWidth ?? "320px"}
            onOK={handleOK}
            onCancel={() => props.onResolve(undefined)}
            valid={valid}
        >
            <Input
                name={props.name}
                focus={true}
                label={props.label}
                value={value ?? ""}
                wide={true}
                onChange={setValue}
                validator={props.validator}
                onValidation={setValid}
                onEnterPressed={handleOK}
            />
            <>{props.extraContent}</>
        </Dialog>
    )
}
