import Redis from 'ioredis'

function Requests(src) {

  const requests =

    // ACCESSORS
    { getIndex(model, params) {
        const r =
          { src
          , key: `${model}:ids`
          }
        return r
      }

    , get(model, id) {
        const r =
          { src
          , key: `${model}:${id}`
          }
        return r
      }
    // MUTATORS
    }

  return requests

}

function Radredis(options) {

  const redis = null

  function exec(jobs, bust) {

  }

  const source =
    { key: `radredis`
    , req: Requests(source)
    , exec
    }

  return source

}

export default Radredis
