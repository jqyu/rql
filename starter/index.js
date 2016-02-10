import express     from 'express'
import graphqlHTTP from 'express-graphql'

import RQL         from '../src'

const app = express()

const rql = RQL(require('graphql'))

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
