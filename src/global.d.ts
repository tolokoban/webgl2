// @see https://v4.webpack.js.org/guides/typescript/

declare module "*.svg" {
    // Loaded as URL.
    const content: string
    export default content
}

declare module "*.png" {
    const value: any
    export = value
}

declare module "*.jpg" {
    const value: any
    export = value
}

declare module "*.jpeg" {
    const value: any
    export = value
}

declare module "*.gif" {
    const value: any
    export = value
}

declare module "*.webp" {
    const value: any
    export = value
}

declare module "*.yaml" {
    const value: any
    export = value
}

declare module "*.css" {
    // Loaded as URL.
    const content: string
    export default content
}

declare module "*.md" {
    const value: string
    export default value
}

declare module "*.vert" {
    const value: string
    export default value
}

declare module "*.frag" {
    const value: string
    export default value
}

declare module "*.code" {
    const value: string
    export default value
}
