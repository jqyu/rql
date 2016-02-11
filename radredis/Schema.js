import _             from 'lodash'

import { RadHeader } from '../src'

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

function toRadredisType(type) {
  if (_.isArray(type))
    return 'array'
  if (typeof type === "string" && type.slice(-1) === '!')
    return toRadredisType(type.slice(0, -1))
  if (type === 'integer' || type === 'int')
    return 'integer'
  return 'string'
}

function toRadredis(field) {
  if (_.isArray(field)) {
    return { type: 'array' }
  }
  if (typeof field === 'string') {
    return { type: toRadredisType(field) }
  }
  return field.redis &&
    { type: toRadredisType(field.type)
    , index: field.index
    }

}

function Schema(header) {

  // read source
  if (typeof header === "string")
    header = RadHeader(header)

  const { meta, fields } = header

  const props = _.mapValues
    ( fields
    , toRadredis
    )

  const schema =
    { name: meta.name
    , key: meta.name.toLowerCase()
    , properties: _.assign
        ( {}
        , _.pickBy( props, v => !!v )
        , systemProps
        )
    }

  return schema

}

export default Schema
