import Radredis from '../../src/services/Radredis'

import maxredis from '../sources/maxredis'

const schema =
  { name: "Post"
  }

const type = Radredis.Type(schema, maxredis)

const service = Radredis.Service(schema, maxredis)

const post =
  { type
  , service
  }

export default post
