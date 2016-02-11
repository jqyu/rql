import _ from 'lodash'

function Schema (GraphQL, apis) {

  const {
        // type constructors
          GraphQLSchema
        , GraphQLObjectType
        , GraphQLList
        , GraphQLNonNull

        // built-in scalar types
        , GraphQLID
        , GraphQLString
        , GraphQLInt
        , GraphQLFloat
        , GraphQLBoolean

        } = GraphQL

  // Create type registry

  const types = {}

  // Translate internal type representation to GraphQL type
  function type(obj) {

    // check non-null
    if (obj['!'])
      return new GraphQLNonNull(type(obj['!']))

    // check list
    if (obj.list)
      return new GraphQLList(type(obj.list))
    if (typeof obj === "array")
      return new GraphQLList(obj[0])

    // all other cases
    switch (obj) {

      case 'id':
        return GraphQLID

      case 'int':
      case 'integer':
        return GraphQLInt

      case 'float':
        return GraphQLFloat

      case 'bool':
      case 'boolean':
        return GraphQLBoolean

      case 'string':
        return GraphQLString

      default:
        return types[obj] || GraphQLString

    }

  }

  function parseArgs(args) {
    if (!args) return undefined
    return _.mapValues
      ( args
      , arg => (
          { type: arg.type ? type(arg.type) : type(arg)
          , description: arg.description
          })
      )
  }

  function addField(fields, field, name) {
    fields[name] =
      { type: type(field.type)
      , description: field.description
      , args: parseArgs(field.args)
      , resolve: (o, a, r) => field.resolve(o, r.e$, a, r)
      }
    return fields
  }

  // Parse API to GraphQL type

  function apiSchema(fields, api) {
    const t = new GraphQLObjectType
      ( { name: api.name
        , description: api.description
        , fields: _.reduce ( api.fields, addField, {} )
        }
      )
    fields[api.name] =
      { type: t
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
