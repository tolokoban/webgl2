import { ModalStack } from "./modal-stack"

export enum ModalStateEnum {
    CLOSE = 0,
    OPEN = 1,
}

interface ModalHistoryState {
    modals: { depth: number }
}

export default abstract class AbstractModal {
    /**
     * We can open several modal windows, but we want the escape key to
     * close only the last one.
     */
    private static readonly _stack = new ModalStack()
    private static _initialized = false

    protected static initialize() {
        if (AbstractModal._initialized) return

        window.history.pushState(makeModalHistoryState(0), document.title)
        window.addEventListener(
            "popstate",
            evt => {
                const { state } = evt
                if (!isModalHistoryState(state)) {
                    return
                }
                const { depth } = state.modals
                const stack = AbstractModal._stack
                while (stack.length > depth) {
                    const topModal = stack.pop()
                    if (!topModal) break

                    topModal.actualHide(true)
                }
            },
            true
        )
        AbstractModal._initialized = true
    }

    /** Wheter this modal can be closed by the back button */
    protected autoClosable = true
    private state: ModalStateEnum = ModalStateEnum.CLOSE

    public show() {
        if (this.state === ModalStateEnum.OPEN) return

        if (false === this.actualShow()) return

        this.state = ModalStateEnum.OPEN
        if (!this.autoClosable) return

        AbstractModal.initialize()
        AbstractModal._stack.push(this)
        window.history.pushState(
            makeModalHistoryState(AbstractModal._stack.length),
            document.title
        )
    }

    public hide() {
        if (this.state === ModalStateEnum.CLOSE) return

        if (this.autoClosable) window.history.back()
        else this.actualHide(false)
    }

    /**
     * When closing is asked by the user, by typing ESC key, clicking outside
     * the modal or using browser back button.
     */
    protected autoClose() {
        if (this.state !== ModalStateEnum.OPEN) return

        const stack = AbstractModal._stack
        if (this !== stack.top()) return

        window.history.back()
    }

    /**
     * @returns `false` if the modal has not been open.
     */
    protected abstract actualShow(): boolean
    /**
     * @param historyBack Wheter the modal has been close by using browser back button.
     */
    protected abstract actualHide(historyBack: boolean): void
}

function makeModalHistoryState(depth: number): ModalHistoryState {
    return { modals: { depth } }
}

function isModalHistoryState(data: any): data is ModalHistoryState {
    if (!data) return false
    const { modals } = data
    if (!modals) return false
    return typeof modals.depth === "number"
}
