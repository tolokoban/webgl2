import * as React from 'react'

export interface Items {
    [key: string]: string | JSX.Element
}

export function useItems(children: Array<JSX.Element | null | false>): Items {
    const [items, setItems] = React.useState<Items>({})
    React.useEffect(() => {
        const newItems: Items = {}
        for (const child of children) {
            if (!child) continue

            const { key } = child
            if (typeof key !== 'string') {
                console.error(
                    'In <Combo> every child must have a `key` which is a string!',
                    child
                )
                continue
            }
            newItems[key] = child
        }
        setItems(newItems)
    }, [children])
    return items
}
