import Redis   from 'ioredis'
import Promise from 'bluebird'
import _       from 'lodash'

import { RadRequests
       } from '../src/'

import * as requests from './Source/requests'

function Source(options) {

  const redis = new Redis(options)

  const source =

    { key: `radredis::${options.name}`

    , exec(jobs, cache) {

        // create a new pipeline
        const pipeline = redis.pipeline()

        // add each job to the pipeline
        _.forEach
          ( jobs         // v-- Either perform single or multiple actions
          , ({ req }) => ( req.action || req.actions )( pipeline )
          )

        return pipeline
          .exec()       // Execute pipeline
          .then(r => { // Iterate over all jobs and execute resolve/reject functions
            const len = jobs.length
            // i: current job index, j: current response index
            let j = -1
            for ( let i = 0 ; i < len ; i++) {
              const job = jobs[i]      // get current job
              const { req } = job     // get current request
              j += req.actions       // if request was a multi
                   ? req.count + 2  // advance response pointer accordingly
                   : 1             // otherwise, advance by 1
              const res = r[j]    // get ioredis response
              if (res[0]) {
                job.reject(res[0])
              } else {
                job.resolve(req.parse ? req.parse(res[1]) : res[1])
                // TODO: cache busting
              }
            }
          })
      }

    }

  source.req = RadRequests(source, requests)

  return source

}

export default Source
