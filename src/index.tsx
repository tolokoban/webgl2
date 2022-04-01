import App from "./app"
import Color from "@/ui/color"
import React from "react"
import ReactDOM from "react-dom"
import Theme from "@/ui/theme"
import "./index.css"

function start() {
    Theme.apply({
        colors: {
            black: "#000",
            white: "#fff",
            error: "#f30",
            input: "#fff",
            section: "#ddd",
            frame: "#bbb",
            screen: "#999",
            primary: Theme.shade("#9cd"),
            accent: Theme.shade("#f80")
        }
    })
    console.log("VERSION", React.version)
    // Use the following as soon as Types are available for React 18.
    // ReactDOM.createRoot(document.getElementById("ROOT")).render(
    //     <React.StrictMode>
    //         <App />
    //     </React.StrictMode>
    // )
    // Create main component.
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById("root")
    )

    // Remove splash screen.
    removeSplashScreen()
}

function removeSplashScreen() {
    const SPLASH_VANISHING_DELAY = 900
    const splash = document.getElementById('tgd-logo')
    if (!splash) return

    splash.classList.add('vanish')
    window.setTimeout(() => {
        const parent = splash.parentNode
        if (!parent) return

        parent.removeChild(splash)
    }, SPLASH_VANISHING_DELAY)
}

start()
