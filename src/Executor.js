// Executor is a thunk that produces an executor instance `exec`
// this instance is used to execute requests and returns
// promises containing the responses

// An executor instance contains a local job queue and cache
// Executor instances should be spawned for each request to
// prevent blocking and prevent cache failures

// If cross-request caching is required, implement it on the data source

import Redis   from 'ioredis'
import Promise from 'bluebird'
import _       from 'lodash'

// Type Declarations:

// type BustCache = Cache -> String -> Cache

// type DataSource d =
//   { key  :: String               -- cache key (mandatory)
//
//          -- for some heterogeneous a b:
//   , req  :: [ a -> Request d b ] -- request constructors
//
//          -- for some heterogeneous a:
//   , exec :: [ Job d a ]          -- requests to perform
//          -> BustCache            -- cache busting side effect
//          -> Promise              -- responses
//   }

// type Request d a = forall r.
//   (DataSource d) =>
//   { type :: String        -- reflecting typename of a
//   , src  :: d             -- reference to DataSource
//   , key  :: Maybe String  -- cache key (if cacheable)
//   | r
//   }

// type Job d a =
//   { req     :: Request d a     -- reference to request
//   , resolve :: Promise.resolve -- reference to resolve function
//   , reject  :: Promise.reject  -- reference to reject function
//   }


// Executor :: Executor
function Executor(opts) {

  // debugging flags
  const trace = opts && opts.trace

  // number of round trips
  let rtCount = 0

  const cache = {} // :: Map DataSourceKey (Map RequestKey a)

  let queue = []   // :: forall a. Job r a

  // track dispatcher state
  let curJob = Promise.resolve()
  let nextJob = null

  const bust = k => key => {
      cache[k][key] = null
    }

  // SIDE EFFECT: empties queue, resolves promises, changes job state
  function dispatchQueue () {

    // copy and swap queue
    const q = queue
    queue = []

    // group jobs by type
    const jobs = _.groupBy(q, 'req.src.key')

    nextJob = null   // copy and swap jobs,
    return curJob =  // mapping all job groups to
      Promise.all    // | the exec functions of their
        ( _.map      // | respective data sources
           ( jobs,
             (rs, k) => rs[0].src            // data source
                          .exec(rs, bust(k)) // call exec
           )
        )

  }


  // enqueue :: Request r a -> Promise a
  // SIDE EFFECT: adds a `Job r a` to queue
  function enqueue (r) {
    return new Promise((resolve, reject) => {
      // add job to queue
      queue.push( { req: r
                  , resolve
                  , reject
                  })
      if (!nextJob)
        nextJob = curJob.then(dispatchQueue)
    })
  }

  const e$ =

    // -- for some heterogeneous d a:
    // fetch :: Request d a -> Promise a
    { fetch (r) {
        // avoid nasty undefined errors
        if (!cache[r.src.key]) cache[r.key] = {}

        // not cacheable, move on with our lives
        if (!key)
          return enqueue(r)

        const cached = cache[r.src.key][r.key]

        // enqueue if not cached
        const res = cached || enqueue(r)

        // if cacheable, cache, avoiding double-fetches
        if (!cached)
          cache[r.src.key][r.key] = res

        return res
      }

    // fetchAll :: [ Request d a ] -> [ Promise a ]
    , fetchAll (...rs) {
        return Promise.map( rs )
      }

    // exec :: ServiceRequest a -> Promise a
    , exec (r, args) {
        // TODO: type validations
        return r.resolve(e$, args)
      }

    }

  return e$

}

export default Executor
