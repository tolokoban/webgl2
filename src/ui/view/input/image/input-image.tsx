import './input-image.css'

import * as React from 'react'

import Modal from '../../../modal'
import Dialog from '../../dialog'
import Flex from '../../flex'
import Label from '../../label'
import InputFile from '../file'
import Preview from './preview'

interface IInputImageProps {
    label?: string
    labelUpload?: string
    value?: string
    width: number
    height: number
    scale?: number
    quality?: number
    onChange?(url: string): void
}

interface IInputImageState {
    size: 'cover' | 'contain' | 'fill'
}

export default function InputImage(props: IInputImageProps) {
    const [url, setUrl] = React.useState(props.value ?? '')
    const refCanvas = React.useRef<HTMLCanvasElement | null>(null)
    const label = (props.label ?? '').trim()
    const width = props.width ?? 0
    const height = props.height ?? 0
    const scale = props.scale ?? 1
    const labelUpload = props.labelUpload ?? 'Upload file'
    const viewW = width * scale
    const viewH = height * scale
    useCanvasPainter(refCanvas, width, height, url)
    const handleUpload = makeUploadHandler(width, height, (url: string) => {
        setUrl(url)
        if (props.onChange) {
            props.onChange(url)
        }
    })
    return (
        <div
            style={{
                width: `${viewW}px`,
            }}
        >
            <Flex justifyContent="space-between" alignItems="flex-end">
                <Label value={label} />
                <InputFile
                    onClick={handleUpload}
                    accept="image/*"
                    label={labelUpload}
                    icon="import"
                    wide={true}
                    flat={false}
                />
            </Flex>
            <div
                className="image ui-view-InputImage theme-shadow-button theme-color-section"
                style={{
                    width: `${viewW}px`,
                    height: `${viewH}px`,
                }}
                title={props.value}
            >
                <canvas
                    ref={refCanvas}
                    style={{
                        width: `${viewW}px`,
                        height: `${viewH}px`,
                    }}
                    width={width}
                    height={height}
                ></canvas>
            </div>
        </div>
    )
}

function useCanvasPainter(
    refCanvas: React.MutableRefObject<HTMLCanvasElement | null>,
    width: number,
    height: number,
    url: string
) {
    React.useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas) return

        const asyncAction = async () => {
            canvas.classList.remove('show')
            const img = await loadImage(url)
            if (img) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.clearRect(0, 0, width, height)
                    console.log('Draw Image!')
                    ctx.drawImage(img, 0, 0, width, height)
                }
            }
            canvas.classList.add('show')
        }
        void asyncAction()
    }, [refCanvas, width, height, url])
}

async function loadImage(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
            console.log('Loaded successfuly!')
            resolve(img)
        }
        img.onerror = () => {
            console.error('Unable to load image:', url)
            resolve(null)
        }
        console.log('Loading', url)
        img.src = url
    })
}

function makeUploadHandler(
    width: number,
    height: number,
    setUrl: (url: string) => void
) {
    return (files: FileList) => {
        const file = files[0]
        const reader = new FileReader()
        reader.addEventListener('load', async () => {
            let url = reader.result
            if (typeof url !== 'string') return

            const img = await Modal.wait('Loading...', loadImage(url))
            if (!img) return

            if (Math.abs(width / height - img.width / img.height) < 1e-6) {
                // No need for image adjustement.
                setUrl(url)
                return
            }

            const dialog = Modal.show({
                content: (
                    <Dialog
                        title="Adjust Image"
                        onCancel={() => dialog.hide()}
                        onOK={async () => {
                            dialog.hide()
                            if (typeof url === 'string') setUrl(url)
                        }}
                    >
                        <Preview
                            width={width ?? 0}
                            height={height ?? 0}
                            mode="cover"
                            url={url ?? ''}
                            onChange={(newURL: string) => {
                                url = newURL
                            }}
                        />
                    </Dialog>
                ),
                autoClosable: true,
            })
        })
        reader.readAsDataURL(file)
    }
}
