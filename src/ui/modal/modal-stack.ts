import Modal from "./abstract-modal"

export class ModalStack {
    private modals: Modal[] = []

    public pop(): Modal | undefined {
        const removedModal = this.modals.pop()
        return removedModal
    }

    public push(modal: Modal) {
        this.modals.push(modal)
    }

    public top(): Modal | undefined {
        return this.modals.at(-1)
    }

    public get length() {
        return this.modals.length
    }

    /**
     * @returns The depth of `modal` in this stack, or -1 if not found.
     */
    public depth(modal: Modal) {
        return this.modals.indexOf(modal)
    }
}
