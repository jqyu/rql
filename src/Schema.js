import _ from 'lodash'

function Schema (GraphQL, R, apis) {

  const { GraphQLSchema
        , GraphQLObjectType
        } = GraphQL

  // Parse API to GraphQL type

  function apiSchema(fields, api) {
    const t = new GraphQLObjectType
      ( { name: api.name
        , description: api.description
        , fields: () => _.reduce ( api.fields, R.addField, {} )
        }
      )
    fields[api.name] =
      { type: t
      // TODO: allow custom resolve hook for an API (i.e. means of handling auth)
      , resolve: api.resolve
          ? (__, a, r) => api.resolve(r.e$, a, r)
          : () => ({ api: api.name })
      }
    return fields
  }

  function apiMutations(fields, api) {
    _.reduce ( api.mutations, R.addField, fields )
    return fields
  }


  const Query = new GraphQLObjectType
    ( { name: 'RootQueryType'
      , fields: () => _.reduce ( apis, apiSchema, {} )
      }
    )

  const Mutation = new GraphQLObjectType
    ( { name: 'RootMutationType'
      , fields: () => _.reduce ( apis, apiMutations, {} )
      }
    )

  const schema = new GraphQLSchema(
    { query: Query
    , mutation: Mutation
    })

  return schema

}

export default Schema
