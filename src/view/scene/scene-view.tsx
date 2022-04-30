import * as React from "react"
import Checkbox from "@/ui/view/checkbox"
import "./scene-view.css"

export type PaintFunc = (time: number) => void

export interface SceneViewProps {
    className?: string
    play?: boolean
    /**
     * Called when the canvas is ready and WebGL2 context available.
     * @returns A function to call everytime we need to repaint the canvas.
     */
    onInit(gl: WebGL2RenderingContext): Promise<PaintFunc>
    // onDestroy(): void
}

export default function SceneView(props: SceneViewProps) {
    const refPlay = React.useRef(props.play ?? false)
    const [animate, setAnimate] = React.useState(refPlay.current)
    const [fullscreen, setFullscreen] = React.useState(false)
    React.useEffect(() => {
        refPlay.current = animate
    }, [animate])
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
                // `stopTime` and `shiftTime` are used to allow pausing the animation.
                // If we just don't render images for some time, the time still goes on.
                // Then, when we resume rendering, there will be a jump in time.
                // With these variables, we ensure that we resume when we paused.
                let stopTime = 0
                let shiftTime = 0
                const { canvas } = gl
                let play = true
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
                        paint(stopTime + shiftTime)
                    }
                    if (play) {
                        paint(time + shiftTime)
                    }
                    if (play !== refPlay.current) {
                        play = refPlay.current
                        if (play) {
                            shiftTime += stopTime - time
                        } else {
                            stopTime = time
                        }
                    }
                }
                window.requestAnimationFrame(anim)
            })
            .catch(console.error)
    }, [])
    return (
        <div className={getClassNames(props)}>
            <canvas
                className={fullscreen ? "fullscreen" : "theme-shadow-button"}
                ref={refCanvas}
                onDoubleClick={(evt) => {
                    if (!evt.ctrlKey) setFullscreen(!fullscreen)
                }}
            ></canvas>
            <footer>
                <p>Double-clic pour passer en plein écran (et revenir)</p>
                <Checkbox
                    label="Animer"
                    value={animate}
                    onChange={setAnimate}
                />
            </footer>
        </div>
    )
}

function getClassNames(props: SceneViewProps): string {
    const classNames = ["custom", "view-SceneView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
