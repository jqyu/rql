import Executor from './Executor'
import Schema from './Schema'

function RQL(GraphQL, apis, types, options) {
  const rsl =
    { Executor
    , Schema

    , RootValue: req => { e$: Executor() }
    , executor: Executor({ trace: true })
    , schema: Schema(GraphQL, apis, types, options)
    , serve: req => null // TODO:
    }
  return rsl
}

export default RQL
