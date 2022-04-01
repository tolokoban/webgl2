/**
 * Here is the list of all parameters used if all the handlers.
 * * x, y: coord relative to the upper-left corner of the element.
 *
 * tap({ x: number, y: number, index: number })
 *
 */

import Moves from "./moves"
import BasicHandler from "./basic-handler"
import { IBasicEvent } from "./basic-handler.types"
import { IEvent } from "./types"

const SYMBOL = Symbol("gesture")

let ID = 0

export interface IHTMLElementWithGesture extends HTMLElement {
    // A special attribute to attach Gesture object.
    [SYMBOL]?: Gesture
}

interface IHandlers {
    [key: string]: ((evt: any) => void) | undefined
    down?(event: IEvent): void
    keydown?(event: KeyboardEvent): void
    keyup?(event: KeyboardEvent): void
    pan?(event: IEvent): void
    pandown?(event: IEvent): void
    panup?(event: IEvent): void
    panvertical?(event: IEvent): void
    swipe?(event: IEvent): void
    swipedown?(event: IEvent): void
    swipeleft?(event: IEvent): void
    swipeup?(event: IEvent): void
    swipevertical?(event: IEvent): void
    tap?(event: IEvent): void
    up?(event: IEvent): void
    wheel?(event: WheelEvent): void
}

interface IPointer {
    id?: number
    isDown: boolean
    moves: Moves
    rect: {
        height: number;
        left: number;
        top: number;
        width: number;
    }
    time?: number
    type?: string | null
}

export class Gesture {
    public get identifier() { return this.id }
    private readonly element: IHTMLElementWithGesture
    // Private readonly basicHandler: BasicHandler;
    private handlers: IHandlers
    private readonly id: number
    private readonly pointers: IPointer[]

    public constructor(elem: HTMLElement) {
        this.id = ID++
        this.element = elem
        this.element[SYMBOL] = this
        this.handlers = {}
        BasicHandler(
            elem,
            this.handleDown.bind(this),
            this.handleUp.bind(this),
            this.handleMove.bind(this),
        )
        this.pointers = new Array(3)
        elem.addEventListener("contextmenu", (evt) => { evt.preventDefault() }, false)
    }

    public on(handlers: IHandlers) {
        if (handlers.wheel)
            this.element.addEventListener("wheel", handlers.wheel)
        if (handlers.keyup)
            this.element.addEventListener("keyup", handlers.keyup)
        if (handlers.keydown)
            this.element.addEventListener("keydown", handlers.keydown)
        this.handlers = { ...this.handlers, ...handlers }
    }

    private getPointer(index: number) {
        const pointers = this.pointers
        if (typeof pointers[index] === "undefined") {
            pointers[index] = {
                isDown: false,
                moves: new Moves(0, 0),
                rect: { left: 0, top: 0, width: 0, height: 0 },
            }
        }

        return pointers[index]
    }

    private handleDown(event: IBasicEvent) {
        // We don't want to deal with more than 3 simultaneous touches.
        if (event.index > 2) return

        const { x, y } = event
        const { element } = this
        const ptr = this.getPointer(event.index)
        ptr.isDown = true
        ptr.moves.init(x, y)

        if (this.handlers.down) {
            this.handlers.down({ ...event, x, y, target: element })
        }
    }

    private handleMove(event: IBasicEvent) {
        // We want not deal with more than 3 simultaneous touches.
        if (event.index > 2) return

        const ptr = this.getPointer(event.index)
        const { x, y } = event
        ptr.moves.add(x, y)
        this.recognizePan(event, ptr)
    }

    private handleUp(event: IBasicEvent) {
        // We want not deal with more than 3 simultaneous touches.
        if (event.index > 2) return

        const { x, y } = event
        const ptr = this.getPointer(event.index)
        ptr.isDown = false
        ptr.moves.add(x, y)

        if (this.handlers.up) {
            this.handlers.up({ ...event, x, y, target: this.element })
        }
        this.recognizeTap(event, ptr)
        this.recognizeSwipe(event, ptr)
    }

    /**
     * Returns true if current gesture has at least one of the provided handlers.
     */
    private hasHandlerFor(...names: string[]) {
        for (const name of names) {
            if (this.handlers[name]) return true
        }

        return false
    }

    private recognizePan(evt: IBasicEvent, ptr: IPointer) {
        if (!ptr.isDown) return
        this.recognizePanDown(evt, ptr)
        this.recognizePanUp(evt, ptr)
        if (this.handlers.pan) {
            const { x, y, startX, startY } = ptr.moves
            this.handlers.pan(
                { ...evt, x, y, startX, startY, target: this.element })
        }
    }

