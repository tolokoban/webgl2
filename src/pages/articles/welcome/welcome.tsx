import * as React from "react"
import Markdown from "markdown-to-jsx"
import WelcomeContent from "./welcome.md"
import "./welcome.css"


export interface WelcomeProps {
    className?: string
}

export default function Welcome(props: WelcomeProps) {
    return <div className={getClassNames(props)}>
        <Markdown>{WelcomeContent}</Markdown>
    </div>
}


function getClassNames(props: WelcomeProps): string {
    const classNames = ['custom', 'pages-tools-Welcome']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
