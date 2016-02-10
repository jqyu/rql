import Redis from 'ioredis'
import _     from 'lodash'

// data Request
//   = Op    { action  :: Redis -> Redis
//           , parse   :: Maybe (a -> b)
//           , bust    :: Maybe String
//           }
//   | Multi { actions :: Redis -> Redis
//           , count   :: Int
//           , parse   :: Maybe ([a] -> b)
//           , bust    :: Maybe String
//           }

const systemProps =
  { id:
    { type: 'integer'
    , index: true
    }
  , created_at:
    { type: 'integer'
    , index: true
    }
  , updated_at:
    { type: 'integer'
    , index: true
    }
  }

// TODO: these 2 functions can be optimized
// quite heavily using pre-computation
// (JS doesn't have language-level memoization i think)

const indexes = m =>
  _.union
    ( _.keys(m.properties)
        .filter(key => m.properties[key].index)
    , _.keys(systemProps)
    )

const deserialize = m => attributes =>
  _.mapValues
    ( _.fromPairs                     // array -> hashmap
        ( _.chunk (attributes, 2))
    , (value, key) => {               // deserialize fields
        const prop = m.properties[key] || systemProps[key]
        const type = prop && prop.type
        if (type === 'array' || type === 'object')
          return (typeof value === 'string')
            ? JSON.parse(value)
            : value
        else if (type === 'integer')
          return parseInt(value, 10)
        return value
      }
    )

const serialize = attributes =>
  _.mapValues
    ( attributes
    , val =>
        _.isObject(val)
        ? JSON.stringify(val)
        : val
    )

function Requests(src) {

  const requests =

    // ACCESSORS

    { getIndex (m, params) {
        const index = params.index  || 'id'
        const limit = params.limit  || 30
        const from  = params.offset || 0
        const to    = from + limit - 1
        const r =
          { src
          , action: p =>
              p.zrevrange(`${m.key}:indexes:${index}`, from, to)
          }
        return r
      }

    , get (m, id) {
        const r =
          { src
          , key: `${m.key}:${id}`
          , action: p =>
              p.hgetall(`${m.key}:${id}`)
          , parse: deserialize(m)
          }
        return r
      }

    // MUTATORS

    , incrId (m) {
        const r =
          { src
          , action: p =>
              p.incr(`${m.key}:id`)
          }
        return r
      }

    , save (m, attributes) {
        const id = attributes.id
        const n = indexes(m).length
        const r =
          { src
          , actions: p => {
              const t = p.multi()
              t.hmset(`${m.key}:${id}:attributes`, serialize(attributes))
              _.forEach
                ( indexes(m)
                , i =>
                    attributes[i]
                    ? t.zadd(`${m.key}:indexes:${i}`, attributes[i], id)
                    : t.zrem(`${m.key}:indexes:${i}`, id)
                )
              return t.exec()
            }
          , count: 1 + n
          , parse: __ => attributes
          }
        return r
      }

    , destroy (m, id) {
        const n = indexes(m).length
        const r =
          { src
          , actions: p => {
              const t = p.multi()
              _.forEach
                ( indexes(m)
                , i => t.zrem(`${m.key}:indexes:${i}`, id)
                )
              t.del(`${m.key}:${id}:attributes`)
              return t.exec()
            }
          , count: 1 + n
          }
      }

    }

  return requests

}

function Radredis(port, host, options) {

  const redis = new Redis(port, host, options)

  function exec(jobs, bust) {
    const pipeline = redis.multi()
    _.forEach
      ( jobs
      , ({ req, resolve, reject }) =>
          req.action
          ? req.action(pipeline)  // perform single action
          : req.actions(pipeline) // perform multi action
      )
    return pipeline.exec()
      .then(r => {
        for (let i,j = 0; i < jobs.length; i++, j++) {
          const job = jobs[i]
          if (job.actions)
            j += job.count - 1
          const res = r[j]
          if (res[0]) {
            reject(res[0])
          } else {
            resolve(res[1].parse ? job.parse(res[1]) : res[1])
            if (job.bust) bust(job.bust)
          }
        }
      })
  }

  const source =
    { key: `radredis:${options.name}`
    , req: Requests(source)
    , exec
    }

  return source

}

export default Radredis
