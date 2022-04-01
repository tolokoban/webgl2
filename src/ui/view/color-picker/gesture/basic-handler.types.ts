export interface IBasicEvent {
    buttons: number
    event: MouseEvent | TouchEvent,
    index: number
    pointer: "mouse" | "touch" | "pen"
    startX?: number
    startY?: number
    target: HTMLElement,
    // Coords relative to the element.
    x: number
    y: number
    clear(): void
}
