import { match } from "react-router"
import { matchRoutes, RouteConfig } from "react-router-config"
import { isAsyncComponent, TAsyncComponent } from "./async-component"

type TLoadDataProps<M> = {
  match: match<M>
  abortController?: AbortController
  props: any
}
type TLoadDataResult<D> = {
  data?: D
  statusCode?: number
}
export type TLoadData<D, M = {}> = (p: TLoadDataProps<M>) => Promise<TLoadDataResult<D>>

export type TRouteConfig = RouteConfig & {
  loadData?: TLoadData<any, any>
  dataKey?: string
  routes?: TRouteConfig[]
}

type TPromiseConfig = {
  dataKey: string
  promise: Promise<any>
}

export const loadBranchDataObject = async (url: string, routes: TRouteConfig[], props: any) => {
  const branch = matchRoutes(routes, url)
  const promisesConfig: TPromiseConfig[] = branch
    .map(
      ({ route, match }: { route: TRouteConfig; match: match<any> }): TPromiseConfig => {
        return route.loadData
          ? {
              dataKey: route.dataKey,
              promise: route
                .loadData({ match, props })
                .then((res: any) => (res && res.data ? res.data : res)),
            }
          : (Promise.resolve(null) as any)
      }
    )
    .filter(Boolean)

  const results = await Promise.all(promisesConfig.map(c => c.promise))
  const resultsObject = results.reduce(
    (prev, current, index) => {
      prev[promisesConfig[index].dataKey] = current
      return prev
    },
    {} as Record<string, any>
  )
  return resultsObject
}

export function ensure_component_ready(
  url: string,
  routes: TRouteConfig[]
): Promise<React.ComponentType[]> {
  const matches = matchRoutes(routes, url)
  return Promise.all(
    matches.map(match => {
      const component = match.route.component as (React.ComponentType | TAsyncComponent)
      if (isAsyncComponent(component)) {
        return component.load()
      }
      return component
    })
  )
}