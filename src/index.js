import Executor from './Executor'
import Registry from './Registry'
import Schema from './Schema'

export function RQL(GraphQL, types, services, apis) {

  const executor = Executor({ trace: true })
  const registry = Registry(GraphQL, types, services)
  const schema = Schema(GraphQL, registry, apis)

  const rql =
    { Executor
    , Schema

    , RootValue: req => { e$: Executor() }
    , executor
    , registry
    , schema
    , serve: req => null // TODO:
    }

  return rql

}

export { RadService
       , RadType
       } from './utils'
