import * as React from "react"
import "./fallback-view.css"

export interface FallbackViewProps {
    className?: string
}

export default function FallbackView(props: FallbackViewProps) {
    return <div className={getClassNames(props)}>
        Chargement en  cours...
    </div>
}


function getClassNames(props: FallbackViewProps): string {
    const classNames = ['custom', 'view-FallbackView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
