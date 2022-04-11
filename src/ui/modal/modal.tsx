import AbstractModal from "./abstract-modal"
import Dialog from "../view/dialog"
import IconFactory from "../factory/icon"
import JSON5 from "json5"
import React from "react"
import ReactDOM from "react-dom"
import { ColorName } from "../view/types"
import "./modal.css"

export interface ModalOptions {
    /** Message to display */
    content: ModalContent
    align?:
        | ""
        | "L"
        | "R"
        | "T"
        | "B"
        | "BL"
        | "LB"
        | "BR"
        | "BL"
        | "TL"
        | "LT"
        | "TR"
        | "TL"
    padding?: string
    transitionDuration?: number
    /**
     * Default to `true`. If `true` the modal window can be closed by
     * clicking outside its frame, by pressing ESC on the keyboard or
     * by using the browser back button.
     */
    autoClosable?: boolean
    /**
     * This function is called when the modal window is closed by
     * the ESC key, by a click outside its frame or using browser back button.
     */
    onClose?(): void
}

interface FullModalOptions {
    content: ModalContent
    align:
        | ""
        | "L"
        | "R"
        | "T"
        | "B"
        | "BL"
        | "LB"
        | "BR"
        | "BL"
        | "TL"
        | "LT"
        | "TR"
        | "TL"
    padding: string
    transitionDuration: number
    /**
     * Default to `true`. If `true` the modal window can be closed by
     * clicking outside its frame, by pressing ESC on the keyboard or
     * by using the browser back button.
     */
    autoClosable: boolean
    /**
     * This function is called when the modal window is closed by
     * the ESC key, by a click outside its frame or using browser back button.
     */
    onClose(): void
}

export interface ConfirmOptions extends ModalOptions {
    /** If defined, it will be the header of the modal dialog box. */
    title?: string
    /** Color of the OK button. */
    colorOK?: ColorName
    /** Default to `title` or "OK" if undefined. */
    labelOK?: string
    /** Default to "Cancel". */
    labelCancel?: string
}

export interface InfoOptions extends ModalOptions {
    /** Default to `title` or "OK" if undefined. */
    labelOK?: string
}

export default class Modal extends AbstractModal {
    /**
     * Semi-transparent fullscreen div.
     */
    private readonly screen: HTMLDivElement
    /**
     * Div with the content of this modal.
     */
    private readonly frame: HTMLDivElement
    private readonly options: FullModalOptions
    private detachScreenTimeoutId = 0
    private view: null | JSX.Element | JSX.Element[] | string | boolean = null

    /**
     * This is a shortcut to create a modal and show it in one step.
     * Then this code:
     * ```ts
     * const modal = Modal.show({ content: "Hello World!" })
     * ```
     * is equivalent to this one:
     * ```ts
     * const modal = new Modal({ content: "Hello World!" })
     * modal.show()
     * ```
     */
    static show(content: ModalContent | ModalOptions): Modal {
        const modal = new Modal(content)
        modal.show()
        return modal
    }

    constructor(content: ModalContent | ModalOptions) {
        super()
        const options = normalizeContent(content)
        this.options = {
            align: "",
            padding: "1rem",
            transitionDuration: 300,
            autoClosable: true,
            onClose() {},
            ...options,
        }
        this.autoClosable = options.autoClosable ?? true
        const screen = createScreen(this.options)
        const frame = document.createElement("div")
        screen.appendChild(frame)
        this.screen = screen
        this.frame = frame
    }

    protected actualShow(): boolean {
        window.clearTimeout(this.detachScreenTimeoutId)
        const { screen, frame } = this
        const { content } = this.options
        if (content) ReactDOM.render(<>{content}</>, frame)
        // Closing a modal takes the time of the transition.
        // The screen is actually detached only at the end of this transition.
        // So if you show the modal before the end of the transition, you will
        // have the screen detached immediatly after you attached it.
        window.clearTimeout(this.detachScreenTimeoutId)
        window.document.body.appendChild(screen)
        window.setTimeout(() => screen.classList.add("show"))
        screen.addEventListener("click", this.handleScreenClick, false)
        document.addEventListener("keydown", this.handleKeyDown, true)
        return true
    }

    protected actualHide(autoClose: boolean) {
        const { screen, options } = this
        screen.classList.remove("show")
        this.detachScreenTimeoutId = window.setTimeout(() => {
            window.document.body.removeChild(screen)
        }, options.transitionDuration)
        screen.removeEventListener("click", this.handleScreenClick, false)
        document.removeEventListener("keydown", this.handleKeyDown, true)
        if (autoClose) {
            // `onClose` is called only if the modal has not been closed
            // using the `hide()` method.
            const { onClose } = options
            if (onClose) onClose()
        }
    }

    /**
     * Tapping the sceeen can be used to close the modal.
     */
    private readonly handleScreenClick = (evt: MouseEvent) => {
        if (!this.options.autoClosable) return
        if (evt.target !== this.screen) return

        this.autoClose()
    }

