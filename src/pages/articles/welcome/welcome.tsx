import * as React from "react"
import Markdown from "@/view/markdown"
import WelcomeContent from "./welcome.md"
import "./welcome.css"


export interface WelcomeProps {
    className?: string
}

export default function Welcome(props: WelcomeProps) {
    return <article className={getClassNames(props)}>
        <Markdown>{WelcomeContent}</Markdown>
    </article>
}


function getClassNames(props: WelcomeProps): string {
    const classNames = ['custom', 'pages-tools-Welcome']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
