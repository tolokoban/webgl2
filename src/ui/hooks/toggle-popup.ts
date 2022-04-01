import * as React from "react"

let incrementalId = Math.random()

/**
 * Handle the visibility of a "popup" A popup that can be closed
 * with the back button of your browser.
 */
export function useTogglePopup(): [
    visible: boolean,
    setVisible: (visible: boolean) => void
] {
    const refId = React.useRef(-1)
    const refHistoryState = React.useRef<any>(null)
    const [visible, setVisible] = React.useState(false)
    React.useEffect(() => {
        refId.current = incrementalId++
        const listener = (evt: PopStateEvent) => {
            const { state } = evt
            const previousState = refHistoryState.current
            refHistoryState.current = state
            // console.log("OLD state:", previousState)
            // console.log("NEW state:", state)
            if (!isTogglePopupState(state, refId.current)) return

            const { value } = state

            setVisible(value)
            if (value) {
                // if (isTogglePopupState(previousState, refId.current)) {
                //     const previousValue = previousState.value
                //     if (previousValue === false) back()
                // } else {
                //     forward()
                // }
            } else {
                if (isTogglePopupState(previousState, refId.current)) {
                    const previousValue = previousState.value
                    if (previousValue === true) back()
                } else {
                    forward()
                }
            }
        }
        window.addEventListener("popstate", listener, false)
        return () => window.removeEventListener("popstate", listener, false)
    }, [])
    return [
        visible,
        (newVisible: boolean) => {
            if (newVisible === visible) return

            if (newVisible) {
                // Open the popup.
                const id = refId.current
                window.history.pushState(
                    makeTogglePopupState(id, false),
                    document.title,
                    null
                )
                const state = makeTogglePopupState(id, true)
                window.history.pushState(state, document.title, null)
                refHistoryState.current = state
                setVisible(true)
            } else {
                // Close the popup.
                back()
            }
        },
    ]
}

interface TogglePopupState {
    type: "toggle-popup"
    id: number
    value: boolean
}

function isTogglePopupState(
    data: any,
    expectedId: number
): data is TogglePopupState {
    if (!data) return false
    const { type, id, value } = data
    if (type !== "toggle-popup") return false
    if (id !== expectedId) return false
    return typeof value === "boolean"
}

function makeTogglePopupState(id: number, value: boolean): TogglePopupState {
    return { type: "toggle-popup", id, value }
}

function back() {
    // console.log("BACK")
    window.history.back()
}

function forward() {
    // console.log("FORWARD")
    window.history.forward()
}
