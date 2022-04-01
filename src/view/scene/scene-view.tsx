import * as React from "react"
import "./scene-view.css"

export type PaintFunc = (time: number) => void

export interface SceneViewProps {
    className?: string
    /**
     * Called when the canvas is ready and WebGL2 context available.
     * @returns A function to call everytime we need to repaint the canvas.
     */
    onInit(gl: WebGL2RenderingContext): Promise<PaintFunc>
    // onDestroy(): void
}

export default function SceneView(props: SceneViewProps) {
    const refCanvas = React.useCallback((node: HTMLCanvasElement | null) => {
        if (!node) return

        const gl = node.getContext("webgl2")
        if (!gl) {
            console.error("Unable to create a WebGL2 Context!")
            return
        }

        props
            .onInit(gl)
            .then((paint) => {
                let lastWidth = 0
                let lastHeight = 0
                const { canvas } = gl
                const anim = (time: number) => {
                    window.requestAnimationFrame(anim)
                    const width = Math.ceil(canvas.clientWidth)
                    const height = Math.ceil(canvas.clientHeight)
                    if (width !== lastWidth || height !== lastHeight) {
                        lastWidth = width
                        lastHeight = height
                        canvas.width = width
                        canvas.height = height
                        gl.viewport(0, 0, width, height)
                        console.log(width, height)
                    }
                    paint(time)
                }
                window.requestAnimationFrame(anim)
            })
            .catch(console.error)
    }, [])
    return <canvas className={getClassNames(props)} ref={refCanvas}></canvas>
}

function getClassNames(props: SceneViewProps): string {
    const classNames = ["custom", "view-SceneView", "theme-shadow-button"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
