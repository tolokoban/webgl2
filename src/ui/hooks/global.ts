import * as React from "react"
import GenericEvent from "@/tools/generic-event"

/**
 * Used to create global states, like this:
 * ```ts
 * export const useGlobalCurrentLanguage = makeGlobal("fr")
 * ```
 * Then, every module using `useGlobalCurrentLanguage` will share the same value
 * and be notified if the value has been changed in any other module.
 */
export function makeGlobal<T>(initialValue: T) {
    const event: GenericEvent<T> = new GenericEvent()

    return () => {
        const [value, setValue] = React.useState<T>(initialValue)
        React.useEffect(() => {
            event.add(setValue)
            return () => event.remove(setValue)
        }, [])
        return [
            value,
            (value: T) => {
                event.fire(value)
            },
        ]
    }
}
