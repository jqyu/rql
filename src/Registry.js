import _ from 'lodash'

function Registry(GraphQL, types, services) {

  const { GraphQLObjectType
        , GraphQLList
        , GraphQLNonNull
        // built-in scalars
        , GraphQLID
        , GraphQLString
        , GraphQLInt
        , GraphQLFloat
        , GraphQLBoolean
        } = GraphQL

  const registry =

    // hash maps of types and services
    { types
    , services
    }

  function type(obj) {
    // check non-null
    if (obj['!'])
      return new GraphQLNonNull(type(obj['!']))
    if (typeof obj === "string" && obj.slice(-1) === '!')
      return new GraphQLNonNull(obj.slice(0, -1))
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
        return types[obj]
          ? registry.types[obj].type
          : GraphQLString
    }
  }

  function service(name) {
    return registry.services[name].service
  }

  function serviceFor(typeName) {
    return registry.types[typeName].service
  }

  function parseArgs(args) {
    if (!args)
      return undefined
    return _.mapValues
      ( args
      , arg => (
          { type: type(arg.type || arg)
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
  }

  // populate registry

  function registerService(s) {
    registry.services[s.name] = s
  }

  function registerType(t) {
    const gqlType = new GraphQLObjectType
      ( { name: t.name
        , description: t.description
        , fields: () => _.reduce ( t.fields, addField, {} )
        }
      )
    registry.types[t.name] =
      { name:        t.name
      , description: t.description
      , type:        gqlType
      , service:     service(t.service)
      }
  }

  // register all services
  _.forEach
    ( services
    , registerService
    )

  // register all types
  _.forEach
    ( types
    , registerType
    )

  // expose helper methods
  registry.parseArgs       = parseArgs
  registry.addField        = addField
  registry.registerService = registerService
  registry.registerType    = registerType
  registry.type            = type
  registry.service         = service
  registry.serviceFor      = serviceFor

  return registry

}

export default Registry
