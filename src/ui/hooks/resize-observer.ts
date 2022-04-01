import * as React from "react"
import AsyncTools from "../../tools/async"

/**
 * Force a rerender as soon as an observed element changed its size.
 * The rerender can also be debounced.
 * @param refElem Reference of the element whose size we want to observe.
 * @param debounceDelay If defined, debounce the dimension update.
 * @returns `[width, height]`
 */
export function useResizeObserver(
    element: HTMLElement | SVGElement | null,
    debounceDelay?: number
): [width: number, height: number] {
    const [size, setSize] = React.useState<[width: number, height: number]>(
        getInitialSize(element)
    )
    const updateSize = React.useMemo(() => {
        const updater = (width: number, height: number) =>
            setSize([width, height])
        if (typeof debounceDelay === "number" && debounceDelay > 0) {
            return AsyncTools.Debouncer(updater, debounceDelay)
        } else {
            return updater
        }
    }, [debounceDelay])
    React.useEffect(() => {
        setSize(getInitialSize(element))
        if (!element) return

        const observer = new ResizeObserver(() => {
            const { width, height } = element.getBoundingClientRect()
            updateSize(width, height)
        })
        observer.observe(element)
        return () => observer.unobserve(element)
    }, [element, updateSize])
    return size
}

function getInitialSize(
    element: HTMLElement | SVGElement | null
): [width: number, height: number] {
    if (!element) return [0, 0]

    return [element.clientWidth, element.clientHeight]
}
