/**
 * If the image as not the same aspect ratio than the container,
 * we need to fit it, crop it or deform it.
 */
import * as React from "react"
import Touchable from '../../../touchable'
import './preview-input-image.css'


// const _ = Tfw.Intl.make(require('./preview-input-image.json'))
export type IMode = "cover" | "contain" | "resize"

export interface IPreviewInputImageProps {
    url: string
    width: number
    height: number
    mode: IMode
    onChange(url: string): void
    className?: string
}

// tslint:disable-next-line: no-empty-interface
interface IPreviewInputImageState {
    mode: IMode
    img?: HTMLImageElement
}

const MODES: IMode[] = ['cover', 'contain', 'resize']
const MIN_WIDTH = 300
const MARGIN = 32

export default class PreviewInputImage extends React.Component<IPreviewInputImageProps, IPreviewInputImageState> {
    private refPreviews = {
        cover: React.createRef<HTMLCanvasElement>(),
        contain: React.createRef<HTMLCanvasElement>(),
        resize: React.createRef<HTMLCanvasElement>()
    }
    private refCanvas = React.createRef<HTMLCanvasElement>()
    state: IPreviewInputImageState = {
        mode: this.props.mode
    }

    componentDidMount() {
        const canvas = this.refCanvas.current
        const coverPreview = this.refPreviews.cover.current
        const containPreview = this.refPreviews.contain.current
        const resizePreview = this.refPreviews.resize.current
        if (!canvas || !coverPreview || !containPreview || !resizePreview) {
            return
        }

        const { width, height } = this.props
        const previewWidth = width < MIN_WIDTH
            ? MIN_WIDTH
            : (width - MARGIN) / MODES.length
        const previewHeight = height * previewWidth / width
        setCanvasSize(canvas, width, height)
        setCanvasSize(coverPreview, previewWidth, previewHeight)
        setCanvasSize(containPreview, previewWidth, previewHeight)
        setCanvasSize(resizePreview, previewWidth, previewHeight)
        // Load input image.
        this.setState({ img: undefined })
        const img = new Image()
        img.src = this.props.url
        img.onload = () => this.setState({ img }, this.refresh)
    }

    componentDidUpdate() {
        this.refresh()
    }

    private refresh = () => {
        const canvas = this.refCanvas.current
        const coverPreview = this.refPreviews.cover.current
        const containPreview = this.refPreviews.contain.current
        const resizePreview = this.refPreviews.resize.current
        if (!canvas || !coverPreview || !containPreview || !resizePreview) {
            return
        }

        const { mode, img } = this.state
        if (!img) return

        paintCanvas(mode, img, canvas)
        paintCanvas('cover', img, coverPreview)
        paintCanvas('contain', img, containPreview)
        paintCanvas('resize', img, resizePreview)

        this.props.onChange(canvas.toDataURL("image/png"))
    }

    private handleModeChange(mode: IMode) {
        this.setState({ mode })
    }

    render() {
        const { mode } = this.state
        const classNames = [
            'custom',
            'view-inputImage-PreviewInputImage',
            'thm-bg2'
        ]
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <h2>Choose format</h2>
            <header>
                {
                    MODES.map(
                        m => <Touchable
                            onClick={() => this.handleModeChange(m)}
                        >
                            <canvas
                                key={`preview-${m}`}
                                ref={this.refPreviews[m]}
                                className={
                                    `preview ${m === mode ? 'selected' : ''}`
                                }
                            ></canvas>
                        </Touchable>
                    )
                }
            </header>
            <h2>Preview</h2>
            <canvas ref={this.refCanvas} className='canvas'></canvas>
        </div>
    }
}

function setCanvasSize(canvas: HTMLCanvasElement, w: number, h: number) {
    const ww = Math.floor(0.5 + w)
    const hh = Math.floor(0.5 + h)
    canvas.style.width = `${ww}px`
    canvas.style.height = `${hh}px`
    canvas.setAttribute("width", `${ww}`)
    canvas.setAttribute("height", `${hh}`)
}

function paintCanvas(
    mode: IMode,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement
) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    clearCanvas(canvas)
    const { x, y, w, h } = computeSize(mode, img, canvas)
    ctx.drawImage(img, x, y, w, h)
}

function clearCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    )
}

function computeSize(
    size: IMode,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement
) {
    if (size === "resize") {
        return { x: 0, y: 0, w: canvas.width, h: canvas.height }
    }
    if (size === "contain") {
        return computeSizeContain(img, canvas)
    }
    return computeSizeCover(img, canvas);
}

function computeSizeContain(img: HTMLImageElement, canvas: HTMLCanvasElement) {
    const scaleW = canvas.width / img.width;
    const scaleH = canvas.height / img.height;
    const scale = Math.min(scaleW, scaleH);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    return { x, y, w, h };
}

function computeSizeCover(img: HTMLImageElement, canvas: HTMLCanvasElement) {
    const scaleW = canvas.width / img.width;
    const scaleH = canvas.height / img.height;
    const scale = Math.max(scaleW, scaleH);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    return { x, y, w, h };
}
