function Schema (GraphQL, apis, types, options) {

  const { GraphQLSchema
        , GraphQLObjectType
        , GraphQLString
        } = GraphQL

  const schema = new GraphQLSchema(
    { query: new GraphQLObjectType(
        { name: 'RootQueryType'
        , fields:
          { hello:
            { type: GraphQLString
            , resolve() { return 'world' }
            }
          }
        })
    })

  return schema

}

export default Schema
