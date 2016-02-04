import Executor from './Executor'
import Schema from './Schema'
import Radredis from './sources/Radredis'
import Radgraph from './sources/Radgraph'

function RQL(services, options) {
  const rsl =
    { executor: Executor({ trace: true })
    , schema: Schema(services, options)
    , serve: (req) => null
    }
  return rsl
}

export default RQL
