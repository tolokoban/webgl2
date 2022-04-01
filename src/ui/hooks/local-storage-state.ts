import JSON5 from "json5"
import * as React from "react"

/**
 * State variable that can be stored in local storage.
 * @param defaultValue Default value for initialization.
 * @param storageKey Key where to store it in local storage.
 * @param initialTransform If defined, it is used to transform the value read from storage.
 */
export function useLocalStorageState<T>(
    defaultValue: T,
    storageKey: string,
    initialTransform?: (value: T) => T
): [value: T, setValue: (value: T) => void] {
    const [value, setValue] = React.useState<T>(
        get<T>(storageKey, defaultValue, initialTransform)
    )
    return [
        value,
        (newValue: T) => {
            setValue(newValue)
            window.localStorage.setItem(storageKey, JSON5.stringify(newValue))
        },
    ]
}

function get<T>(
    key: string,
    defaultValue: T,
    initialTransform?: (value: T) => T
): T {
    const text = window.localStorage.getItem(key)
    if (!text)
        return initialTransform ? initialTransform(defaultValue) : defaultValue

    try {
        const value = JSON5.parse(text)
        if (typeof value !== typeof defaultValue) {
            throw Error("Incompatible types!")
        }
        return initialTransform ? initialTransform(value) : value
    } catch (ex) {
        console.error(`Unexpected value in local storage "${key}":`, ex)
        return initialTransform ? initialTransform(defaultValue) : defaultValue
    }
}
