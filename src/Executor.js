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

  const cache = {} // :: Map DataSourceKey (Map RequestKey (forall a. a))

  let queue = []   // :: forall a. Job r a

  // track dispatcher state
  let curJob = Promise.resolve()
  let nextJob = null

  // SIDE EFFECT: empties queue, resolves promises, changes job state
  function dispatchQueue () {

    // copy and swap queue
    const q = queue
    queue = []

    // group jobs by type
    const jobs = _.groupBy(q, 'req.src.key')

    nextJob = null   // copy and swap jobs,
    return curJob = // mapping all job groups to
      Promise.all  //  | the exec functions of their
        ( _.map   //   | respective data sources
           ( jobs,
             (rs, k) =>
               rs[0].req.src                 // data source
                        .exec(rs, cache[k]) // call exec
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
    // exec :: Request d a -> Promise a
    { exec(r) {
        // avoid nasty undefined errors
        if (!cache[r.src.key]) cache[r.src.key] = {}

        // not cacheable, move on with our lives
        if (!r.key)
          return enqueue(r)

        // check cache, enqueue if not found
        return cache[r.src.key][r.key]
          || ( cache[r.src.key][r.key] = enqueue(r) )

      }

    // CONVENIENCE METHODS

    // all :: [ Request d a ] -> [ Promise a ]
    , all: rs =>
        Promise.all( _.map( rs, e$.exec ))

    // map :: [ b ] -> ( b -> Request d a ) -> [ Promise a ]
    , map: ( rs, fn ) =>
        e$.all( _.map( rs , fn ) )

    }

  return e$

}

export default Executor
