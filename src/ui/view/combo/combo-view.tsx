import './combo-view.css'

import * as React from 'react'

import Modal from '../../modal'
import Dialog from '../dialog'
import Label from '../label'
import ComboItemView from './combo-item/combo-item-view'
import { Items, useItems } from './hooks'

let globalId = 1
const ID = 'ui-view-Combo'

function nextId() {
    return `${ID}-${globalId++}`
}

export interface ComboViewProps {
    className?: string
    wide?: boolean
    label?: string
    value: string
    onChange(value: string): void
    children: JSX.Element[]
}

export default function ComboView(props: ComboViewProps) {
    const items = useItems(props.children)
    const [value, setValue] = React.useState(props.value)
    React.useEffect(() => setValue(props.value), [props.value])
    const refId = React.useRef<string>(nextId())
    const handleClick = () => {
        handleChange(value, props, items).then(setValue)
    }
    return (
        <div className={getClassNames(props)}>
            <Label target={refId.current} value={props.label} />
            <ComboItemView
                onClick={handleClick}
                wide={props.wide}
                showButton={true}
            >
                {items[value]}
            </ComboItemView>
        </div>
    )
}

function getClassNames(props: ComboViewProps): string {
    const classNames = ['custom', 'ui-view-ComboView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }
    if (props.wide === true) classNames.push('wide')

    return classNames.join(' ')
}

async function handleChange(
    value: string,
    props: ComboViewProps,
    items: Items
): Promise<string> {
    const newValue = await askForNewValue(value, items, props.label)
    if (newValue === value) return value

    props.onChange(newValue)
    return newValue
}

async function askForNewValue(
    value: string,
    items: Items,
    title?: string
): Promise<string> {
    const values = Object.keys(items)
    if (values.length < 2) return value
    if (values.length === 2) return getOtherValue(value, values)

    return new Promise((resolve) => {
        const modal = new Modal({
            padding: '.5rem',
            content: (
                <Dialog
                    title={title}
                    onCancel={() => resolve(value)}
                    hideOK={true}
                >
                    <div className="ui-view-ComboView-list">
                        {Object.keys(items).map((key) => (
                            <ComboItemView
                                key={key}
                                wide={true}
                                value={key}
                                showButton={false}
                                onClick={() => {
                                    modal.hide()
                                    resolve(key)
                                }}
                            >
                                {items[key]}
                            </ComboItemView>
                        ))}
                    </div>
                </Dialog>
            ),
        })
        modal.show()
    })
}

function getOtherValue(value: string, values: string[]): string {
    for (const item of values) {
        if (value !== item) return item
    }
    // There is no other value.
    return value
}
