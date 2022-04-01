import './color-view.css'

import * as React from 'react'

import Color from '../../../color'
import Modal from '../../../modal'
import ColorPicker from '../../color-picker'
import Dialog from '../../dialog'
import FloatingButton from '../../floating-button'
import Label from '../../label'

const ID = 'ui-view-input-ColorView'

export interface ColorViewProps {
    className?: string
    label?: string
    enabled?: boolean
    size?: number
    value: string
    onChange?(value: string): void
    onEnterPressed?(value: string): void
}

export default function ColorView(props: ColorViewProps) {
    const { value, size, label, enabled, onChange, onEnterPressed } = props
    const [id, setId] = React.useState('')
    const [code, setCode] = React.useState(value.toUpperCase())
    const valid = Color.isValid(code)
    React.useEffect(() => setId(nextId()), [])
    const colors: React.CSSProperties = {
        color: 'currentcolor',
        backgroundColor: 'transparent',
    }
    if (valid) {
        const color = new Color(code)
        colors.backgroundColor = code
        colors.color = Color.bestContrast(color, BLACK, WHITE).stringify()
    }
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newCode = evt.target.value
        setCode(newCode.toUpperCase())
        if (Color.isValid(newCode) && onChange) {
            onChange(newCode)
        }
    }
    const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (!valid) return
        if (typeof onEnterPressed !== 'function') return
        if (evt.key === 'Enter') onEnterPressed(code)
    }

    return (
        <div className={getClassNames(props, valid)}>
            <div className="input">
                <Label value={label} target={id} />
                <input
                    id={id}
                    style={colors}
                    size={size ?? 4}
                    value={code}
                    disabled={enabled === false ? true : undefined}
                    onChange={handleChange}
                    onKeyDownCapture={handleKeyDown}
                />
            </div>
            <FloatingButton
                icon="edit"
                small={true}
                onClick={() => pickColor(label, code, setCode)}
            />
        </div>
    )
}

const BLACK = Color.newBlack()
const WHITE = Color.newWhite()

let globalId = 1

function nextId() {
    return `${ID}-${globalId++}`
}

function getClassNames(props: ColorViewProps, valid: boolean): string {
    const classNames = ['custom', 'ui-view-input-ColorView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }
    if (!valid) classNames.push('invalid')

    return classNames.join(' ')
}

function pickColor(
    label: string | undefined,
    code: string,
    setCode: React.Dispatch<React.SetStateAction<string>>
): void {
    let value = code
    const modal = Modal.show(
        <Dialog
            title={label}
            onOK={() => {
                setCode(value)
                modal.hide()
            }}
            onCancel={() => modal.hide()}
        >
            <ColorPicker
                value={value}
                onChange={(newCode) => {
                    value = newCode
                }}
            />
        </Dialog>
    )
}
