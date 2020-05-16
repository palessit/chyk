import React, { FC } from "react"
import { Router, StaticRouter } from "react-router"
import { Chyk } from "./chyk"
import { ChykContext } from "./hooks"
import { ChykPreloader } from "./preloader"
import { DataRoutes } from "./routes"

export const ChykComponent: FC<{ chyk: Chyk }> = ({ chyk }) => {
  if (!chyk.history) {
    throw "No history"
  }
  const WrapperComponent = chyk.component || React.Fragment
  return (
    <ChykContext.Provider value={chyk}>
      <Router history={chyk.history}>
        <ChykPreloader>
          <WrapperComponent>
            <DataRoutes routes={chyk.routes} />
          </WrapperComponent>
        </ChykPreloader>
      </Router>
    </ChykContext.Provider>
  )
}

export const ChykStaticComponent: FC<{ chyk: Chyk }> = ({ chyk }) => {
  const WrapperComponent = chyk.component || React.Fragment
  return (
    <ChykContext.Provider value={chyk}>
      <StaticRouter location={chyk.locationState.location} context={chyk.staticRouterContext}>
        <WrapperComponent>
          <DataRoutes routes={chyk.routes} />
        </WrapperComponent>
      </StaticRouter>
    </ChykContext.Provider>
  )
}
