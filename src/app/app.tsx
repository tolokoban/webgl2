import Fallback from "@/view/fallback"
import Icon from "@/ui/view/icon"
import React, { Suspense } from "react"
import { useHash } from "../ui/hooks/hash"
import "./app.css"

const Test = React.lazy(() => import("@/test"))
const WelcomeArticle = React.lazy(() => import("@/pages/articles/welcome"))
const Webgl2ContextArticle = React.lazy(
    () => import("@/pages/articles/intro/webgl2context")
)
const AttributesArticle = React.lazy(
    () => import("@/pages/articles/intro/attributes")
)
const InstancesArticle = React.lazy(() => import("@/pages/articles/instances"))
const Voronoi1Article = React.lazy(
    () => import("@/pages/articles/voronoi/page1")
)
const Voronoi2Article = React.lazy(
    () => import("@/pages/articles/voronoi/page2")
)
const BasicPerspectiveArticle = React.lazy(
    () => import("@/pages/articles/basic-perspective")
)
const PainterTool = React.lazy(() => import("@/pages/tools/painter"))
const BlackBoardTool = React.lazy(() => import("@/pages/tools/black-board"))

const PAGES: { [hash: string]: JSX.Element } = {
    "#test": <Test />,
    "#article/webgl2context": <Webgl2ContextArticle />,
    "#article/attributes": <AttributesArticle />,
    "#article/basic-perspective": <BasicPerspectiveArticle />,
    "#article/instances": <InstancesArticle />,
    "#article/voronoi1": <Voronoi1Article />,
    "#article/voronoi2": <Voronoi2Article />,
    "#tool/painter": <PainterTool />,
    "#tool/black-board": <BlackBoardTool />,
}

export default function App() {
    const hash = useHash()
    const [showNav, setShowNav] = React.useState(true)
    const page = PAGES[hash]
    const navClassName = (page ? showNav : true) ? "show" : "hide"
    console.log("🚀 [app] page, navClassName = ", page, navClassName) // @FIXME: Remove this line written on 2022-04-01 at 15:36
    return (
        <div className="App">
            <div className="body">
                <Suspense fallback={<Fallback />}>
                    {page ?? <WelcomeArticle />}
                </Suspense>
            </div>
            <nav
                className={`${navClassName} theme-shadow-header theme-color-primary-dark`}
                onClick={() => (window.location.hash = "#")}
            >
                <Icon name="menu" />
                <div>WebGL2 Experiments</div>
                <div></div>
            </nav>
        </div>
    )
}
