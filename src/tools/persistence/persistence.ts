import * as React from "react"
import JSON5 from "json5"

class Persistence {
    async get(
        table: string,
        key: string,
        defaultValue: unknown
    ): Promise<unknown> {
        console.log("[DB]", table, key, ">GET>")
        const content = window.localStorage.getItem(makeKey(table, key))
        if (content === null) return defaultValue

        try {
            const data = JSON5.parse(content)
            console.log(data)
            return data
        } catch (ex) {
            console.log(content)
            console.error(ex)
            return defaultValue
        }
    }

    async set(table: string, key: string, value: unknown): Promise<void> {
        console.log("[DB]", table, key, "<SET<")
        console.log(value)
        window.localStorage.setItem(makeKey(table, key), JSON5.stringify(value))
    }
}

const DB = new Persistence()

function makeKey(table: string, key: string): string {
    return `wgl2:${table}\t${key}`
}

export function usePersistentState<T>(
    table: string,
    key: string,
    defaultValue: T,
    validator: (value: unknown) => value is T
): [value: T, setValue: (value: T) => void] {
    const [value, setValue] = React.useState<T>(defaultValue)
    React.useEffect(() => {
        DB.get(table, key, defaultValue).then(v => {
            setValue(validator(v) ? v : defaultValue)
        })
    }, [defaultValue])
    return [
        value,
        (v: T) => {
            setValue(v)
            void DB.set(table, key, v)
        },
    ]
}

export default DB
