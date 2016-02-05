import Redis from 'ioredis'
import _     from 'lodash'

function Requests(src) {

  const requests =
    // ACCESSORS
    { get(id, type) {

      }

    // MUTATORS
    , add(id1, type, id2, params) {
      }

    , delete(id1, type, id2, params) {
      }

    }
  return requests

}

function Radgraph(port, host, options) {

  const redis = new Redis(post, host, options)

  function exec(jobs, bust) {
  }

  const source =
    { key: `radgraph`
    , req: Req(source)
    , exec
    }

  return source

}

export default Radgraph
