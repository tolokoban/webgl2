import { Token } from "./lexer"

export interface Point {
    name: string
    x: number
    y: number
    visible: boolean
}

interface StylesShape {
    stroke: string
    fill: string
    thickness: number
}

export interface Polyline extends StylesShape {
    type: "polyline"
    start: [x: number, y: number]
    points: Array<[x: number, y: number]>
}

export interface Circle extends StylesShape {
    type: "circle"
    center: [x: number, y: number]
    radius: number
}

export type Shape = Polyline | Circle

const COLORS = {
    "0": "none",
    "1": "#000",
    "2": "#06f",
    "3": "#ffa500",
    "4": "#888",
    "5": "#8aafff",
    "6": "#ffd380",
    "7": "#0005",
    "8": "#06f5",
    "9": "#ffa50055",
    R: "#f00",
    G: "#0f0",
    B: "#00f",
    r: "#f007",
    g: "#0f07",
    b: "#00f7",
    W: "#fff",
    w: "#fff7",
}

export default class Scanner {
    public readonly shapes: Shape[] = []
    private readonly pointsMap: { [key: string]: Point } = {}
    private tokenIndex = 0
    private stroke = COLORS["1"]
    private fill = COLORS["1"]
    private thickness = 1

    constructor(
        private readonly code: string,
        private readonly tokens: Token[]
    ) {
        const parsers: Array<(token: Token) => boolean> = [
            this.parseLine,
            this.parsePlot,
            this.parsePoly,
            this.parsePoint,
            this.parseColor,
            this.parseCircle,
            this.parseThickness,
        ]
        while (true) {
            const token = this.next()
            if (token.name === "END") break

            let found = false
            for (const parser of parsers) {
                if (parser(token)) {
                    found = true
                    break
                }
            }
            if (!found) throw Error(this.error(token.pos, "Code non reconnu !"))
        }
    }

    public get points() {
        return Object.values(this.pointsMap)
    }

    private get style(): StylesShape {
        return {
            fill: this.fill,
            stroke: this.stroke,
            thickness: this.thickness,
        }
    }

    private error(pos: number, message: string) {
        const before = this.code.substring(0, pos)
        const after = this.code.substring(pos)
        const prevLineBreak = before.lastIndexOf("\n")
        const nextLineBreak = before.indexOf("\n")
        const start = prevLineBreak === -1 ? 0 : prevLineBreak
        const end = nextLineBreak === -1 ? this.code.length : nextLineBreak
        let current = this.code.substring(start, end)
        let index = pos - start
        while (index > 30) {
            current = current.substring(10)
            index -= 10
        }
        return `${current}\n${spc(index)}^\n${message}`
    }

    private getPoint(name: string): Point {
        const point = this.pointsMap[name]
        if (!point) throw Error(`Le point "${name}" n'a pas été défini !`)

        return point
    }

