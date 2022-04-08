import * as React from "react"
import Markdown from "@/view/markdown"
import Painter from "./painter"
import Scene, { PaintFunc } from "@/view/scene"
import Slider from "@/ui/view/slider"
import Text from "./text.md"
export interface BasicPerspectiveProps {
    className?: string
}

export default function BasicPerspective(props: BasicPerspectiveProps) {
    const [instances, setInstances] = React.useState(1)
    const refInstances = React.useRef(instances)
    React.useEffect(() => {
        refInstances.current = instances
    }, [instances])
    const render = React.useCallback(makeRender(refInstances), [refInstances])
    return (
        <article className={getClassNames(props)}>
            <Slider
                label={`Nombre d'instances : ${instances}`}
                wide={true}
                min={1}
                max={6 * 7}
                steps={1}
                value={instances}
                onChange={setInstances}
            />
            <Scene play={true} onInit={render} />
            <Markdown>{Text}</Markdown>
        </article>
    )
}

function getClassNames(props: BasicPerspectiveProps): string {
    const classNames = ["custom", "BasicPerspective"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function makeRender(refInstances: React.MutableRefObject<number>): any {
    return (gl: WebGL2RenderingContext) => {
        const painter = new Painter(gl, 12, 6 * 7)
        const a = 0.1
        const b = 0.55
        const c = 1
        painter.pokeInstEvery7StaticData(a, b, c)
        painter.pokeInstEvery7StaticData(a, c, b)
        painter.pokeInstEvery7StaticData(b, a, c)
        painter.pokeInstEvery7StaticData(c, a, b)
        painter.pokeInstEvery7StaticData(b, c, a)
        painter.pokeInstEvery7StaticData(c, b, a)
        painter.pushInstEvery7StaticArray()
        for (let i = 0; i < 6 * 7; i++) {
            painter.pokeInstStaticData((i * 360) / (6 * 7))
        }
        painter.pushInstStaticArray()
        painter.pokeVertStaticData(0, 0.3, 0)
        painter.pokeVertStaticData(90, 0.4, 1)
        painter.pokeVertStaticData(-90, 0.4, 1)
        painter.pokeVertStaticData(0, 0.5, 2)
        painter.pokeVertStaticData(120, 0.25, 0.1)
        painter.pokeVertStaticData(180, 0, 1)
        painter.pokeVertStaticData(0, 0.5, 2)
        painter.pokeVertStaticData(-120, 0.25, 0.1)
        painter.pokeVertStaticData(180, 0, 1)
        painter.pokeVertStaticData(0, 0.4, 1)
        painter.pokeVertStaticData(60, 0.4, 2)
        painter.pokeVertStaticData(-60, 0.4, 2)
        painter.pushVertStaticArray()
        gl.clearColor(0, 0, 0, 1)
        return new Promise<PaintFunc>((resolve) => {
            resolve((time) => {
                painter.instCount = refInstances.current
                painter.paint(time, (p, t) => {
                    gl.clear(gl.COLOR_BUFFER_BIT)
                    gl.enable(gl.BLEND)
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
                    p.$uniOpacity(1)
                    p.$uniAngleStep(t * 0.002)
                    p.$uniTrianglesScale(
                        1 + 2 * Math.abs(Math.sin(time * 0.00074545))
                    )
                    const w = gl.drawingBufferWidth
                    const h = gl.drawingBufferHeight
                    if (w > h) {
                        p.$uniScreenScale(h / w, 1)
                    } else {
                        p.$uniScreenScale(1, w / h)
                    }
                })
            })
        })
    }
}
