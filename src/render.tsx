import React, { FC } from "react"
import { render, hydrate } from "react-dom"
import { Chyk } from "../src/chyk"
import { ChykContext } from "./hooks"
import { Router, StaticRouter } from "react-router"
import { DataRoutes } from "./routes"
import { ChykPreloader } from "./preloader"

export const chykHydrateOrRender = (chyk: Chyk) => {
  if (!chyk.el) {
    throw "No renderer for no element"
  }
  const renderer = chyk.el.childNodes.length === 0 ? render : hydrate
  renderer(<ChykComponent chyk={chyk} />, chyk.el)
}

export const ChykComponent: FC<{ chyk: Chyk }> = ({ chyk }) => {
  return (
    <ChykContext.Provider value={chyk}>
      <Router history={chyk.history!}>
        <ChykPreloader>
          <DataRoutes routes={chyk.routes} />
        </ChykPreloader>
      </Router>
    </ChykContext.Provider>
  )
}

export const ChykStaticComponent: FC<{ chyk: Chyk }> = ({ chyk }) => {
  return (
    <ChykContext.Provider value={chyk}>
      <StaticRouter
        location={chyk.currentLocationState.location}
        context={chyk.staticRouterContext}
      >
        <DataRoutes routes={chyk.routes} />
      </StaticRouter>
    </ChykContext.Provider>
  )
}
