import Executor from './Executor'
import Schema from './Schema'
import Radredis from './sources/Radredis'
import Radgraph from './sources/Radgraph'

function RQL(services, types, options) {
  const rsl =
    { executor: Executor({ trace: true })
    , schema: Schema(services, types, options)
    , serve: (req) => null
    }
  return rsl
}

export default RQL
