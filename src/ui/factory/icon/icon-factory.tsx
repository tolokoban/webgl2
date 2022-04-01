/**
 * We can found material icons here:
 * https://materialdesignicons.com/
 */
import React from "react"
const ICONS = require('./icons.yaml') as {[key: string]: string}

const DEFAULT_ICON: JSX.Element = (
    <svg viewBox="0 0 24 24" preserveAspectRatio="meet xMidYMid">
        <path
            fill="currentColor"
            d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
        />
    </svg>
)

class IconFactory {
    private icons = new Map<string, JSX.Element>()

    register(name: string, svg: JSX.Element) {
        this.icons.set(name, svg)
    }

    registerFromPath(name: string, path: string) {
        this.icons.set(
            name,
            <svg viewBox="0 0 24 24" preserveAspectRatio="meet xMidYMid">
                <path fill="currentColor" d={path} />
            </svg>
        )
    }

    registerMany(icons: { [name: string]: string }) {
        for (const name of Object.keys(icons)) {
            const path = icons[name]
            this.registerFromPath(name, path)
        }
    }

    make(name: string): JSX.Element {
        return this.icons.get(name) ?? DEFAULT_ICON
    }
}

const factory = new IconFactory()

export default factory

factory.registerMany(ICONS)