import _ from 'lodash'

// HELPERS

const indexes = s =>
  _.keys(s.properties)
    .filter(key => s.properties[key].index)

const deserialize = s => attributes =>
  _.mapValues
    ( attributes
    , (value, key) => {               // deserialize fields
        const prop = s.properties[key]
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

// IMPLEMENTATIONS

export function getIndex(s, params = {}) {

  const index = params.index  || 'id'
  const limit = params.limit  || 30
  const from  = params.offset || 0
  const to    = from + limit - 1

  const r =
    { action: p =>
        p.zrevrange(`${s.key}:indexes:${index}`, from, to)
    }

  return r

}

export function get(s, id) {

  const r =
    { key: `${s.key}:${id}`
    , action: p =>
        p.hgetall(`${s.key}:${id}:attributes`)
    , parse: deserialize(s)
    }

  return r

}

export function incrId(s) {

  const r =
    { action: p =>
        p.incr(`${s.key}:id`)
    }

  return r

}

export function save(s, attributes) {

  const id = attributes.id
  const idxs = indexes(s)

  const r =
    { actions: p => {
        const t = p.multi()
        t.hmset(`${s.key}:${id}:attributes`, serialize(attributes))
        _.forEach
          ( idxs
          , idx =>
              attributes[idx]
              ? t.zadd(`${s.key}:indexes:${idx}`, attributes[idx], id)
              : t.zrem(`${s.key}:indexes:${idx}`, id)
          )
        return t.exec()
      }
    , count: 1 + idxs.length
    , parse: __ => attributes
    , busts: [ `${s.key}:${id}` ]
    }

  return r

}

export function destroy(s, id) {

  const idxs = indexes(s)

  const r =
    { actions: p => {
        const t= p.multi()
        _.forEach
          ( idxs
          , idx => t.zrem(`${s.key}:indexes:${idx}`, id)
          )
        t.del(`${s.key}:${id}:attributes`)
        return t.exec()
      }
    , count: 1 + idxs.length
    , busts: [ `${s.key}:${id}` ]
    }

  return r

}
