import Executor from './Executor'
import Schema from './Schema'

export function RQL(GraphQL, apis) {

  const rsl =
    { Executor
    , Schema

    , RootValue: req => { e$: Executor() }
    , executor: Executor({ trace: true })
    , schema: Schema(GraphQL, apis)
    , serve: req => null // TODO:
    }

  return rsl

}

export { RadAPIRead
       , RadAPI
       } from './utils'
