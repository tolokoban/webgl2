import * as React from "react"
import Button from "../../button"
import { ColorName } from '../../types'
import "./input-file.css"


interface IInputFileProps {
    className?: string
    label?: string
    icon?: string
    error?: string
    color?: ColorName
    width?: string
    wide?: boolean
    wait?: boolean
    flat?: boolean
    visible?: boolean
    enabled?: boolean
    reversed?: boolean
    multiple?: boolean
    /**
     * Ex.: "image/png,image/jpeg", ".png,.jpg", "image/*", ...
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
     */
    accept?: string
    onClick?: (files: FileList) => void
}

export default class InputFile extends React.Component<IInputFileProps> {
    private readonly refInput: React.RefObject<HTMLInputElement> = React.createRef()

    static readFileAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader()
            reader.onload = data => {
                if (!data || !data.target) {
                    resolve("")
                    return
                }
                const content = data.target.result
                if (typeof content === 'string') {
                    resolve(content)
                } else {
                    resolve("")
                }
            }
            reader.onerror = err => {
                reject(err)
            }
            reader.readAsText(file)
        })
    }

    handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!evt.target) return

        const handler = this.props.onClick
        if (typeof handler !== 'function') return

        try {
            const input = evt.target as HTMLInputElement
            const files = input.files
            if (!files) return
            handler(files)
        } catch (ex) {
            console.error("Error in handleFileChange(): ")
            console.error(ex)
        }
    }

    handleClick = () => {
        const input = this.refInput.current
        if (!input) return
        input.click()
    }

    render() {
        const p = this.props
        const classes = ["tfw-view-InputFile"]

        return (<div className={classes.join(" ")}>
            <Button
                label={p.label ?? 'Upload'}
                icon={p.icon}
                error={p.error}
                color={p.color}
                wide={p.wide}
                // wait={p.wait}
                flat={p.flat}
                visible={p.visible}
                enabled={p.enabled}
                reversed={p.reversed}
                className={p.className}
                onClick={this.handleClick} />
            <input
                ref={this.refInput}
                type="file"
                style={{ display: "none" }}
                accept={p.accept}
                multiple={p.multiple === true}
                onChange={this.handleFileChange} />
        </div>)
    }
}
