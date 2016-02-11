import express      from 'express'
import graphqlHTTP  from 'express-graphql'

import * as GraphQL from 'graphql'
import { RQL
       , RadService
       , RadType
       } from '../src'

function service(path) {
  return RadService
    ( `services/${path}`
    , require(`./services/${path}`)
    )
}

function type(t) {
  return RadType
    ( `services/models/${t}/type`
    , require(`./services/models/${t}/type`)
    )
}

function typeService(t) {
  return service(`models/${t}/service`)
}

const types =
  { User: type('user')
  , Zone: type('zone')
  }

const services =
  { API: service('api')
  , UserService: typeService('user')
  , ZoneService: typeService('zone')
  }

const app = express()

const rql = RQL(GraphQL, types, services, [ services.API ])

app.use
  ( '/graphql'
  , graphqlHTTP
      ( request => (
          { schema: rql.schema
          , rootValue: rql.RootValue(request)
          , graphiql: true
          })
      )
  )

const server = app.listen(3000, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`RQL starter listening at http://${host}:${port}`)
})
