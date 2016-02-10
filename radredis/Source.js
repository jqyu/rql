import Redis from 'ioredis'
import _     from 'lodash'

function Source(options) {

  const redis = new Redis(options)

  const source =

    { key: `radredis::${options.name}`

    , req: null // TODO: zip and stuff zip.requests(source, yaml, impl)

    , exec(jobs, cache) {

        // create a new pipeline
        const pipeline = redis.multi()

        // add each job to the pipeline
        _.forEach
          ( jobs         // v-- Either perform single or multiple actions
          , ({ req }) => ( req.action || req.actions )(pipeline)
          )

        return pipeline
          .exec()       // Execute pipeline
          .then(r => { // Iterate over all jobs and execute resolve/reject functions
            for ( let i, j = 0     // i <- current job index
                ; i < jobs.length // j <- current response index
                ; i++, j++
                ) {
              const job = jobs[i]     // get current job
              if (job.actions)       // if current job is a multi,
                j += job.count - 1  // advance result pointer to end of queue
              const res = r[j]     // get ioredis response
              if (res[0]) {
              } else {
              }
            }
          })
      }

    }

  return source

}

export default Source
