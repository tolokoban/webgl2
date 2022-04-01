import './combo-lang.css'

import * as React from 'react'

import Combo from '../combo'

const Languages = require('./languages.json') as { [key: string]: string }

interface IComboLangProps {
    // Array selectable languages.
    // If not defined, all the available languages will be displayed.
    languages?: string[]
    // A list of languages we want to put at the top of the list.
    highlight?: string[]
    onChange?: (lang: string) => void
    label?: string
    // Selected language.
    value: string
    wide?: boolean
}

export default function ComboLang(props: IComboLangProps) {
    const { highlight } = props
    const [value, setValue] = React.useState(props.value)
    React.useEffect(() => setValue(props.value), [props.value])
    const languages = getLanguages(props.languages)
    const languageCodes = Object.keys(languages)
    const comparator = (a: string, b: string) => {
        const A = languages[a].trim().toLowerCase()
        const B = languages[b].trim().toLowerCase()
        if (A < B) return -1
        if (A > B) return +1
        return 0
    }
    const sortedCodes = !highlight
        ? languageCodes
        : [
              ...languageCodes
                  .filter((code) => highlight.includes(code))
                  .sort(comparator),
              ...languageCodes
                  .filter((code) => !highlight.includes(code))
                  .sort(comparator),
          ]
    return (
        <Combo
            label={props.label}
            wide={props.wide}
            value={value}
            onChange={(v) => {
                setValue(v)
                if (props.onChange) props.onChange(v)
            }}
        >
            {convertToItems(getLanguages(sortedCodes))}
        </Combo>
    )
}

function getLanguages(languageCodes: string[] | undefined) {
    if (!languageCodes) return Languages

    const narrowedLanguages: { [key: string]: string } = {}
    for (const code of languageCodes) {
        const name = Languages[code]
        if (!name) continue

        narrowedLanguages[code] = name
    }
    return narrowedLanguages
}

function makeComboItem(code: string, languages: { [key: string]: string }) {
    const name = languages[code] ?? `<unknown: ${code}>`
    return (
        <div className="ui-view-ComboLang-item" key={code}>
            <div>{name}</div>
            <div>{code}</div>
        </div>
    )
}

function convertToItems(languages: { [key: string]: string }): JSX.Element[] {
    const languagesCodes = Object.keys(languages)
    const elements = languagesCodes.map((code: string) =>
        makeComboItem(code, languages)
    )
    return elements
}