    private readonly parsePoint = (token: Token): boolean => {
        if (token.name !== "NAME") return false

        const name = token.value
        try {
            const tknOpen = this.next("OPEN_PAR", "OPEN_BRA")
            switch (tknOpen.name) {
                case "OPEN_PAR":
                    const tknX = this.next("NUMBER")
                    const tknY = this.next("NUMBER")
                    this.next("CLOSE_PAR")
                    this.pointsMap[name] = {
                        name,
                        x: parseFloat(tknX.value),
                        y: parseFloat(tknY.value),
                        visible: false,
                    }
                    return true
                case "OPEN_BRA":
                    let count = 0
                    let x = 0
                    let y = 0
                    let weight = 1
                    while (true) {
                        const tkn = this.next("NAME", "NUMBER", "CLOSE_BRA")
                        if (tkn.name === "CLOSE_BRA") break

                        if (tkn.name === "NUMBER") {
                            weight = parseFloat(tkn.value)
                            continue
                        }
                        const point = this.getPoint(tkn.value)
                        count += weight
                        x += point.x * weight
                        y += point.y * weight
                        weight = 1
                    }
                    if (count === 0)
                        throw Error("Mauvaise syntaxe pour le barycentre !")
                    this.pointsMap[name] = {
                        name,
                        x: x / count,
                        y: y / count,
                        visible: false,
                    }
                    return true
            }
            return false
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour le point "${name}" !\n${ex}`
                )
            )
        }
    }

    private readonly parsePoly = (token: Token): boolean => {
        if (token.name !== "OPEN_BRA") return false

        try {
            const poly: Polyline = {
                type: "polyline",
                points: [],
                start: [0, 0],
                ...this.style,
            }
            let first = true
            while (true) {
                const tkn = this.next("NAME", "CLOSE_BRA")
                if (tkn.name === "CLOSE_BRA") break

                const { x, y } = this.getPoint(tkn.value)
                if (first) {
                    first = false
                    poly.start = [x, y]
                } else {
                    poly.points.push([x, y])
                }
            }
            this.shapes.push(poly)
            return true
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour le polygone !\n${ex}`
                )
            )
        }
    }

    private readonly parseLine = (token: Token): boolean => {
        if (token.name !== "OPEN_PAR") return false

        try {
            const poly: Polyline = {
                type: "polyline",
                points: [],
                start: [0, 0],
                ...this.style,
            }
            const A = this.getPoint(this.next("NAME").value)
            const tkn = this.next("NAME", "PIPE")
            const median = tkn.name === "PIPE"
            const B = this.getPoint(
                median ? this.next("NAME").value : tkn.value
            )
            this.next("CLOSE_PAR")
            if (median) {
                const vx = B.y - A.y
                const vy = A.x - B.x
                const x = (A.x + B.x) / 2
                const y = (A.y + B.y) / 2
                poly.start = [x - vx * 1e5, y - vy * 1e5]
                poly.points = [[x + vx * 1e5, y + vy * 1e5]]
            } else {
                const vx = B.x - A.x
                const vy = B.y - A.y
                poly.start = [A.x - vx * 1e5, A.y - vy * 1e5]
                poly.points = [[A.x + vx * 1e5, A.y + vy * 1e5]]
            }
            this.shapes.push(poly)
            return true
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour le polygone !\n${ex}`
                )
            )
        }
    }

    private readonly parsePlot = (token: Token): boolean => {
        if (token.name !== "OPEN_CUR") return false

        try {
            while (true) {
                const tkn = this.next("NAME", "CLOSE_CUR")
                if (tkn.name === "CLOSE_CUR") break

                const point = this.getPoint(tkn.value)
                point.visible = true
            }
            return true
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour les points à afficher !\n${ex}`
                )
            )
        }
    }

    private readonly parseCircle = (token: Token): boolean => {
        if (token.name !== "AT") return false

        try {
            const circle: Circle = {
                type: "circle",
                center: [0, 0],
                radius: 1,
                ...this.style,
            }
            const center = this.getPoint(this.next("NAME").value)
            circle.center = [center.x, center.y]
            circle.radius = parseFloat(this.next("NUMBER").value)
            this.shapes.push(circle)
            return true
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour le polygone !\n${ex}`
                )
            )
        }
    }

    private readonly parseColor = (token: Token): boolean => {
        if (token.name !== "COLOR") return false

        this.stroke = COLORS[token.value.charAt(1)] ?? "none"
        this.fill = COLORS[token.value.charAt(2)] ?? "none"
        return true
    }

    private readonly parseThickness = (token: Token): boolean => {
        if (token.name !== "PERCENT") return false

        this.thickness = parseFloat(this.next("NUMBER").value)
        return true
    }

    private test(action: () => void): boolean {
        const savedTokenIndex = this.tokenIndex
        try {
            action()
            return true
        } catch (ex) {
            this.tokenIndex = savedTokenIndex
            return false
        }
    }

    private next(...expected: string[]): Token {
        const token = this.tokens[this.tokenIndex++]
        if (expected.length === 0) return token ?? { name: "END", value: "" }

        if (!token || !expected.includes(token.name))
            throw Error(
                `Attendu ${expected
                    .map((tkn) => `"${tkn}"`)
                    .join(" ou ")} mais reçu "${token?.name}" !`
            )
        return token
    }

    private back(steps = 1) {
        this.tokenIndex = Math.max(0, this.tokenIndex - steps)
    }
}

function spc(index: number) {
    let text = ""
    while (index-- > 0) text += " "
    return text
}
