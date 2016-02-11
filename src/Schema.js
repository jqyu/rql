import _ from 'lodash'

function Schema (GraphQL, R, apis) {

  const { GraphQLSchema
        , GraphQLObjectType
        } = GraphQL

  function addField(fields, field, name) {
    fields[name] =
      { type: R.type(field.type)
      , description: field.description
      , args: R.parseArgs(field.args)
      , resolve: (ctx, a, r) => field.resolve(r.e$, a, ctx, r)
      }
    return fields
  }

  // Parse API to GraphQL type

  function apiSchema(fields, api) {
    const t = new GraphQLObjectType
      ( { name: api.name
        , description: api.description
        , fields: () => _.reduce ( api.fields, addField, {} )
        }
      )
    fields[api.name] =
      { type: t
      // TODO: allow custom resolve hook for an API (i.e. means of handling auth)
      , resolve: () => ({ api: api.name })
      }
    return fields
  }

  function apiMutations(fields, api) {
    _.reduce ( api.mutations, addField, fields )
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