    private recognizePanDown(evt: IBasicEvent, ptr: IPointer) {
        if (!this.hasHandlerFor("pandown", "panvertical")) return

        // Check that we are panning down.
        const moves = ptr.moves
        const sx = Math.abs(moves.speedX)
        const sy = moves.speedY
        if (sy < sx) return
        // Check that the final point is beneath the initial one.
        const dx = Math.abs(moves.x - moves.startX)
        const dy = moves.y - moves.startY
        if (dy < dx) return

        if (this.handlers.pandown) {
            this.handlers.pandown(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
        if (this.handlers.panvertical) {
            this.handlers.panvertical(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
    }

    private recognizePanUp(evt: IBasicEvent, ptr: IPointer) {
        if (!this.hasHandlerFor("panup", "panvertical")) return

        // Check that we are panning up.
        const moves = ptr.moves
        const sx = Math.abs(moves.speedX)
        const sy = -moves.speedY
        if (sy < sx) return
        // Check that the final point is beneath the initial one.
        const dx = Math.abs(moves.x - moves.startX)
        const dy = moves.startY - moves.y
        if (dy < dx) return

        if (this.handlers.panup) {
            this.handlers.panup(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
        if (this.handlers.panvertical) {
            this.handlers.panvertical(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
    }

    private recognizeSwipe(evt: IBasicEvent, ptr: IPointer) {
        this.recognizeSwipeDown(evt, ptr)
        this.recognizeSwipeUp(evt, ptr)
        this.recognizeSwipeLeft(evt, ptr)
        if (this.handlers.swipe) {
            const { x, y, startX, startY } = ptr.moves
            this.handlers.swipe({ ...evt, x, y, startX, startY, target: this.element })
        }
    }

    private recognizeSwipeDown(evt: IBasicEvent, ptr: IPointer) {
        if (!this.hasHandlerFor("swipedown", "swipevertical")) return

        // Check that we are panning down.
        const moves = ptr.moves
        const sx = Math.abs(moves.speedX)
        const sy = moves.speedY
        if (sy < sx) return
        // Check that the final point is beneath the initial one.
        const dx = Math.abs(moves.x - moves.startX)
        const dy = moves.y - moves.startY
        if (dy < dx) return
        // Minimal speed for swipe: 100 pixels/second.
        const speed = dy / moves.elapsedTime
        if (speed < 0.1) return
        if (this.handlers.swipedown) {
            this.handlers.swipedown(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
        if (this.handlers.swipevertical) {
            this.handlers.swipevertical(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
    }

    private recognizeSwipeLeft(evt: IBasicEvent, ptr: IPointer) {
        if (!this.hasHandlerFor("swipeleft", "swipehorizontal")) return

        // Check that we are panning left.
        const moves = ptr.moves
        const sx = -moves.speedX
        const sy = Math.abs(moves.speedY)
        if (sx < sy) return
        // Check that the final point is beneath the initial one.
        const dx = moves.startX - moves.x
        const dy = Math.abs(moves.y - moves.startY)
        if (dx < dy) return
        // Minimal speed for swipe: 100 pixels/second.
        const speed = dx / moves.elapsedTime
        if (speed < 0.1) return
        if (this.handlers.swipeleft) {
            this.handlers.swipeleft(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
        if (this.handlers.swipehorizontal) {
            this.handlers.swipehorizontal(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
    }

    private recognizeSwipeUp(evt: IBasicEvent, ptr: IPointer) {
        if (!this.hasHandlerFor("swipeup", "swipevertical")) return

        // Check that we are panning up.
        const moves = ptr.moves
        const sx = Math.abs(moves.speedX)
        const sy = moves.speedY
        if (sy < sx) return
        // Check that the final point is beneath the initial one.
        const dx = Math.abs(moves.x - moves.startX)
        const dy = moves.y - moves.startY
        if (dy < dx) return
        // Minimal speed for swipe: 100 pixels/second.
        const speed = dy / moves.elapsedTime
        if (speed < 0.1) return
        if (this.handlers.swipeup) {
            this.handlers.swipeup({ ...evt, x: moves.x, y: moves.y, target: this.element })
        }
        if (this.handlers.swipevertical) {
            this.handlers.swipevertical(
                { ...evt, x: moves.x, y: moves.y, target: this.element })
        }
    }

    private recognizeTap(evt: IBasicEvent, ptr: IPointer) {
        // A tap is recognized only if there is less than 400ms
        // Between down and up, and if the pointer has not moves more
        // Than 16px.
        if (!this.handlers.tap || ptr.moves.elapsedTime > 400) return
        const moves = ptr.moves
        const dx = Math.abs(moves.x - moves.startX)
        if (dx > 16) return

        const dy = Math.abs(moves.y - moves.startY)
        if (dy > 16) return

        evt.clear()
        this.handlers.tap({ ...evt, x: moves.x, y: moves.y, target: this.element })
    }
}

export default function(element: Element): Gesture {
    const elem = element as IHTMLElementWithGesture
    let gesture = elem[SYMBOL]
    if (gesture) return gesture

    gesture = new Gesture(elem)
    elem[SYMBOL] = gesture

    return gesture
}
