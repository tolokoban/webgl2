type TIdentifier = number | null

export default class Finger {
    private readonly fingers: TIdentifier[] = []

    public getIndex(identifier: number): number {
        const index = this.fingers.indexOf(identifier)
        if (index !== -1) return index
        const indexOfFirstNull = this.fingers.indexOf(null)
        if (indexOfFirstNull !== -1) {
            this.fingers[indexOfFirstNull] = identifier

            return indexOfFirstNull
        }
        this.fingers.push(identifier)

        return this.fingers.length - 1
    }

    public remove(identifier: number) {
        const index = this.fingers.indexOf(identifier)
        if (index !== -1) this.fingers[index] = null
    }
}
