import { IBasicEvent } from "./basic-handler.types"

export interface IEvent extends IBasicEvent {
    target: HTMLElement
    x: number
    y: number
    preventDefault?(): void
    stopPropagation?(): void
}

export interface IWheelEvent {
    deltaX: number,
    deltaY: number,
    deltaZ: number
    target: EventTarget | null
    x: number,
    y: number,
    preventDefault?(): void
    stopPropagation?(): void
}
