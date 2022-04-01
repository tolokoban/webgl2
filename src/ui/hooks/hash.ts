import * as React from "react"

export function useHash(): string {
    const [hash, setHash] = React.useState(window.location.hash)
    React.useEffect(()=>{
        const handleHashChange = (evt: HashChangeEvent)=>{
            console.log('🚀 [hash] evt.newURL = ', evt.newURL) // @FIXME: Remove this line written on 2022-04-01 at 14:50
            setHash(window.location.hash)
        }
        window.addEventListener("hashchange", handleHashChange)
        return ()=>window.removeEventListener("hashchange", handleHashChange)
    }, [])
    return hash
}