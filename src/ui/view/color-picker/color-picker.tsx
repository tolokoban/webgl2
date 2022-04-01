import './color-picker.css'

import * as React from 'react'

import { ensureString } from '../../../tools/type-guards'
import Color from '../../color'
import FloatingButton from '../floating-button'
import Input from '../input/text'
import Gesture from './gesture'
import { IEvent } from './gesture/types'

interface IColorPickerProps {
    label?: string
    labelComplement?: string
    labelInvalidColor?: string
    value: string
    onChange: (color: string) => void
}

interface IColorPickerState {
    color: string
    hue: number
    sat: number
    lum: number
    valid: boolean
}

export default class ColorPicker extends React.Component<
    IColorPickerProps,
    IColorPickerState
> {
    private readonly refWheel: React.RefObject<HTMLDivElement> =
        React.createRef()
    private readonly refBar: React.RefObject<HTMLDivElement> = React.createRef()
    private lastValue = `${Math.random()}`

    state = {
        color: this.props.value,
        hue: 0,
        sat: 0,
        lum: 0,
        valid: Color.isValid(this.props.value),
    }

    private readonly checkForNewProps = () => {
        const { value } = this.props
        if (this.lastValue !== value) {
            this.lastValue = value
            this.updateColor(value)
        }
    }

    componentDidMount() {
        const wheel = this.refWheel.current
        const bar = this.refBar.current

        if (wheel) {
            Gesture(wheel).on({
                down: this.handleSelectHue,
                pan: this.handleSelectHue,
                wheel: this.handleMouseWheel,
            })
        }

        if (bar) {
            Gesture(bar).on({
                down: this.handleBar,
                pan: this.handleBar,
                wheel: this.handleMouseWheel,
            })
        }

        this.checkForNewProps()
    }

    componentDidUpdate = this.checkForNewProps

    private readonly handleBar = (evt: IEvent) => {
        const bar = this.refBar.current
        if (!bar) return
        const rect = bar.getBoundingClientRect()
        const luminance = 1 - evt.y / rect.height
        const { hue, sat, lum } = this.state
        const color = Color.fromHSL(hue, sat, lum)
        color.rgb2hsl()
        color.L = luminance
        color.hsl2rgb()
        this.setState({ lum: luminance })
        this.props.onChange(color.stringify())
    }

    private readonly handleMouseWheel = (evt: WheelEvent) => {
        const LUM_STEP = 0.03125
        const { hue, sat, lum, color } = this.state
        const realColor = new Color(color)
        realColor.H = hue
        realColor.S = sat

        if (evt.deltaY < 0) {
            // Wheel up!
            realColor.L = Math.min(1, lum + LUM_STEP)
        } else if (evt.deltaY > 0) {
            // Wheel down!
            realColor.L = Math.max(0, lum - LUM_STEP)
        }
        realColor.hsl2rgb()

        this.setState({ lum: realColor.L, color: realColor.stringify() })
        this.props.onChange(realColor.stringify())
    }

    private readonly handleSelectHue = (evt: IEvent) => {
        const wheel = this.refWheel.current
        if (!wheel) return
        const rect = wheel.getBoundingClientRect()
        const x = 2 * (evt.x / rect.width - 0.5)
        const y = 2 * (evt.y / rect.height - 0.5)
        const a = Math.PI + Math.atan2(x, -y)
        const hue = a / (2 * Math.PI)
        const sat = Math.min(1, Math.sqrt(x * x + y * y))
        const lum = this.state.lum
        const color = Color.fromHSL(hue, sat, lum)
        const value = color.stringify()
        this.setState({ color: value, hue, sat })
        this.props.onChange(value)
    }

    private readonly handleComplementClick = () => {
        const color = new Color(this.state.color)
        color.rgb2hsl()
        color.H += 0.5
        if (color.H > 1) color.H--
        color.hsl2rgb()
        this.setState({
            color: color.stringify(),
            hue: color.H,
            sat: color.S,
            lum: color.L,
        })
        this.props.onChange(color.stringify())
    }

    private readonly handleRandomClick = () => {
        const color = Color.fromArrayRGB([
            Math.random(),
            Math.random(),
            Math.random(),
        ])
        this.updateColor(color)
    }

    private readonly updateColor = (value: string | Color) => {
        const color = Color.fromColorOrString(value)
        color.rgb2hsl()
        this.setState({
            color: color.stringify().toUpperCase(),
            hue: color.H,
            sat: color.S,
            lum: color.L,
        })
        this.props.onChange(color.stringify())
    }

    render() {
        const { hue, sat, lum } = this.state
        const cursorColor = Color.fromHSL(hue, sat, lum)
        const r = sat * 50
        const a = hue * Math.PI * 2
        const xx = r * Math.cos(a)
        const yy = r * Math.sin(a)
        const x = 50 - yy
        const y = 50 + xx
        const barMainColor = Color.fromHSL(hue, 1, 0.5)

        return (
            <div className="tfw-view-ColorPicker">
                <header>
                    <Input
                        wide={true}
                        label={this.props.label}
                        value={this.state.color.toUpperCase()}
                        backgroundColor={this.state.color}
                        focus={true}
                        // error={ensureString(
                        //     this.props.labelInvalidColor,
                        //     'Invalid color!'
                        // )}
                        validator={Color.isValid}
                        onChange={this.updateColor}
                    />
                    <FloatingButton
                        icon="refresh"
                        small={true}
                        enabled={this.state.valid}
                        onClick={this.handleComplementClick}
                    />
                    <FloatingButton
                        icon="random"
                        small={true}
                        enabled={this.state.valid}
                        onClick={this.handleRandomClick}
                    />
                </header>
                <div className="flex">
                    <div ref={this.refWheel} className="wheel">
                        <div
                            style={{
                                background: cursorColor.stringify(),
                                left: `${x}%`,
                                top: `${y}%`,
                            }}
                            className="disk"
                        />
                    </div>
                    <div
                        ref={this.refBar}
                        style={{
                            boxShadow: '0 0 0px 1px rgba(0,0,0,.5)',
                            background: `linear-gradient(to top,#000,${barMainColor.stringify()},#fff)`,
                            borderRadius: '2px',
                        }}
                        className="bar"
                    >
                        <div
                            style={{ top: `${100 * (1 - lum)}%` }}
                            className="cursor"
                        />
                    </div>
                </div>
                <div className="info">
                    <div>
                        <span>Hue: </span>
                        <b>{`${Math.floor(360 * hue)}`}</b>
                    </div>
                    <div>
                        <span>Sat: </span>
                        <b>{`${Math.floor(100 * sat)}`}</b> %
                    </div>
                    <div>
                        <span>Lum: </span>
                        <b>{`${Math.floor(100 * lum)}`}</b> %
                    </div>
                </div>
            </div>
        )
    }
}