    /**
     * Pressing `Escape` can be used to close the modal.
     */
    private readonly handleKeyDown = (evt: KeyboardEvent) => {
        if (!this.options.autoClosable) return
        if (evt.key !== "Escape") return

        this.autoClose()
    }

    static async confirm(
        content: ConfirmOptions | ModalContent
    ): Promise<boolean> {
        const options = normalizeContent(content)
        return new Promise((resolve) => {
            const modal = new Modal({
                autoClosable: true,
                ...options,
                content: (
                    <Dialog
                        colorOK={options.colorOK}
                        title={options.title}
                        labelOK={options.labelOK ?? options.title ?? "OK"}
                        labelCancel={options.labelCancel ?? "Cancel"}
                        onOK={() => hide(true)}
                        onCancel={() => hide(false)}
                    >
                        {options.content}
                    </Dialog>
                ),
            })
            const hide = (value: boolean) => {
                modal.hide()
                resolve(value)
            }
            modal.show()
        })
    }

    static async info(content: ModalContent | InfoOptions): Promise<void> {
        const options = normalizeContent(content)
        return new Promise((resolve) => {
            const hide = () => {
                modal.hide()
                resolve()
            }
            const modal = new Modal({
                ...options,
                content: (
                    <Dialog
                        hideCancel={true}
                        flat={true}
                        labelOK={options.labelOK ?? "Got It!"}
                        onOK={hide}
                    >
                        {options.content}
                    </Dialog>
                ),
            })
            modal.show()
        })
    }

    static async error(content: ModalContent | ModalOptions): Promise<void> {
        const options = normalizeContent(content)
        return new Promise((resolve) => {
            const hide = () => {
                modal.hide()
                resolve()
            }
            const modal = new Modal({
                autoClosable: false,
                ...options,
                content: (
                    <Dialog hideCancel={true} labelOK="OK" onOK={hide}>
                        <div className="ui-Modal-error">
                            {getHumanFriendlyErrorContent(options.content)}
                        </div>
                    </Dialog>
                ),
                onClose() {
                    resolve()
                },
            })
            modal.show()
        })
    }

    /**
     * Wait for a promise resolution and display an animation in the meantime.
     * @param content Text or element to display along the spinning icon.
     * @param promise The promise to wait on.
     */
    static async wait<T>(
        content: ModalContent | ModalOptions,
        promise: Promise<T>
    ): Promise<T> {
        const options = normalizeContent(content)
        return new Promise((resolve, reject) => {
            const modal = new Modal({
                ...options,
                content: (
                    <div className="ui-Modal-promise-waiter">
                        {IconFactory.make("refresh")}
                        {options.content}
                    </div>
                ),
                /** This modal can only close itself when the promise resolves or rejects */
                autoClosable: false,
            })
            modal.show()
            const hide = (arg: T) => {
                modal.hide()
                resolve(arg)
            }
            promise.then(hide).catch((ex) => {
                modal.hide()
                reject(ex)
            })
        })
    }
}

function createScreen(options: FullModalOptions) {
    const screen = document.createElement("div")
    screen.classList.add("ui-Modal")
    addClassesForAlign(screen, options.align ?? "")
    applyPadding(screen, options.padding)
    applyTransition(screen, options.transitionDuration)
    return screen
}

function addClassesForAlign(screen: HTMLDivElement, align: string) {
    const items = align.split("")
    if (items.includes("L")) screen.classList.add("align-left")
    if (items.includes("R")) screen.classList.add("align-right")
    if (items.includes("T")) screen.classList.add("align-top")
    if (items.includes("B")) screen.classList.add("align-bottom")
}

function applyPadding(screen: HTMLDivElement, padding: string) {
    screen.style.setProperty("--padding", padding)
}

function applyTransition(screen: HTMLDivElement, transitionDuration: number) {
    screen.style.setProperty(
        "--transition-duration",
        `${Math.floor(transitionDuration)}ms`
    )
}

type ModalContent = React.ReactNode

function normalizeContent<T extends { content: ModalContent }>(
    content: ModalContent | T
): T {
    if (isModalContent(content)) return { content } as T
    return content
}

function isModalContent(
    data: ModalContent | { content: ModalContent }
): data is ModalContent {
    if (!data) return true
    if ((data as any).content) return false
    return true
}

/**
 * This function makes possible codes like this:
 * ```ts
 * catch (ex) {
 *   await Modal.error(ex)
 * }
 * ```
 */
function getHumanFriendlyErrorContent(content: unknown): JSX.Element {
    if (typeof content === "string") return <p>{content}</p>
    if (content instanceof Error) return <p>{content.message}</p>
    if (typeof content === "object" && React.isValidElement(content))
        return content
    return <pre>{JSON5.stringify(content, null, "  ")}</pre>
}
