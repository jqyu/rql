import Redis from 'ioredis'

function Requests(src) {

  const requests =
    // ACCESSORS
    { get() {

      }
    // MUTATORS
    , add(id1, type, id2, params) {
      }

    , delete(id1, type, id2, params) {
      }

    }
  return requests

}

function Radgraph(options) {

  const redis = null

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
